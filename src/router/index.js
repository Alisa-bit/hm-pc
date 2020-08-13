import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// 引入一级路由组件
// @代表src的别名
// 默认会去src/views/Login下找名称为index的文件
import Login from '@/views/Login'
import Layout from '@/views/Layout'

// 引入二级路由组件
import Articles from '@/views/Articles'
import AddArticle from '@/views/AddArticle'
import EditArticle from '@/views/EditArticle'
import Image from '@/views/Image'
import Comment from '@/views/Comment'
import Fans from '@/views/Fans'
import Setting from '@/views/Setting'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name:'login',
    component: Login
  },
  {
    //首页路径地址默认为/
    path: '/',
    name:'layout',
    component: Layout,
    children:[
      {path:'articles',name:'articles',component:Articles},
      {path:'addArcticle',name:'addArcticle',component:AddArticle},
      {path:'editArticle',name:'editArticle',component:EditArticle},
      {path:'image',name:'image',component:Image},
      {path:'comment',name:'comment',component:Comment},
      {path:'fans',name:'fans',component:Fans},
      {path:'setting',name:'setting',component:Setting}
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
