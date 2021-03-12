/**
 * nuxt.js 配置文件
 */
module.exports = {
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'components/layout'),
          children: [
            {
              // 登录
              path: 'login',
              name: 'login',
              component: resolve(__dirname, 'pages/login')
            }, {
              // 注册
              path: 'register',
              name: 'register',
              component: resolve(__dirname, 'pages/login')
            }, {
              // 首页
              path: '',
              name: 'home',
              component: resolve(__dirname, 'pages/home')
            }, {
              // 文章详情
              path: 'article/:id',
              name: 'article',
              component: resolve(__dirname, 'pages/article')
            }, {
              // 发布文章
              path: 'post',
              name: 'post',
              component: resolve(__dirname, 'pages/post')
            }, {
              // 编辑文章
              path: 'edit/:id',
              name: 'edit',
              component: resolve(__dirname, 'pages/post')
            }, {
              // 个人主页
              path: 'profile/:name',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile')
            }, {
              path: 'settings',
              name: 'setting',
              component: resolve(__dirname, 'pages/settings')
            }
          ]
        }
      ])
    }
  },
  plugins: [
    {src: '~/plugins/request.js', ssr: true},
    {src: '~/plugins/validate.js', ssr: true}
  ],
  // nuxtjs默认忽略 node_modules文件夹下文件的编译，通过这个配置可以指定哪些文件被转化
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ]
  }
}