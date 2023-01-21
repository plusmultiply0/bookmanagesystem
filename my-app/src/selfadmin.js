import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Typography, Result, Space, Table, notification, message } from 'antd';

import axios from 'axios'

import { Detail } from './bookdata'

const { TextArea } = Input;
const { Title} = Typography;

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
                <Detail data={record} />
                <EditBook data={record} />
                <DelBook data={record} />
            </Space>
        )
    },
]

const newbookcolumns = [
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
                <Detail data={record} />
                <OkNewBook data={record} />
                <DelNewBook data={record} />
            </Space>
        )
    },
]
// 信息审核组件
const InfoCheck = () => {
    const admin = window.localStorage.getItem('admin')
    const [isAdmin, setAdmin] = useState(admin)

    const [bookdata,setBookData] = useState([])
    const [newbookdata,setNewBookData] = useState([])

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // console.log('effect')
        axios.get('http://127.0.0.1:5000/bookdata').then(response => {
            const data = response.data
            // console.log('data:', data)
            setBookData(data)
        })
        axios.get('http://127.0.0.1:5000/newbookdata').then(response => {
            const data = response.data
            // console.log('new book data:', data)
            setNewBookData(data)
        })

    }, [])
    //只在第一次渲染时运行

    const showModal = () => {
        setOpen(true);
    };
    const handleOk = async () => {

        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            form.resetFields()
        }, 500);
        const formValues = form.getFieldsValue();

        // console.log('form', formValues)

        const res1 = await uniPost('http://127.0.0.1:5000/toaddnewbook', formValues)
        // console.log('res1', res1)
        messageApi.open({
            type: 'success',
            content: '新增图书信息成功！',
        });

        setTimeout(() => { window.location.reload() }, 2000)
    };
    const handleCancel = () => {
        // console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        isAdmin ?
         <>
                {contextHolder}
            <Title>新增图书信息</Title>
            <p>点击下方按钮，即可录入图书信息！</p>
            <br/>
                <Button type="primary" className="newbook" onClick={showModal}>新建图书</Button>
                <Modal
                    title="新建图书"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    okText="确认" cancelText="取消"
                >
                    <Form
                        form={form}
                        name="bookmsg"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item label="图书名称" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="图书作者" name="author">
                            <Input />
                        </Form.Item>
                        <Form.Item label="出版社" name="publish">
                            <Input />
                        </Form.Item>
                        <Form.Item label="ISBN" name="isbn">
                            <Input />
                        </Form.Item>
                        <Form.Item label="价格" name="price">
                            <Input />
                        </Form.Item>
                        <Form.Item label="出版日期" name="pubdate">
                            <Input />
                        </Form.Item>
                        <Form.Item label="库存数量" name="number">
                            <Input />
                        </Form.Item>
                        <Form.Item label="图书类别" name="type">
                            <Input />
                        </Form.Item>
                        <Form.Item label="内容简介" name="intro">
                            <TextArea rows={4} maxLength={500} />
                        </Form.Item>
                    </Form>
                </Modal>
            <Title>书籍条目信息审核</Title>
                <Table columns={newbookcolumns} dataSource={newbookdata} locale={{ emptyText: '暂无数据' }} />
            <Title>全部书籍条目信息</Title>
                <Table columns={columns} dataSource={bookdata} locale={{ emptyText: '暂无数据' }} />
         </>
        : <PermissionError />
    );
}



const DelBook = (props) => {
    const data = props.data

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description: '删除成功！',
        });
    };

    const handleCilck = async() => {
        const values = {
            name: data.name,
            isbn:data.isbn,
        }
        // console.log('new value', values)

        const res1 = await uniPost('http://127.0.0.1:5000/delbook', values)
        // console.log('res1', res1)

        openNotificationWithIcon('success')

        setTimeout(() => { window.location.reload() }, 2000)
    }

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleCilck} type="primary" ghost>删除</Button>
            </Space>
        </>
    )
}

