// 进行axios请求库的封装
import axios from 'axios'

// 配置接口主URL
const instance = axios.create({
  // 当前项目的所有接口都是以这个地址开头的
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 因为别的模块也需要使用主接口，所以要导出
export default instance
