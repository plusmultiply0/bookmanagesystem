from libraryms import app
from flask_cors import cross_origin
from flask import render_template, jsonify, request

from flask_jwt_extended import create_access_token

from libraryms import db
from libraryms.models import normalusr,adminusr,usrinfo,usridea,bookitem,bookCollect,bookBorrow,bookBorrowHistory,booknewitem,messageboard,bookDefaultRecord,messageboardparentcomment,messageboardchildcomment

import random

@app.route('/')
@app.route('/login')
@app.route('/register')
@app.route('/bookpreview')
@app.route('/permissionerror')
@app.route('/home')
@app.route('/home/bookList')
@app.route('/home/messageBoard')
@app.route('/home/borrowList')
@app.route('/home/borrowHistory')
@app.route('/home/defaultRecord')
@app.route('/home/collectList')
@app.route('/home/self')
@app.route('/home/userProfile')
@app.route('/home/infoCheck')
@app.route('/home/readerManage')
@cross_origin()
def index():
    return render_template('index.html')

@app.errorhandler(404)
def indexerror(error):
    return render_template('index.html'),404


# 登录、注册------------------------------------------------
@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    sth = request.json
    # print(sth)
    username = sth['username']
    password = sth['password']
    # 非管理员会少传一个数据项，所以需要额外判断
    if 'isAdmin' in sth.keys():
        isadmin = sth['isAdmin']
    else:
        isadmin=''

    # 判断是否为管理员
    if isadmin:
        # 先查找用户名是否存在
        res1 = adminusr.query.filter(adminusr.username==username).first()
        # print(res1)
        if not res1:
            return jsonify({"msg": "用户名错误"}), 401
        else:
        # 找到用户名，再比对密码是否正确
            res1pwd = res1.password
            if res1pwd != password:
                return jsonify({"msg": "密码错误"}), 401
    else:
        # 先查找用户名是否存在
        res1 = normalusr.query.filter(normalusr.username == username).first()
        # print(res1)
        if not res1:
            return jsonify({"msg": "用户名错误"}), 401
        else:
            # 找到用户名，再比对密码是否正确
            res1pwd = res1.password
            if res1pwd != password:
                return jsonify({"msg": "密码错误"}), 401

    # 用户名和密码正确，返回token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    sth = request.json
    # print(sth)
    username = sth['nickname']
    password = sth['password']
    gender = sth['gender']
    phone = sth['phone']
#     判断用户名是否重合，普通用户能注册，所以检查普通用户表
    res1 = normalusr.query.filter(normalusr.username == username).first()
    if res1:
        return jsonify({"msg": "用户名重复！"}), 401
    else:
        # 普通表写入信息
        m1 = normalusr(username=username, password=password)
        db.session.add(m1)
        db.session.commit()
        # 信息表填入信息
        m2 = usrinfo(username=username,tel=phone,sex=gender)
        db.session.add(m2)
        db.session.commit()
        return jsonify({"msg": "注册成功！","ok":"true"}), 200
# --------------------------------------------------

# 个人信息页路由------------------------------------------------
@app.route('/selfdata', methods=["GET"])
@cross_origin()
def self():
    # print(request)
    sth = request.args
    # print(sth)
    username = sth['username']
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    response = {"username":username,"tel":res1.tel,"sex":res1.sex,"intro":res1.intro}
    # print(response)
    return jsonify(response)

@app.route('/selfchange', methods=["POST"])
@cross_origin()
def selfchange():
    sth = request.json
    # print('selfchange:',sth)
    username = sth['username']
    # 根据名字，查找到对应的表项
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    res1.intro = sth['intro']
    res1.tel = sth['tel']
    db.session.commit()
    # print(res1)
    return jsonify({"username":res1.username,"tel":res1.tel,"sex":res1.sex,"intro":res1.intro})

