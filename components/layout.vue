<template>
  <div>
    <base-header></base-header>
    <!-- 子路由 -->
    <nuxt-child />
    <!-- /子路由 -->
    <base-footer></base-footer>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  components: {
    baseHeader: () => import('./header'),
    baseFooter: () => import('./footer')
  }
}
</script>