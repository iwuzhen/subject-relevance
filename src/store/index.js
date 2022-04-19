/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-12-15 10:48:31
 * @LastEditors: ider
 * @LastEditTime: 2020-12-15 11:19:02
 * @Description: vueitfy 的 store 拷贝
 */

import Vue from 'vue'
import Vuex from 'vuex'

import pathify from '@/plugins/vuex-pathify'

// Modules
import * as modules from './modules'

Vue.use(Vuex)

export function createStore() {
  const store = new Vuex.Store({
    modules,
    plugins: [pathify.plugin]
  })

  store.subscribe(mutation => {
    if (!mutation.type.startsWith('user/')) return

    store.dispatch('user/update', mutation)
  })

  return store
}

// 作用不明
export const ROOT_DISPATCH = Object.freeze({ root: true })
