// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import echarts from "echarts";
// import ecStat from "echarts-stat";
import elementui from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store.js";
Vue.use(echarts);
// Vue.use(ecStat);
Vue.use(elementui);
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