const EditBook = (props) => {
    const data = props.data

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        const newValues = {
            isbn: data.isbn,
            name: form.getFieldValue('name') ? form.getFieldValue('name') : data.name,
            author: form.getFieldValue('author') ? form.getFieldValue('author') : data.author,
            number: form.getFieldValue('number') ? form.getFieldValue('number') : data.number,
            price: form.getFieldValue('price') ? form.getFieldValue('price') : data.price,
            pubdate: form.getFieldValue('pubdate') ? form.getFieldValue('pubdate') : data.pubdate,
            type: form.getFieldValue('type') ? form.getFieldValue('type') : data.type,
            publish: form.getFieldValue('publish') ? form.getFieldValue('publish') : data.publish,
            intro: form.getFieldValue('intro') ? form.getFieldValue('intro') : data.intro,
        }
        // const formvalues = form.getFieldsValue()
        // console.log('new value', newValues)

        const res1 = await uniPost('http://127.0.0.1:5000/toeditbook', newValues)
        // console.log('res1', res1)

        setIsModalOpen(false);

        messageApi.open({
            type: 'success',
            content: '编辑成功！',
        });

        setTimeout(() => { window.location.reload() }, 2000)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={showModal}>编辑</Button>
                <Modal title="编辑图书" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                    <Form
                        form={form}
                        name="booksmsg"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item label="图书名称" name="name">
                            <Input defaultValue={data.name}/>
                        </Form.Item>
                        <Form.Item label="isbn" name="isbn">
                            <Input placeholder={data.isbn} disabled />
                        </Form.Item>
                        <Form.Item label="图书作者" name="author">
                            <Input defaultValue={data.author} />
                        </Form.Item>
                        <Form.Item label="剩余数量" name="number">
                            <Input defaultValue={data.number} />
                        </Form.Item>
                        <Form.Item label="价格" name="price">
                            <Input defaultValue={data.price} />
                        </Form.Item>
                        <Form.Item label="出版社" name="publish">
                            <Input defaultValue={data.publish} />
                        </Form.Item>
                        <Form.Item label="出版日期" name="pubdate">
                            <Input defaultValue={data.pubdate} />
                        </Form.Item>
                        <Form.Item label="图书类别" name="type">
                            <Input defaultValue={data.type} />
                        </Form.Item>
                        <Form.Item label="内容简介" name="intro">
                            <TextArea rows={4} maxLength={500} defaultValue={data.intro} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </>
    )
}
const OkNewBook = (props) => {
    const data = props.data

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description: '通过成功！',
        });
    };

    const handleCilck = async() => {
        const values = {
            name: data.name,
            action: 'ok'
        }
        // console.log('new value', values)

        const res1 = await uniPost('http://127.0.0.1:5000/newbookaction', values)
        // console.log('res1', res1)

        openNotificationWithIcon('success')

        setTimeout(() => { window.location.reload() }, 2000)
    }

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleCilck} type="primary" ghost>通过</Button>
            </Space>
        </>
    )
}
const DelNewBook = (props) => {
    const data = props.data

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description: '删除成功！',
        });
    };

    const handleCilck = async() => {
        const values = {
            name: data.name,
            action: 'no'
        }
        // console.log('new value', values)

        const res1 = await uniPost('http://127.0.0.1:5000/newbookaction', values)
        // console.log('res1', res1)

        openNotificationWithIcon('success')

        setTimeout(() => { window.location.reload() }, 2000)
    }

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleCilck}>删除</Button>
            </Space>
        </>
    )
}


