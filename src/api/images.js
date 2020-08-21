// 封装跟文章相关的接口
import request from "@/utils/request"
// 引入操作本地存储获取数据的模块
import { getData } from '@/store'

// 获取用户图片素材
export const getImgs = (params) => {
    return request({
        method: 'get',
        url: `/mp/v1_0/user/images`,
        // 查询字符串
        params:params
    })
}

// 收藏和取消图片素材
export const switchCollect = (id,collect) => {
    return request({
        method: 'put',
        url: `/mp/v1_0/user/images/${id}`,
       data:{
        collect
       }
    })
}

// 删除图片素材
export const delImg = (id) => {
    return request({
        method: 'delete',
        url: `/mp/v1_0/user/images/${id}`
    })
}
