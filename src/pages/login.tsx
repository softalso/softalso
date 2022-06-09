import React, { useState } from 'react';
import { Button, Checkbox, Form, Input,message  } from 'antd';
import './login.less';
import {Login} from '../request/log.js'

export default function onePage(props:any) {
  // 登录
  const onFinish = async (values: any) => {
    let res = await Login(values)
    if (res.meta.status !== 200) return message.error(res.meta.msg)
    console.log(res);
    // 登录成功之后保存用户信息 跳转首页
    message.success(res.meta.msg)
    let {token,username} = res.data
    localStorage.setItem('token',token)
    localStorage.setItem('username',username)
    props.history.push('/home')
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id='login'>
      <div className='box'>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: false,username:'admin',password:'123456'}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请先输入用户名!' },{max:10,min:3,message:'长度不小于3不大于10'}]}>
            <Input placeholder='请输入用户名'/>
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请先输入密码!' },{max:12,min:6,message:'长度不小于6不大于12'}]}
          >
            <Input.Password placeholder='请输入密码'/>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="yuan">
          <img src="https://b.bdstatic.com/searchbox/icms/searchbox/img/young_boy.png" style={{width:'100%',height:'100%'}}/>
        </div>
      </div>
    </div>
  );
}
