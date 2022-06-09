import server from "./server";

// 添加
export function Add(path,data={}){
    return server.post(path,data)
}

// 删除
export function Del(path){
    return server.delete(path)
}

// 修改 
export function UpdateMor(path,data={}){
    return server.put(path,data)
}

// 查询
export function FindData(path,data){
    return server.get(path,data)
}
