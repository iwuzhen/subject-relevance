import Vue from "vue";
import Router from "vue-router";

const IndexPage = () => import("@/pages/index");
const Discipline = () => import("@/pages/discipline");
const DisciplineCore = () => import("@/pages/disciplineCore");
const Masline = () => import("@/pages/masline");
const wikiPageCount = () => import("@/pages/ArticlesTotal");
const SubDiscipline = () => import("@/pages/SubDiscipline");
const MasArticlesTotal = () => import("@/pages/MasArticlesTotal");
const PowerLaw = () => import("@/pages/powerLaw");
const ViewAndEdits = () => import("@/pages/ViewAndEdits");
const SmallWorldUndirected = () => import("@/pages/SmallWorldUndirected");
const SmallWorldUndirectedLimit = () =>
  import("@/pages/SmallWorldUndirectedLimit");
const SmallWorldDirected = () => import("@/pages/SmallWorldDirected");
const powerLawPageRank = () => import("@/pages/powerLawPageRank");
const DegreeDistribution = () => import("@/pages/DegreeDistribution");
const ZipfByNodes = () => import("@/pages/ZipfByNodes");
const WikiTree = () => import("@/pages/WikiTree");
const BritannicaTree = () => import("@/pages/BritannicaTree");
const BanShuaiQi = () => import("@/pages/BanShuaiQi");
const TopArticles = () => import("@/pages/TopArticles");
const disciplinePeople = () => import("@/pages/disciplinePeople");
const PeopleZipfByNodes = () => import("@/pages/PeopleZipfByNodes");
const PeopleInnerZipfByNodes = () =>
  import("@/pages/PeopleInnerZipfByNodes");
const CoreZipfByNodes = () => import("@/pages/CoreZipfByNodes");
const CoreLinks = () => import("@/pages/CoreLinks");
const CoreArticlesTotal = () => import("@/pages/CoreArticlesTotal");
const MagZipf = () => import("@/pages/MagZipf");
const CoreArticlesTotalV2 = () => import("@/pages/CoreArticlesTotalV2");
const MagInnerZipf = () => import("@/pages/MagInnerZipf");
const CoreArticlesTotalNew_v3 = () =>
  import("@/pages/CoreArticlesTotalNew_v3");
const CoreSWUndirectLimit = () => import("@/pages/CoreSWUndirectLimit");
const CoreSMUndirected = () => import("@/pages/CoreSMUndirected");
const MagAAAInfo = () => import("@/pages/MagAAAInfo");
const CoreArticlesTotalV1_plus = () =>
  import("@/pages/CoreArticlesTotalV1_plus");
const SmallWorldDirectedCoreV2 = () =>
  import("@/pages/SmallWorldDirectedCoreV2");
