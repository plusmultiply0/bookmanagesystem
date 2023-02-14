import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Modal, Form, Input, Typography, List, Skeleton, message, Space,Row,Col } from 'antd';
import { LaptopOutlined, SmileOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios'

const { TextArea } = Input;
const { Title } = Typography;

const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

// 表情列表
const emojiList = [
    // 笑脸
    { id: 1, emoji:"😀"},
    { id: 2, emoji: "😁" },
    { id: 3, emoji: "😂" },
    { id: 4, emoji: "😃" },
    { id: 5, emoji: "😄" },
    { id: 6, emoji: "😅" },
    { id: 7, emoji: "😆" },
    { id: 8, emoji: "😇" },
    { id: 9, emoji: "😉" },
    { id: 10, emoji: "😊" },
    { id: 11, emoji: "🙂" },
    { id: 12, emoji: "🙃" },
    { id: 13, emoji: "🤣" },
    { id: 14, emoji: "🫠" },
    // 表情脸
    { id: 15, emoji: "😍" },
    { id: 16, emoji: "😗" },
    { id: 17, emoji: "😘" },
    { id: 18, emoji: "😙" },
    { id: 19, emoji: "😚" },
    { id: 20, emoji: "🤩" },
    { id: 21, emoji: "🥰" },
    { id: 22, emoji: "🥲" },
    // 吐舌脸
    { id: 23, emoji: "😋" },
    { id: 24, emoji: "😛" },
    { id: 25, emoji: "😜" },
    { id: 26, emoji: "😝" },
    { id: 27, emoji: "🤑" },
    { id: 28, emoji: "🤪" },
    // 带手脸
    { id: 29, emoji: "🤔" },
    { id: 30, emoji: "🤗" },
    { id: 31, emoji: "🤫" },
    { id: 32, emoji: "🤭" },
    { id: 33, emoji: "🫡" },
    { id: 34, emoji: "🫢" },
    { id: 35, emoji: "🫣" },
]

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

    // 表情状态
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (item) => {
        // console.log(item)
        setText(text+item)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return(
        <>
            {contextHolder}
            <Title>留言板</Title>
            <p>如果有想要添加的新书籍或者改进建议，可以在下方进行留言:)</p>
            <TextArea showCount maxLength={100} onChange={onChange} autoSize={{
                minRows: 3,
                maxRows: 5,
            }} className="mbinput" value={text} />
            {/* 表情组件 */}
            <Space size="large">
                <Space className='smilehover' onClick={showModal}>
                    <SmileOutlined/>
                    表情
                </Space>
            </Space>
            <Modal title="表情符号" open={isModalOpen} onOk={()=>{handleOk("")}} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Row gutter={0}>
                    {
                        emojiList.map((item)=>{
                            return(
                                <Col span={2} key={item.id} onClick={()=>{handleOk(item.emoji)}}>
                                    <div>{item.emoji}</div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Modal>
            {/* 结束 */}
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