@app.route('/pwdchange', methods=["POST"])
@cross_origin()
def pwdchange():
    sth = request.json
    # print('selfmsg:', sth)
    username = sth['username']
    isadmin = sth['isadmin']
    if isadmin=='true':
        # 根据名字，查找到对应的表项
        # print(1)
        res1 = adminusr.query.filter(adminusr.username == username).first()
        res1.password = sth['password']
    else:
        # print(2)
        res1 = normalusr.query.filter(normalusr.username == username).first()
        res1.password = sth['password']
    db.session.commit()
    return {"msg": "ok！"}

@app.route('/selfidea', methods=["GET"])
@cross_origin()
def selfidea():
    sth = request.args
    # print(sth)
    username = sth['username']
    res1 = usridea.query.filter(usridea.username == username).all()
    # print(res1)
    response = []
    for x in res1:
        item = {'username':x.username,"text":x.text}
        response.append(item)
    # print(response)
    return response

@app.route('/addidea', methods=["POST"])
@cross_origin()
def addidea():
    sth = request.json
    # print('msg:', sth)
    username = sth['username']
    text = sth['text']
    nitem = usridea(username=username, text=text)
    db.session.add(nitem)
    db.session.commit()
    return jsonify({"msg": "ok！"})

@app.route('/delideas', methods=["POST"])
@cross_origin()
def delideas():
    sth = request.json
    # print('msg:', sth)
    username = sth['username']
    res1 = usridea.query.filter(usridea.username == username).all()
    for x in res1:
        db.session.delete(x)
    db.session.commit()
    return jsonify({"msg": "ok！"})

# 用户画像
@app.route('/userprofile', methods=["GET"])
@cross_origin()
def userprofile():
    sth = request.args
    username = sth['username']
    tagarray = []
    bookarray = []
    # 统计借阅历史
    res1 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == username).all()
    for x in res1:
        bookarray.append(x.name)
    # 统计收藏信息
    res2 = bookCollect.query.filter(bookCollect.username == username).all()
    for x in res2:
        res3 = bookitem.query.filter(bookitem.isbn == x.isbn).first()
        bookarray.append(res3.name)
    # 统计所有标签
    for x in bookarray:
        res4 = bookitem.query.filter(bookitem.name == x).first()
        tagarray.append(res4.type)
    # print(bookarray)
    # print(tagarray)
    # 计算出数量最多的3个标签
    dict = {}
    tag = []
    for x in tagarray:
        dict[x] = dict.get(x,0)+1
    # print(dict)
    if len(dict)>3:
        while (len(tag)<3):
            tag.append(max(dict,key=dict.get))
            dict.pop(max(dict,key=dict.get))
    else:
        for key in dict:
            tag.append(key)
    # print(tag)
    return tag

@app.route('/userrecommend', methods=["POST"])
@cross_origin()
def userrecommend():
    sth = request.json
    tagarray = sth['tagarray']
    book = []
    # print(tagarray)
    for x in tagarray:
        res1 = bookitem.query.filter(bookitem.type == x).all()
        a = random.choice(res1)
        item = {"key": a.bid, "name": a.name, "author": a.author, "publish": a.publish, "isbn": a.isbn,"price": a.price, "number": a.number, "type": a.type, "intro": a.intro, "pubdate": a.pubdate}
        book.append(item)
    # print(book)
    return book

@app.route('/userprofilealldata', methods=["GET"])
@cross_origin()
def userprofilealldata():
    sth = request.args
    username = sth['username']
    tagarray = []
    bookarray = []
    # 统计借阅历史
    res1 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == username).all()
    for x in res1:
        bookarray.append(x.name)
    # 统计收藏信息
    res2 = bookCollect.query.filter(bookCollect.username == username).all()
    for x in res2:
        res3 = bookitem.query.filter(bookitem.isbn == x.isbn).first()
        bookarray.append(res3.name)
    # 统计所有标签
    for x in bookarray:
        res4 = bookitem.query.filter(bookitem.name == x).first()
        tagarray.append(res4.type)

    dict1 = {}
    result = []
    for x in tagarray:
        dict1[x] = dict1.get(x, 0) + 1

    # 取值唯一的数组
    uniquetagarray = list(set(tagarray))
    # 拆分字典，每个取值为一个字典并保存在数组中
    for x in uniquetagarray:
        subdict = dict([(key,dict1[key]) for key in [x]])
        # print(list(subdict.keys()))
        fridict = dict(type=list(subdict.keys())[0],value=list(subdict.values())[0])
        result.append(fridict)
    # print(result)
    return result