const MagDirectNet = () => import("@/pages/MagDirectNet");
const MagRefSelfRate = () => import("@/pages/MagRefSelfRate");
const MagDirectNetV3 = () => import("@/pages/MagDirectNetV3");
const MAGRefDist = () => import("@/pages/MAGRefDist");
const MasCompositionByYear = () => import("@/pages/MasCompositionByYear");

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "index",
      component: IndexPage
    },
    {
      path: "/SmallWorldDirectedCoreV2",
      name: "SmallWorldDirectedCoreV2",
      component: SmallWorldDirectedCoreV2
    },
    {
      path: "/MasCompositionByYear",
      name: "MasCompositionByYear",
      component: MasCompositionByYear
    },
    {
      path: "/MAGRefDist",
      name: "MAGRefDist",
      component: MAGRefDist
    },
    {
      path: "/MagRefSelfRate",
      name: "MagRefSelfRate",
      component: MagRefSelfRate
    },
    {
      path: "/MagDirectNet",
      name: "MagDirectNet",
      component: MagDirectNet
    },
    {
      path: "/MagDirectNetV3",
      name: "MagDirectNetV3",
      component: MagDirectNetV3
    },
    {
      path: "/MagAAAInfo",
      name: "MagAAAInfo",
      component: MagAAAInfo
    },
    {
      path: "/CoreSWUndirectLimit",
      name: "CoreSWUndirectLimit",
      component: CoreSWUndirectLimit
    },
    {
      path: "/CoreSMUndirected",
      name: "CoreSMUndirected",
      component: CoreSMUndirected
    },
    {
      path: "/discipline",
      name: "discipline",
      component: Discipline
    },
    {
      path: "/masline",
      name: "masline",
      component: Masline
    },
    {
      path: "/ArticlesTotal",
      name: "ArticlesTotal",
      component: wikiPageCount
    },
    {
      path: "/SubDiscipline",
      name: "SubDiscipline",
      component: SubDiscipline
    },
    {
      path: "/MasArticlesTotal",
      name: "MasArticlesTotal",
      component: MasArticlesTotal
    },
    {
      path: "/powerlaw",
      name: "powerlaw",
      component: PowerLaw
    },
    {
      path: "/viewandedits",
      name: "viewandedits",
      component: ViewAndEdits
    },
    {
      path: "/SmallWorldUndirected",
      name: "SmallWorldUndirected",
      component: SmallWorldUndirected
    },
    {
      path: "/SmallWorldDirected",
      name: "SmallWorldDirected",
      component: SmallWorldDirected
    },
    {
      path: "/powerLawPageRank",
      name: "powerLawPageRank",
      component: powerLawPageRank
    },
    {
      path: "/SmallWorldUndirectedLimit",
      name: "SmallWorldUndirectedLimit",
      component: SmallWorldUndirectedLimit
    },
    {
      path: "/DegreeDistribution",
      name: "DegreeDistribution",
      component: DegreeDistribution
    },
    {
      path: "/ZipfByNodes",
      name: "ZipfByNodes",
      component: ZipfByNodes
    },
    {
      path: "/WikiTree",
      name: "WikiTree",
      component: WikiTree
    },
    {
      path: "/BanShuaiQi",
      name: "BanShuaiQi",
      component: BanShuaiQi
    },
    {
      path: "/TopArticles",
      name: "TopArticles",
      component: TopArticles
    },
    {
      path: "/BritannicaTree",
      name: "BritannicaTree",
      component: BritannicaTree
    },
    {
      path: "/disciplinePeople",
      name: "disciplinePeople",
      component: disciplinePeople
    },
    {
      path: "/PeopleZipfByNodes",
      name: "PeopleZipfByNodes",
      component: PeopleZipfByNodes
    },
    {
      path: "/PeopleInnerZipfByNodes",
      name: "PeopleInnerZipfByNodes",
      component: PeopleInnerZipfByNodes
    },
    {
      path: "/DisciplineCore",
      name: "DisciplineCore",
      component: DisciplineCore
    },
    {
      path: "/CoreZipfByNodes",
      name: "CoreZipfByNodes",
      component: CoreZipfByNodes
    },
    {
      path: "/CoreLinks",
      name: "CoreLinks",
      component: CoreLinks
    },
    {
      path: "/CoreArticlesTotal",
      name: "CoreArticlesTotal",
      component: CoreArticlesTotal
    },
    {
      path: "/CoreArticlesTotalV2",
      name: "CoreArticlesTotalV2",
      component: CoreArticlesTotalV2
    },
    {
      path: "/CoreArticlesTotalNew_v3",
      name: "CoreArticlesTotalNew_v3",
      component: CoreArticlesTotalNew_v3
    },
    {
      path: "/MagZipf",
      name: "MagZipf",
      component: MagZipf
    },
    {
      path: "/MagInnerZipf",
      name: "MagInnerZipf",
      component: MagInnerZipf
    },
    {
      path: "/CoreArticlesTotalV1_plus",
      name: "CoreArticlesTotalV1_plus",
      component: CoreArticlesTotalV1_plus
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; //滚动到指定位置
    } else {
      return { x: 0, y: 0 };
    }
  }
});
