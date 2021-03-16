import Vue from 'vue'
import dayjs from 'dayjs'

// 定义日期的filter
Vue.filter('dateFormat', value => {
  return dayjs(value).format('MMMM D') + 'th'
})