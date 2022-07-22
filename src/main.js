// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { createRouter } from './router'
// import router from './router'
import * as echarts from 'echarts'
// import ecStat from "echarts-stat";
// import store from './store.js'
import Notifications from 'vue-notification'
import dayjs from 'dayjs'
import { sync } from 'vuex-router-sync'
import { createStore } from '@/store'
import md5 from 'md5'
import Vuetify from 'vuetify'

const store = createStore()

Vue.use(Vuetify)
const vuetify = new Vuetify({})

const router = createRouter(vuetify, store)
sync(store, router)

// 目录同步到 store

// import VueRx from 'vue-rx';
// Vue.use(VueRx);

Vue.use(echarts)
Vue.use(Notifications)
// Vue.use(ecStat);
Vue.prototype.$echarts = echarts
Vue.prototype.dayjs = dayjs
Vue.prototype.$md5 = md5
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