# ------------------------------------------------

# 图书类路由-----------------------------------------
@app.route('/bookdata', methods=["GET"])
@cross_origin()
def bookdata():
    res1 = bookitem.query.all()
    response = []
    for x in res1:
        item = {"key":x.bid,"name":x.name, "author":x.author, "publish":x.publish, "isbn":x.isbn, "price":x.price, "number":x.number, "type":x.type,"intro":x.intro, "pubdate":x.pubdate}
        response.append(item)
    return response

@app.route('/tocollect', methods=["POST"])
@cross_origin()
def tocollect():
    sth = request.json
    # print('json msg:', sth)
    username = sth['username']
    isbn = sth['isbn']
    iscollect = sth['isCollect']
    if not iscollect:
        # 先找书的所有收藏信息
        res1 = bookCollect.query.filter(bookCollect.isbn == isbn).all()
        tag = False
        # 再判断是否收藏这本书
        for x in res1:
            if x.username == username:
                tag=True
        # 没收藏就记录信息，收藏过就忽略
        if not tag:
            newitem = bookCollect(username=username,isbn=isbn)
            db.session.add(newitem)
            db.session.commit()
        return jsonify({"msg": "collect ok！"})
    else:
        res1 = bookCollect.query.filter(bookCollect.isbn == isbn).all()
        for x in res1:
            if x.username==username:
                db.session.delete(x)
        db.session.commit()
        return jsonify({"msg": "cancel collect ok！"})

@app.route('/collectdata', methods=["GET"])
@cross_origin()
def collectdata():
    sth = request.args
    # print(sth)
    username = sth['username']
    res1 = bookCollect.query.filter(bookCollect.username == username).all()
    print(res1)
    response = []
    for x in res1:
        res2 = bookitem.query.filter(bookitem.isbn == x.isbn).first()
        item = {"id":res2.bid,"key": res2.bid, "name": res2.name, "author": res2.author, "publish": res2.publish, "isbn": res2.isbn,
                "price": res2.price, "number": res2.number, "type":res2.type,"intro": res2.intro, "pubdate": res2.pubdate}
        response.append(item)
    return response

@app.route('/toborrow', methods=["POST"])
@cross_origin()
def toborrow():
    sth = request.json
    # print('json msg:', sth)
    borrowusr = sth['borrowusr']
    name = sth['name']
    borrownum = sth['borrownum']
    borrowdate = sth['borrowdate']
    shouldreturndate = sth['shouldreturndate']
    timestamp = sth['timestamp']

    hasborrow = False
    borrowitem = ''
    res1 = bookBorrow.query.filter(bookBorrow.borrowusr == borrowusr).all()
    for x in res1:
        if x.name == name:
            hasborrow = True
            borrowitem = x

    # db里查询到借阅过相关书
    if hasborrow:
        # print(borrowitem.name)
        borrowitem.borrownum = borrowitem.borrownum+1
        # 违约记录中数量+1
        res3 = bookDefaultRecord.query.filter(bookDefaultRecord.name == name).all()
        for x in res3:
            if x.borrowusr == borrowusr:
                item = x
        item.number = item.number+1
        # 库存数量-1
        res2 = bookitem.query.filter(bookitem.name == name).first()
        res2.number = res2.number-1
        db.session.commit()
        return jsonify({"msg": "add book num ok！"})
    # 第一次借书
    else:
        newborrow = bookBorrow(borrowusr=borrowusr,name=name,borrownum=borrownum,borrowdate=borrowdate,shouldreturndate=shouldreturndate)
        newhistory = bookBorrowHistory(name=name,borrowusr=borrowusr,borrowdate=borrowdate,returndate='')
        db.session.add(newborrow)
        db.session.add(newhistory)
        newdefault = bookDefaultRecord(name=name,borrowusr=borrowusr,borrowdate=borrowdate,shouldreturndate=shouldreturndate,number=borrownum,borrowtimestamp=timestamp,ispayfine=0,isreturnbook=0)
        db.session.add(newdefault)
        # 库存数量-1
        res2 = bookitem.query.filter(bookitem.name == name).first()
        res2.number = res2.number - 1
        db.session.commit()
        return jsonify({"msg": "borrow book ok！"})

