// 封装跟文章相关的接口
import request from "@/utils/request"

// 获取文章列表数据接口
// 传递的参数
export const articleList = (params) => {
    return request({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: params
    })
}

// 获取频道接口
export const getChannel = () => {
    return request({
        url: '/mp/v1_0/channels',
        method: 'get'
    })
}

// 删除文章的接口
export const delArticle = (id) => {
    return request({
        method: 'delete',
        url: `/mp/v1_0/articles/${id}`
    })
}


// 发布文章
export const add = (draft,data) => {
    return request({
        method: 'post',
        url: `/mp/v1_0/articles`,
        // 放置query中的
        params:{
            draft:draft
        },
        // 放置body中的
        data
    })
}


// 获取指定文章的数据
export const article = (id) => {
    return request({
        url:`/mp/v1_0/articles/${id}`,
        method: 'get'
    })
}

// 编辑当前指定的文章
export const editarticle = (id,params,data) => {
    return request({
        url:`/mp/v1_0/articles/${id}`,
        method: 'PUT',
        params:params,
        data:data
    })
}