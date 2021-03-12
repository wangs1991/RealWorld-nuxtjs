<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="userData.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="userData.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="userData.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="userData.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="userData.password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="loading"
                @click="updateProfile"
              >Update Settings</button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click.prevent="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
const Cookie = process.client ? require('js-cookie') : undefined
import { mapMutations } from 'vuex'
import { update } from '@/api/user'

export default {
  name: 'Settings',
  data () {
    return {
      loading: false,
      userData: {}
    }
  },
  middleware: 'authenticated',
  computed: {},
  methods: {
    ...mapMutations(['storeUserData']),
    logout () {
      // 清空本地的 token 定向到首页
      Cookie.remove('user')
      this.$router.replace({ name: 'home' })
    },
    // 更新用户信息
    async updateProfile () {
      try {
        this.loading = true
        const res = await update({
          user: this.userData
        })
        this.loading = false

        this.storeUserData(res.user)
        // 数据持久化
        Cookie.set('user', res.user)
      } catch (e) {
        this.loading = false
      }
    }
  },
  created () {
    /**
     * 深拷贝store中的用户数据
     * 这里只需要获取初始值，更新的内容不会更新到全局缓存
     */
    this.userData = _.cloneDeep(this.$store.state.userData)
  }
}
</script>