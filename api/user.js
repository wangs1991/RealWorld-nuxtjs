import { request } from '@/plugins/request'

// 登录
export const login = (data) => {
  return request({
    url: '/api/users/login',
    method: 'post',
    data
  })
}

// 注册
export const register = data => {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

// 更新用户信息
export const update = data => {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

// 工作用户名获取个人信息
export const getProfile = username => {
  return request({
    url: `/api/profiles/${username}`,
    method: 'get'
  })
}

// 关注用户
export const followUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'post'
  })
}

// 取消用户关注
export const unFollowUser = username => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: 'DELETE'
  })
}
