# 图书管理系统

## 概述

前端页面基于React + React-Router + Antd开发，后端页面基于Python的Flask框架进行开发。主要功能分为两部分：

**普通用户**

- 登录和注册功能
- 用户实现个人信息及密码的更改
- 实现个人想法的发布和删除
- 对图书信息的搜索和查看
- 对图书进行借阅和归还
- 对图书进行收藏和信息导出
- 用户新增图书信息
- 生成用户画像/标签

**管理员用户**

管理员包含普通用户的功能，还有如下功能：

- 实现新增书籍信息的审核
- 编辑和修改旧有的图书信息
- 编辑普通用户信息，以及实现用户账户的删除
- 可以查看所有用户的收藏和借阅信息。

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
6. 预设的管理员账号是<code>zzc</code>，普通账号有<code>zjc,abc,赵怀真,沈梦溪</code>，密码都是<code>123456</code>。
7. 修改前端代码前，请先在 my-app 目录下<code>npm install</code>，然后运行<code>npm start</code>，在http://127.0.0.1:3000/ 查看项目





## 功能展示

起始页

![](screenshot/1.png)

登录及注册页

![](screenshot/login.png)

![](screenshot/register.png)

主页面

![](screenshot/index.png)

收藏页

![](screenshot/collect.png)

借阅页面

![](screenshot/borrow.png)

![](screenshot/borrowhistory.png)

个人信息页

![](screenshot/self.png)

无权限访问管理员页面

![](screenshot/self2.png)

管理员页面

书籍信息审核

![](screenshot/admin1.png)

编辑删除查看书籍信息

![](screenshot/admin2.png)

查看编辑删除所有普通用户

![](screenshot/admin3.png)

查看所有用户收藏和借阅信息

![](screenshot/admin4.png)

## 参考资料

- https://ant.design/components/overview-cn
- https://fullstackopen.com/zh/#course-contents
- https://reactrouter.com/en/main/start/overview

- https://github.com/JeffDing99/books
- https://github.com/zhanghuanhao/LibrarySystem
- https://github.com/plusmultiply0/db-big-assignment

