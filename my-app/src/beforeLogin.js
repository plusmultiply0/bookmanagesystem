import { Form, Button } from "antd";
import { Link } from "react-router-dom";

// 登录之前的页面显示
const BeforeLogin = () => {
    return (
        <Form>
            <Form.Item>
                <Link to="/login">
                    <Button type="primary" id="homelogin" size="large">登录</Button>
                </Link>
            </Form.Item>
            <Form.Item>
                <Link to="/register">
                    <Button type="primary" id="homeregister" size="large">注册</Button>
                </Link>
            </Form.Item>
        </Form>
    )
}

export default BeforeLogin