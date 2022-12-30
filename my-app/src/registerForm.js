import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Select, Alert, Result
} from 'antd';
import axios from 'axios';
import { Link } from "react-router-dom";

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const baseUrl = 'http://127.0.0.1:5000/register'

const RegisterForm = () => {
    const [form] = Form.useForm();

    const [isAlertShow, setAlertShow] = useState(false)
    const [isRegister,setRegister] = useState(false)

    // 注册post函数
    const ifRegister = async res => {
        const response = await axios.post(baseUrl, res)
        // console.log('response.data:',response.data)
        return response.data
    }
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        try{
            const res1 = await ifRegister(values)
            // console.log('res1:', res1)
            setRegister(true)
        }catch(exception){
            // console.log(exception)
            setAlertShow(true)
            setTimeout(() => { setAlertShow(false) }, 3000)
        }
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <>
            {isAlertShow ? <Alert
                className='registeralert'
                message="Error"
                description="用户名重复！"
                type="error"
                showIcon
                closable
            /> : ''}
            {isRegister?
                <Result
                    status="success"
                    title="注册成功！"
                    extra={[
                        <Link to="/login"><Button type="primary" key="console">前往登录</Button></Link>,
                    ]}
                />
            :<Form
                {...formItemLayout}
                form={form}
                className="registerform"
                name="register"
                onFinish={onFinish}
                initialValues={{
                    prefix: '86',
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码！',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label="用户名"
                    tooltip="你想让其他人如何称呼你？"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的用户名！',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="电话号码"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的电话号码！',
                        },
                    ]}
                >
                    <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: '100%',
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="性别"
                    rules={[
                        {
                            required: true,
                            message: '请选择你的性别！',
                        },
                    ]}
                >
                    <Select placeholder="选择你的性别">
                        <Option value="男性">男性</Option>
                        <Option value="女性">女性</Option>
                        <Option value="其他">其他</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('应当同意服务条款！')),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        注册即代表同意<a href="">服务条款</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        注册
                    </Button>
                </Form.Item>
            </Form>}
        </>
    );
};
export default RegisterForm;