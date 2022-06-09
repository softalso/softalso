import { Redirect } from "umi";

// 路由鉴权 
export default function(props){
    const token = localStorage.getItem('token')
    if (props.location.pathname === '/'){
        if (token) return <Redirect to='/home'></Redirect>
    }else{
        if (!token) return <Redirect to='/'></Redirect>
    }
    return (<>{props.children}</>)
}