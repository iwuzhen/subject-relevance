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
  path: '/mag2019v2/MagTrade',
  name: 'MagTrade',
  component: () => import('@/pages/mag2019v2/MagTrade')
}, {
  path: '/mag2019v2/DisruptionByYear',
  name: 'DisruptionByYear',
  component: () => import('@/pages/mag2019v2/DisruptionByYear')
}, {
  path: '/mag2019v2/MagGoogleDistanceCurrentV2',
  name: 'MagGoogleDistanceCurrentV2',
  component: () => import('@/pages/mag2019v2/MagGoogleDistanceCurrentV2')
}, {
  path: '/mag2020/MagGoogleDistance_2020_V3',
  name: 'MagGoogleDistance_2020_V3',
  component: () => import('@/pages/mag2020/MagGoogleDistance_2020_V3')
}, {
  path: '/explorer/PageDistance',
  name: 'PageDistance',
  component: () => import('@/pages/explorer/PageDistance')
}, {
  path: '/mag2019v2/MagTopTrade',
  name: 'MagTopTrade',
  component: () => import('@/pages/mag2019v2/MagTopTrade')
}, {
  path: '/mag2019v1/MagTopNRefSelfRate',
  name: 'MagTopNRefSelfRate',
  component: () => import('@/pages/mag2019v1/MagTopNRefSelfRate')
}, {
  path: '/mag2019v2/MagDisruption',
  name: 'MagDisruption',
  component: () => import('@/pages/mag2019v2/MagDisruption')
}, {
  path: '/mag2019v2/MagJJByCat',
  name: 'MagJJByCat',
  component: () => import('@/pages/mag2019v2/MagJJByCat')
}, {
  path: '/explorer/DataSheet',
  name: 'DataSheet',
  component: () => import('@/pages/explorer/DataSheet')
}, {
  path: '/mag2019v2/MagSankey',
  name: 'MAGSankey',
  component: () => import('@/pages/mag2019v2/MagSankey')
}, {
  path: '/mag2019v2/MagInnerZipTj',
  name: 'MagInnerZipTj',
  component: () => import('@/pages/mag2019v2/MagInnerZipTj')
}, {
  path: '/wikipedia/WikiGoogleDistance',
  name: 'WikiGoogleDistance',
  component: () => import('@/pages/wikipedia/WikiGoogleDistance')
}, {
  path: '/mag2019v2/GoogleDistance',
  name: 'GoogleDistance',
  component: () => import('@/pages/mag2019v2/GoogleDistance')
}, {
  path: '/explorer/MagFunnel',
  name: 'MagFunnel',
  component: () => import('@/pages/explorer/MagFunnel')
}, {
  path: '/mag2019v2/MagBlLevel',
  name: 'MagBlLevel',
  component: () => import('@/pages/mag2019v2/MagBlLevel')
}, {
  path: '/SmallWorldDirectedCoreV2',
  name: 'SmallWorldDirectedCoreV2',
  component: () => import('@/pages/SmallWorldDirectedCoreV2')
}, {
  path: '/mag2019v1/MagCompositionByYear',
  name: 'MagCompositionByYear',
  component: () => import('@/pages/mag2019v1/MagCompositionByYear')
}, {
  path: '/mag2019v1/MagRefDist',
  name: 'MagRefDist',
  component: () => import('@/pages/mag2019v1/MagRefDist')
}, {
  path: '/mag2019v2/MagRefDistV2',
  name: 'MagRefDistV2',
  component: () => import('@/pages/mag2019v2/MagRefDistV2')
}, {
  path: '/mag2019v1/MagRefSelfRate',
  name: 'MagRefSelfRate',
  component: () => import('@/pages/mag2019v1/MagRefSelfRate')
}, {
  path: '/mag2019v1/MagDirectNet',
  name: 'MagDirectNet',
  component: () => import('@/pages/mag2019v1/MagDirectNet')
}, {
  path: '/mag2019v1/MagDirectNetV3',
  name: 'MagDirectNetV3',
  component: () => import('@/pages/mag2019v1/MagDirectNetV3')
}, {
  path: '/mag2019v2/MagDirectNetV4',
  name: 'MagDirectNetV4',
  component: () => import('@/pages/mag2019v2/MagDirectNetV4')
}, {
  path: '/mag2019v1/MagAAAInfo',
  name: 'MagAAAInfo',
  component: () => import('@/pages/mag2019v1/MagAAAInfo')
}, {
  path: '/mag2019v2/MagAAAInfoV2',
  name: 'MagAAAInfoV2',
  component: () => import('@/pages/mag2019v2/MagAAAInfoV2')
}, {
  path: '/wikipedia/CoreSWUndirectLimit',
  name: 'CoreSWUndirectLimit',
  component: () => import('@/pages/wikipedia/CoreSWUndirectLimit')
}, {
  path: '/wikipedia/CoreSMUndirected',
  name: 'CoreSMUndirected',
  component: () => import('@/pages/wikipedia/CoreSMUndirected')
}, {
  path: '/discipline',
  name: 'discipline',
  component: () => import('@/pages/discipline')
}, {
  path: '/mag2019v1/MagGoogleDistance',
  name: 'MagGoogleDistance',
  component: () => import('@/pages/mag2019v1/MagGoogleDistance')
}, {
  path: '/mag2019v2/MagGoogleDistanceV2',
  name: 'MagGoogleDistanceV2',
  component: () => import('@/pages/mag2019v2/MagGoogleDistanceV2')
}, {
  path: '/mag2019v2/MagGraph',
  name: 'MagGraph',
  component: () => import('@/pages/mag2019v2/MagGraph')
}, {
  path: '/wikipedia/ArticlesTotal',
  name: 'ArticlesTotal',
  component: () => import('@/pages/wikipedia/ArticlesTotal')
}, {
  path: '/SubDiscipline',
  name: 'SubDiscipline',
  component: () => import('@/pages/SubDiscipline')
}, {
  path: '/powerlaw',
  name: 'powerlaw',
  component: () => import('@/pages/powerLaw')
}, {
  path: '/wikipedia/ViewAndEdits',
  name: 'ViewAndEdits',
  component: () => import('@/pages/wikipedia/ViewAndEdits')
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
  path: '/browser/WikiTree',
  name: 'WikiTree',
  component: () => import('@/pages/browser/WikiTree')
}, {
  path: '/wikipedia/BanShuaiQi',
  name: 'BanShuaiQi',
  component: () => import('@/pages/wikipedia/BanShuaiQi')
}, {
  path: '/wikipedia/TopArticles',
  name: 'TopArticles',
  component: () => import('@/pages/wikipedia/TopArticles')
}, {
  path: '/browser/BritannicaTree',
  name: 'BritannicaTree',
  component: () => import('@/pages/browser/BritannicaTree')
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
  path: '/wikipedia/DisciplineCore',
  name: 'DisciplineCore',
  component: () => import('@/pages/wikipedia/DisciplineCore')
}, {
  path: '/wikipedia/CoreZipfByNodes',
  name: 'CoreZipfByNodes',
  component: () => import('@/pages/wikipedia/CoreZipfByNodes')
}, {
  path: '/wikipedia/CoreLinks',
  name: 'CoreLinks',
  component: () => import('@/pages/wikipedia/CoreLinks')
}, {
  path: '/wikipedia/CoreArticlesTotal',
  name: 'CoreArticlesTotal',
  component: () => import('@/pages/wikipedia/CoreArticlesTotal')
}, {
  path: '/wikipedia/CoreArticlesTotalV2',
  name: 'CoreArticlesTotalV2',
  component: () => import('@/pages/wikipedia/CoreArticlesTotalV2')
}, {
  path: '/wikipedia/CoreArticlesTotalNew_v3',
  name: 'CoreArticlesTotalNew_v3',
  component: () => import('@/pages/wikipedia/CoreArticlesTotalNew_v3')
}, {
  path: '/mag2019v1/MagZipf',
  name: 'MagZipf',
  component: () => import('@/pages/mag2019v1/MagZipf')
}, {
  path: '/mag2019v2/MagZipfV2',
  name: 'MagZipfV2',
  component: () => import('@/pages/mag2019v2/MagZipfV2')
}, {
  path: '/mag2019v1/MagInnerZipf',
  name: 'MagInnerZipf',
  component: () => import('@/pages/mag2019v1/MagInnerZipf')
}, {
  path: '/mag2019v2/MagInnerZipfV2',
  name: 'MagInnerZipfV2',
  component: () => import('@/pages/mag2019v2/MagInnerZipfV2')
}, {
  path: '/wikipedia/CoreArticlesTotalV1_plus',
  name: 'CoreArticlesTotalV1_plus',
  component: () => import('@/pages/wikipedia/CoreArticlesTotalV1_plus')
}, {
  path: '/browser/MagFosTree',
  name: 'MagFosTree',
  component: () => import('@/pages/browser/MagFosTree')
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
