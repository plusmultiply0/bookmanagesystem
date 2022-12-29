from libraryms import app
from flask_cors import cross_origin
from flask import render_template, jsonify, request

from flask_jwt_extended import create_access_token

from libraryms import db
from libraryms.models import normalusr,adminusr,usrinfo,usridea,bookitem,bookCollect,bookBorrow,bookBorrowHistory,booknewitem

import random

@app.route('/')
@app.route('/home')
@app.route('/home/bookList')
@app.route('/home/readerManage')
@app.route('/home/infoCheck')
@app.route('/home/collectList')
@app.route('/home/borrowList')
@app.route('/home/self')
@cross_origin()
def index():
    return render_template('index.html')


# 登录、注册------------------------------------------------
@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    sth = request.json
    print(sth)
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
        print(res1)
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
        print(res1)
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
    print(sth)
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
    print(request)
    sth = request.args
    print(sth)
    username = sth['username']
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    response = {"username":username,"tel":res1.tel,"sex":res1.sex,"intro":res1.intro}
    print(response)
    return jsonify(response)

@app.route('/selfchange', methods=["POST"])
@cross_origin()
def selfchange():
    sth = request.json
    print('selfchange:',sth)
    username = sth['username']
    # 根据名字，查找到对应的表项
    res1 = usrinfo.query.filter(usrinfo.username == username).first()
    res1.intro = sth['intro']
    res1.tel = sth['tel']
    db.session.commit()
    print(res1)
    return jsonify({"username":res1.username,"tel":res1.tel,"sex":res1.sex,"intro":res1.intro})

@app.route('/pwdchange', methods=["POST"])
@cross_origin()
def pwdchange():
    sth = request.json
    print('selfmsg:', sth)
    username = sth['username']
    isadmin = sth['isadmin']
    if isadmin=='true':
        # 根据名字，查找到对应的表项
        res1 = adminusr.query.filter(adminusr.username == username).first()
        res1.password = sth['password']
    else:
        res1 = normalusr.query.filter(normalusr.username == username).first()
        res1.password = sth['password']
    db.session.commit()
    return {"msg": "ok！"}

@app.route('/selfidea', methods=["GET"])
@cross_origin()
def selfidea():
    sth = request.args
    print(sth)
    username = sth['username']
    res1 = usridea.query.filter(usridea.username == username).all()
    print(res1)
    response = []
    for x in res1:
        item = {'username':x.username,"text":x.text}
        response.append(item)
    print(response)
    return response

@app.route('/addidea', methods=["POST"])
@cross_origin()
def addidea():
    sth = request.json
    print('msg:', sth)
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
    print('msg:', sth)
    username = sth['username']
    res1 = usridea.query.filter(usridea.username == username).all()
    for x in res1:
        db.session.delete(x)
    db.session.commit()
    return jsonify({"msg": "ok！"})

# ------------------------------------------------

# 图书类路由-----------------------------------------
@app.route('/bookdata', methods=["GET"])
@cross_origin()
def bookdata():
    res1 = bookitem.query.all()
    response = []
    for x in res1:
        item = {"key":x.bid,"name":x.name, "author":x.author, "publish":x.publish, "isbn":x.isbn, "price":x.price, "number":x.number, "intro":x.intro, "pubdate":x.pubdate}
        response.append(item)
    return response

@app.route('/tocollect', methods=["POST"])
@cross_origin()
def tocollect():
    sth = request.json
    print('json msg:', sth)
    username = sth['username']
    isbn = sth['isbn']
    iscollect = sth['isCollect']
    if not iscollect:
        newitem = bookCollect(username=username,isbn=isbn)
        db.session.add(newitem)
        db.session.commit()
        return jsonify({"msg": "collect ok！"})
    else:
        res1 = bookCollect.query.filter(bookCollect.isbn == isbn).first()
        db.session.delete(res1)
        db.session.commit()
        return jsonify({"msg": "cancel collect ok！"})

@app.route('/collectdata', methods=["GET"])
@cross_origin()
def collectdata():
    sth = request.args
    print(sth)
    username = sth['username']
    res1 = bookCollect.query.filter(bookCollect.username == username).all()
    print(res1)
    response = []
    for x in res1:
        res2 = bookitem.query.filter(bookitem.isbn == x.isbn).first()
        item = {"id":res2.bid,"key": res2.bid, "name": res2.name, "author": res2.author, "publish": res2.publish, "isbn": res2.isbn,
                "price": res2.price, "number": res2.number, "intro": res2.intro, "pubdate": res2.pubdate}
        response.append(item)
    return response