@app.route('/borrowdata', methods=["GET"])
@cross_origin()
def borrowdata():
    sth = request.args
    # print(sth)
    username = sth['username']
    history = sth['history']
    tag = False
    if history=='false':
        tag = False
    elif history=='true':
        tag = True
    # print(tag)
    if tag:
        res1 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == username).all()
        # print(res1)
        # print(1)
        response = []
        for x in res1:
            item = {"id":x.id,"key":x.id,"name":x.name,"borrowusr":x.borrowusr,"borrowdate":x.borrowdate,"returndate":x.returndate}
            response.append(item)
        return response
    else:
        res1 = bookBorrow.query.filter(bookBorrow.borrowusr == username).all()
        # print(res1)
        # print(2)
        response = []
        for x in res1:
            item = {"id":x.id,"key":x.id,"name":x.name,"borrowusr":x.borrowusr,"borrowdate":x.borrowdate,"borrownum":x.borrownum,"shouldreturndate":x.shouldreturndate}
            response.append(item)
        return response

@app.route('/toreturn', methods=["POST"])
@cross_origin()
def toreturn():
    sth = request.json
    # print('json msg:', sth)
    borrowusr = sth['borrowusr']
    name = sth['name']
    returndate = sth['returndate']
    timestamp = sth['timestamp']
    res1 = bookBorrow.query.filter(bookBorrow.borrowusr == borrowusr).all()
    for x in res1:
        if x.name == name:
            if x.borrownum > 1:
                x.borrownum = x.borrownum-1
            else:
                db.session.delete(x)
                # 当书尽数归还，记录已还书和最后的时间戳
                res3 = bookDefaultRecord.query.filter(bookDefaultRecord.name == name).all()
                for x in res3:
                    if x.borrowusr == borrowusr:
                        item = x
                item.isreturnbook = 1
                item.returntimestamp = timestamp

    db.session.commit()
    res2 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == borrowusr).all()
    for x in res2:
        if x.name == name:
            x.returndate = returndate
    db.session.commit()
    # 库存图书数量+1
    res3 = bookitem.query.filter(bookitem.name == name).first()
    res3.number = res3.number+1
    db.session.commit()
    return jsonify({"msg": "return ok！"})

@app.route('/toaddnewbook', methods=["POST"])
@cross_origin()
def toaddnewbook():
    sth = request.json
    # print('msg:', sth)
    name = sth['name']
    author = sth['author']
    publish = sth['publish']
    isbn = sth['isbn']
    price = sth['price']
    number = sth['number']
    type = sth['type']
    intro = sth['intro']
    pubdate = sth['pubdate']
    newitem = booknewitem(name=name,author=author,publish=publish,isbn=isbn,price=price,number=number,type=type,intro=intro,pubdate=pubdate)
    db.session.add(newitem)
    db.session.commit()
    return jsonify({"msg": "add new book ok！"})

