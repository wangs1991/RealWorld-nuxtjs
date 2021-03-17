import { request } from '@/plugins/request'

// 获取文章列表
export const getArticles = (params) => {
  return request({
    url: '/api/articles',
    method: 'get',
    params
  })
}

// 获取喜欢的文章
export const getFeedArticles = data => {
  return request({
    url: '/api/articles/feed',
    method: 'get',
    data
  })
}

// 获取标签的集合
export const getTags = () => {
  return request({
    url: '/api/tags',
    method: 'get'
  })
}

// 发布文章
export const publish = (data) => {
  return request({
    url: '/api/articles',
    method: 'post',
    data
  })
}

// 更新文章
export const update = (slug, data) => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'PUT',
    data
  })
}

// 更具slug 获取文章的详情
export const getDetailBySlug = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'get'
  })
}

// 收藏文章
export const articleFav = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'post'
  })
}

// 取消收藏文章
export const articleUnFav = slug => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: 'DELETE'
  })
}

// 获取文章的评论
export const getArticleComments = slug => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'get'
  })
}

// 提交评论
export const submitComment = (slug, data) => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: 'post',
    data
  })
}

// 删除文章
export const deleteArticle = slug => {
  return request({
    url: `/api/articles/${slug}`,
    method: 'DELETE'
  })
}
