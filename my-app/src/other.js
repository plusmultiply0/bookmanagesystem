import {
    Navigate, Link
} from "react-router-dom"
import React from 'react';
import { Button, Result } from 'antd';

const ProtectedRoute = (props) => {
    const token = window.localStorage.getItem('loggedUser')

    if (!token) {
        return (
            <>
                <Navigate to="/permissionerror" replace />
            </>
        )
    }
    return props.children
};

const ProtectResult = ()=>{
    return(
        <Result
            status="warning"
            title="权限错误，请先登录！"
            extra={
                <Link to="/login">
                    <Button type="primary" key="console">
                        前往登录
                    </Button>
                </Link>
            }
        />
    )
}

const PageNotFound = ()=>{
    return(
        <Result
            status="404"
            title="404 页面不存在"
            subTitle="很抱歉，当前页面不存在"
            extra={<Link to="/">
                <Button type="primary">
                    前往主页
                </Button>
            </Link>}
        />
    )
}

export { ProtectedRoute, ProtectResult, PageNotFound }