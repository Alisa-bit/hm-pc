// 进行axios请求库的封装
import axios from 'axios'
// 引入操作本地存储获取数据的模块
import { getData } from '@/store'
// 引入插件，可以处理大的数据
import Jsonbig from 'json-bigint'

// 配置接口主URL
const instance = axios.create({
  // 当前项目的所有接口都是以这个地址开头的
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    // data代表当前接口返回的数据
    // 使用Jsonbig.parse代替默认的JSON.parse处理数据

    // try catch容错处理
    try{
      let handTrag=Jsonbig.parse(data);
      // 返回数据
      return handTrag
    }catch(error){
      console.log('JSONbig转换出错', error)
      return data
    }
  }]
})

instance.interceptors.request.use((config) => {
  // 请求发起之前设置一些自定义的属性
  // config是一个对象，代表当前请求头对象
  // console.log(config);
  // 如果本地存在token值就设置
  let getuserInfo = getData()
  // token做一层容错
  if (getuserInfo && getuserInfo.token) {
    config.headers.Authorization = `Bearer ${getuserInfo.token}`
  }
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});


// 因为别的模块也需要使用主接口，所以要导出
export default instance
