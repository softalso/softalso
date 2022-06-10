import './home.less';
import {
  FundOutlined,
  UserOutlined,
  CrownOutlined,
  ShoppingOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import  { Layout,Menu,Button   } from 'antd';
import type { MenuProps,TreeProps } from 'antd';
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router,Redirect,Route,withRouter,Switch } from 'react-router-dom';
import {getMenus} from '../request/jurisdiction.js'
// import { getMenuData } from '@ant-design/pro-layout';
import src from '@/static/zhentao.png'

const iconslist = [<FundOutlined/>,<UserOutlined/>,<CrownOutlined/>,<ShoppingOutlined/>,<ProfileOutlined/>]

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

export default function Home(props:any){
  
  const [collapsed,setcoll] = useState(false)
  // 菜单列表数据
  const [menuList,setMenu] = useState([])

  // 初次加载页面时触发
  useEffect(()=>{
    getData()
  },[])


  // 获取数据 将获取的数据转换成列表菜单格式
  const getData = async ()=>{
    let res = await getMenus()
    let list:any = []
    if (!res)return false
    res.data.forEach((item,index)=>{
      let children1 = []
      let {authName,id,path,children} = item
      const forItem = (data)=>{
          if (!data.children){
            list.push(getItem(authName,id,iconslist[index]))
          }else{
            children.forEach(item1=>{
              children1.push(getItem(item1.authName,item1.path))
            })
            list.push(getItem(authName,id,iconslist[index],children1))
          }
      }
      forItem(item)
    })
    setMenu([...list])
  }

  // 菜单列表keys
  // const [keys,setkeys] = useState([])

  // 点击导航菜单触发
  // const onOpenChange = (value)=>{
  //   console.log(value);
  //   // setkeys([value[-1]])
  // }  

  return (
    <div id='home'>
      <Layout className='Layout'>
        {/* 头部 */}
        <Header className='Header' style={{ position: 'fixed',zIndex: 1, width: '100%' }}>
          <div>
            <div>
              <img src={src} alt="振涛教育"/>
              <span>哈哈电哈哈商哈哈管哈哈理哈哈</span>
            </div>
            <div>
              <span style={{fontWeight:'bold',color:'#fff'}}>欢迎用户 {localStorage.getItem('username')}</span>
              <Button style={{marginLeft:'20px'}} type='primary' onClick={()=>(localStorage.removeItem('username'),localStorage.removeItem('token'),props.history.push('/'))}>退出</Button>
            </div>
            
          </div>
        </Header>
        <Layout>
          {/* 左侧路由 */}
          <Sider style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 63,
        bottom: 0,
      }} className='Sider' trigger={null} collapsible collapsed={collapsed}>
          
          <div onClick={()=>setcoll(!collapsed)} style={{width:'100%',background:'#1b4875',height:'30px',textAlign:'center'}}>| | |</div>
            <Menu
              onClick={(e)=>props.history.push('/home/'+e.key)}
              defaultSelectedKeys={['215']}
              // openKeys={keys}
              defaultOpenKeys={['125']}
              mode="inline"
              theme="dark"
              items={menuList}
              // onOpenChange={onOpenChange}
            />
            </Sider>
          {/* 中间视图区域 */}
          <Content className='Content' style={{ marginLeft: 200,marginTop: 60 }}>
              <Switch location={props.location}>{props.children.props.children}</Switch>
          </Content>
        </Layout>
    </Layout>
    </div>
  );
}
