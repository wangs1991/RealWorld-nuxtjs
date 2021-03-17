import axios from 'axios'

// 初始化请求对象，基本路径地址设置
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

/**
 * 通过插件机制可以获取到 nuxtJs 的上下文环境对象
 * 插件使用的是默认导出对象
 */
export default ({ route, store, req, res }) => {
  /**
   * 为请求追加 token 验证信息
   */
  request.interceptors.request.use(config => {
    const { userData } = store.state
    if (userData && userData.token) {
      config.headers.Authorization = `Token ${userData.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  request.interceptors.response.use(response => {
    return Promise.resolve(response.data || response)
  }, error => {
    return Promise.reject(error)
  })
}