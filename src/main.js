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

// 导入vue富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)
// 全局注册
Vue.component('tree-table',TreeTable)
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 将axios挂载到Vue的原型对象上，通过this.$http发起ajax请求
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 全局注册过滤器
Vue.filter('dataFormat',function(originVal){
 const dt =  new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2,'0')
    const x = (dt.getDate() + '').padStart(2,'0')

    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss = (dt.getSeconds() + '').padStart(2,'0')

    return `${y}-${m}-${x}-${hh}--${mm}-${ss}`
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
