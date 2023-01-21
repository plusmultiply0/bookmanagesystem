import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Modal, Form, Input, Typography, List, Skeleton, message } from 'antd';

import axios from 'axios'

const { TextArea } = Input;
const { Title } = Typography;

const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const MessageBoard = ()=>{

    const [text, setText] = useState('')
    const [messageList, setMessageList] = useState([])

    const [messageApi, contextHolder] = message.useMessage();

    const mbUrl = 'http://127.0.0.1:5000/mbdata'
    useEffect(() => {
        // console.log('idea info')
        axios.get(mbUrl).then(response => {
            const data = response.data
            setMessageList(data)
            // console.log('ideainfo:', data)
        })
    }, [])
    //只在第一次渲染时运行

    const onChange = (e) => {
        // console.log('Change:', e.target.value);
        setText(e.target.value)
    };

    const handleClick = async (e)=>{
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            username: self,
            text: text,
        }
        setMessageList([newValue, ...messageList])
        setText('')

        messageApi.open({
            type: 'success',
            content: '提交成功！',
        });
        // 发送至服务器
        const url = 'http://127.0.0.1:5000/addmb'
        const res1 = await uniPost(url,newValue)
        // console.log('addidea:', res1)
    }

    return(
        <>
            {contextHolder}
            <Title>留言板</Title>
            <p>如果有想要添加的新书籍或者改进建议，可以在下方进行留言:)</p>
            <TextArea showCount maxLength={100} onChange={onChange} autoSize={{
                minRows: 3,
                maxRows: 5,
            }} className="mbinput" value={text} />
            <br />
            <Button type='primary' className='mbbutton' htmlType="submit" onClick={handleClick}>提交</Button>
            <Title>过往留言</Title>
            <List
                className="mblist"
                itemLayout="horizontal"
                dataSource={messageList}
                renderItem={(item) => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={<a href="">{item.username + ' '}说</a>}
                                description={item.text}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </>
    )
}

export { MessageBoard }