// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
// import ecStat from "echarts-stat";
// import store from './store.js'
import vuetify from './plugins/vuetify'
import Notifications from 'vue-notification'
import dayjs from 'dayjs'
import { sync } from 'vuex-router-sync'
import { createStore } from '@/store'

const store = createStore()
sync(store, router)

// 目录同步到 store

// import VueRx from 'vue-rx';
// Vue.use(VueRx);

Vue.use(echarts)
Vue.use(Notifications)
// Vue.use(ecStat);
Vue.prototype.$echarts = echarts
Vue.prototype.dayjs = dayjs
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
