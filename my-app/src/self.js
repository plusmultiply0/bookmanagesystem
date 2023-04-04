import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Modal, Form, Input, Typography, List, Skeleton, message } from 'antd';

import axios from 'axios'

const selfdata = [
    {
        username:'zjc',
        tel:'13912345678',
        sex:'男',
        intro:'',
    },
]
const list = [
    {
        username:'zjc',
        text:'这是一个内容1',
    },
    {
        username: 'zjc',
        text: '这是一个内容2',
    },
    {
        username: 'zjc',
        text: '这是一个内容3',
    },
]

const { TextArea } = Input;
const { Title} = Typography;

const baseUrl = 'http://127.0.0.1:5000/selfdata'

const Self = ()=>{
    const [info,setInfo] = useState({})

    // 获取用户信息
    const self = window.localStorage.getItem('loggedUser')
    const res = {"username":self}
    useEffect(() => {
        // console.log('self info')
        axios.get(baseUrl,{
            params:res
        }).then(response => {
            const data = response.data
            // console.log(data)
            setInfo(data)
            // console.log('info',data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Descriptions title="用户信息" bordered extra={<EditSelf data={info} handleChange={setInfo}/> }>
                <Descriptions.Item label="用户名" span={3}>{info.username}</Descriptions.Item>
                <Descriptions.Item label="电话号码" span={3}>{info.tel}</Descriptions.Item>
                <Descriptions.Item label="性别" span={3}>{info.sex}</Descriptions.Item>
                <Descriptions.Item label="简介" span={3}>{info.intro}</Descriptions.Item>
            </Descriptions>
            <br/>
            <EditPwd/>
            <br/>
            <br/>
            <IdeaRelease/>
        </>
    );
}
// 修改自身信息的组件
const EditSelf = (props)=>{
    const data = props.data
    const handleInfo = props.handleChange

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [infoTel,setInfoTel]= useState(data.tel)

    const [infoMsg,setInfoMsg]= useState(data.intro)

    const [messageApi, contextHolder] = message.useMessage();

    const handleTel = (event)=>{
        setInfoTel(event.target.value)
    }

    const handleMsg = (event) => {
        setInfoMsg(event.target.value)
    }

    const showModal = () => {
        setIsModalOpen(true);
        console.log(data.username)
    };

    const infoUrl = 'http://127.0.0.1:5000/selfchange'
    // 登录post函数
    const uniPost = async res => {
        const response = await axios.post(infoUrl, res)
        // console.log('response.data:',response.data)
        return response.data
    }
    const handleOk = async () => {
        const newValues = {
            username:data.username,
            sex:data.sex,
            tel:infoTel?infoTel:data.tel,
            intro:infoMsg?infoMsg:data.intro
        }
        // console.log(newValues)
        // 更改本地信息
        handleInfo(newValues)
         
        setIsModalOpen(false);
        // 更改服务器端信息
        const res1 = await uniPost(newValues)
        // console.log('res1:', res1)
        messageApi.open({
            type: 'success',
            content: '修改成功！',
        });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onFinish = (values)=>{
        console.log(values)
    }
    return(
        <>
            {contextHolder}
            <Button type="primary" onClick={showModal}>编辑</Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Form
                    name="basic"
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
                    onFinish={onFinish}
                >
                    <Form.Item>
                        修改个人信息
                    </Form.Item>
                    <Form.Item label="用户名" name="username">
                        <Input placeholder={data.username} disabled/>
                    </Form.Item>
                    <Form.Item label="电话号码" name="tel">
                        <Input defaultValue={data.tel} value={infoTel} onChange={handleTel}/>
                    </Form.Item>
                    <Form.Item label="性别" name="sex">
                        <Input placeholder={data.sex} disabled/>
                    </Form.Item>
                    <Form.Item label="个人简介" name="intro">
                        <TextArea rows={4} defaultValue={data.intro} maxLength={120} value={infoMsg} onChange={handleMsg }/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
// 修改密码
const EditPwd = ()=>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const pwdUrl = 'http://127.0.0.1:5000/pwdchange'
    // 登录post函数
    const uniPost = async res => {
        const response = await axios.post(pwdUrl, res)
        // console.log('response.data:',response.data)
        return response.data
    }

    const handleOk = async() => {
        // console.log({ firstPwd, secondPwd })
        if (firstPwd == secondPwd){
            // console.log('same,ok!')
            messageApi.open({
                type: 'success',
                content: '修改密码成功！',
            });

            const self = window.localStorage.getItem('loggedUser')
            const newValues = {
                "username": self,
                "password":secondPwd,
                "isadmin": window.localStorage.getItem('admin')
            }
            // console.log(newValues)
            const res1 = await uniPost(newValues)
            // console.log('res1:', res1)
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const [form] = Form.useForm();

    const [firstPwd, setFirstPwd] = useState('')
    const [secondPwd, setSecondPwd] = useState('')

    const handleFirst = (event)=>{
        setFirstPwd(event.target.value)
    }
    const handleSecond = (event) => {
        setSecondPwd(event.target.value)
    }

    return(
        <>
            {contextHolder}
            <Button type="primary" onClick={showModal}>修改密码</Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Form
                    form={form}
                    name="pwd"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item>
                        修改密码
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="新密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入你的密码！',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password value={firstPwd} onChange={handleFirst }/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请确认你的密码！',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致！'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password value={secondPwd} onChange={handleSecond }/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

// 想法发布
const IdeaRelease = ()=>{
    const [ideaText,setIdeaText] = useState('')
    const [ideaList, setIdeaList] = useState([])

    const [messageApi, contextHolder] = message.useMessage();

    const onChange = (e) => {
        // console.log('Change:', e.target.value);
        setIdeaText(e.target.value)
    };

    const addideaUrl = 'http://127.0.0.1:5000/addidea'
    // 登录post函数
    const uniPost = async res => {
        const response = await axios.post(addideaUrl, res)
        // console.log('response.data:',response.data)
        return response.data
    }

    const onFinish = async()=>{
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            username: self,
            text: ideaText,
        }
        setIdeaList([newValue, ...ideaList])
        setIdeaText('')
        // console.log([newValue, ...ideaList])

        // 发送新想法至服务器
        const res1 = await uniPost(newValue)
        // console.log('addidea:', res1)
        messageApi.open({
            type: 'success',
            content: '发布成功！',
        });
    }

    const delideaUrl = 'http://127.0.0.1:5000/delideas'
    // 登录post函数
    const delPost = async res => {
        const response = await axios.post(delideaUrl, res)
        // console.log('response.data:',response.data)
        return response.data
    }

    const handleDel = async()=>{
        setIdeaList([])
        const self = window.localStorage.getItem('loggedUser')
        const res = await delPost({username:self})
        // console.log('delidea:', res)
        messageApi.open({
            type: 'success',
            content: '删除成功！',
        });
    }

    // 获取用户信息
    const self = window.localStorage.getItem('loggedUser')
    const res = { "username": self }
    const ideaUrl = 'http://127.0.0.1:5000/selfidea'
    useEffect(() => {
        // console.log('idea info')
        axios.get(ideaUrl, {
            params: res
        }).then(response => {
            const data = response.data
            setIdeaList(data)
            // console.log('ideainfo:', data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            {contextHolder}
            <Form
                name="basic"
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
                onFinish={onFinish}
            >
                <Form.Item>
                    <Title level={4}>个人座右铭</Title>
                </Form.Item>
                
                <TextArea showCount maxLength={100} onChange={onChange} autoSize={{
                    minRows: 3,
                    maxRows: 5,
                }} className="ideainput" value={ideaText}/>
                <br/>
                <Form.Item>
                    <Button type='primary' className='ideabutton' htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
            <Button onClick={handleDel}>全部删除</Button>
            <List
                className="idealist"
                itemLayout="horizontal"
                dataSource={ideaList}
                renderItem={(item) => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={<a href="">{item.username+' '}说</a>}
                                description={item.text}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </>
    )
}


export { Self }