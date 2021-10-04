import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/CSS/global.css'
// import {Button,Form,FormItem,Input,Message} from 'element-ui'
import  './assets/fonts/font_s3zb9h1jotj/iconfont.css'
import axios from 'axios'

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将axios挂载到Vue的原型对象上，通过this.$http发起ajax请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