# 图书违约
@app.route('/defaultdata', methods=["GET"])
@cross_origin()
def defaultdata():
    sth = request.args
    # print(sth)
    username = sth['username']
    res1 = bookDefaultRecord.query.filter(bookDefaultRecord.borrowusr == username).all()
    response = []
    for x in res1:
        item = {"key":random.random(),"name":x.name,"borrowusr":x.borrowusr,"borrowdate":x.borrowdate,"shouldreturndate":x.shouldreturndate,"number":x.number,"borrowtimestamp":x.borrowtimestamp,"returntimestamp":x.returntimestamp,"ispayfine":x.ispayfine,"isreturnbook":x.isreturnbook}
        response.append(item)
    return response

@app.route('/defaultpay', methods=["POST"])
@cross_origin()
def defaultpay():
    sth = request.json
    # print('msg:', sth)
    username = sth['username']
    name = sth['name']
    res1 = bookDefaultRecord.query.filter(bookDefaultRecord.borrowusr == username).all()
    for x in res1:
        if x.name==name:
            x.ispayfine = 1
    db.session.commit()
    return jsonify({"msg": "pay default ok！"})

# 留言板评论功能
@app.route('/mbcommentdata', methods=["GET"])
@cross_origin()
def messagebcdata():
    res1 = messageboardparentcomment.query.all()
    res2 = messageboardchildcomment.query.all()
    response = []
    for x in res1:
        item = {"id":x.id,'fromId': x.fromId, "content": x.content,"likeNum":x.likeNum,"createTime":x.createTime,"child":[]}
        response.append(item)
    for x in res2:
        item = {"id":x.id,'fromId': x.fromId, "content": x.content,"commentId":x.commentId,"createTime":x.createTime}
        for x in response:
            if x['id'] == item['commentId']:
                x['child'].append(item)
    # print(response)
    return response

@app.route('/addmbcomment', methods=["POST"])
@cross_origin()
def addmbcomment():
    sth = request.json
    type = sth['type']
    if type=='parent':
        fromId = sth['fromId']
        content = sth['content']
        createTime = sth['createTime']
        likeNum = sth['likeNum']
        nitem = messageboardparentcomment(fromId=fromId, content=content, likeNum=likeNum,
                                          createTime=createTime)
    elif type=='child':
        fromId = sth['fromId']
        content = sth['content']
        createTime = sth['createTime']
        commentId = sth['commentId']
        nitem = messageboardchildcomment(fromId=fromId, content=content, commentId=commentId,
                                          createTime=createTime)
    db.session.add(nitem)
    db.session.commit()
    return jsonify({"msg": "add comment ok！"})

@app.route('/mbcommentlike', methods=["POST"])
@cross_origin()
def mbcommentlike():
    sth = request.json
    type = sth['type']
    id = sth['id']
    res1 = messageboardparentcomment.query.all()
    for x in res1:
        if x.id==id and type=='like':
            x.likeNum=x.likeNum+1
        elif x.id==id and type=='unlike':
            x.likeNum = x.likeNum - 1
    db.session.commit()
    return jsonify({"msg": "like/unlike comment ok！"})
# -----------------------------------------------------

# 管理员类路由----------------------------------------
@app.route('/usrdata', methods=["GET"])
@cross_origin()
def usrdata():
    res1 = normalusr.query.all()
    response = []
    for x in res1:
        res2 = usrinfo.query.filter(usrinfo.username == x.username).all()
        for y in res2:
            item = {"id":y.uid,"key":y.uid,"username":y.username,"tel":y.tel,"sex":y.sex,"intro":y.intro}
            response.append(item)
    return response

@app.route('/usrcollectdata', methods=["GET"])
@cross_origin()
def usrcollectdata():
    res1 = bookCollect.query.all()
    response = []
    for x in res1:
        res2 = bookitem.query.filter(bookitem.isbn == x.isbn).first()
        item = {"key":random.random(),"username":x.username,"name":res2.name,"author":res2.author}
        response.append(item)
    print(response)
    return response

@app.route('/usrborrowdata', methods=["GET"])
@cross_origin()
def usrborrowdata():
    res1 = bookBorrowHistory.query.all()
    response = []
    for x in res1:
        item = {"key":x.id,"borrowusr":x.borrowusr,"name":x.name,"borrowdate":x.borrowdate,"returndate":x.returndate}
        response.append(item)
    print(response)
    return response

