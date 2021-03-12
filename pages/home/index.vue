<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href>Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href>Global Feed</a>
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
                <span class="date">{{ item.createdAt }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
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
              <!-- ngRepeat: pageNumber in $ctrl.pageRange($ctrl.totalPages) -->
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      page: item
                    }
                  }"
                  class="page-link ng-binding"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="(tag, index) in tags"
                :key="index"
                :to="{ name: 'home', query: { tag } }"
                class="tag-pill tag-default"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getTags } from '@/api/articles'
export default {
  name: 'HomeIndex',
  async asyncData ({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag

    // 文章的加载
    const loadArticles = tab === 'global_feed'
      ? getArticles
      : getYourFeedArticles    

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ]) 

    const { articles, articlesCount } = articleRes
    const { tags } = tagRes

    return {
      articles,
      articlesCount,
      page,
      limit,
      tags
    }
  },
  data() {
    return {
      articles: [],
      articlesCount: 1,
      loading: false,
      tags: [],
      params: {
        offset: 0,
        limit: 20
      }
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watchQuery: ['page'],
  methods: {
  },
  created() { }
}
</script>
