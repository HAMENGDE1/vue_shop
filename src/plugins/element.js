import Vue from 'vue'
import {Button,Form,FormItem,Input,Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 弹窗组件挂在Vue原型对象上
Vue.prototype.$message = Message
