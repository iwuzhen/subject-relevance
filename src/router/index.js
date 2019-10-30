import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/index'
import Discipline from '@/components/discipline'
import Masline from '@/components/masline'
import wikiPageCount from '@/components/ArticlesTotal'
import SubDiscipline from '@/components/SubDiscipline'
import MasArticlesTotal from '@/components/MasArticlesTotal'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'index',
    component: IndexPage
  }, {
    path: '/discipline',
    name: 'discipline',
    component: Discipline
  }, {
    path: '/masline',
    name: 'masline',
    component: Masline
  }, {
    path: '/ArticlesTotal',
    name: 'ArticlesTotal',
    component: wikiPageCount
  }, {
    path: '/SubDiscipline',
    name: 'SubDiscipline',
    component: SubDiscipline
  }, {
    path: '/MasArticlesTotal',
    name: 'MasArticlesTotal',
    component: MasArticlesTotal
  }]
})
