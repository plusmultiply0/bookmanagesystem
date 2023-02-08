import { Button, Table, Input, Space, message } from 'antd'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

import XLSX from 'xlsx'

const { Search } = Input;

const collectbookdata = [
    {
        id: '1',
        name: '白夜行',
        author: '[日] 东野圭吾',
        publish: '南海出版公司',
        isbn: '9787544258609',
        price: '39.50',
        pubdate: '2013-1-1',
    },
    {
        id: '3',
        name: '大医·破晓篇',
        author: '马伯庸',
        publish: '上海文艺出版社',
        isbn: '9787532183562',
        price: '108.00',
        pubdate: '2022-9',
    },
    {
        id: '4',
        name: '球状闪电',
        author: '刘慈欣',
        publish: '四川科学技术出版社',
        isbn: '9787536484276',
        price: '25.00',
        pubdate: '2016-9',
    },
    {
        id: '6',
        name: '如父如子',
        author: '[日] 是枝裕和',
        publish: ' 湖南文艺出版社',
        isbn: '9787540484651',
        price: '49.80',
        pubdate: '2018-4',
    },
    {
        id: '7',
        name: '无人生还',
        author: '[英] 阿加莎·克里斯蒂',
        publish: '新星出版社',
        isbn: '9787513338288',
        price: '42.00',
        pubdate: '2020-7',
    },
]
const collectColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
    },
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
        title: '出版日期',
        dataIndex: 'pubdate',
        key: 'pubdate',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <CancelCollect data={record}/>
            </Space>
        )
    },
]

// 通用post函数
const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const CancelCollect = (props)=>{
    const data = props.data

    const [isCollect, setCollect] = useState(true)
    const [messageApi, contextHolder] = message.useMessage();
    const info = async() => {
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            username: self,
            isbn: data.isbn,
            isCollect:isCollect
        }
        const res1 = await uniPost('http://127.0.0.1:5000/tocollect', newValue)
        messageApi.info(isCollect ? '取消成功！' : '收藏成功！');
        setCollect(!isCollect)
        setTimeout(() => { window.location.reload() }, 2000)
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={info} >
                {isCollect ?'取消收藏':'收藏'}
            </Button>
        </>
    );
}

const CollectList = ()=>{
    const [collectdata ,setcollectdata] = useState([])

    const [savedata,setsavedata] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    
    const baseUrl = 'http://127.0.0.1:5000/collectdata'
    const self = window.localStorage.getItem('loggedUser')
    const res = { "username": self }

    useEffect(() => {
        // console.log('effect')
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            const data = response.data
            // console.log(data)
            setcollectdata(data)
            setsavedata(data)
        })
    }, [])
    //只在第一次渲染时运行

    const handleexport = ()=>{
        const cleandata = collectdata.map(item=>({
            id:item.id,
            "图书名称":item.name,
            "图书作者":item.author,
            "出版社":item.publish,
            "图书类别":item.type,
            "出版日期":item.pubdate,
            "ISBN":item.isbn,
            "价格":item.price+'元',
            "内容简介":item.intro
        }))
        const worksheet = XLSX.utils.json_to_sheet(cleandata);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);

        XLSX.writeFile(workbook, "book.xlsx", { compression: true });

        messageApi.open({
            type: 'success',
            content: '导出成功！',
        });
    }

    const onSearch = (value) => {
        // console.log(value);
        
        if(value){
            const filterdata = collectdata.filter(item => {
                // console.log(item.value)
                return item.name.includes(value)
            })
            // console.log(filterdata)
            setcollectdata(filterdata)
        }else{
            setcollectdata(savedata)
        }
    }
    const handleChange = (e) => {
        const values = e.target.value
        // console.log(values)
        if (values) {
            // 这里保存一个原始数据，便于反复查找使用
            const filterdata = savedata.filter(item => {
                // console.log(item.value)
                return item.name.includes(values)
            })
            // console.log(filterdata)
            setcollectdata(filterdata)
        } else {
            setcollectdata(savedata)
        }
    }

    return (
        <>
            {contextHolder}
            <Search placeholder="输入书名" onSearch={onSearch} onChange={handleChange} enterButton style={{ width: 200, }} />
            <Button type="primary" className="exportBook" ghost onClick={handleexport}>导出图书</Button>
            <Table columns={collectColumns} dataSource={collectdata} locale={{ emptyText: '暂无数据' }} />
        </>
    );
}

export {CollectList}