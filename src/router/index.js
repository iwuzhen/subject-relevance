import Vue from 'vue'
import Router from 'vue-router'
import scrollBehavior from './scroll-behavior'

import { ChartMap } from '@/api/chartData'

Vue.use(Router)
const routes = [{
  path: '/',
  name: 'index',
  component: () => import('@/pages/index')
}, {
  path: '/MagTrade',
  name: 'MagTrade',
  component: () => import('@/pages/MagTrade')
}, {
  path: '/DisruptionByYear',
  name: 'DisruptionByYear',
  component: () => import('@/pages/DisruptionByYear')
}, {
  path: '/MagGoogleDistanceV2',
  name: 'MagGoogleDistanceV2',
  component: () => import('@/pages/MagGoogleDistanceV2')
}, {
  path: '/MagGoogleDistance_2020_V3',
  name: 'MagGoogleDistance_2020_V3',
  component: () => import('@/pages/MagGoogleDistance_2020_V3')
}, {
  path: '/PageDistance',
  name: 'PageDistance',
  component: () => import('@/pages/PageDistance')
}, {
  path: '/MagTopTrade',
  name: 'MagTopTrade',
  component: () => import('@/pages/MagTopTrade')
}, {
  path: '/MagTopNRefSelfRate',
  name: 'MagTopNRefSelfRate',
  component: () => import('@/pages/MagTopNRefSelfRate')
}, {
  path: '/MagDisruption',
  name: 'MagDisruption',
  component: () => import('@/pages/MagDisruption')
}, {
  path: '/MagJJByCat',
  name: 'MagJJByCat',
  component: () => import('@/pages/MagJJByCat')
}, {
  path: '/DataSheet',
  name: 'DataSheet',
  component: () => import('@/pages/DataSheet')
}, {
  path: '/MAGSankey',
  name: 'MAGSankey',
  component: () => import('@/pages/MAGSankey')
}, {
  path: '/MAGInnerZipTj',
  name: 'MAGInnerZipTj',
  component: () => import('@/pages/MAGInnerZipTj')
}, {
  path: '/WikiGoogleDistance',
  name: 'WikiGoogleDistance',
  component: () => import('@/pages/WikiGoogleDistance')
}, {
  path: '/GoogleDistance',
  name: 'GoogleDistance',
  component: () => import('@/pages/GoogleDistance')
}, {
  path: '/MagFunnel',
  name: 'MagFunnel',
  component: () => import('@/pages/MagFunnel')
}, {
  path: '/MAGBLLevel',
  name: 'MAGBLLevel',
  component: () => import('@/pages/MAGBLLevel')
}, {
  path: '/SmallWorldDirectedCoreV2',
  name: 'SmallWorldDirectedCoreV2',
  component: () => import('@/pages/SmallWorldDirectedCoreV2')
}, {
  path: '/MasCompositionByYear',
  name: 'MasCompositionByYear',
  component: () => import('@/pages/MasCompositionByYear')
}, {
  path: '/MAGRefDist',
  name: 'MAGRefDist',
  component: () => import('@/pages/MAGRefDist')
}, {
  path: '/MAGRefDistV2',
  name: 'MAGRefDistV2',
  component: () => import('@/pages/MAGRefDistV2')
}, {
  path: '/MagRefSelfRate',
  name: 'MagRefSelfRate',
  component: () => import('@/pages/MagRefSelfRate')
}, {
  path: '/MagDirectNet',
  name: 'MagDirectNet',
  component: () => import('@/pages/MagDirectNet')
}, {
  path: '/MagDirectNetV3',
  name: 'MagDirectNetV3',
  component: () => import('@/pages/MagDirectNetV3')
}, {
  path: '/MagDirectNetV4',
  name: 'MagDirectNetV4',
  component: () => import('@/pages/MagDirectNetV4')
}, {
  path: '/MagAAAInfo',
  name: 'MagAAAInfo',
  component: () => import('@/pages/MagAAAInfo')
}, {
  path: '/MagAAAInfoV2',
  name: 'MagAAAInfoV2',
  component: () => import('@/pages/MagAAAInfoV2')
}, {
  path: '/CoreSWUndirectLimit',
  name: 'CoreSWUndirectLimit',
  component: () => import('@/pages/CoreSWUndirectLimit')
}, {
  path: '/CoreSMUndirected',
  name: 'CoreSMUndirected',
  component: () => import('@/pages/CoreSMUndirected')
}, {
  path: '/discipline',
  name: 'discipline',
  component: () => import('@/pages/discipline')
}, {
  path: '/masline',
  name: 'masline',
  component: () => import('@/pages/masline')
}, {
  path: '/MasDistanceV2',
  name: 'MasDistanceV2',
  component: () => import('@/pages/maslinev2')
}, {
  path: '/MagGraph',
  name: 'MagGraph',
  component: () => import('@/pages/MagGraph')
}, {
  path: '/ArticlesTotal',
  name: 'ArticlesTotal',
  component: () => import('@/pages/ArticlesTotal')
}, {
  path: '/SubDiscipline',
  name: 'SubDiscipline',
  component: () => import('@/pages/SubDiscipline')
}, {
  path: '/powerlaw',
  name: 'powerlaw',
  component: () => import('@/pages/powerLaw')
}, {
  path: '/viewandedits',
  name: 'viewandedits',
  component: () => import('@/pages/ViewAndEdits')
}, {
  path: '/SmallWorldUndirected',
  name: 'SmallWorldUndirected',
  component: () => import('@/pages/SmallWorldUndirected')
}, {
  path: '/SmallWorldDirected',
  name: 'SmallWorldDirected',
  component: () => import('@/pages/SmallWorldDirected')
}, {
  path: '/powerLawPageRank',
  name: 'powerLawPageRank',
  component: () => import('@/pages/powerLawPageRank')
}, {
  path: '/SmallWorldUndirectedLimit',
  name: 'SmallWorldUndirectedLimit',
  component: () => import('@/pages/SmallWorldUndirectedLimit')
}, {
  path: '/DegreeDistribution',
  name: 'DegreeDistribution',
  component: () => import('@/pages/DegreeDistribution')
}, {
  path: '/ZipfByNodes',
  name: 'ZipfByNodes',
  component: () => import('@/pages/ZipfByNodes')
}, {
  path: '/WikiTree',
  name: 'WikiTree',
  component: () => import('@/pages/WikiTree')
}, {
  path: '/BanShuaiQi',
  name: 'BanShuaiQi',
  component: () => import('@/pages/BanShuaiQi')
}, {
  path: '/TopArticles',
  name: 'TopArticles',
  component: () => import('@/pages/TopArticles')
}, {
  path: '/BritannicaTree',
  name: 'BritannicaTree',
  component: () => import('@/pages/BritannicaTree')
}, {
  path: '/disciplinePeople',
  name: 'disciplinePeople',
  component: () => import('@/pages/disciplinePeople')
}, {
  path: '/PeopleZipfByNodes',
  name: 'PeopleZipfByNodes',
  component: () => import('@/pages/PeopleZipfByNodes')
}, {
  path: '/PeopleInnerZipfByNodes',
  name: 'PeopleInnerZipfByNodes',
  component: () => import('@/pages/PeopleInnerZipfByNodes')
}, {
  path: '/DisciplineCore',
  name: 'DisciplineCore',
  component: () => import('@/pages/disciplineCore')
}, {
  path: '/CoreZipfByNodes',
  name: 'CoreZipfByNodes',
  component: () => import('@/pages/CoreZipfByNodes')
}, {
  path: '/CoreLinks',
  name: 'CoreLinks',
  component: () => import('@/pages/CoreLinks')
}, {
  path: '/CoreArticlesTotal',
  name: 'CoreArticlesTotal',
  component: () => import('@/pages/CoreArticlesTotal')
}, {
  path: '/CoreArticlesTotalV2',
  name: 'CoreArticlesTotalV2',
  component: () => import('@/pages/CoreArticlesTotalV2')
}, {
  path: '/CoreArticlesTotalNew_v3',
  name: 'CoreArticlesTotalNew_v3',
  component: () => import('@/pages/CoreArticlesTotalNew_v3')
}, {
  path: '/MagZipf',
  name: 'MagZipf',
  component: () => import('@/pages/MagZipf')
}, {
  path: '/MagZipfV2',
  name: 'MagZipfV2',
  component: () => import('@/pages/MagZipfV2')
}, {
  path: '/MagInnerZipf',
  name: 'MagInnerZipf',
  component: () => import('@/pages/MagInnerZipf')
}, {
  path: '/MagInnerZipfV2',
  name: 'MagInnerZipfV2',
  component: () => import('@/pages/MagInnerZipfV2')
}, {
  path: '/CoreArticlesTotalV1_plus',
  name: 'CoreArticlesTotalV1_plus',
  component: () => import('@/pages/CoreArticlesTotalV1_plus')
}, {
  path: '/MagFosTree',
  name: 'MagFosTree',
  component: () => import('@/pages/MagFosTree')
}, {
  path: '/mag2020/ZipfAndInnerzipfByYearV3',
  name: 'ZipfAndInnerzipfByYearV3',
  component: () => import('@/pages/mag2020/ZipfAndInnerzipfByYearV3')
}

]
// 自动化映入模板
for (const [k, v] of Object.entries(ChartMap)) {
  routes.push({
    path: '/' + k,
    name: k,
    component: () => import('@/pages/' + v.componentName)
  })
}

export function createRouter(vuetify, store) {
  return new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior: (...args) => scrollBehavior(vuetify, store, ...args)
  })
}
