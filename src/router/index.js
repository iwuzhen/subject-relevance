import Vue from 'vue'
import Router from 'vue-router'
import Discipline from '@/components/discipline'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'discipline',
      component: Discipline
    }
  ]
})
