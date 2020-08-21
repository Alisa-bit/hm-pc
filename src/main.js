import Vue from 'vue'
// 1、引入element-ui库和必要的样式文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

// 2、注册elementUI插件
Vue.use(ElementUI)

// 实例化一个vue对象，然后把eventBus方法挂载到他的原型上，使每个vue组件实例都有这个方法
Vue.prototype.eventBus=new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
