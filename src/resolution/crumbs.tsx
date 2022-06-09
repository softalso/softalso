import {Breadcrumb} from 'antd'

export default function Crumbs(props){
    return (
        <Breadcrumb style={{marginBottom:'20px'}}>
            <Breadcrumb.Item>
                <a href="/home/welcome">首页</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{props.one}</Breadcrumb.Item>
            <Breadcrumb.Item>{props.two}</Breadcrumb.Item>
        </Breadcrumb>
    )
}