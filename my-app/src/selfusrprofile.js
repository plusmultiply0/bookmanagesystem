import React ,{ useState, useEffect } from 'react';
import { Card, Button, Spin, Tag, Divider, message, Space, Table } from 'antd';
import axios from 'axios'
import { Detail, Borrow, Collect, columns } from './bookdata'

// 通用post函数
const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const UserProfile = ()=>{
    const [usrdata,setUsrData] = useState([])
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const handleCilck = async()=>{
        setLoading(true)
        const values = {
            username: window.localStorage.getItem('loggedUser')
        }
        const url = 'http://127.0.0.1:5000/userprofile'
        axios.get(url, {
            params: values
        }).then(response => {
            const data = response.data
            setUsrData(data)
            // console.log('info',data)
            if(data.length==0){
                messageApi.open({
                    type: 'error',
                    content: '数据为空，生成失败！请进行收藏或者借阅！',
                });
            }else{
                messageApi.open({
                    type: 'success',
                    content: '生成成功！',
                });
            }
        })
        setLoading(false)
    }

    return(
        <>
            {contextHolder}
            <Card
                title="你的用户画像/标签"
                extra={<Button type="primary" onClick={handleCilck}>生成</Button>}
                style={{
                    width: "100%",
                }}
            >
                <Spin spinning={loading} tip="加载中" size="large">
                    <p>用户画像是根据你的借阅和收藏信息，后台生成与你的形象最符合的标签</p>
                    {
                        usrdata.length?<Divider orientation="left">标签如下：</Divider>:<></>
                    }
                    {
                        usrdata.map(item => {
                            let num = Math.round(Math.random()*11);
                            return (<Tag color={colors[num]} key={Math.random()}>{item}</Tag>)
                    })
                    }
                </Spin>
            </Card>
            <br/>
            <br />
            <br />
            <UserRecommend/>
        </>
    )
}

const testdata = ['推理','文学','历史']

// 11种
const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

const UserRecommend = ()=>{

    const [data,setData] = useState([])
    const [tagData,setTagData]=useState([])
    const [messageApi, contextHolder] = message.useMessage();

    const values = {
        username: window.localStorage.getItem('loggedUser')
    }
    const url = 'http://127.0.0.1:5000/userprofile'

    const tagvalue = {
        tagarray:tagData
    }
    const urlsecond = 'http://127.0.0.1:5000/userrecommend'

    // 预先获取标签
    useEffect(() => {
        
        axios.get(url, {
            params: values
        }).then(response => {
            const data = response.data
            setTagData(data)
            // console.log('info',data)
        })
    }, [])
    //只在第一次渲染时运行

    const handleCilck = async()=>{
        const res1 = await uniPost(urlsecond, tagvalue)
        console.log('data:', res1)
        setData(res1)

        if (res1.length == 0) {
            messageApi.open({
                type: 'error',
                content: '数据为空，生成失败！请进行收藏或者借阅！',
            });
        } else {
            messageApi.open({
                type: 'success',
                content: '生成成功！',
            });
        }
    }

    return(
        <>
            {contextHolder}
            <Card
                title="图书推荐"
                extra={<Button type="primary" onClick={handleCilck}>生成</Button>}
                style={{
                    width: "100%",
                }}
            >
                <p>图书推荐是根据你的借阅和收藏信息，后台生成的你可能喜欢的图书清单</p>
                {data.length == 0 ?<></>:<Table columns={columns} dataSource={data} locale={{ emptyText: '暂无数据' }} />}
            </Card>
        </>
    )
}

export {UserProfile}