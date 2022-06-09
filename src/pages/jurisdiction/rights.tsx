import React,{useState,useEffect} from 'react';
import './rights.less';
import { Card,message,Table,Tag } from 'antd'
import Crumbs from '@/resolution/crumbs';
import { FindData } from '@/request/mixture'

export default function Rights() {

  useEffect(() => {
    getData()
  }, [])

  const [rightsList, setRightsList] = useState([])

  // 权限列表数据
  const getData = async () => {
    let { data, meta } = await FindData('rights/list')
    if (meta.status !== 200) return message.error(meta.msg)
    setRightsList([...data])
    console.log(data);
  }

  // 表格列配置
  const columns = [
    {
      title:'#',
      render:(a,b,index)=> <p>{index+1}</p>
    },
    {
      title: '角色名称',
      dataIndex:'authName',
    },
    {
      title: '路径',
      dataIndex:'path',
    },
    {
      title: '权限等级',
      dataIndex:'level',
      render:(level)=> <p>{ level==='0' ? <Tag color="geekblue">一级</Tag>: level==='1' ? <Tag color="lime">二级</Tag>:<Tag color="gold">三级</Tag>}</p>
    },
  ]

  return (
    <div id='rights'>
        <Crumbs one='权限管理' two='权限列表'></Crumbs>

        {/* 视图 */}
        <Card>
          <Table rowKey={item=>item.id} columns={columns} dataSource={rightsList}></Table>
        </Card>
    </div>
  );
}
