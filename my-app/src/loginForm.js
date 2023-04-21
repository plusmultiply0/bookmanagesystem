import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Alert, Statistic, message } from 'antd';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";

import SliderCaptcha from 'rc-slider-captcha';
import createPuzzle from 'create-puzzle';
import DemoImage from './images/captcha2.jpg';

const baseUrl = 'http://127.0.0.1:5000/login'

const { Countdown } = Statistic;

const LoginForm = () => {

    const [isAlertShow, setAlertShow] = useState(false)
    const [islogged,setlogged] = useState(false)

    const [visible, setVisible] = useState(false);
    const [duration, setDuration] = useState(0);
    const [result,setResult] = useState(false);
    const [captchaAlert,setCaptchaAlert] = useState(false);

    const isLock = window.localStorage.getItem('lockoutTime')
    // console.log(isLock - Date.now())

    const [failattempt,setFailAttempt]=useState(0);
    const [locked, setLocked] = useState(isLock?true:false);
    const [remainingTime, setRemainingTime] = useState(isLock - Date.now())
    const [lockTime, setLockTime] = useState(parseInt(isLock));
    // console.log(lockTime)
    const [messageApi, contextHolder] = message.useMessage();

    const actionRef = useRef();

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
            // 滑块验证未通过，禁止登录
            if (!result){
                setCaptchaAlert(true);
                setTimeout(() => { setCaptchaAlert(false) }, 2000)
                return;
            }

            // 3次登录失败，锁定一段时间
            if(failattempt>1){

                if (actionRef.current) {
                    actionRef.current.refresh();
                    setVisible(false);
                    setResult(false)
                }
                // 实际秒数+1
                const time = 31 * 1000
                messageApi.open({
                    type: 'error',
                    content: `您已被锁定，请在${time/1000-1}秒后重试！`,
                });

                setLocked(true)
                // 登录失败时设置锁定时间并保存到本地存储
                const lockoutTime = Date.now() + time; // 锁定5分钟
                localStorage.setItem('lockoutTime', lockoutTime);
                setLockTime(lockoutTime)
                // console.log(lockoutTime)
                setRemainingTime(time)
                return;
            }

            const res1 = await ifLogin(values)
            // console.log('res1:',res1)
            // console.log(res1.access_token)
            setlogged(true)
            window.localStorage.setItem('loggedToken', res1.access_token)
            window.localStorage.setItem('loggedUser',values.username)
            if (values.isAdmin){
                window.localStorage.setItem('admin', true)
            }else{
                window.localStorage.removeItem('admin')
            }
        } catch (exception){
            // console.log(exception)
            
            // console.log(exception.response.data)
            setAlertShow(true)

            if (actionRef.current) {
                actionRef.current.refresh();
                setVisible(false);
                setResult(false)
            }

            const trytime = failattempt + 1

            messageApi.open({
                type: 'warning',
                content: `登录错误！累计3次，账号会被锁定，已累计${trytime}次！`,
            });

            setFailAttempt(trytime)
            // console.log(trytime)

            setTimeout(()=>{setAlertShow(false)},3000)
        }
    };

    const offsetXRef = useRef(0);

    const waitTime = ()=>{
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    // 计时器函数，每秒钟更新一次锁定截止时间
    useEffect(() => {
        const interval = setInterval(() => {
            // 倒计时--
            const newtime = remainingTime - 1000
            const locktimeto = window.localStorage.getItem('lockoutTime')
            // 时间到解锁
            if (locktimeto && newtime <=0) {
                setLocked(false);
                setFailAttempt(0);
                localStorage.removeItem('lockoutTime');
                setRemainingTime(0)
            } else if (locktimeto && newtime>0){
                setRemainingTime(newtime)
                // console.log(remainingTime)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [remainingTime]);

    const handleChange = (val) => {
        if (typeof val === 'number') {
            // console.log('changed!');
        }
    };

    return (
        <>
            {contextHolder}
            {isAlertShow?<Alert
                className='loginalert'
                message="Error"
                description="用户名或密码错误！"
                type="error"
                showIcon
                closable
            />:''}
            {captchaAlert ? <Alert
                className='loginalert'
                message="Error"
                description="滑块验证错误！请再次尝试！"
                type="error"
                showIcon
                closable
            /> : ''}
            {
                islogged && <Navigate to="/home/bookList" replace={true} />
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
                {locked?
                    <Form.Item>
                        <Countdown title="锁定倒计时" value={lockTime} onChange={handleChange} />
                    </Form.Item>
                    :''
                }
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
                    <SliderCaptcha
                        request={() =>
                            createPuzzle(DemoImage).then(async (res) => {
                                offsetXRef.current = res.x;
                                await waitTime();
                                return {
                                    bgUrl: res.bgUrl,
                                    puzzleUrl: res.puzzleUrl
                                };
                            })
                        }
                        onVerify={async (data) => {
                            await waitTime();
                            // console.log(data);
                            if (data.x >= offsetXRef.current - 5 && data.x < offsetXRef.current + 5) {
                                setDuration(data.duration);
                                setVisible(true);
                                await waitTime();
                                setResult(true);
                                offsetXRef.current = 0
                                return Promise.resolve();
                            }
                            return Promise.reject();
                        }}
                        bgSize={{
                            width: 250,
                            height: 110
                        }}
                        mode="float"
                        limitErrorCount={3}
                        jigsawContent={
                            visible && (
                                <div className={"successTip"}>
                                    {Number((duration / 1000).toFixed(2))}秒内完成，打败了98%用户
                                </div>
                            )
                        }
                        actionRef={actionRef}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="loginbutton" disabled={locked ?true:false}>
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