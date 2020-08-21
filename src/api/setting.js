import request from "@/utils/request"


// 编辑用户资料接口
export const editUserinfo = (data) => {
    return request({
        url: '/mp/v1_0/user/profile',
        method: 'PATCH',
        data:data
    })
}

// 编辑用户头像
export const editUserImg = (data) => {
    return request({
        url: '/mp/v1_0/user/photo',
        method: 'PATCH',
        data:data
    })
}
