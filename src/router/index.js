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
  path: '/index2020',
  name: 'index2020',
  component: () => import('@/pages/index2020')
}, {
  path: '/mag2020/MagDirectNetBrowser',
  name: 'MagDirectNetBrowser',
  component: () => import('@/pages/mag2020/MagDirectNetBrowser')
}, {
  path: '/mag2020/MagGraph',
  name: 'Mag2020Graph',
  component: () => import('@/pages/mag2020/MagGraph')
}, {
  path: '/mag2020/MagPlantDistance',
  name: 'Mag2020MagPlantDistance',
  component: () => import('@/pages/mag2020/MagPlantDistance')
}, {
  path: '/wikipedia/WikiPlantDistance',
  name: 'WikiPlantDistance',
  component: () => import('@/pages/wikipedia/WikiPlantDistance')
}, {
  path: '/mag2020/BubbleDistance',
  name: 'BubbleDistance',
  component: () => import('@/pages/mag2020/BubbleDistance')
}, {
  path: '/mag2020/MagDirectedDistance',
  name: 'MagDirectedDistance',
  component: () => import('@/pages/mag2020/MagDirectedDistance')
}, {
  path: '/mag2020/linkscf',
  name: 'linkscf',
  component: () => import('@/pages/mag2020/Linkscf')
}, {
  path: '/mag2019v2/MagTrade',
  name: 'MagTrade',
  component: () => import('@/pages/mag2019v2/MagTrade')
}, {
  path: '/mag2020/DisruptionByYear2020',
  name: 'DisruptionByYear2020',
  component: () => import('@/pages/mag2020/DisruptionByYear')
}, {
  path: '/mag2019v2/DisruptionByYear',
  name: 'DisruptionByYear',
  component: () => import('@/pages/mag2019v2/DisruptionByYear')
}, {
  path: '/mag2019v2/MagGoogleDistanceCurrentV2',
  name: 'MagGoogleDistanceCurrentV2',
  component: () => import('@/pages/mag2019v2/MagGoogleDistanceCurrentV2')
}, {
  path: '/wikipedia/WikiPlantGraph',
  name: 'WikiPlantGraph',
  component: () => import('@/pages/wikipedia/WikiPlantGraph')
}, {
  path: '/mag2020/MagPlantGraph',
  name: 'Mag2020PlantGraph',
  component: () => import('@/pages/mag2020/MagPlantGraph')
}, {
  path: '/mag2020/MagGoogleDistance_2020_V3',
  name: 'MagGoogleDistance_2020_V3',
  component: () => import('@/pages/mag2020/MagGoogleDistance_2020_V3')
}, {
  path: '/wm/WMGoogleDistance_2020_V3',
  name: 'WMGoogleDistance_2020_V3',
  component: () => import('@/pages/wm/WMGoogleDistance_2020_V3')
}, {
  path: '/wm/GoogleDistance',
  name: 'WMGoogleDistance',
  component: () => import('@/pages/wm/GoogleDistance')
}, {
  path: '/wm/dbfwm2020',
  name: 'dbfwm2020',
  component: () => import('@/pages/wm/DbfWM2020')
}, {
  path: '/mag2020/MagDirectNet',
  name: 'Mag2020DirectNet',
  component: () => import('@/pages/mag2020/MagDirectNet')
}, {
  path: '/explorer/PageDistance',
  name: 'PageDistance',
  component: () => import('@/pages/explorer/PageDistance')
}, {
  path: '/mag2019v2/MagTopTrade',
  name: 'MagTopTrade',
  component: () => import('@/pages/mag2019v2/MagTopTrade')
}, {
  path: '/mag2020/MagTrade',
  name: 'Mag2020TopTrade',
  component: () => import('@/pages/mag2020/MagTrade')
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
  path: '/explorer/NetworkFeture',
  name: 'NetworkFeture',
  component: () => import('@/pages/explorer/NetworkFeture')
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
  path: '/wikipedia-build/WikiGoogleDistance',
  name: 'WikiGoogleDistance',
  component: () => import('@/pages/wikipediaBuild/WikiGoogleDistance')
}, {
  path: '/wikipedia/WikiTrade',
  name: 'WikiTrade',
  component: () => import('@/pages/wikipedia/WikiTrade')
}, {
  path: '/mag2020/DisruptionTrendByYear',
  name: 'DisruptionTrendByYear',
  component: () => import('@/pages/mag2020/DisruptionTrendByYear')
}, {
  path: '/wikipedia/SubjectArticleCount',
  name: 'SubjectArticleCount',
  component: () => import('@/pages/wikipedia/SubjectArticleCount')
}, {
  path: '/wikipedia/wikiGraph',
  name: 'wikiGraph',
  component: () => import('@/pages/wikipedia/wikiGraph')
}, {
  path: '/wikipedia-build/wikiGraph',
  name: 'wikiGraphBuild',
  component: () => import('@/pages/wikipediaBuild/wikiGraph')
}, {
  path: '/wikipedia-build/CoreZipfByNodes_wiki',
  name: 'CoreZipfByNodes_wiki',
  component: () => import('@/pages/wikipediaBuild/CoreZipfByNodes_wiki')
}, {
  path: '/wikipedia-build/smallworld_20211107',
  name: 'smallWorld',
  component: () => import('@/pages/wikipediaBuild/smallWorld')
}, {
  path: '/mag2019v2/GoogleDistance',
  name: 'GoogleDistance',
  component: () => import('@/pages/mag2019v2/GoogleDistance')
}, {
  path: '/mag2020/GoogleDistance',
  name: 'GoogleDistance',
  component: () => import('@/pages/mag2020/GoogleDistance')
}, {
  path: '/mag2020/entropy',
  name: 'MAGEntropy',
  component: () => import('@/pages/mag2020/entropy')
}, {
  path: '/mag2020/networkEntropy',
  name: 'MAGNetworkEntropy',
  component: () => import('@/pages/mag2020/networkEntropy')
}, {
  path: '/explorer/MagFunnel',
  name: 'MagFunnel',
  component: () => import('@/pages/explorer/MagFunnel')
}, {
  path: '/mag2019v2/MagBlLevel',
  name: 'MagBlLevel',
  component: () => import('@/pages/mag2019v2/MagBlLevel')
}, {
  path: '/wikipedia/SmallWorldDirectedCoreV2',
  name: 'SmallWorldDirectedCoreV2',
  component: () => import('@/pages/wikipedia/SmallWorldDirectedCoreV2')
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
  path: '/mag-lts/MagRefSelfRate',
  name: 'MagRefSelfRate',
  component: () => import('@/pages/mag-lts/MagRefSelfRate')
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
},
// {
//   path: '/wikipedia/RefSelfRate',
//   name: 'RefSelfRate',
//   component: () => import('@/pages/wikipedia/RefSelfRate')
// },
{
  path: '/wikipedia/CoreZipfByNodes_new',
  name: 'CoreZipfByNodes_new',
  component: () => import('@/pages/wikipedia/CoreZipfByNodes_new')
}, {
  path: '/wikipedia/CoreSWUndirectLimit',
  name: 'CoreSWUndirectLimit',
  component: () => import('@/pages/wikipedia/CoreSWUndirectLimit')
}, {
  path: '/wikipedia/CoreSMUndirected',
  name: 'CoreSMUndirected',
  component: () => import('@/pages/wikipedia/CoreSMUndirected')
}, {
  path: '/wikipedia/discipline',
  name: 'discipline',
  component: () => import('@/pages/wikipedia/discipline')
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
  path: '/wikipedia/SubDiscipline',
  name: 'SubDiscipline',
  component: () => import('@/pages/wikipedia/SubDiscipline')
}, {
  path: '/wikipedia/powerlaw',
  name: 'powerlaw',
  component: () => import('@/pages/wikipedia/powerLaw')
}, {
  path: '/wikipedia/ViewAndEdits',
  name: 'ViewAndEdits',
  component: () => import('@/pages/wikipedia/ViewAndEdits')
}, {
  path: '/wikipedia/SmallWorldUndirected',
  name: 'SmallWorldUndirected',
  component: () => import('@/pages/wikipedia/SmallWorldUndirected')
}, {
  path: '/wikipedia/SmallWorldDirected',
  name: 'SmallWorldDirected',
  component: () => import('@/pages/wikipedia/SmallWorldDirected')
}, {
  path: '/wikipedia/powerLawPageRank',
  name: 'powerLawPageRank',
  component: () => import('@/pages/wikipedia/powerLawPageRank')
}, {
  path: '/wikipedia/SmallWorldUndirectedLimit',
  name: 'SmallWorldUndirectedLimit',
  component: () => import('@/pages/wikipedia/SmallWorldUndirectedLimit')
}, {
  path: '/wikipedia-build/DegreeDistribution',
  name: 'DegreeDistribution',
  component: () => import('@/pages/wikipediaBuild/DegreeDistribution')
}, {
  path: '/wikipedia/DegreeDistribution',
  name: 'DegreeDistribution',
  component: () => import('@/pages/wikipedia/DegreeDistribution')
}, {
  path: '/wikipedia/ZipfByNodes',
  name: 'ZipfByNodes',
  component: () => import('@/pages/wikipedia/ZipfByNodes')
}, {
  path: '/browser/WikiTree',
  name: 'WikiTree',
  component: () => import('@/pages/browser/WikiTree')
}, {
  path: '/browser/Paper',
  name: 'PaperChart',
  component: () => import('@/pages/browser/Paper')
}, {
  path: '/browser/MagGraphPaper',
  name: 'MagGraphPaperChart',
  component: () => import('@/pages/browser/MagGraphPaper')
}, {
  path: '/browser/MagGraphPaper_20220409',
  name: 'MagGraphPaperChart',
  component: () => import('@/pages/browser/MagGraphPaper_20220409')
}, {
  path: '/browser/wikiGraphPaper',
  name: 'wikiGraphPaperChart',
  component: () => import('@/pages/browser/wikiGraphPaper')
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
  path: '/wikipedia/disciplinePeople',
  name: 'disciplinePeople',
  component: () => import('@/pages/wikipedia/disciplinePeople')
}, {
  path: '/wikipediaBuild/disciplinePeople',
  name: 'disciplinePeople',
  component: () => import('@/pages/wikipediaBuild/disciplinePeople')
}, {
  path: '/wikipedia/PeopleZipfByNodes',
  name: 'PeopleZipfByNodes',
  component: () => import('@/pages/wikipedia/PeopleZipfByNodes')
}, {
  path: '/wikipedia/PeopleInnerZipfByNodes',
  name: 'PeopleInnerZipfByNodes',
  component: () => import('@/pages/wikipedia/PeopleInnerZipfByNodes')
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
  path: '/mag2020/MAGSubjectEntropy',
  name: 'MAGSubjectEntropy',
  component: () => import('@/pages/mag2020/MAGSubjectEntropy')
}, {
  path: '/mag2020/ZipfAndInnerzipfByYearV3',
  name: 'ZipfAndInnerzipfByYearV3',
  component: () => import('@/pages/mag2020/ZipfAndInnerzipfByYearV3')
}, {
  path: '/mag2020/DbfMAG2020',
  name: 'DbfMAG2020',
  component: () => import('@/pages/mag2020/DbfMAG2020')
}, {
  path: '/wikipedia-build/wikipediaEntropy',
  name: 'wikipediaEntropy',
  component: () => import('@/pages/wikipediaBuild/wikipediaEntropy')
}, {
  path: '/wikipedia-build/wikipediaNetworkEntropy',
  name: 'wikipediaNetworkEntropy',
  component: () => import('@/pages/wikipediaBuild/wikipediaNetworkEntropy')
}
]

// 自动读取views文件夹下的所有vue文件
// const files = require.context('@/pages', true, /\.vue$/)
// files.keys().map((item) => {
//   const path = item.slice(1).replace('.vue', '').toLowerCase()
//   // 获取组件信息
//   // const comp = files(item).default
//   routes.push({
//     path,
//     // name: comp.name.replace(/ /g, ''),
//     name: nanoid(),
//     component: () => import('@/pages' + item.slice(1))
//   })
// })

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
    base: '/v1/',
    routes: routes,
    scrollBehavior: (...args) => scrollBehavior(vuetify, store, ...args)
  })
}
