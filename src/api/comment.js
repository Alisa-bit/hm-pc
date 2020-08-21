// 封装跟文章相关的接口
import request from "@/utils/request"


// 修改文章状态的接口
// 注意点：put方式url传递参数，请求体修改数据
// 通过params往url地址栏传递查询字符串
// 通过data修改对应的数据
export const commentStatus = (id, commentStatus) => {
    return request({
        method: 'put',
        url: `/mp/v1_0/comments/status`,
        // 查询字符串
        params: {
            article_id: id
        },
        // 修改的数据
        data: {
            'allow_comment': commentStatus
        }
    })
}