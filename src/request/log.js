import server from "./server";

export function Login(data){
    return server.post('login',data)
}