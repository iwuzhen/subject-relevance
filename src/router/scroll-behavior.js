/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-12-17 14:41:17
 * @LastEditors: ider
 * @LastEditTime: 2020-12-17 17:31:48
 * @Description:可能是跳转页面之后滚动的逻辑，这里还没有验证
 */
// Globals
import { IN_BROWSER } from '@/utils/globals'

export default async function(vuetify, store, to, from, savedPosition) {
  if (
    !IN_BROWSER ||
    (from && to.path === from.path) ||
    store.state.pages.scrolling
  ) return {}

  let scrollTo = 0

  if (to.hash) scrollTo = to.hash
  else if (savedPosition) scrollTo = savedPosition.y
  // TODO: https://github.com/vuejs/vue-router/pull/3199
  // scroll-behavior is not called on
  // load handled in views/Documentation.vue
  return new Promise((resolve, reject) => {
    // Options 1
    const options = { Offset: 0 }

    if (!scrollTo || to.hash) options.duration = 0

    window.requestAnimationFrame(async() => {
      vuetify.framework
        .goTo(scrollTo, options)
        .catch(reject)
        .finally(resolve)
    })
  })
}
