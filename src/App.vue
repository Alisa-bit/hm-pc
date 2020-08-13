<template>
  <div id="app">
    <div id="nav">
    </div>
    <!-- 一级路由渲染出口 -->
    <router-view />
  </div>
</template>

<script>

// 导入进行axios请求的模块
// request就是配置了baseURL的axios实例
// import request from './utils/request'
// @相当于当前目录的别名
import request from '@/utils/request'

export default {
  // mounted () {
  //   // 发送axios请求
  //   request({
  //     url: '/getList',
  //     method: 'get'
  //   })
  // }
}
</script>

<style lang="less">
</style>
