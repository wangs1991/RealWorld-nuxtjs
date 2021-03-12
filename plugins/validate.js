// vee-validate
import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
// 注册组件
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

// 定义验证规则
extend('email', {
  ...email,
  message: 'Account need to be email'
})
extend('required', {
  ...required,
  message: 'This field is required'
})
extend('password', {
  validate(value) {
    return value.length >= 6
  },
  message: 'password minlength is 6'
})

export default () => { }