import React, { useState, useEffect } from 'react';
import './goods.less';
import { PlusOutlined,EditOutlined,DeleteOutlined,UploadOutlined } from '@ant-design/icons'
import { Card, Button, message, Input, Table, Pagination,Form,Modal,Upload  } from 'antd'
import { FindData, Add, UpdateMor, Del } from '@/request/mixture'
import Crumbs from '@/resolution/crumbs';
import moment from 'moment';

const { Search } = Input

export default function Goods() {

  useEffect(() => { getGoodsData() }, [])

  // 商品列表
  const [goodsList, setGoodsList] = useState([])

  // 商品查询参数
  const [goodsName, setGoodsName] = useState('')

  // 获取数据的总条数
  const [total, setTotal] = useState(0)

  // 当前页数
  const [page, setPage] = useState(1)

  // 每页显示多少条
  const [page_size, setPage_size] = useState(7)

  // 添加弹出框状态
  const [addstatus, setAddstatus] = useState(false)

  // 修改对话框状态
  const [upstatus, setupstatus] = useState(false)

  // 当前修改对话框表单数据
  const [form] = Form.useForm()

  // 商品列表
  const getGoodsData = async (page = 1, page_size = 7) => {
    let { meta, data } = await FindData(`goods`, { params: { pagenum: page, query: goodsName, pagesize: page_size } })
    if (meta.status !== 200) return message.error(meta.msg)
    setGoodsList(data.goods)
    setTotal(data.total)
    console.log(data);
  }

  // 页数或页码改变时触发
  const PaginatiChange = (pagenum, pagesize) => {
    setPage(pagenum)
    setPage_size(pagesize)
    getGoodsData(pagenum, pagesize)
  }

  // 删除用户
  const del = async (id)=>{
    let {meta} = await Del('goods/'+id)   
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    getGoodsData()
  }

  // 显示修改对话框
  const openupdate = (data)=>{
      setAddstatus(true)
      setupstatus(true)
      form.setFieldsValue(data)
  }

  // 修改商品
  const upData = async ()=>{
    let data = form.getFieldValue()
    let {meta} = await UpdateMor('goods/'+data.goods_id,data)
    if (meta.status !==200)return message.error(meta.msg)
    message.success(meta.msg)
    setAddstatus(false)
    getGoodsData()
  }

  // 添加表单数据
  const onFinish = async (value)=>{
    value.pics = goodsFile
    let res = await Add('goods',value)
    let {data,meta} = res
    if (meta.status !==201)return message.error(meta.msg)
    message.success(meta.msg)
    console.log(data,meta);
    setAddstatus(false)
    getGoodsData()
  }

  // 列表配置项
  const columns = [
    {
      title: '#',
      // dataIndex: 'create_time',
      render:(_,__,index)=> <p>{index+1}</p>
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
    },
    {
      title: '商品价格(元)',
      dataIndex: 'goods_price',
    },
    {
      title: '商品重量',
      dataIndex: 'goods_weight',
    },
    {
      title: '创建时间',
      dataIndex: 'add_time',
      render:(add_time)=><p>{moment(add_time).format('YYYY-MM-DD HH:mm:ss')}</p>
    },
    {
      title: '操作',
      // dataIndex: 'mg_state',
      render: (data) => {
        return (
          <div>
            <Button type="primary" icon={<EditOutlined />} onClick={() =>openupdate(data)}>编辑</Button>
            &nbsp;&nbsp;
            <Button danger icon={<DeleteOutlined />} onClick={() =>del(data.goods_id)}>删除</Button>
          </div>
        )
      }
    },
  ]

  // 要添加添加的文件
  const [goodsFile,setFile] = useState()

  // 输入内容时触发
  const searchChange = (e) => setGoodsName(e.target.value)

  // 搜索框的值
  const onSearch = (value: string) => getGoodsData()

  // 上传文件之前的回调
  const beforeUpload = (file)=>{
    setFile(file)
    return false
  }

  return (
    <div id='goods'>
      {/* 导航面包屑 */}
      <Crumbs one='商品管理' two='商品列表'></Crumbs>
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
          <Button onClick={() => (setAddstatus(true), setupstatus(false))} style={{ marginLeft: '20px' }} type="primary" icon={<PlusOutlined />}>
            添加商品
          </Button>
        </div>
        {/* 数据表格 */}
        <Table style={{ marginBottom: '20px' }} pagination={false} rowKey={item => item.goods_id} columns={columns} dataSource={goodsList} />
        {/* 分页 */}
        <Pagination
          total={total}
          current={page}
          pageSize={page_size}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={[7, 14, 21, 28]}
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
                label="商品名称"
                name="goods_name"
                rules={[{ required: true, message: '请输入商品名称!' }]}
            >
                <Input/>
            </Form.Item>

            <Form.Item label="商品价格" name="goods_price"  rules={[{ required: true, message: '请输入商品价格！' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="商品数量" name="goods_number"  rules={[{ required: true, message: '请输入商品数量!' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="商品重量" name="goods_weight"  rules={[{ required: true, message: '请输入商品重量!' }]}>
                <Input />
            </Form.Item>

            { upstatus ? <></>:
            <Form.Item label="上传商品图片" >
              <Upload beforeUpload={beforeUpload}><Button icon={<UploadOutlined />}>点击上传</Button></Upload>
            </Form.Item> }


            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                { upstatus ? 
                <Button style={{marginRight:'20px'}} type="primary" onClick={upData}>
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
    </div>
  );
}
