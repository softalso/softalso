// 权限管理
import server from "./server";

export function getMenus(){
    return server.get('menus')
}