<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="image" class="user-img" />
            <h4>{{username}}</h4>
            <p>{{bio}}</p>
            <nuxt-link
              v-if="userData && userData.username === username"
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{name: 'setting'}"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm action-btn"
              :class="following ? 'btn-secondary' : 'btn-outline-secondary'"
              :disabled="followTag || !userData"
              @click="toggleFollow"
            >
              <i class="ion-plus-round"></i>
              {{ following ? 'Unfollow' : 'Follow' }}
              &nbsp;
              {{username}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: type === 'my'}"
                  :to="{
                    name: 'profile',
                    params: { name: username },
                    query: { type: 'my' }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{active: type === 'feed'}"
                  :to="{
                    name: 'profile',
                    params: { name: username },
                    query: { type: 'feed' }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章元素 -->
          <div class="article-preview" v-for="item in articles" :key="item.slug">
            <div class="article-meta">
              <nuxt-link :to="{ name: 'profile', params: { name: item.author.username } }">
                <img :src="item.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{ name: 'profile', params: { name: item.author.username } }"
                >{{ item.author.username }}</nuxt-link>
                <span class="date">{{ item.createdAt | dateFormat }}</span>
              </div>
              <button
                @click="toggleFavourite(item)"
                :disabled="!userData"
                class="btn btn-sm pull-xs-right"
                :class="item.favorited ? 'btn-primary' : 'btn-outline-primary'"
              >
                <i class="ion-heart"></i>
                {{ item.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{ name: 'article', params: { id: item.slug } }" class="preview-link">
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 加载中提示 -->
          <div class="article-preview" v-show="loading">Loading articles...</div>

          <!-- 空列表提示 -->
          <div class="article-preview" v-show="articles.length < 1">No articles are here... yet.</div>

          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      name: username
                    },
                    query: {
                      page: item,
                      type
                    }
                  }"
                  class="page-link ng-binding"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfile, followUser, unFollowUser } from '@/api/user'
import { getArticles, articleFav, articleUnFav } from '@/api/articles'

export default {
  name: 'UserProfile',
  async asyncData({ params, query }) {
    const { name } = params
    let { type, page } = query
    const search = {}
    let articles
    let articlesCount
    let profile
    const limit = 20

    type = type || 'my'
    page = page || 1
    // 拼接文章接口的参数
    search.limit = limit
    search.offset = (page - 1) * limit
    if (type === 'feed') {
      search.favorited = name
    } else {
      search.author = name
    }

    try {
      const [articleRes, profileRes] = await Promise.all([
        getArticles(search),
        getProfile(name)
      ])
      articles = articleRes.articles
      articlesCount = articleRes.articlesCount
      profile = profileRes.profile
    } catch (e) {}

    return {
      loading: false,
      articlesCount,
      articles,
      ...profile,
      followTag: false,
      type,
      limit,
      page
    }
  },
  computed: {
    ...mapState(['userData']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watchQuery: ['type', 'page'],
  methods: {
    async toggleFollow() {
      const request = this.following ? unFollowUser : followUser

      try {
        this.followTag = true
        const { profile } = await request(this.username)
        this.following = profile.following
        this.followTag = false
      } catch (e) {
        alert(e.message || e.toString())
        this.followTag = false
      }
    },
    async toggleFavourite(data) {
      const { article } = await (data.favorited
        ? articleUnFav(data.slug)
        : articleFav(data.slug))

      data.favorited = article.favorited
      data.favoritesCount = article.favoritesCount
    }
  }
}
</script>
