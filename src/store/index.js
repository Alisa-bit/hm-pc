// 用来做本地存储的增删查改的
const USERKEY='heima';

// 存的数据是一个对象形式
// 往本地存数据
export const saveData = function (obj) {
    let str=JSON.stringify(obj);
    localStorage.setItem(USERKEY,str)
}

// 从本地获取数据
export const getData = function () {
    try{
        return JSON.parse(localStorage.getItem(USERKEY))
    }catch(error){
        return {}
    }
}

// 删除数据
export const removeData = function () {
    localStorage.removeItem(USERKEY);
 }