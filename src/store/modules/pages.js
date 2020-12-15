/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-12-15 11:00:44
 * @LastEditors: ider
 * @LastEditTime: 2020-12-15 13:34:09
 * @Description:
 */
// Pathify
import { make } from 'vuex-pathify'

const state = {
  message_count: {},
  frontmatter: {},
  pages: {},
  toc: [],
  scrolling: false,
  md: undefined
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