@app.route('/toeditusr', methods=["POST"])
@cross_origin()
def toeditusr():
    sth = request.json
    # print('json msg:', sth)
    username = sth['username']
    sex = sth['sex']
    tel = sth['tel']
    intro = sth['intro']
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    res1.sex = sex
    res1.tel = tel
    res1.intro = intro
    db.session.commit()
    return jsonify({"msg": "edit usr ok！"})

@app.route('/todelusr', methods=["POST"])
@cross_origin()
def todelusr():
    sth = request.json
    # print('json msg:', sth)
    username = sth['username']
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    db.session.delete(res1)
    res2 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == username).all()
    for x in res2:
        db.session.delete(x)
    res3 = bookBorrow.query.filter(bookBorrow.borrowusr == username).all()
    for x in res3:
        db.session.delete(x)
    res4 = bookCollect.query.filter(bookCollect.username == username).all()
    for x in res4:
        db.session.delete(x)
    db.session.commit()
    return jsonify({"msg": "delete usr ok！"})

@app.route('/newbookdata', methods=["GET"])
@cross_origin()
def newbookdata():
    res1 = booknewitem.query.all()
    response = []
    for x in res1:
        item = {"key":x.bid,"name":x.name, "author":x.author, "publish":x.publish, "isbn":x.isbn, "price":x.price, "number":x.number, "type":x.type,"intro":x.intro, "pubdate":x.pubdate}
        response.append(item)
    return response

@app.route('/newbookaction', methods=["POST"])
@cross_origin()
def newbookaction():
    sth = request.json
    # print('json msg:', sth)
    name = sth['name']
    action = sth['action']
    if action=='ok':
        res1 = booknewitem.query.filter(booknewitem.name == name).first()
        newitem = bookitem(name=name, author=res1.author, publish=res1.publish, isbn=res1.isbn, price=res1.price, number=res1.number,type=res1.type,intro=res1.intro, pubdate=res1.pubdate)
        db.session.add(newitem)
        db.session.delete(res1)
    elif action=='no':
        res3 = booknewitem.query.filter(booknewitem.name == name).first()
        db.session.delete(res3)
    db.session.commit()
    return jsonify({"msg": "action ok！"})

@app.route('/delbook', methods=["POST"])
@cross_origin()
def delbook():
    sth = request.json
    # print('json msg:', sth)
    isbn = sth['isbn']
    name = sth['name']
    res1 = bookitem.query.filter(bookitem.isbn == isbn).first()
    # print(res1.name)
    db.session.delete(res1)
    res2 = bookBorrowHistory.query.filter(bookBorrowHistory.name == name).all()
    for x in res2:
        db.session.delete(x)
    res3 = bookBorrow.query.filter(bookBorrow.name == name).all()
    for x in res3:
        db.session.delete(x)
    res4 = bookCollect.query.filter(bookCollect.isbn == isbn).all()
    for x in res4:
        db.session.delete(x)
    db.session.commit()
    return jsonify({"msg": "delete book ok！"})

@app.route('/toeditbook', methods=["POST"])
@cross_origin()
def toeditbook():
    sth = request.json
    # print('json msg:', sth)
    name = sth['name']
    author = sth['author']
    intro = sth['intro']
    isbn = sth['isbn']
    number = sth['number']
    price = sth['price']
    type = sth['type']
    pubdate = sth['pubdate']
    publish = sth['publish']
    # isbn默认无误，作为图书的唯一标识
    res1 = bookitem.query.filter(bookitem.isbn == isbn).first()
    res1.name = name
    res1.author = author
    res1.intro = intro
    res1.number = number
    res1.price = price
    res1.type = type
    res1.pubdate = pubdate
    res1.publish = publish
    db.session.commit()
    return jsonify({"msg": "edit book ok！"})

