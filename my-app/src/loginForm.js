import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Alert} from 'antd';
import axios from 'axios';
import { useState } from 'react';

import { Link, Navigate } from "react-router-dom";

const baseUrl = 'http://127.0.0.1:5000/login'

const LoginForm = () => {

    const [isAlertShow, setAlertShow] = useState(false)
    const [islogged,setlogged] = useState(false)

    // 登录post函数
    const ifLogin = async res =>{
        const response = await axios.post(baseUrl,res)
        // console.log('response.data:',response.data)
        return response.data
    }
    // 登录函数
    const onFinish = async (values) => {
        // console.log('Received values of form: ', values);
        try{
            const res1 = await ifLogin(values)
            // console.log('res1:',res1)
            // console.log(res1.access_token)
            setlogged(true)
            window.localStorage.setItem('loggedToken', res1.access_token)
            window.localStorage.setItem('loggedUser',values.username)
            if (values.isAdmin){
                window.localStorage.setItem('admin', true)
            }
        } catch (exception){
            // console.log(exception)
            
            // console.log(exception.response.data)
            setAlertShow(true)
            setTimeout(()=>{setAlertShow(false)},3000)
        }
    };
    return (
        <>
            {isAlertShow?<Alert
                className='loginalert'
                message="Error"
                description="用户名或密码错误！"
                type="error"
                showIcon
                closable
            />:''}
            {
                islogged && <Navigate to="/home/self" replace={true} />
            }
            <Form
                name="normal_login"
                className="loginform"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item>
                    登录
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的用户名！',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码！',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="isAdmin" valuePropName="checked" noStyle>
                        <Checkbox>是否为管理员</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="loginbutton">
                        登录
                    </Button>
                    <Button type="primary" ghost className="registerbutton">
                        <Link to="/register">注册</Link>
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm