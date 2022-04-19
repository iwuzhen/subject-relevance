/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-12-15 11:00:44
 * @LastEditors: ider
 * @LastEditTime: 2020-12-17 17:23:48
 * @Description:
 */
// Pathify
import { make } from 'vuex-pathify'

const state = {
  message_count: {},
  root_hash: '',
  page_name: '',
  toc: [],
  scrolling: false
}

const mutations = make.mutations(state)

const actions = {}

const getters = make.getters(state)

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
