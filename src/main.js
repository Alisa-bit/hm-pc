import Vue from 'vue'
// 1、引入element-ui库和必要的样式文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 2、注册elementUI插件
Vue.use(ElementUI);
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
