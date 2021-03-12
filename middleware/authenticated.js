/**
 * 验证登录的依据
 * cookie里面存在数据会存储到 store 中的
 */
export default ({ store, redirect }) => {
  if (!store.state.userData) {
    return redirect({ name: 'login' })
  }
}