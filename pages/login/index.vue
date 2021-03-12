<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ title }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="state === 'login'" :to="{ name: 'register' }">Need an account?</nuxt-link>
            <nuxt-link v-else :to="{ name: 'login' }">Have an account?</nuxt-link>
          </p>

          <ul class="error-messages" v-show="remoteError">
            <li>{{ remoteError }}</li>
          </ul>
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <fieldset class="form-group" v-if="state === 'register'">
                <validation-provider rules="required" v-slot="{ errors }">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="username"
                    :disabled="loading"
                  />
                  <span class="error-messages">{{ errors[0] }}</span>
                </validation-provider>
              </fieldset>
              <fieldset class="form-group">
                <validation-provider rules="required|email" v-slot="{ errors }">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="email"
                    :disabled="loading"
                  />
                  <span class="error-messages">{{ errors[0] }}</span>
                </validation-provider>
              </fieldset>
              <fieldset class="form-group">
                <validation-provider rules="required|password" v-slot="{ errors }">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    :disabled="loading"
                  />
                  <span class="error-messages">{{ errors[0] }}</span>
                </validation-provider>
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                :disabled="loading"
              >{{ title }}</button>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'Login',
  asyncData() {
    return {
      loading: false,
      username: '',
      email: '',
      password: '',
      remoteError: ''
    }
  },
  computed: {
    state() {
      return this.$route.name
    },
    title() {
      if (this.state === 'login') {
        return 'Sign in'
      } else {
        return 'Sign up'
      }
    }
  },
  watch: {
    // 输入变化之后，清空错误提示
    username() {
      this.remoteError = ''
    },
    email() {
      this.remoteError = ''
    },
    password() {
      this.remoteError = ''
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        let data = this.state === 'login' ? await login({ 
          user: { email: this.email, password: this.password }
        }) : await register({
          user: { username: this.username, email: this.email, password: this.password }
        })

        if (data.user) {
          // 把返回的用户登录信息放到全局的store里面
          this.$store.commit('storeUserData', data.user)
          // 数据持久化
          Cookie.set('user', data.user)
          // 定向到首页
          this.$router.replace('/')
        }
      } catch(e) {
        this.remoteError = e.errors || e.message
      }
      this.loading = false
    }
  },
  mounted() { }
}
</script>