import axios from 'axios'

// 创建axios实例
const server = axios.create({
    baseURL: 'http://api.xiaohuihui0728.cn:8888/api/private/v1/',
    timeout: 5000,
    // headers: {'X-Custom-Header': 'foobar'}
})

// 添加请求拦截器
server.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url ==='login') return config
    config.headers['Authorization'] = localStorage.getItem('token')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return error
});

// 添加响应拦截器
server.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.status>=200 || response.status<=300) return response.data
    return response;
}, function (error) {
    // 对响应错误做点什么
    return error
});

export default server




