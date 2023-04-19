# 图书管理系统

## 概述

前端页面基于 React + React-Router + Antd 开发，后端页面基于 Python 的 Flask 框架进行开发。主要功能分为三部分：

**普通用户**

- 登录和注册功能
- 用户实现个人信息及密码的更改
- 实现个人座右铭的发布和删除
- 对图书图文信息的搜索（支持多类别搜索）和查看
- 查看热门借阅、收藏以及新录入的图书
- 在留言板留言或查看过往留言，留言支持回复和输入表情以及点赞
- 对图书进行借阅和归还
- 对图书进行收藏和信息导出
- 生成用户画像/标签和图书数据分析图
- 个性化推荐图书

**管理员用户**

管理员包含普通用户的功能，还有如下功能：

- 置顶或者取消置顶、删除留言板的评论
- 审核用户归还的图书信息
- 新增图书信息
- 实现新增书籍信息的审核
- 编辑修改、删除旧有的图书信息
- 查看普通用户基本信息、图书偏好及相关统计分析图，编辑基本信息，以及实现用户账户的删除
- 可以查看所有用户的收藏、借阅信息以及收藏和借阅前十位的排行统计数据图

**其他**

- 未登录页面的路由保护功能
- 面包屑导航功能
- 丰富且较完备的提示信息
- 提供预览界面（随便逛逛）搜索查看图书信息
- 图书超期未还会被记录，超期需缴纳罚款并且限制借书
- 登录页添加滑块验证



## 如何使用本项目

1. 使用<code>git clone</code>下载项目代码
2. 进入backend文件夹，在 python3 环境下，创建python虚拟环境 testvenv<code>python -m venv testvenv</code>，激活虚拟环境 <code>testvenv\scripts\activate</code>
3. 在虚拟环境下，安装依赖库 <code>pip install -r requirements.txt</code>
4. 在backend目录里，创建一个 .env 文件，并写入如下代码。将root替换为你的 MySQL 的登录名，123456替换为登录密码。然后在你的本地MySQL里创建一个名为bookms的数据库DB

```
DATABASE_URL=mysql+pymysql://root:123456@localhost:3306/bookms

SQLALCHEMY_TRACK_MODIFICATIONS=False
```

5. 在前面的虚拟环境中，先运行<code>flask initdb</code> 初始化数据库，再运行<code>flask build</code> 填充预置数据，最后运行<code>flask run</code>，在 http://127.0.0.1:5000/ 查看项目（若出现重复数据，运行<code>flask initdb --drop</code> ，再运行<code>flask build</code>）
6. 预设的管理员账号是<code>zzc</code>，普通账号有<code>zjc,abc,赵怀真,沈梦溪，asd，海月，test</code>，密码都是<code>123456</code>。
7. 修改前端代码前，请先在 my-app 目录下<code>npm install</code>，然后运行<code>npm start</code>，在http://127.0.0.1:3000/ 查看项目



## 功能展示

起始页

![](screenshot/1.png)

点击随便逛逛，在登录前可以预览图书的图文信息

点击上方按钮可以切换为文字版

![](screenshot/21.png)

![](screenshot/2.png)

可以查看热门排行图书

![](screenshot/22.png)

进行相关操作时，提示登录才能完成

![](screenshot/3.png)

登录及注册页

![](screenshot/login.png)

![](screenshot/register.png)

### 普通用户部分

主页面

可以切换查看图书图片和文字信息，还可以进行多类别搜索，查看详情、借阅、收藏等等

![](screenshot/index2.png)

![](screenshot/index.png)

当剩余数量为0时，提示借阅失败

![](screenshot/index4.png)

热门排行，可以查看热门借阅、收藏图书以及新录入的图书

![](screenshot/index3.png)

留言板

![](screenshot/mb.png)

收藏页

![](screenshot/collect.png)

借阅页面，归还图书需要申请，等待管理员批准

![](screenshot/borrow.png)

![](screenshot/borrowhistory.png)

个人信息页

![](screenshot/self.png)

个性推荐部分，包含用户画像/标签生成、图书类别分析图和图书推荐环节

生成个性图书标签

![](screenshot/self3.png)

图书数据分析和词云图

![](screenshot/self4.png)

![](screenshot/self5.png)

图书推荐

![](screenshot/self6.png)

无权限访问管理员页面

![](screenshot/self2.png)

### 管理员部分

留言板，管理员可以置顶评论或者删除评论

![](screenshot/mb2.png)

审核用户的归还图书，可以查看是否超期，超期天数，罚款是否缴纳

![](screenshot/admin12.png)

书籍信息审核以及新增图书信息模块

![](screenshot/admin1.png)

编辑删除查看书籍信息

![](screenshot/admin2.png)

查看所有普通用户基本信息和图书偏好，以及编辑信息和删除账号

![](screenshot/admin3.png)

读者性别统计分析

![](screenshot/admin32.png)

查看所有用户收藏和借阅信息

![](screenshot/admin4.png)

收藏及借阅书籍排行统计信息

![](screenshot/admin42.png)

![](screenshot/admin43.png)

### 其他功能

未登录页面会有路由保护功能，自动跳转指定页面

![](screenshot/other.png)

路由错误或者找不到指定页面时

![](screenshot/other2.png)

图书超期违约会被记录

![](screenshot/default1.png)

还书前，缴纳罚金可以使还书审批更容易通过

恢复正常借书功能，除了缴纳罚款外，还需要尽数还书

![](screenshot/default4.png)

超期未缴纳罚金或未还书时，限制借书

![](screenshot/default3.png)

## 参考资料

- https://ant.design/components/overview-cn
- https://fullstackopen.com/zh/#course-contents
- https://reactrouter.com/en/main/start/overview
- https://github.com/JeffDing99/books
- https://github.com/zhanghuanhao/LibrarySystem
- https://github.com/lyric777/Book-Management-System
- https://github.com/plusmultiply0/db-big-assignment
- https://charts.ant.design/zh/examples/gallery

