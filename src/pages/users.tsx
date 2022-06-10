import { Select,Breadcrumb, Card, Input, Button, message, Table, Switch, Pagination, Modal,Form,Checkbox } from 'antd';
import { PlusOutlined,EditOutlined,DeleteOutlined,AppstoreOutlined } from '@ant-design/icons'
import React, { useState, useEffect, createRef } from 'react';
// import {request} from 'umi';
const { Search } = Input
import { FindData,Add,UpdateMor,Del } from '@/request/mixture'
import Crumbs from '@/resolution/crumbs';

export default function Users(props: any) {

    // 用户数据列表
    const [arr, setArr] = useState([])

    // 用户数据列表
    const [roleList, setRoleList] = useState([])

    // 用户查询参数
    const [username, setUsername] = useState('')

    // 获取数据的总条数
    const [total, setTotal] = useState(0)

    // 当前页数
    const [page, setPage] = useState(1)

    // 每页显示多少条
    const [page_size, setPage_size] = useState(5)

    // 输入内容时触发
    const searchChange = (e)=> setUsername(e.target.value)

    // 搜索框的值
    const onSearch = (value: string) => getUserData()
    
    // 添加弹出框状态
    const [addstatus, setAddstatus] = useState(false)

    // 修改对话框状态
    const [upstatus, setupstatus] = useState(false)

    // 添加表单数据
    const onFinish = async (value)=>{
        let res = await Add('users',value)
        let {data,meta} = res
        if (meta.status !==201)return message.error(meta.msg)
        message.success(meta.msg)
        setAddstatus(false)
        getUserData()
    }

    // 删除用户
    const del = async (id)=>{
        let {meta} = await Del('users/'+id)   
        if (meta.status !==200)return message.error(meta.msg)
        message.success(meta.msg)
        getUserData()
    }
    
    // 当前修改对话框表单数据
    const [form] = Form.useForm()

    useEffect(() => {
        getUserData()
        getRoleData()
    }, [])

    // 请求用户数据
    const getUserData = async (page=1,page_size=5) => {
        let res = await FindData(`users`, { params: { pagenum: page,query:username, pagesize: page_size } })
        let { data } = res
        if (res.meta.status !== 200) return message.error(res.meta.msg)
        setArr([...data.users])
        setTotal(data.total)
        console.log(res);
    }

    // 请求角色列表数据
    const getRoleData = async () => {
        let res = await FindData(`roles`)
        let { data,meta } = res
        if (meta.status !== 200) return message.error(meta.msg)
        setRoleList([...data])
        console.log(res);

    }

    // 当前用户改变状态
    const onChange = async (mg_state,id) => {
        let res = await UpdateMor(`users/${id}/state/${!mg_state}`)
        let {meta} = res
        console.log(res);
        if (meta.status !==200)return message.error(meta.msg)
        message.success(meta.msg)
    }

    // 显示修改对话框
    const openupdate = (data)=>{
        setAddstatus(true)
        setupstatus(true)
        form.setFieldsValue(data)
    }

    // 修改用户
    const upUser = async ()=>{
        let data = form.getFieldValue()
        let {meta} = await UpdateMor('users/'+data.id,data)
        if (meta.status !==200)return message.error(meta.msg)
        message.success(meta.msg)
        setAddstatus(false)
        getUserData()
    }

    // 表格列配置
    const columns = [
        {
            title: '#',
            dataIndex: 'create_time',
        },
        {
            title: '姓名',
            dataIndex: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '电话',
            dataIndex: 'mobile',
        },
        {
            title: '角色',
            dataIndex: 'role_name',
        },
        {
            title: '状态',
            dataIndex: 'mg_state',
            render: (mg_state,data) => {
                return (
                    <p><Switch defaultChecked={mg_state} onChange={()=>onChange(mg_state,data.id)} /></p>
                )
            }
        },
        {
            title: '操作',
            // dataIndex: 'address',
            key: 'id',
            render: (data:any) =>{
                return (
                    <div>
                        <Button type="primary" icon={<EditOutlined />} onClick={() =>openupdate(data)}>修改</Button>
                        &nbsp;&nbsp;
                        <Button danger icon={<DeleteOutlined />} onClick={() =>del(data.id)}>删除</Button>
                        &nbsp;&nbsp;
                        <Button icon={<AppstoreOutlined />} onClick={()=>roleoPeration(data,data.id)}>分配角色</Button>
                    </div>
                )
            }
        },
    ]

    // 页数或页码改变时触发
    const PaginatiChange = (pagenum, pagesize) => {
        setPage(pagenum)
        setPage_size(pagesize)
        getUserData(pagenum, pagesize)
    }

    // 分配角色对话框状态
    const [roleStatus, setroleStatus] = useState(false)

    // 分配角色表单数据
    const [roleForm] = Form.useForm()

    // 打开角色对话框
    const roleoPeration = (data,id)=>{
        setroleStatus(true)
        // id 当前选中的用户id
        setRole(id)
        roleForm.setFieldsValue(data)
    }

    // 当前选择用户的id
    const [role,setRole] = useState(Number)
    
    // 选择角色
    const onSecondCityChange = (data)=>{
        console.log(data);
    }

    // 分配角色
    const roleonFinish = async ({rid})=>{
        let {meta} = await UpdateMor(`users/${role}/role`,{rid})
        if (meta.status !==200)return message.error(meta.msg)
        message.success(meta.msg)
        setroleStatus(false)
        getUserData()
    }

    return (
        <div>
            {/* 导航面包屑 */}
            <Crumbs one='用户管理' two='用户列表'></Crumbs>
            {/* 视图区域 */}
            <Card style={{ marginTop: '10px' }}>
                {/* 头部搜索区域 */}
                <div style={{ marginBottom: '20px' }}>
                    <Search
                        placeholder="请输入用户名进行搜索"
                        allowClear
                        onChange={searchChange}
                        onSearch={onSearch}
                        style={{ width: 304 }}
                    />
                    <Button onClick={() =>(setAddstatus(true),setupstatus(false))} style={{ marginLeft: '20px' }} type="primary" icon={<PlusOutlined />}>
                        添加用户
                    </Button>
                </div>
                {/* 数据表格 */}
                <Table style={{ marginBottom: '20px' }} pagination={false} rowKey={item => item.id} columns={columns} dataSource={arr} />
                {/* 分页 */}
                <Pagination
                    total={total}
                    current={page}
                    pageSize={page_size}
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={[5, 10, 15, 20]}
                    onChange={PaginatiChange}
                    showTotal={total => `一共 ${total} 条数据`}
                />
            </Card>

            {/* 添加弹出框 */}
            <Modal afterClose={form.resetFields} forceRender={true} destroyOnClose={true} footer={false} title={ upstatus ? "修改":"添加"} visible={addstatus} onCancel={() => setAddstatus(false)}>
                <Form
                    style={{marginRight:'80px'}}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input disabled={upstatus} />
                    </Form.Item>

                    { upstatus ? <></>:<Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item> }

                    <Form.Item label="邮箱" rules={[{ required: true, message: 'Please input your email!' }]} name="email">
                        <Input />
                    </Form.Item>

                    <Form.Item label="手机" rules={[{ required: true, message: 'Please input your mobile!' }]} name="mobile">
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        { upstatus ? 
                        <Button style={{marginRight:'20px'}} type="primary" onClick={upUser}>
                        修改
                        </Button>
                        :
                        <Button style={{marginRight:'20px'}} type="primary" htmlType="submit">
                            添加
                        </Button> }

                        <Button onClick={()=>setAddstatus(false)} type="primary" htmlType="reset">
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 分配角色对话框 */}
            <Modal afterClose={roleForm.resetFields} forceRender={true} destroyOnClose={true} footer={false} title="分配角色" visible={roleStatus} onCancel={() => setroleStatus(false)}>
                <Form   
                    style={{marginRight:'80px'}}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={roleonFinish}
                    autoComplete="off"
                    form={roleForm}
                >
                    <Form.Item label="当前用户">
                        {roleForm.getFieldValue('username')}
                    </Form.Item>

                    <Form.Item label="当前的角色">
                        {roleForm.getFieldValue('role_name')}
                    </Form.Item>

                    <Form.Item label="分配新角色" name="rid" rules={[{ required: true, message: 'Please input your roleName!' }]}>
                        <Select style={{ width: 160 }} placeholder='请选择角色' onChange={onSecondCityChange}>
                            {roleList.map(item => (
                                <Select.Option key={item.id}>{item.roleName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button onClick={()=>setroleStatus(false)} type="primary" htmlType="reset">
                            取消
                        </Button>
                        <Button style={{marginLeft:'20px',textAlign:'left'}} type="primary" htmlType="submit">
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}