import React,{useState,useEffect} from 'react';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons'
import { FindData,Add,UpdateMor,Del } from '@/request/mixture'
import Crumbs from '@/resolution/crumbs';
import { message, Card, Alert,Select,Cascader,Tabs,Table,Button,Modal,Form,Input } from 'antd'
const {TabPane} = Tabs

export default function Params() {

  useEffect(()=>{
    getCategoriesList()
  },[])

  // 商品分类列表
  const [categories,setCategories] = useState([])

  // 获取商品分类列表
  const getCategoriesList = async ()=>{
    let res = await FindData('categories')
    let {data,meta} = res
    if (!res)return;
    if (meta.status !== 200) return message.error(meta.msg)
    setCategories(data)
  }

  // 参数列表
  const [paramsList,setParamsList] = useState([])

  // 获取参数列表
  const getParamsList = async (id,sel)=>{
    let res = await FindData(`categories/${id}/attributes?sel=${sel}`)
    let {data,meta} = res
    if (!res)return;
    if (meta.status !== 200) return message.error(meta.msg)
    setParamsList(data)
    console.log(res);
    
  }

  // 级联选择框的值
  const [cascader,setCascader] = useState([])

  // 动态列表参数or静态列表参数
  const [params,setParams] = useState('many')

  // 级联选择器变化
  const onChange = (value)=>{
    if (value===undefined || value.length!==3)return setCascader([])
    setCascader(value)
    getParamsList(value[2],params)
  }

  // 切换tabs页
  const TabsOnChange = (data)=>{
    if (cascader.length !== 3)return;
    setParams(data)
    getParamsList(cascader[2],data)
  }

  // 添加弹出框状态
  const [addstatus, setAddstatus] = useState(false)

  // 修改对话框状态
  const [upstatus, setupstatus] = useState(false)

  // 当前修改对话框表单数据
  const [form] = Form.useForm()

  // 添加表单数据
  const onFinish = async (value)=>{
    value.attr_sel = params
    let res = await Add(`categories/${cascader[2]}/attributes`,value)
    let {data,meta} = res
    console.log(res);
    if (meta.status !==201)return message.error(meta.msg)
    message.success(meta.msg)
    setAddstatus(false)
    getParamsList(cascader[2],params)
  }

  // 修改
  const openupdate = (data) => {
    setAddstatus(true)
    setupstatus(true)
    form.setFieldsValue(data)
  }

  // 修改参数属性
  const upUser = async ()=>{
    let data = form.getFieldValue()
    let {meta} = await UpdateMor(`categories/${cascader[2]}/attributes/${data.attr_id}`,data)
    if (meta.status !==200)return message.error(meta.msg)    
    message.success(meta.msg)
    setAddstatus(false)
    getParamsList(cascader[2],params)
  }

  // 删除
  const del = async (id) => {
    let {meta} = await Del(`categories/${cascader[2]}/attributes/${id}`)
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    getParamsList(cascader[2],params)
  }

  // 表格配置项
  const columns = [
    {
      title:'#',
      render:(_,__,index)=> <p>{index+1}</p>
    },
    {
      title:'参数名称',
      dataIndex:'attr_name',
    },
    {
      title:'操作',
      render:(data)=>{
        return (
          <div>
            <Button type="primary" icon={<EditOutlined />} onClick={() =>openupdate(data)}>编辑</Button>
            &nbsp;&nbsp;
            <Button danger icon={<DeleteOutlined />} onClick={() =>del(data.attr_id)}>删除</Button>
          </div>
        )
      }
    },
  ]
  
  return (
    <div>
        {/* 导航面包屑 */}
        <Crumbs one='商品管理' two='参数列表'></Crumbs>
        {/* 视图区域 */}
        <Card>
          {/* 提示 */}
          <Alert message="注意：只允许为第三级分类设置相关参数！" banner />
          {/* 商品分类选择框 */}
          <div style={{margin:'20px 0'}}>
            <span>选择商品分类：</span>
            <Cascader
              allowClear={false}
              options={categories}
              expandTrigger="hover"
              onChange={onChange}
              placeholder='请选择'
              value={cascader}
              // showCheckedStrategy='SHOW_CHILD'
              fieldNames={{ label: "cat_name", value: "cat_id", children: "children" }}
            />
          </div>
          {/* Tabs 标签页 */}
          <Tabs defaultActiveKey="many" onChange={TabsOnChange}>
            <TabPane forceRender={true} tab="动态" key="many">
              <Button type='primary' style={{marginBottom:'20px'}} onClick={() =>(setAddstatus(true),setupstatus(false))} disabled={cascader.length!==3}>添加参数</Button>
            </TabPane>
            <TabPane forceRender={true} tab="静态" key="only">
              <Button type='primary' style={{marginBottom:'20px'}} onClick={() =>(setAddstatus(true),setupstatus(false))} disabled={cascader.length!==3}>添加属性</Button>
            </TabPane>
          </Tabs>
          <Table dataSource={paramsList} columns={columns} rowKey={item=>item.attr_id}></Table>
          {/* 添加、修改弹出框 */}
          <Modal afterClose={form.resetFields} forceRender={true} destroyOnClose={true} footer={false} title={upstatus ? "修改" : "添加"} visible={addstatus} onCancel={() => setAddstatus(false)}>
            <Form
              style={{ marginRight: '80px' }}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
              autoComplete="off"
              form={form}
            >
                <Form.Item label={ params==='only' ? "静态属性":"动态参数" } rules={[{ required: true, message: `请输入${ params==='only' ? "属性":"参数" }描述！` }]} name="attr_name">
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
        </Card>
    </div>
  );
}
