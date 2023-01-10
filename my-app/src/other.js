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

export { ProtectedRoute, ProtectResult }