// 读者管理组件
const ReaderManage = () => {
    const admin = window.localStorage.getItem('admin')
    const [isAdmin, setAdmin] = useState(admin)
    // console.log(isAdmin)

    const [usrdata, setUsrData] = useState([])
    const [usrcollectdata, setUsrCollectData] = useState([])
    const [usrborrowdata, setUsrBorrowData] = useState([])

    useEffect(() => {
        // console.log('effect')
        axios.get('http://127.0.0.1:5000/usrdata').then(response => {
            const data = response.data
            // console.log('data:', data)
            setUsrData(data)
        })
        axios.get('http://127.0.0.1:5000/usrcollectdata').then(response => {
            const data = response.data
            // console.log('collect data:', data)
            setUsrCollectData(data)
        })
        axios.get('http://127.0.0.1:5000/usrborrowdata').then(response => {
            const data = response.data
            // console.log('borrow data:', data)
            setUsrBorrowData(data)
        })

    }, [])
    //只在第一次渲染时运行

    return (
        isAdmin ?
            <>
                <Title>读者信息</Title>
                <Table columns={usrcolumns} dataSource={usrdata} locale={{ emptyText: '暂无数据' }} />
                <Title>图书收藏信息</Title>
                <Table columns={usrcollectcolumns} dataSource={usrcollectdata} locale={{ emptyText: '暂无数据' }} />
                <Title>图书借阅信息</Title>
                <Table columns={usrborrowcolumns} dataSource={usrborrowdata} locale={{ emptyText: '暂无数据' }} />
            </>
            : <PermissionError />
    );
}

// 通用post函数
const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const usrcolumns = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
    },
    {
        title: '电话号码',
        dataIndex: 'tel',
        key: 'tel',
    },
    {
        title: '个人简介',
        dataIndex: 'intro',
        key: 'intro',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Editusr data={record} />
                <Delusr data={record} />
            </Space>
        )
    },
]
const Delusr = (props)=>{
    const data = props.data

    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description: '删除成功！',
        });
    };

    const handleClick = async()=>{
        const newValues = {
            username: data.username,
        }
        // console.log('new value', newValues)

        const res1 = await uniPost('http://127.0.0.1:5000/todelusr', newValues)
        // console.log('res1', res1)

        openNotificationWithIcon('success')

        setTimeout(() => { window.location.reload() }, 3000)
    }

    return (
        <>
            {contextHolder}
            <Space>
                <Button type="primary" onClick={handleClick}>删除用户</Button>
            </Space>
        </>
    )
}
const Editusr = (props)=>{
    const data = props.data
    // console.log(data)

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async() => {
        const newValues = {
            username:data.username,
            sex: form.getFieldValue('sex') ? form.getFieldValue('sex') :data.sex,
            tel: form.getFieldValue('tel') ? form.getFieldValue('tel') : data.tel,
            intro: form.getFieldValue('intro') ? form.getFieldValue('intro') : data.intro,
        }
        // console.log('new value',newValues)

        const res1 = await uniPost('http://127.0.0.1:5000/toeditusr',newValues)
        // console.log('res1',res1)
        
        setIsModalOpen(false);

        messageApi.open({
            type: 'success',
            content: '编辑成功！',
        });

        setTimeout(() => { window.location.reload() }, 1000)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={showModal}>编辑</Button>
                <Modal title="编辑用户" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                    <Form
                        form={form}
                        name="usrmsg"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item label="用户名" name="username">
                            <Input placeholder={data.username} disabled/>
                        </Form.Item>
                        <Form.Item label="性别" name="sex">
                            <Input placeholder={data.sex} />
                        </Form.Item>
                        <Form.Item label="电话号码" name="tel">
                            <Input placeholder={data.tel} />
                        </Form.Item>
                        <Form.Item label="个人简介" name="intro">
                            <TextArea rows={4} maxLength={500} placeholder={data.intro} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </>
    )
}
const usrcollectcolumns = [
    {
        title: '收藏用户',
        dataIndex: 'username',
        key: 'username',
    },
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
]
const usrborrowcolumns = [
    {
        title: '借阅用户',
        dataIndex: 'borrowusr',
        key: 'borrowusr',
    },
    {
        title: '图书名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '借阅日期',
        dataIndex: 'borrowdate',
        key: 'borrowdate',
    },
    {
        title: '归还日期',
        dataIndex: 'returndate',
        key: 'returndate',
        render: (returndate) => returndate ? returndate : '尚未归还'
    },
]

// 错误页，显示没有管理员权限
const PermissionError = () => {

    return (
        <Result
            status="error"
            title="权限错误！"
            subTitle="请检查自身的权限设置！非管理员禁止访问此部分功能！" 
        >
        </Result>
    );
}

export { InfoCheck, ReaderManage }