import Vue from 'vue'
import VueRouter from 'vue-router'
import {getData} from '@/store'

// 引入一级路由组件
// 默认会去找该目录下的index文件
import Login from '@/views/Login'
import Layout from '@/views/Layout'

// 引入二级路由组件
import NotFound from '@/views/NotFound'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    // 首页的根路径为/
    path: '/',
    name: 'Layout',
    component: Layout,
    // 重定向到home
    redirect: 'home',
    children: [
      { path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
       },
      { path: 'article',
        name: 'article', 
        component: () => import(/* webpackChunkName: "articles" */ '@/views/Articles')
      },
      { path: 'addArticle',
       name: 'addArticle', 
       component: () => import(/* webpackChunkName: "addArticle" */ '@/views/Articles/addArticle') 
      },
      { path: 'editArticle', 
        name: 'editArticle', 
        component: () => import(/* webpackChunkName: "editArticle" */ '@/views/Articles/editArticle') 
    },
      { path: 'image', 
        name: 'image', 
        component: () => import(/* webpackChunkName: "image" */ '@/views/Image')
     },
      { path: 'comment', 
        name: 'comment', 
        component: () => import(/* webpackChunkName: "comment" */ '@/views/Comment') 
    },
      { path: 'fans', 
        name: 'fans', 
        component: () => import(/* webpackChunkName: "fans" */ '@/views/Fans')  
    },
      { path: 'setting',
        name: 'setting', 
        component: () => import(/* webpackChunkName: "setting" */ '@/views/Setting')  
      }
    ]
  }, {
    // 页面找不到时，匹配的路由地址
    path: '*',
    name: 'notFound',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

//点击登录会跳转到默认页，默认页地址可能是发给用户的地址
// 用户在没有登录的情况下直接访问默认页，是不允许的，要退出到登录页面进行登录
// 直到登录成功，才可以访问首页
// 控制页面的访问，一个是登录，一个是默认页
// 导航守卫，路由跳转之前做一层拦截
router.beforeEach((to, from, next) => {
  // console.log(to);//从哪里啦
  // console.log(from);//到哪里去
  //控制页面的访问
  if(to.path==='/home'){
    let userInfo=getData();
    // 控制页面的跳转
    // 检查本地是否存在token
    if(userInfo && userInfo.token){
      next()
    }else{
      // 不存在跳转到登录页
      next('/login')
    }

  }else{
    next();
  }
});
export default router
