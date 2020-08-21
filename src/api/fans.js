// 封装跟文章相关的接口
import request from "@/utils/request"

// 获取粉丝列表
export const getFans = (params) => {
    return request({
        method: 'get',
        url: `/mp/v1_0/followers`,
        params:params
    })
}

// 获取粉丝统计数据
export const fnasCount = () => {
    return request({
        method: 'get',
        url: "/mp/v1_0/statistics/followers"
    })
}