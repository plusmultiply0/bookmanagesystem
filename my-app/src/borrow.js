import { Space, notification, Button, Table, Empty, ConfigProvider, Typography, Modal } from 'antd'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const { Title } = Typography;

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

const applyBorrowColumns = [
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
        title: '归还数量',
        dataIndex: 'returnnum',
        key: 'returnnum',
    },
    {
        title: '借阅日期',
        dataIndex: 'borrowdate',
        key: 'borrowdate',
    },
    // {
    //     title: '归还日期',
    //     dataIndex: 'shouldreturndate',
    //     key: 'shouldreturndate',
    // },
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
            description: isReturn ? '申请成功！请等待管理员审核！' : '归还失败！借阅数量为0！',
        });
    };
    const openNotificationWithIconError = (type) => {
        api[type]({
            message: '通知信息：',
            description: '归还失败！借阅数量为0！',
        });
    };

    const handleClick = async()=>{
        const self = window.localStorage.getItem('loggedUser')
        const newValue = {
            borrowusr: self,
            name: data.name,
            borrownum: 1,
            returndate: getCurrentTime(false),
            timestamp: new Date().getTime()
        }
        // 借阅数量为0时，提示失败
        if (data.borrownum<1){
            openNotificationWithIconError('error')
            return;
        }

        // console.log(newValue)
        const res1 = await uniPost('http://127.0.0.1:5000/beforetoreturn', newValue)
        // console.log('res1', res1)
        openNotificationWithIcon(isReturn ? 'success' : 'error')

        setTimeout(() => { window.location.reload() }, 3000)
    }

    const buttontext = data.ischecking == -1 ? '再次归还' :'归还'

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={handleClick}>{buttontext}</Button>
            </Space>
        </>
    )
}

const BorrowList = ()=>{
    const [borrowdata ,setBorrowData] = useState([])
    const [applyborrowdata, setApplyBorrowData] = useState([])


    const baseUrl = 'http://127.0.0.1:5000/borrowdata'
    const self = window.localStorage.getItem('loggedUser')

    const res = {
        username:self,
        history: false
    }

    useEffect(() => {
        // console.log('effect')
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            const data = response.data
            // console.log(data)
            setBorrowData(data)
            const filterdata = data.filter((item) => item.ischecking==1)
            // console.log(filterdata)
            setApplyBorrowData(filterdata)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Title>借阅图书</Title>
            <Table columns={borrowColumns} dataSource={borrowdata} locale={{emptyText:'暂无数据'}}/>
            <Title>归还图书申请</Title>
            <Table columns={applyBorrowColumns} dataSource={applyborrowdata} locale={{ emptyText: '暂无数据' }} />
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

const BorrowHistory = ()=>{
    const [borrowhistorydata, setBorrowHistoryData] = useState([])

    const baseUrl = 'http://127.0.0.1:5000/borrowdata'
    const self = window.localStorage.getItem('loggedUser')

    const res = {
        username: self,
        history: true
    }

    useEffect(() => {
        // console.log('effect')
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            const data = response.data
            // console.log(data)
            setBorrowHistoryData(data)
        })
    }, [])
    //只在第一次渲染时运行

    return(
        <>
            <Title>借阅历史</Title>
            <Table columns={borrowHistoryColumns} dataSource={borrowhistorydata} locale={{ emptyText: '暂无数据' }} />
        </>
    )
}

export {BorrowList,BorrowHistory}