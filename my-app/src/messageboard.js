import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Modal, Form, Input, Typography, List, Skeleton, message, Space,Row,Col } from 'antd';
import { LaptopOutlined, SmileOutlined, BookOutlined, AppstoreOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
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

// 评论列表
let commentList = [
    {
        id:1,
        fromId:'zjc',
        content:'想看三体Ⅲ，希望能尽快上架QAQ',
        likeNum:12,
        createTime:'1672720815000',
        child:[
            {
                id: 1,
                commentId:1,
                fromId: 'zzc',
                content: '同，我也想！',
                createTime: '1672816760000',
            },
            {
                id: 2,
                commentId: 1,
                fromId: '赵怀真',
                content: '支持！顶！',
                createTime: '1674475687000',
            },
        ]
    },
    {
        id: 2,
        fromId: '沈梦溪',
        content: '希望能借阅《黑客与画家》这本书，心心念念好久了😊',
        likeNum: 8,
        createTime: '1673947766000',
        child: []
    },
    {
        id: 3,
        fromId: 'abc',
        content: '什么时候能上架《翦商》，上新书的速度太慢了！！！🥲',
        likeNum: 15,
        createTime: '1675491463000',
        child: [
            {
                id: 1,
                commentId: 3,
                fromId: 'test',
                content: '对呀！太慢了！！',
                createTime: '1675655361000',
            },
        ]
    },
]

// 时间戳转化函数
function timetrans(date) {
    var date = new Date(date);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}

const MessageBoard = ()=>{

    const [text, setText] = useState('')

    const [comments, setComments] = useState([])

    const [messageApi, contextHolder] = message.useMessage();

    const mbcommentUrl = 'http://127.0.0.1:5000/mbcommentdata'
    useEffect(() => {

        axios.get(mbcommentUrl).then(response => {
            const data = response.data
            setComments(data)
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
        // 保存父评论
        const newcomment = {
            id: comments.length+1,
            fromId: self,
            content: text,
            createTime: new Date().getTime(),
            likeNum:0,
            child:[]
        }
        
        // console.log(comments)
        setComments([newcomment, ...comments])
        // console.log(newcomment)
        setText('')
        // 添加类别，便于后端识别
        const sendComment = { ...newcomment, type:'parent'}

        messageApi.open({
            type: 'success',
            content: '提交成功！',
        });
        // 发送至服务器
        const url = 'http://127.0.0.1:5000/addmbcomment'
        const res1 = await uniPost(url, sendComment)
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
            {/* 表情组件 */}
            <MyEmoji text={text} setText={setText}/>
            {/* 结束 */}
            <br />
            <Button type='primary' className='mbbutton' htmlType="submit" onClick={handleClick}>提交</Button>
            <Title>过往留言</Title>
            <MyComment item={comments} comments={comments} setComments={setComments}/>
        </>
    )
}

// 表情组件
const MyEmoji = (props)=>{

    let text = props.text
    let setText = props.setText

    // 表情状态
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (item) => {
        // console.log(item)
        setText(text + item)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return(
        <>
            <Space size="large">
                <Space className='smilehover' onClick={showModal}>
                    <SmileOutlined />
                    表情
                </Space>
            </Space>
            <Modal title="表情符号" open={isModalOpen} onOk={() => { handleOk("") }} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Row gutter={0}>
                    {
                        emojiList.map((item) => {
                            return (
                                <Col span={2} key={item.id} onClick={() => { handleOk(item.emoji) }}>
                                    <div>{item.emoji}</div>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Modal>
        </>
    )
}

// 评论组件
const MyComment = (props)=>{

    let items = props.item

    let comments = props.comments
    let setComments = props.setComments

    // console.log(items)

    return(
        <>
            {
                items.map((item)=>{
                    return(
                        <BaseComemnt item={item} key={item.id} keyid={item.id} comments={comments} setComments={setComments} />
                    )
                })
            }
        </>
    )
}

const BaseComemnt = (props)=>{

    let it = props.item
    // console.log(it)

    let comments = props.comments
    let setComments = props.setComments
    let keyid = props.keyid

    const [state,setState] = useState(it)
    const [click, setClick] = useState(false)

    const [content,setContent] = useState('')

    const [replystate,setReplyState] = useState(false)
    const [replyclick,setReplyClick] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();

    const handlelikeclick = async() => {
        setClick(!click)
        // 状态非立即改变
        const likeurl = 'http://127.0.0.1:5000/mbcommentlike'
        let sendobject;
        if(click){
            setState({ ...state, likeNum: state.likeNum - 1 })
            sendobject = {
                type:'unlike',
                id: keyid
            }
            const res1 = await uniPost(likeurl, sendobject)
            messageApi.open({
                type: 'success',
                content: '取消点赞成功！',
            });
        }else{
            setState({ ...state, likeNum: state.likeNum + 1 })
            sendobject = {
                type: 'like',
                id: keyid
            }
            const res1 = await uniPost(likeurl, sendobject)
            messageApi.open({
                type: 'success',
                content: '点赞成功！',
            });
        }
        
    }

    const onChange = (e) => {
        // console.log('Change:', e.target.value);
        setContent(e.target.value)
    };

    // 提交评论
    const handleClick = async()=>{
        let num = 1;
        comments.map((item)=>{
            if(item.id==keyid){
                item.child.map((item)=>{
                    num++;
                })
            }
        })
        
        const self = window.localStorage.getItem('loggedUser')
        const newcomment = {
            id: num,
            commentId: keyid,
            fromId: self,
            content: content,
            createTime: new Date().getTime(),
        }
        // console.log(newcomment)

        let newco = { ...it ,child:[...it.child,newcomment]}
        // console.log(newco)
        // 转变思路，直接改变当前组件状态，不去改变上级状态
        setState(newco)

        setReplyState(false)
        setContent('')
        setReplyClick(false)

        messageApi.open({
            type: 'success',
            content: '发布成功！',
        });

        // 发送至后端
        const send = { ...newcomment, type: 'child' }
        const url = 'http://127.0.0.1:5000/addmbcomment'
        const res1 = await uniPost(url, send)
    }

    const handlereplyclick = ()=>{
        setReplyState(!replystate)

        setReplyClick(!replyclick)
    }

    return (
        <>
            {contextHolder}
        <div className='parentcomment'>
            <span className='parentusr'>{state.fromId + ' 说'}</span><span className='parenttime'>{timetrans(Number(state.createTime))}</span>
            <div className='parentcontent'>{state.content}</div>
            <div>
                <span className='likeicon' onClick={handlelikeclick}>
                    {click ? <LikeFilled /> : <LikeOutlined />}
                </span>
                {state.likeNum}
                <span className='parentreply' onClick={handlereplyclick}>{replyclick ?'取消':'回复'}</span>
            </div>
            <div className='commentreply' style={{display:replystate?'block':'none'}}>
                <TextArea showCount maxLength={100} autoSize={{
                    minRows: 3,
                    maxRows: 5,
                }} className="mbinput" value={content} onChange={onChange}/>
                <MyEmoji text={content} setText={setContent} />
                <Button type='primary' className='mbbutton' htmlType="submit" onClick={handleClick}>提交</Button>
            </div>
            {
                state.child && state.child.map((item) => {
                    // console.log(item)
                    return (
                        <div className='childcomment' key={item.id}>
                            <span className='childusr'>{item.fromId}</span><span className='childtime'>{timetrans(Number(item.createTime))}</span>
                            <div className='childcontent'>{item.content}</div>
                        </div>
                    )
                })
            }
            <hr className="hr-edge-weak"></hr>
        </div>
        </>
    )
}

export { MessageBoard }