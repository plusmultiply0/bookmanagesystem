from libraryms import db

# 普通用户表
class normalusr(db.Model):
    nid=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    username=db.Column(db.String(30))
    password=db.Column(db.String(30))

# 管理员表
class adminusr(db.Model):
    aid=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    username=db.Column(db.String(30))
    password=db.Column(db.String(30))

# 用户信息表
class usrinfo(db.Model):
    uid=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    username=db.Column(db.String(30))
    tel=db.Column(db.String(30))
    sex=db.Column(db.String(30))
    intro=db.Column(db.String(300))

# 用户想法表
class usridea(db.Model):
    id=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    username = db.Column(db.String(30))
    text = db.Column(db.String(300))

# 图书有关表----------------------------------------------------
# 图书信息表
class bookitem(db.Model):
    bid=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    name=db.Column(db.String(50))
    author=db.Column(db.String(50))
    publish=db.Column(db.String(40))
    isbn=db.Column(db.String(60))
    price=db.Column(db.String(20))
    number=db.Column(db.Integer)
    intro=db.Column(db.String(3000))
    pubdate=db.Column(db.String(30))
    type=db.Column(db.String(30))

class bookCollect(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    username = db.Column(db.String(30))
    isbn = db.Column(db.String(60))

class bookBorrow(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(50))
    borrowusr = db.Column(db.String(30))
    borrownum = db.Column(db.Integer)
    borrowdate=db.Column(db.String(30))
    shouldreturndate=db.Column(db.String(30))
    ischecking = db.Column(db.Integer)
    returnnum = db.Column(db.Integer)

class bookBorrowHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(50))
    borrowusr = db.Column(db.String(30))
    borrowdate=db.Column(db.String(30))
    returndate=db.Column(db.String(30))

# 图书违约记录表
class bookDefaultRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(50))
    borrowusr = db.Column(db.String(30))
    borrowdate = db.Column(db.String(30))
    shouldreturndate = db.Column(db.String(30))
    number = db.Column(db.Integer)
    borrowtimestamp = db.Column(db.String(50))
    returntimestamp = db.Column(db.String(50))
    ispayfine = db.Column(db.Integer)
    isreturnbook = db.Column(db.Integer)

# 新建图书信息表
class booknewitem(db.Model):
    bid=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    name=db.Column(db.String(50))
    author=db.Column(db.String(50))
    publish=db.Column(db.String(40))
    isbn=db.Column(db.String(60))
    price=db.Column(db.String(20))
    number=db.Column(db.Integer)
    intro=db.Column(db.String(3000))
    pubdate=db.Column(db.String(30))
    type = db.Column(db.String(30))

# 留言板评论表
class messageboardparentcomment(db.Model):
    id=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    fromId = db.Column(db.String(30))
    content = db.Column(db.String(300))
    likeNum = db.Column(db.Integer)
    createTime = db.Column(db.String(50))
    settop = db.Column(db.Integer)

class messageboardchildcomment(db.Model):
    id=db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    commentId = db.Column(db.Integer)
    fromId = db.Column(db.String(30))
    content = db.Column(db.String(300))
    createTime = db.Column(db.String(50))
