import React ,{ useState, useEffect } from 'react';
import { Card, Button, Spin, Tag, Divider, message, Space, Table, Modal, Descriptions } from 'antd';
import axios from 'axios'
import { Detail, Borrow, Collect, columns } from './bookdata'
import { Column, WordCloud } from '@ant-design/plots';

// 通用post函数
const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const colorsforpic = ['#F4664A', '#5B8FF9']

const UserProfile = ()=>{
    const [usrdata,setUsrData] = useState([])
    const [alldata,setAllData] = useState([])
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
        const urlad = 'http://127.0.0.1:5000/userprofilealldata'
        axios.get(urlad, {
            params: values
        }).then(response => {
            const data = response.data
            setAllData(data)
            // console.log('info',data)
        })
        setLoading(false)
    }

    // 图表配置
    const config = {
        data:alldata,
        xField: 'type',
        yField: 'value',
        seriesField: '',
        color: ({ type }) => {
            let num = Math.round(Math.random() * 1);

            return colorsforpic[num];
        },
        label: {
            content: (originData) => {
                const val = parseFloat(originData.value);

                let num = 0;
                alldata.map((item)=>{
                    num = num + item.value
                })

                return (val * 100 / num).toFixed(1) + '%';
            },
            offset: 10,
        },
        legend: false,
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };

    const configwc = {
        data:alldata,
        wordField: 'type',
        weightField: 'value',
        colorField: 'type',
        wordStyle: {
            fontFamily: 'Verdana',
            fontSize: [20, 50],
            rotation: 0,
        },
        // 返回值设置成一个 [0, 1) 区间内的值，
        // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
        random: () => 0.5,
    };

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
                        usrdata.length?<Divider orientation="left">你最可能喜欢的三个标签如下：</Divider>:<></>
                    }
                    {
                        usrdata.map(item => {
                            let num = Math.round(Math.random()*11);
                            return (<Tag color={colors[num]} key={Math.random()}>{item}</Tag>)
                    })
                    }
                    {
                        alldata.length ? <Divider orientation="left">你的图书类别数据分析图如下：</Divider> : <></>
                    }
                    {
                        alldata.length==0?<></>:<Column {...config} />
                    }
                    {
                        alldata.length ? <Divider orientation="left">你的图书类别数据词云图如下：</Divider> : <></>
                    }
                    {
                        alldata.length == 0 ? <></> : <WordCloud {...configwc} />
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
        // console.log('data:', res1)
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
                {data.length == 0 ? <></> : <Table columns={usrcolumns} dataSource={data} locale={{ emptyText: '暂无数据' }} />}
            </Card>
        </>
    )
}

// 修复借阅后页面刷新问题
const usrcolumns = [
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
        title: '类别',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <XDetail data={record} />
                <Borrow data={record} tag={false}/>
                <Collect data={record} />
            </Space>
        )
    },
]

const XDetail = (props) => {
    let detail = props.data

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                详情
            </Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
                <Descriptions title="图书详细信息" bordered>
                    <Descriptions.Item label="图书名称" span={2}>{detail.name}</Descriptions.Item>
                    <Descriptions.Item label="图书作者">{detail.author}</Descriptions.Item>
                    <Descriptions.Item label="出版社" span={2}>{detail.publish}</Descriptions.Item>
                    <Descriptions.Item label="ISBN">{detail.isbn}</Descriptions.Item>
                    <Descriptions.Item label="价格" span={2}>{detail.price}元</Descriptions.Item>
                    <Descriptions.Item label="类别">{detail.type}</Descriptions.Item>
                    <Descriptions.Item label="内容简介" span={3}>{detail.intro}</Descriptions.Item>
                    <Descriptions.Item label="出版日期">{detail.pubdate}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    )
}


export {UserProfile}