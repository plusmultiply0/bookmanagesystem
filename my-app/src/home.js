import { useState } from "react";

import { Link, Outlet, useLocation, Navigate } from "react-router-dom";

import React from 'react';
import { LaptopOutlined, UserOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown } from 'antd';

// 导入图书数据

import {Space,Typography } from 'antd';

const { Title } = Typography;

const Home = ()=>{
    
    return(
        <MainPage/>
    );
}

// 登录后的页面显示

const { Header, Content, Sider, Footer } = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const allitems = [
    getItem('图书管理', 'sub1', <BookOutlined />, [getItem(<Link to="/home/bookList">图书列表</Link>, 'g1'), getItem(<Link to="/home/hotRanking">热门排行</Link>, 'g2'), getItem(<Link to="/home/messageBoard">留言板</Link>, 'g3')]),
    getItem('借阅管理', 'sub2', <LaptopOutlined />, [getItem(<Link to="/home/borrowList">借阅列表</Link>, 'g4'), getItem(<Link to="/home/borrowHistory">借阅历史</Link>, 'g5'), getItem(<Link to="/home/defaultRecord">图书违约</Link>, 'g6')]),
    getItem('收藏管理', 'sub3', <AppstoreOutlined />, [getItem(<Link to="/home/collectList">收藏列表</Link>,'g7')]),
    getItem('个人中心', 'sub4', <UserOutlined />, [getItem(<Link to="/home/self">基本信息</Link>, 'g8'), getItem(<Link to="/home/userProfile">个性推荐</Link>, 'g9'), getItem(<Link to="/home/infoCheck">信息审核</Link>, 'g10'), getItem(<Link to="/home/readerManage">读者管理</Link>, 'g11')])
]

const normalitems = [
    getItem('图书管理', 'sub1', <BookOutlined />, [getItem(<Link to="/home/bookList">图书列表</Link>, 'g1'), getItem(<Link to="/home/hotRanking">热门排行</Link>, 'g2') ,getItem(<Link to="/home/messageBoard">留言板</Link>, 'g3')]),
    getItem('借阅管理', 'sub2', <LaptopOutlined />, [getItem(<Link to="/home/borrowList">借阅列表</Link>, 'g4'), getItem(<Link to="/home/borrowHistory">借阅历史</Link>, 'g5'), getItem(<Link to="/home/defaultRecord">图书违约</Link>, 'g6')]),
    getItem('收藏管理', 'sub3', <AppstoreOutlined />, [getItem(<Link to="/home/collectList">收藏列表</Link>, 'g7')]),
    getItem('个人中心', 'sub4', <UserOutlined />, [getItem(<Link to="/home/self">基本信息</Link>, 'g8'), getItem(<Link to="/home/userProfile">个性推荐</Link>, 'g9')])
]

// 面包屑
const breadcrumbNameMap = {
    '/home':'主页',
    '/home/bookList': '图书管理 / 图书列表',
    '/home/hotRanking': '图书管理 / 热门排行',
    '/home/messageBoard': '图书管理 / 留言板',
    '/home/borrowList': '借阅管理 / 借阅列表',
    '/home/borrowHistory': '借阅管理 / 借阅历史',
    '/home/defaultRecord': '借阅管理 / 图书违约',
    '/home/collectList': '收藏管理 / 收藏列表',
    '/home/self': '个人中心 / 基本信息',
    '/home/userProfile':'个人中心 / 个性推荐',
    '/home/infoCheck': '个人中心 / 信息审核',
    '/home/readerManage': '个人中心 / 读者管理',
};

const MainPage = () => {
    const admin = window.localStorage.getItem('admin')
    const [isAdmin, setAdmin] = useState(admin)

    // 面包屑
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    // console.log('path:',pathSnippets)
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        // console.log(url)
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [].concat(extraBreadcrumbItems);
    // 面包屑

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 制定状态切换主页和其他内容
    let tag = false
    if (pathSnippets.length<2){
        tag=true;
    } else{
        tag=false
    }

    return (
        <Layout className="mainpage">
            <Header className="header">
                <Title level={3} type="success" className="wetitle">图书管理系统</Title>
                <LoginStatus/>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        items={isAdmin ? allitems : normalitems}
                    />
                </Sider>
                <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                >
                    {/* 面包屑 */}
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        {breadcrumbItems}
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            overflow: 'auto',
                        }}
                    >
                        {tag?<MainContent/>:<Outlet/>}
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Book management system ©2023 Created by ZJC
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

// 登录状态框
const LoginStatus = ()=>{
    const [isLogin,setLogin]=useState(true)

    const handleClick = ()=>{
        // console.log('delete ok!')
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('loggedToken')
        if (window.localStorage.getItem('admin')){
            window.localStorage.removeItem('admin')
        }
        setLogin(false)
    }

    const items = [
        {
            label: <Link to="/home/self">个人中心</Link>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={handleClick}>退出登录</span>,
            key: '1',
        },
    ];
    return(
        <Space wrap className="loginstatus">
            <Dropdown.Button
                menu={{
                    items,
                }}
                trigger={['click']} icon={<UserOutlined />}
            >
                {window.localStorage.getItem('loggedUser')}
                {/* 退出登录跳转首页 */}
                {!isLogin && <Navigate to="/" replace={true} />}
            </Dropdown.Button>
        </Space>
    );
}

// 主页内容提示
const MainContent = ()=>{

    return(
        <>
            <Title level={3}>欢迎来到图书管理系统！</Title>
            <br/>
            <p>点击左侧的导航按钮，可以访问不同内容，请尽情尝试！</p>
            <br />
            <p>信息审核和读者管理为管理员模块，普通用户不可访问。</p>
            <br/>
            <p>点击右上角小人图标，可以选择退出登录状态。</p>
        </>
    )
}

export default Home;