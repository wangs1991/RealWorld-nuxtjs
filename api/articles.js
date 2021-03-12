import { request } from '@/plugins/request'

// 获取文章列表
export const getArticles = (data) => {
  return request({
    url: '/api/articles',
    method: 'get',
    data
  })
}

// 获取喜欢的文章
export const getFeedArticles = data => {
  return request({
    url: '/api/articles',
    method: 'get',
    data
  })
}

// 获取标签的集合
export const getTags  = () => {
  return request({
    url: '/api/tags',
    method: 'get'
  })
}