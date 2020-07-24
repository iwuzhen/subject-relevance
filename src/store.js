/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-02-21 18:37:55
 * @LastEditors: ider
 * @LastEditTime: 2020-07-24 14:23:57
 * @Description:
 */
import Vue from "vue";
import vuex from "vuex";
Vue.use(vuex);

export default new vuex.Store({
  // 首先声明一个状态 state
  state: {
    curentPath: "",
    messageCount: 0
  }, // 更新状态
  mutations: {
    changeCurentPath(state, _curentPath) {
      state.curentPath = _curentPath;
    },

    changemessageCount(state, _messageCount) {
      state.messageCount = _messageCount;
    }
  }
});