@app.route('/toborrow', methods=["POST"])
@cross_origin()
def toborrow():
    sth = request.json
    print('json msg:', sth)
    borrowusr = sth['borrowusr']
    name = sth['name']
    borrownum = sth['borrownum']
    borrowdate = sth['borrowdate']
    shouldreturndate = sth['shouldreturndate']

    hasborrow = False
    borrowitem = ''
    res1 = bookBorrow.query.filter(bookBorrow.borrowusr == borrowusr).all()
    for x in res1:
        if x.name == name:
            hasborrow = True
            borrowitem = x

    # db里查询到借阅过相关书
    if hasborrow:
        print(borrowitem.name)
        borrowitem.borrownum = borrowitem.borrownum+1
        db.session.commit()
        return jsonify({"msg": "add book num ok！"})
    # 第一次借书
    else:
        newborrow = bookBorrow(borrowusr=borrowusr,name=name,borrownum=borrownum,borrowdate=borrowdate,shouldreturndate=shouldreturndate)
        newhistory = bookBorrowHistory(name=name,borrowusr=borrowusr,borrowdate=borrowdate,returndate='')
        db.session.add(newborrow)
        db.session.add(newhistory)
        db.session.commit()
        return jsonify({"msg": "borrow book ok！"})

@app.route('/borrowdata', methods=["GET"])
@cross_origin()
def borrowdata():
    sth = request.args
    print(sth)
    username = sth['username']
    history = sth['history']
    tag = False
    if history=='false':
        tag = False
    elif history=='true':
        tag = True
    print(tag)
    if tag:
        res1 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == username).all()
        print(res1)
        print(1)
        response = []
        for x in res1:
            item = {"id":x.id,"key":x.id,"name":x.name,"borrowusr":x.borrowusr,"borrowdate":x.borrowdate,"returndate":x.returndate}
            response.append(item)
        return response
    else:
        res1 = bookBorrow.query.filter(bookBorrow.borrowusr == username).all()
        print(res1)
        print(2)
        response = []
        for x in res1:
            item = {"id":x.id,"key":x.id,"name":x.name,"borrowusr":x.borrowusr,"borrowdate":x.borrowdate,"borrownum":x.borrownum,"shouldreturndate":x.shouldreturndate}
            response.append(item)
        return response

@app.route('/toreturn', methods=["POST"])
@cross_origin()
def toreturn():
    sth = request.json
    print('json msg:', sth)
    borrowusr = sth['borrowusr']
    name = sth['name']
    returndate = sth['returndate']
    res1 = bookBorrow.query.filter(bookBorrow.borrowusr == borrowusr).all()
    for x in res1:
        if x.name == name:
            if x.borrownum > 1:
                x.borrownum = x.borrownum-1
            else:
                db.session.delete(x)
    db.session.commit()
    res2 = bookBorrowHistory.query.filter(bookBorrowHistory.borrowusr == borrowusr).all()
    for x in res2:
        if x.name == name:
            x.returndate = returndate
    db.session.commit()
    return jsonify({"msg": "return ok！"})

@app.route('/toaddnewbook', methods=["POST"])
@cross_origin()
def toaddnewbook():
    sth = request.json
    print('msg:', sth)
    name = sth['name']
    author = sth['author']
    publish = sth['publish']
    isbn = sth['isbn']
    price = sth['price']
    number = sth['number']
    intro = sth['intro']
    pubdate = sth['pubdate']
    newitem = booknewitem(name=name,author=author,publish=publish,isbn=isbn,price=price,number=number,intro=intro,pubdate=pubdate)
    db.session.add(newitem)
    db.session.commit()
    return jsonify({"msg": "add new book ok！"})

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
    print('json msg:', sth)
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
    print('json msg:', sth)
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
        item = {"key":x.bid,"name":x.name, "author":x.author, "publish":x.publish, "isbn":x.isbn, "price":x.price, "number":x.number, "intro":x.intro, "pubdate":x.pubdate}
        response.append(item)
    return response

@app.route('/newbookaction', methods=["POST"])
@cross_origin()
def newbookaction():
    sth = request.json
    print('json msg:', sth)
    name = sth['name']
    action = sth['action']
    if action=='ok':
        res1 = booknewitem.query.filter(booknewitem.name == name).first()
        newitem = bookitem(name=name, author=res1.author, publish=res1.publish, isbn=res1.isbn, price=res1.price, number=res1.number,intro=res1.intro, pubdate=res1.pubdate)
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
    print('json msg:', sth)
    isbn = sth['isbn']
    name = sth['name']
    res1 = bookitem.query.filter(bookitem.isbn == isbn).first()
    print(res1.name)
    db.session.delete(res1)
    db.session.commit()
    return jsonify({"msg": "delete book ok！"})

