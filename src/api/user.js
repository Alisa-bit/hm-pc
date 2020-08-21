// 封装用户发送请求的所有接口
// 引入请求库
import request from "@/utils/request"


// 登录接口的封装
// 一般导出
export const login = (mobile, code) => {
    return request({
        url: '/mp/v1_0/authorizations',
        method: 'post',
        data: {
            mobile: mobile,
            code: code
        }
    })
}

// 获取用户信息接口
export const userInfo = (mobile, code) => {
    return request({
        url: '/mp/v1_0/user/profile',
        method: 'get',
        'Content-Type': 'application/json',
    })
}

/*
 login内部实际上调用的是request函数，并且会把request函数当做返回值返回
 login实际上就等于调用request({})发生请求之后返回的一个promise对象
 request函数的调用实际上就等于axios调用发送请求，request()<===>axios()

 login函数调用之后实际上拿到的是一个promise对象，是promise对象就可以调用then方法和catch方法
*/