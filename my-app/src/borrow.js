import { Space, notification, Button, Table } from 'antd'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
const borrowData = [
    {
        id:'1',
        name:'黑客与画家',
        borrowusr:'zjc',
        borrownum:'1',
        borrowdate:'2022-12-15',
        returndate:'',
    },
    {
        id: '2',
        name: '风起陇西',
        borrowusr: 'zjc',
        borrownum: '2',
        borrowdate: '2022-11-30',
        returndate: '',
    },
    {
        id: '3',
        name: '恶意',
        borrowusr: 'zjc',
        borrownum: '1',
        borrowdate: '2022-12-01',
        returndate: '',
    },
]

const borrowColumns = [
    {
        title:'序号',
        dataIndex:'id',
        key:'id',
    },
    {
        title: '图书名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '借阅人',
        dataIndex: 'borrowusr',
        key: 'borrowusr',
    },
    {
        title: '借阅数量',
        dataIndex: 'borrownum',
        key: 'borrownum',
    },
    {
        title: '借阅日期',
        dataIndex: 'borrowdate',
        key: 'borrowdate',
    },
    {
        title: '应还日期',
        dataIndex: 'shouldreturndate',
        key: 'shouldreturndate',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Return data={record}/>
            </Space>
        )
    },
]

const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}
// 获取设置时间的函数
function zeroFill(i) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}
function getCurrentTime(more) {

    if (!more) {
        var date = new Date();//当前时间
        var month = zeroFill(date.getMonth() + 1);//月
        var day = zeroFill(date.getDate());//日
        //当前时间
        var curTime = date.getFullYear() + "-" + month + "-" + day
    } else {
        var date = new Date();//当前时间
        var month = zeroFill(date.getMonth() + 2);//月
        let year = date.getFullYear()
        let day = zeroFill(date.getDate());//日
        if (month > 12) {
            year = date.getFullYear() + 1
            month = zeroFill(1)
        }
        var curTime = year + "-" + month + "-" + day
    }
    return curTime;
}

const Return = (props) => {
    const data = props.data
    const [isReturn, setReturn] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: '通知信息：',
            description: isReturn ? '归还成功！' : '归还失败！',
        });
    };

    const handleClick = async()=>{
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            borrowusr: self,
            name: data.name,
            borrownum: 1,
            returndate: getCurrentTime(false)
        }
        console.log(newValue)
        const res1 = await uniPost('http://127.0.0.1:5000/toreturn', newValue)
        console.log('res1', res1)
        openNotificationWithIcon(isReturn ? 'success' : 'error')

        setTimeout(() => { window.location.reload() }, 3000)
    }
    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleClick}>归还</Button>
            </Space>
        </>
    )
}

const BorrowList = ()=>{
    const [borrowdata ,setBorrowData] = useState([])

    const baseUrl = 'http://127.0.0.1:5000/borrowdata'
    const self = window.localStorage.getItem('loggedUser')

    const res = {
        username:self,
        history: false
    }

    useEffect(() => {
        console.log('effect')
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            const data = response.data
            console.log(data)
            setBorrowData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Table columns={borrowColumns} dataSource={borrowdata} />
        </>
    );
}

const borrowHistoryColumns = [
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
        title: '借阅人',
        dataIndex: 'borrowusr',
        key: 'borrowusr',
    },
    {
        title: '借阅日期',
        dataIndex: 'borrowdate',
        key: 'borrowdate',
    },
    {
        title: '归还日期',
        dataIndex: 'returndate',
        key: 'returndate',
        render: (returndate)=>returndate?returndate:'尚未归还'
    },
]
const borrowHistoryData = [
    {
        id: '1',
        name: '黑客与画家',
        borrowusr: 'zjc',
        borrowdate: '2022-12-15',
        returndate: '',
    },
    {
        id: '2',
        name: '风起陇西',
        borrowusr: 'zjc',
        borrowdate: '2022-11-30',
        returndate: '2022-12-05',
    },
    {
        id: '3',
        name: '恶意',
        borrowusr: 'zjc',
        borrowdate: '2022-12-01',
        returndate: '',
    },
]

const BorrowHistory = ()=>{
    const [borrowhistorydata, setBorrowHistoryData] = useState([])

    const baseUrl = 'http://127.0.0.1:5000/borrowdata'
    const self = window.localStorage.getItem('loggedUser')

    const res = {
        username: self,
        history: true
    }

    useEffect(() => {
        console.log('effect')
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            const data = response.data
            console.log(data)
            setBorrowHistoryData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Table columns={borrowHistoryColumns} dataSource={borrowhistorydata} />
        </>
    )
}

export {BorrowList,BorrowHistory}