import React ,{ useState, useEffect } from 'react';
import { Card, Button, Spin, Tag, Divider, message, Space } from 'antd';
import axios from 'axios'

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
        // setTimeout(function () { console.log('1') }, 3000);
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
        </>
    )
}

const testdata = ['推理','文学','历史']

// 11种
const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

export {UserProfile}