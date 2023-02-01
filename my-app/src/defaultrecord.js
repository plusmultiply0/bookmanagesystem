import { Space, notification, Button, Table, Empty, ConfigProvider, Typography, Modal, message } from 'antd'
import { LaptopOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'

const { Title } = Typography;
const { confirm } = Modal;

const uniPost = async (url, res) => {
    const response = await axios.post(url, res)
    // console.log('response.data:',response.data)
    return response.data
}

const DefaultRecord = () => {

    const [defaultdata, setDefaultData] = useState([])

    const baseUrl = 'http://127.0.0.1:5000/defaultdata'
    const self = window.localStorage.getItem('loggedUser')

    const res = {
        username: self,
    }

    useEffect(() => {
        axios.get(baseUrl, {
            params: res
        }).then(response => {
            let data = response.data

            // 计算是否超期
            const nowtime = new Date().getTime()
            
            data = data.map(item => {
                // 判断是否还书
                let diff;
                // 已还书，根据归还日期进行计算；否则根据当天日期计算
                if (item.returntimestamp) {
                    diff = item.returntimestamp - item.borrowtimestamp
                } else {
                    diff = nowtime - item.borrowtimestamp
                }
                const diffdays = Math.round(diff / 3600 / 1000 / 24) - 31
                
                const isoverdue = diffdays > 0 ? true : false
                // 计算罚金
                let fine = 0;
                if (isoverdue) {
                    fine = item.number * diffdays * 2
                }
                return { fine, overduedays: diffdays, ...item }
            })

            data = data.filter(item => item.overduedays>0)

            setDefaultData(data)
            
        })
    }, [])
    //只在第一次渲染时运行

    return (
        <>
            
            <Title>图书违约</Title>
            <Table columns={defaultColumns} dataSource={defaultdata} locale={{ emptyText: '暂无数据' }} />
        </>
    )
}

const defaultColumns = [
    // {
    //     title: '序号',
    //     dataIndex: 'id',
    //     key: 'id',
    // },
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
        title: '借阅数量',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: '超期天数',
        dataIndex: 'overduedays',
        key: 'overduedays',
    },
    {
        title: '应还日期',
        dataIndex: 'shouldreturndate',
        key: 'shouldreturndate',
    },
    {
        title: '应缴罚金',
        dataIndex: 'fine',
        key: 'fine',
        render: (fine) => <p>{fine}元</p>
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <PayFine data={record} />
            </Space>
        )
    },
]

const PayFine = (props) => {
    let data = props.data

    const [payfine, setpayfine] = useState(data.ispayfine)
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    const handleClick = async() => {
        // 未还书，提示先还书
        if (data.isreturnbook == 0) {
            confirm({
                title: '提示',
                icon: <ExclamationCircleFilled />,
                content: '缴纳罚金前，请将图书尽数归还！',
                okText: '去还书',
                cancelText: '取消',
                onOk() {
                    navigate('/home/borrowList')
                },
                onCancel() {

                },
            });
        }else{
            const self = window.localStorage.getItem('loggedUser')

            const newValue = {
                username: self,
                name:data.name,
            }
            const res1 = await uniPost('http://127.0.0.1:5000/defaultpay', newValue)

            messageApi.open({
                type: 'success',
                content: '缴纳成功！',
            });
            setpayfine(1)
        }
    }

    const finetext = payfine == 0 ? '缴纳罚金' : '已缴纳'
    const finebutton = payfine == 0 ? false : true

    return (
        <>
            {contextHolder}
            <Button type="primary" danger onClick={handleClick} disabled={finebutton}>{finetext}</Button>
        </>
    )
}

export { DefaultRecord }