@app.route('/toeditbook', methods=["POST"])
@cross_origin()
def toeditbook():
    sth = request.json
    print('json msg:', sth)
    name = sth['name']
    author = sth['author']
    intro = sth['intro']
    isbn = sth['isbn']
    number = sth['number']
    price = sth['price']
    pubdate = sth['pubdate']
    publish = sth['publish']
    # isbn默认无误，作为图书的唯一标识
    res1 = bookitem.query.filter(bookitem.isbn == isbn).first()
    res1.name = name
    res1.author = author
    res1.intro = intro
    res1.number = number
    res1.price = price
    res1.pubdate = pubdate
    res1.publish = publish
    db.session.commit()
    return jsonify({"msg": "edit book ok！"})

@app.route('/jsondata')
@cross_origin()
def testjson():
    bookdata = [
    {
        "id": '1',
        "name": '白夜行',
        "author": '[日] 东野圭吾',
        "publish": '南海出版公司',
        "isbn": '9787544258609',
        "price": '39.50',
        "number": '10',
        "intro": '1973年，大阪的一栋废弃建筑中发现一名遭利器刺死的男子。案件扑朔迷离，悬而未决。此后20年间，案件滋生出的恶逐渐萌芽生长，绽放出恶之花。案件相关者的人生逐渐被越来越重的阴影笼罩……“我的天空里没有太阳，总是黑夜，但并不暗，因为有东西代替了太阳。虽然没有太阳那么明亮，但对我来说已经足够。凭借着这份光，我便能把黑夜当成白天。我从来就没有太阳，所以不怕失去。”“只希望能手牵手在太阳下散步”，这句象征本书故事内核的绝望念想，有如一个美丽的幌子，随着无数凌乱、压抑、悲凉的事件片段如纪录片一样一一还原，最后一丝温情也被完全抛弃，万千读者在一曲救赎罪恶的爱情之中悲切动容。',
        "pubdate": '2013-1-1',
    },
    {
        "id": '2',
        "name": '海边的卡夫卡',
        "author": ' [日]村上春树',
        "publish": '上海译文出版社',
        "isbn": '9787532777617',
        "price": '59.00',
        "number": '5',
        "intro": '本书是村上春树仅次于《挪威的森林》的重要长篇小说，以其独特风格的两条平行线展开。一条平行线是少年“田村卡夫卡”，为了挣脱“你要亲手杀死父亲，与母亲乱伦”的诅咒，离开家乡投入成人世界。此后父亲在家被杀，他却疑心自己是在睡梦中杀父。他在一座旧图书馆遇到一位50岁的优雅女性，梦中却与这位女性的少女形象交合，而这位女性又可能是他的生母。一条平行线是一名失忆老人中田，因为一桩离奇的杀人事件走上逃亡之路，在汽车司机星野的帮助下恢复了遥远的战争记忆。',
        "pubdate": '2018-8',
    },
    {
        "id": '3',
        "name": '大医·破晓篇',
        "author": '马伯庸',
        "publish": '上海文艺出版社',
        "isbn": '9787532183562',
        "price": '108.00',
        "number": '7',
        "intro": '《大医·破晓篇》是马伯庸2022年全新长篇历史小说。挽亡图存、强国保种，这是医者在清末变局中的一声呐喊。大医若史，以济世之仁心，见证大时代的百年波澜。一个在日俄战争中死里逃生的东北少年、一个在伦敦公使馆里跑腿的广东少年、一个不肯安享富贵的上海少女——这三个出身、性格、 际遇各不相同的年轻人，在一九一〇年这一个关键节点，同时踏入了中国红十字会总医院，开始了他们纠葛一生的医海生涯。作为中国第一代公共慈善医生，三个人身上肩负的责任比普通医生更加沉重。哪里有疫情，就要去哪里治疫；哪里有灾害，就要去哪里救灾；哪里爆发战争，就要去哪里冒着枪林弹雨，救死扶伤。上海鼠疫、皖北水灾、武昌起义……晚清时局的跌宕起伏，无时无刻不牵扯着三人的命运。他们相互扶持，从三个蒙昧天真的少年，逐渐成长为三名出色的医生，在一次次救援中感悟到，何为真正的“大医”。',
        "pubdate": '2022-9',
    }
]
    return bookdata
