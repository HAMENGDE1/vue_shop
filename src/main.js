import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css'
// import {Button,Form,FormItem,Input,Message} from 'element-ui'
import  './assets/fonts/font_yat9gwed6ne/iconfont.css'
import axios from 'axios'
// 引入vue插件
import TreeTable from 'vue-table-with-tree-grid'

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

// 全局注册
Vue.component('tree-table',TreeTable)
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将axios挂载到Vue的原型对象上，通过this.$http发起ajax请求
axios.interceptors.request.use(config=>{
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
