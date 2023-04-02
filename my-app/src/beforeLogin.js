import { Form, Button, Layout, Menu, theme, Dropdown, Typography, Space, Table, Modal, Input, Card, Row, Col, Switch, Pagination } from "antd";
import { Link, Navigate, useNavigate, Outlet } from "react-router-dom";
import { LaptopOutlined, UserOutlined, BookOutlined, AppstoreOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Detail } from './bookdata'

// 登录之前的页面显示
const BeforeLogin = () => {
    return (
        <Form>
            <Form.Item>
                <Link to="/login">
                    <Button type="primary" id="homelogin" size="large">登录</Button>
                </Link>
            </Form.Item>
            <Form.Item>
                <Link to="/register">
                    <Button type="primary" id="homeregister" size="large">注册</Button>
                </Link>
            </Form.Item>
            <Form.Item>
                <Link to="/preview/books">
                    <Button type="primary" id="homepreview" size="large">随便逛逛</Button>
                </Link>
            </Form.Item>
        </Form>
    )
}

const { Header, Content, Sider, Footer } = Layout;
const { Title } = Typography;
const { Search } = Input;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('图书管理', 'sub1', <BookOutlined />, [getItem(<Link to="/preview/books">图书列表</Link>, 'g1'), getItem(<Link to="/preview/hotRanking">热门排行</Link>, 'g2')]),
]

const { Meta } = Card;

const FrameForAll = ()=>{

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Layout className="mainpage">
                <Header className="header">
                    <Title level={3} type="success" className="wetitle">图书管理系统</Title>
                    <LoginRegisterButton />
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
                            items={items}
                        />
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                                overflow: 'auto',
                            }}
                        >
                            <Outlet />
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
        </>
    )
}

const BookPreview = ()=>{

    const [bookData, setBookData] = useState([])
    const [savedata, setSaveData] = useState([])

    const [conponentshowstatus, setConponentShowStatus] = useState(true)
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const baseUrl = 'http://127.0.0.1:5000/bookdata'

    useEffect(() => {
        // console.log('effect')
        axios.get(baseUrl).then(response => {
            const data = response.data
            // console.log(data)
            setBookData(data)
            setSaveData(data)
        })
    }, [])
    //只在第一次渲染时运行

    const handleChange = (e) => {
        const values = e.target.value
        // console.log(values)
        if (values) {
            // 这里保存一个原始数据，便于反复查找使用
            const filterdata = savedata.filter(item => {
                // console.log(item.value)
                return item.name.includes(values)
            })
            // console.log(filterdata)
            setBookData(filterdata)
        } else {
            setBookData(savedata)
        }
    }

    const onSwitchChange = (checked) => {
        setConponentShowStatus(!checked)
    }

    const onPageChange = (page) => {
        // console.log(page);
        setCurrent(page);
    };

    const handleShowSizeChange = (current, size) => {
        const newPage = Math.floor(start / size) + 1;
        // console.log(newPage,size)
        setPageSize(size);
        setCurrent(newPage);
    };

    // 对数据切片
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    const currentData = bookData.slice(start, end);

    return(
        <>
            {/* <p>此为预览页面，仅提供基本功能展示。若想体验完整功能，请先注册并登录！</p> */}
            <Search placeholder="输入书名" onChange={handleChange} enterButton style={{ width: 200, }} />
            <Switch checkedChildren="图片版" unCheckedChildren="文字版" onChange={onSwitchChange} className="switch" />
            <br/>
            <br />
            {/* 图片组件和文字组件 */}
            {
                conponentshowstatus ?
                <>
                    <Row gutter={[8, 16]}>
                    {
                        currentData.map((item) => {
                            return (
                                <Col span={6} key={item.id}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 300,
                                        }}
                                        cover={<img alt="example" src={"http://127.0.0.1:5000/images/" + item.isbn + ".jpg"} />}
                                        actions={[
                                            <FakeBorrowCollect name="借阅"/>,
                                            <Detail data={item} />,
                                            <FakeBorrowCollect name="收藏" />
                                        ]}
                                        >
                                        <Meta title={item.name} description={item.author} />
                                    </Card>
                                </Col>
                                )
                            })
                        }
                        </Row>
                        <br />
                        <Pagination className="pagination" current={current} showSizeChanger onShowSizeChange={handleShowSizeChange} onChange={onPageChange} total={bookData.length} />
                </>
                    :
                    <Table columns={columns} dataSource={bookData} locale={{ emptyText: '暂无数据' }} />
            }
        </>
    )
}

const LoginRegisterButton = () => {

    const items = [
        {
            label: <Link to="/login">登录</Link>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/register">注册</Link>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/">首页</Link>,
            key: '2',
        },
    ];
    return (
        <Space wrap className="loginstatus">
            <Dropdown.Button
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                登录/注册
            </Dropdown.Button>
        </Space>
    );
}

const columns = [
    {
        title: '图书名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '图书作者',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: '出版社',
        dataIndex: 'publish',
        key: 'publish',
    },
    {
        title: 'ISBN',
        dataIndex: 'isbn',
        key: 'isbn',
    },
    {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (price) => <p>{price}元</p>
    },
    {
        title: '剩余数量',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <FakeBorrowCollect name="借阅"/>
                <Detail data={record} />
                <FakeBorrowCollect name="收藏" />
            </Space>
        )
    },
]

const { confirm } = Modal;

const FakeBorrowCollect = (props) => {
    const name = props.name

    const buttontype = name == "收藏" ? 'dashed' :'default'

    const navigate = useNavigate();

    const handleCilck = () => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '收藏或借阅前请先登录！',
            okText: '去登录',
            cancelText: '取消',
            onOk() {
                navigate('/login')
            },
            onCancel() {
                
            },
        });
    }

    return (
        <>
            <Space>
                <Button onClick={handleCilck} type={buttontype}>{name}</Button>
            </Space>
        </>
    )
}



export { BeforeLogin, BookPreview, FrameForAll, FakeBorrowCollect } 