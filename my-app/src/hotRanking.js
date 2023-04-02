import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Typography, Result, Space, Table, notification, message, Divider, List, Carousel,Card, Row, Col, } from 'antd';
import axios from 'axios'

import { Detail, Borrow, Collect } from './bookdata'

const { Title } = Typography;
const { Meta } = Card;

const HotRanking = ()=>{

    return(
        <>
            <HotBorrow/>
            <NewBook />
            <HotCollect />
        </>
    )
}

// 热门借阅
const HotBorrow = (props)=>{

    const [bookdata,setBookData] = useState([])

    useEffect(() => {
        // console.log('effect')
        axios.get('http://127.0.0.1:5000/hotborrowdata').then(response => {
            const data = response.data
            // console.log('data:', data)
            setBookData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Title>热门借阅</Title>
            <List
                className='borrowlist'
                itemLayout="vertical"
                size="small"
                dataSource={bookdata}
                footer={
                    <div>
                        热门借阅图书实时更新！
                    </div>
                }
                renderItem={(item,index) => (
                    <List.Item
                        key={item.key}
                        actions={[
                            <Detail data={item} />,
                            <Borrow data={item} tag={false} />,
                            <Collect data={item} />
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src={"http://127.0.0.1:5000/images/" + item.isbn + ".jpg"}
                            />
                        }
                    >
                        <Title level={2}>{"No." + (index + 1)}</Title>
                        <List.Item.Meta
                            // avatar={<Avatar src={item.avatar} />}
                            title={<a href={""}>{item.name}</a>}
                            description={item.author}
                        />
                        {item.intro}
                    </List.Item>
                )}
            />
        </>
    )
}


// 热门收藏
const HotCollect = (props) => {

    const [bookdata, setBookData] = useState([])

    useEffect(() => {
        // console.log('effect')
        axios.get('http://127.0.0.1:5000/hotcollectdata').then(response => {
            const data = response.data
            // console.log('data:', data)
            setBookData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return (
        <>
            <Title>热门收藏</Title>
            <List
                className='borrowlist'
                itemLayout="vertical"
                size="small"
                dataSource={bookdata}
                footer={
                    <div>
                        热门收藏图书实时更新！
                    </div>
                }
                renderItem={(item, index) => (
                    <List.Item
                        key={item.key}
                        actions={[
                            <Detail data={item} />,
                            <Borrow data={item} tag={false} />,
                            <Collect data={item} />
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src={"http://127.0.0.1:5000/images/" + item.isbn + ".jpg"}
                            />
                        }
                    >
                        <Title level={2}>{"No." + (index + 1)}</Title>
                        <List.Item.Meta
                            // avatar={<Avatar src={item.avatar} />}
                            title={<a href={""}>{item.name}</a>}
                            description={item.author}
                        />
                        {item.intro}
                    </List.Item>
                )}
            />
        </>
    )
}

// 新书速递
const NewBook = (props) => {

    const [bookdata, setBookData] = useState([])

    useEffect(() => {
        // console.log('effect')
        axios.get('http://127.0.0.1:5000/newbookrecommenddata').then(response => {
            const data = response.data
            // console.log('data:', data)
            setBookData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return (
        <>
            <Title>新书速递</Title>
            <Row gutter={[16, 24]}>
                {
                    bookdata.map((item) => {
                        return (
                            <Col span={8} key={item.id}>
                                <Card
                                    hoverable
                                    style={{
                                        width: 300,
                                    }}
                                    cover={<img alt="example" src={"http://127.0.0.1:5000/images/" + item.isbn + ".jpg"} />}
                                    actions={[
                                        <Detail data={item} />,
                                        <Borrow data={item} tag={true} />,
                                        <Collect data={item} />
                                    ]}
                                >
                                    <Meta title={item.name} description={item.author} />
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
        </>
    )
}

export { HotRanking, HotBorrow, HotCollect, NewBook }