import React, { useState, useEffect, useMemo } from 'react';
import './role.less';
import Crumbs from '@/resolution/crumbs';
import { Tree,Card, Button, Table, message, Row, Col, Tag,Modal,Form,Input } from 'antd'
import { PlusOutlined,EditOutlined,DeleteOutlined,AppstoreOutlined } from '@ant-design/icons'
import { FindData, Add, UpdateMor, Del } from '@/request/mixture'

export default function Role() {

  useEffect(() => {
    getData()
  }, [])

  const [roleList, setRoleList] = useState([])

  // 角色列表数据
  const getData = async () => {
    let { data, meta } = await FindData('roles')
    if (meta.status !== 200) return message.error(meta.msg)
    setRoleList([...data])
    console.log(data);
  }

  // 添加弹出框状态
  const [addstatus, setAddstatus] = useState(false)

  // 修改对话框状态
  const [upstatus, setupstatus] = useState(false)

  // 分配角色对话框状态
  const [roleStatus, setroleStatus] = useState(false)

  // 当前修改对话框表单数据
  const [form] = Form.useForm()

  // 表格配置列
  const columns = [
    {
      title: '序号',

      render:(text,record,index)=>`${index+1}`,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width:400,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width:400,
    },
    {
      title: '操作',
      // dataIndex: 'id',
      render: (data) => {
        return (
          <div>
            <Button type="primary" icon={<EditOutlined />} onClick={() => openupdate(data)}>编辑</Button>
            &nbsp;&nbsp;
            <Button danger icon={<DeleteOutlined />} onClick={() => del(data.id)}>删除</Button>
            &nbsp;&nbsp;
            <Button icon={<AppstoreOutlined />} onClick={() => roleoPeration(data,data.id)}>分配权限</Button>
          </div>
        )
      }
    },
  ]

  // 添加表单数据
  const onFinish = async (value)=>{
    // console.log(value);
    let res = await Add('roles',value)
    let {data,meta} = res
    if (meta.status !==201)return message.error(meta.msg)
    message.success(meta.msg)
    setAddstatus(false)
    getData()
}

  // 修改
  const openupdate = (data) => {
    setAddstatus(true)
    setupstatus(true)
    form.setFieldsValue(data)
  }

  // 修改角色
  const upUser = async ()=>{
    let data = form.getFieldValue()
    let {meta} = await UpdateMor('roles/'+data.id,data)
    if (meta.status !==200)return message.error(meta.msg)    
    message.success(meta.msg)
    setAddstatus(false)
    getData()
  }

  // 删除
  const del = async (id) => {
    let {meta} = await Del('roles/'+id)   
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    getData()
  }

  // 权限列表
  const [jurisList,setjurisList] = useState([])

  // 请求权限列表
  const getJurisList = async ()=>{
    let {data,meta} = await FindData('rights/tree')
    if (meta.status !== 200) return message.error(meta.msg)
    // 将获取到的数据递归转化成tree控件格式
    // setjurisList([...transformTree(data)])
    setjurisList([...data])

  }

  // 当前已有权限的key数组
  const [keys,setKeys] = useState([])

  // 当前修改的角色id
  const [roleid,setroleid] = useState()

  // 分配权限
  const roleoPeration = (data,id) => {
    setKeys(transformTree(data.children))
    setroleid(id)
    setroleStatus(true)
    getJurisList()    
  }

  // 递归遍历树形结构 将已有的权限key添加到数组中并返回
  const transformTree = (data,array=[])=>{
    data.forEach(item=>{
      if (item.children && item.children.length > 0) {
        transformTree(item.children,array)
      }else{
        array.push(item.id)
      }
    })
    return array
    // return data.map(item => {
    //   obj ={
    //     title: item.authName,
    //     key: item.id,
    //     children: item.children && item.children.length >0 ? item.children : [],
    //   }
    //   if (item.children && item.children.length > 0) {
    //       // console.log('@item.children', item.children);
    //     obj.children = transformTree(item.children)
    //   }
    //   return obj
    // })
  }

  // 要添加的权限id列表
  const [rids,setRids] = useState([])

  // 复选框改变触发
  const onCheck = (data,e)=> setRids([...data,...e.halfCheckedKeys])

  // 修改权限
  const addRids = async ()=>{
    /*
    * 
    let arrNew= new Set(keys.concat(rids)); //通过set集合去重
    Array.from(arrNew)
    // rids.forEach((item1,index)=> keys.forEach(item=>item1===item ? rids.splice(index,1):false))
    */
    let {meta} = await Add('roles/'+roleid+'/rights',{rids:rids.toString()})
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    setroleStatus(false)
    getData()
  }

  // 删除某个权限
  const onClose = async (roleId,rightId)=>{
    let {meta} = await Del(`roles/${roleId}/rights/${rightId}`)
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    setroleStatus(false)
    getData()
  }

  return (
    <div>
      {/* 导航面包屑 */}
      <Crumbs one='角色列表' two='角色列表'></Crumbs>
      {/* 卡片视图区域 */}
      <Card>
        <div>
          <Button style={{ marginBottom: '20px' }} onClick={() =>(setAddstatus(true),setupstatus(false))} type="primary" icon={<PlusOutlined />}>添加角色</Button>
        </div>
        {/* 表格数据 */}
        <Table
          columns={columns}
          dataSource={roleList}
          bordered
          rowKey={item => item.id}
          childrenColumnName='ss'
          expandable={{
            expandedRowRender: record => {
              return (
                record.children.map(item => {
                  return (
                    <Row gutter={[8, 16]} key={item.id} id='row'>
                      <Col span={8}><Tag closable onClose={()=>onClose(record.id,item.id)} color="magenta">{item.authName}</Tag></Col>
                      <Col span={16}>
                        {
                          item.children.map(item1 => {
                            return (
                              <Row key={item1.id}>
                                <Col span={12}>
                                  <Tag color="cyan" onClose={()=>onClose(record.id,item1.id)} closable>{item1.authName}</Tag>
                                </Col>
                                <Col span={12}>
                                  {
                                    item1.children.map(item2 => {
                                      return <Tag onClose={()=>onClose(record.id,item2.id)} key={item2.id} color="volcano" closable>{item2.authName}</Tag>
                                    })
                                  }
                                </Col>
                              </Row>
                            )
                          })
                        }
                      </Col>
                    </Row>
                  )
                })

              )
            },
            // rowExpandable: record => {
            //   if (!record.children) return false
            //   if (record.children.length !== 0) return true
            // },
          }}
        />
        {/* 添加弹出框 */}
        <Modal afterClose={form.resetFields} forceRender={true} destroyOnClose={true} footer={false} title={upstatus ? "修改" : "添加"} visible={addstatus} onCancel={() => setAddstatus(false)}>
          <Form
            style={{ marginRight: '80px' }}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="角色名称"
              name="roleName"
              rules={[{ required: true, message: '请输入角色名称!' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item label="角色描述" rules={[{ required: true, message: '请输入角色描述！' }]} name="roleDesc">
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              {upstatus ?
                <Button style={{ marginRight: '20px' }} type="primary" onClick={upUser}>
                  修改
                </Button>
                :
                <Button style={{ marginRight: '20px' }} type="primary" htmlType="submit">
                  添加
                </Button>}

              <Button onClick={() => setAddstatus(false)} type="primary" htmlType="reset">
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 分配权限 */}
        <Modal destroyOnClose={true} title="分配角色" visible={roleStatus} onCancel={() => setroleStatus(false)} onOk={addRids}>
            { jurisList.length ? <Tree checkable defaultExpandAll={true} 
              treeData={jurisList}
              onCheck={onCheck}
              defaultCheckedKeys ={keys}
            fieldNames={{ title: "authName", key: "id", children: "children" }}/>:<></> }
        </Modal>
      </Card>
    </div>
  );
}