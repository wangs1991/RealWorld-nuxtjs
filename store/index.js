const cookieParser = process.server ? require('cookieparser') : undefined

// 只需要定义对应的组成部分即可
// state 为了保证每一个用户都是一个单独的实例，和纯vue组件类似需要是一个返回对象的方法
export const state = () => {
  return {
    userData: null
  }
}

// mutations
export const mutations = {
  // 更新用户的数据
  storeUserData(state, data) {
    state.userData = data
  }
}

// actions
export const actions = {
  /**
   * 服务器端需要对header包含token的请求进行处理
   * 如果header有token，需要在 cookie 中读取用户的数据存储到store中，客户端可以直接渲染对应的内容了
   */
  nuxtServerInit({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieParser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (e) {
        console.log(1)
      }
    }

    // console.log(user)
    // 更新到 store 中
    user && commit('storeUserData', user)
  }
}