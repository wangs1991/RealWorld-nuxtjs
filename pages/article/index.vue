<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ title }}</h1>

        <!-- 作者的信息 -->
        <div class="article-meta">
          <nuxt-link :to="{ name: 'profile', params: { name: author.username } }">
            <img :src="author.image" />
          </nuxt-link>
          <div class="info">
            <nuxt-link
              class="author"
              :to="{ name: 'profile', params: { name: author.username } }"
            >{{ author.username }}</nuxt-link>
            <span class="date">{{ createdAt|dateFormat }}</span>
          </div>
          <button
            class="btn btn-sm"
            :class="author.following ? 'btn-secondary' : 'btn-outline-secondary'"
            :disabled="followTag || !userData"
            @click="toggleFollow"
          >
            <i class="ion-plus-round"></i>
            &nbsp;
            {{author.following ? 'UnFollow' : 'Follow' }} {{ author.username }}
          </button>
          &nbsp;&nbsp;
          <button
            class="btn btn-sm btn-outline-primary"
            :class="favorited ? 'btn-secondary' : 'btn-outline-secondary'"
            :disabled="favTag || !userData"
            @click="toogleFav"
          >
            <i class="ion-heart"></i>
            &nbsp;
            Favorite Post
            <span class="counter">({{favoritesCount}})</span>
          </button>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <nuxt-link :to="{ name: 'profile', params: { name: author.username } }">
            <img :src="author.image" />
          </nuxt-link>
          <div class="info">
            <nuxt-link
              class="author"
              :to="{ name: 'profile', params: { name: author.username } }"
            >{{ author.username }}</nuxt-link>
            <span class="date">{{ createdAt|dateFormat }}</span>
          </div>
          <button
            class="btn btn-sm"
            :class="author.following ? 'btn-secondary' : 'btn-outline-secondary'"
            :disabled="followTag || !userData"
            @click="toggleFollow"
          >
            <i class="ion-plus-round"></i>
            &nbsp;
            {{author.following ? 'UnFollow' : 'Follow' }} {{ author.username }}
          </button>
          &nbsp;&nbsp;
          <button
            class="btn btn-sm btn-outline-primary"
            :class="favorited ? 'btn-secondary' : 'btn-outline-secondary'"
            :disabled="favTag || !userData"
            @click="toogleFav"
          >
            <i class="ion-heart"></i>
            &nbsp;
            Favorite Post
            <span class="counter">({{favoritesCount}})</span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <!-- 未登录 提示登录后评论 -->
          <p style="display: inherit;" v-if="!userData">
            <nuxt-link :to="{ name: 'login' }">Sign in</nuxt-link>or
            <nuxt-link :to="{ name: 'register' }">sign up</nuxt-link>to add comments on this article.
          </p>
          <!-- 登录 进行评论 -->
          <template v-else>
            <ValidationObserver v-slot="{ handleSubmit }">
              <form class="card comment-form" @submit.prevent="handleSubmit(onSubmit)">
                <validation-provider rules="required" v-slot="{ errors }">
                  <span class="error-messages">{{ errors[0] }}</span>
                  <div class="card-block">
                    <textarea
                      class="form-control"
                      placeholder="Write a comment..."
                      rows="3"
                      v-model="comment"
                      :disabled="commentSubmitting"
                    ></textarea>
                  </div>
                </validation-provider>
                <div class="card-footer">
                  <img :src="userData.image" class="comment-author-img" />
                  <button
                    class="btn btn-sm btn-primary"
                    :disabled="commentSubmitting"
                    @click="submitComment"
                  >Post Comment</button>
                </div>
              </form>
            </ValidationObserver>
          </template>

          <!-- 评论的元素 -->
          <template v-if="comments.length">
            <div class="card" v-for="comment in comments" :key="comment.id">
              <div class="card-block">
                <p class="card-text">{{comment.body}}</p>
              </div>
              <div class="card-footer">
                <nuxt-link
                  class="comment-author"
                  :to="{ name: 'profile', params: { name: author.username } }"
                >
                  <img :src="comment.author.image" class="comment-author-img" />
                </nuxt-link>&nbsp;
                <nuxt-link
                  class="comment-author"
                  :to="{ name: 'profile', params: { name: author.username } }"
                >{{comment.author.username}}</nuxt-link>
                <span class="date-posted">{{comment.createdAt|dateFormat}}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDetailBySlug,
  articleFav,
  articleUnFav,
  getArticleComments,
  submitComment
} from '@/api/articles'
import { followUser, unFollowUser } from '@/api/user'
import { mapState } from 'vuex'
export default {
  name: 'Article',
  async asyncData({ params }) {
    const { id } = params
    const requests = [getArticleComments(id), getDetailBySlug(id)]

    const [{ comments }, { article }] = await Promise.all(requests)

    return {
      ...article,
      followTag: false,
      favTag: false,
      comments,
      comment: '',
      commentSubmitting: false
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  methods: {
    async toggleFollow() {
      const request = this.author.following ? unFollowUser : followUser

      try {
        this.followTag = true
        const { profile } = await request(this.author.username)
        this.author.following = profile.following
        this.followTag = false
      } catch (e) {
        alert(e.message || e.toString())
        this.followTag = false
      }
    },
    async toogleFav() {
      const request = this.favorited ? articleUnFav : articleFav

      try {
        this.favTag = true
        const { article } = await request(this.slug)
        this.favorited = article.favorited
        this.favoritesCount = article.favoritesCount
        this.favTag = false
      } catch (e) {
        alert(e.message || e.toString())
        this.favTag = false
      }
    },
    async submitComment() {
      try {
        this.commentSubmitting = true
        const { comment } = await submitComment(this.slug, {
          comment: {
            body: this.comment
          }
        })

        this.comments.unshift(comment)
        this.comment = ''
        this.commentSubmitting = false
      } catch (e) {
        alert(e.message || e.toString())
        this.commentSubmitting = false
      }
    }
  }
}
</script>
