<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <nuxt-link class="navbar-brand" :to="{ name: 'home' }">conduit</nuxt-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <nuxt-link class="nav-link active" :to="{ name: 'home' }">Home</nuxt-link>
        </li>
        <!-- 登录用户 个人信息 和 发布按钮 -->
        <template v-if="userData">
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{ name: 'post' }">
              <i class="ion-compose"></i>&nbsp;New Post
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{ name: 'setting' }">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{ name: 'profile', params:{ name: userData.username } }">
              <img class="user-pic" :src="userData.image" />
              {{ userData.username }}
            </nuxt-link>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{ name: 'login' }">Sign in</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" :to="{ name: 'register' }">Sign up</nuxt-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BaseHeader',
  computed: {
    ...mapState(['userData'])
  }
}
</script>