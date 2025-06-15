import React from 'react'
import { Form, Input, Button, message } from 'antd';
import "./login.css"
import { getMenu } from '../../api'
import { useNavigate, Navigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  if (localStorage.getItem('token')) {
    return <Navigate to="/home" replace />
  }
  const handleSubmit = (val) => {
    if (!val.password || !val.username) {
      return message.open({
        type: 'warning',
        content: '请输入用户名和密码',
      });
    }
   getMenu(val).then(({ data }) => {
  if (data.code === 200) {
    localStorage.setItem('token', data.data.token)
    message.success('登录成功');
    navigate('/home')
  } else {
    message.error(data.data.message || '登录失败');
  }
}).catch(error => {
  console.error('请求失败:', error);
  message.error('登录请求失败，请稍后再试');
});
  }
  return (
    <Form
      className="login-container"
      onFinish={handleSubmit}
    >
      <div className="login_title">系统登录</div>
      <Form.Item
        label="账号"
        name="username"
      >
        <Input placeholder="请输入账号" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
      >
        <Input.Password placeholder="请输入账号" />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">登录</Button>
      </Form.Item>
    </Form>
  )
}

export default Login