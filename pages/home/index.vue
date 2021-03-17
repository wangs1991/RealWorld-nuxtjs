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
              <li class="nav-item" v-if="userData">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' || tab === '' }"
                  :to="{ name: 'home' }"
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-show="tag">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  :to="{ name: 'home', query: { tab: 'tag', tag: tag } }"
                >#{{tag}}</nuxt-link>
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
                      page: item,
                      tag,
                      tab
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
import { mapState } from 'vuex'
import {
  getArticles,
  getFeedArticles,
  getTags,
  articleFav,
  articleUnFav
} from '@/api/articles'
export default {
  name: 'HomeIndex',
  async asyncData({ query }) {
    /**
     * tab 文章列表的分裂
     * tag 标签文字
     */
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    let { tag, tab } = query

    tab = tab || 'global_feed'
    tag && (tab = 'tag')

    // 文章的加载
    const [articleRes, tagRes] = await Promise.all([
      tab === 'your_feed'
        ? getFeedArticles({
            limit,
            offset: (page - 1) * limit
          })
        : getArticles({
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
      tags,
      tag,
      tab
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(['userData']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  methods: {
    async toggleFavourite(data) {
      const { article } = await (data.favorited
        ? articleUnFav(data.slug)
        : articleFav(data.slug))

      data.favorited = article.favorited
      data.favoritesCount = article.favoritesCount
    }
  },
  created() {}
}
</script>
