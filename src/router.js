import Vue from "vue";
import Router from "vue-router";

const IndexPage = () => import("@/components/index");
const Discipline = () => import("@/components/discipline");
const DisciplineCore = () => import("@/components/disciplineCore");
const Masline = () => import("@/components/masline");
const wikiPageCount = () => import("@/components/ArticlesTotal");
const SubDiscipline = () => import("@/components/SubDiscipline");
const MasArticlesTotal = () => import("@/components/MasArticlesTotal");
const PowerLaw = () => import("@/components/powerLaw");
const ViewAndEdits = () => import("@/components/ViewAndEdits");
const SmallWorldUndirected = () => import("@/components/SmallWorldUndirected");
const SmallWorldUndirectedLimit = () =>
  import("@/components/SmallWorldUndirectedLimit");
const SmallWorldDirected = () => import("@/components/SmallWorldDirected");
const powerLawPageRank = () => import("@/components/powerLawPageRank");
const DegreeDistribution = () => import("@/components/DegreeDistribution");
const ZipfByNodes = () => import("@/components/ZipfByNodes");
const WikiTree = () => import("@/components/WikiTree");
const BritannicaTree = () => import("@/components/BritannicaTree");
const BanShuaiQi = () => import("@/components/BanShuaiQi");
const TopArticles = () => import("@/components/TopArticles");
const disciplinePeople = () => import("@/components/disciplinePeople");
const PeopleZipfByNodes = () => import("@/components/PeopleZipfByNodes");
const PeopleInnerZipfByNodes = () =>
  import("@/components/PeopleInnerZipfByNodes");
const CoreZipfByNodes = () => import("@/components/CoreZipfByNodes");
const CoreLinks = () => import("@/components/CoreLinks");
const CoreArticlesTotal = () => import("@/components/CoreArticlesTotal");
const MagZipf = () => import("@/components/MagZipf");
const CoreArticlesTotalV2 = () => import("@/components/CoreArticlesTotalV2");
const MagInnerZipf = () => import("@/components/MagInnerZipf");
const CoreArticlesTotalNew_v3 = () =>
  import("@/components/CoreArticlesTotalNew_v3");
const CoreSWUndirectLimit = () => import("@/components/CoreSWUndirectLimit");
const CoreSMUndirected = () => import("@/components/CoreSMUndirected");
const MagAAAInfo = () => import("@/components/MagAAAInfo");
const CoreArticlesTotalV1_plus = () =>
  import("@/components/CoreArticlesTotalV1_plus");
const SmallWorldDirectedCoreV2 = () =>
  import("@/components/SmallWorldDirectedCoreV2");
const MagDirectNet = () => import("@/components/MagDirectNet");
const MagRefSelfRate = () => import("@/components/MagRefSelfRate");
const MagDirectNetV3 = () => import("@/components/MagDirectNetV3");
const MAGRefDist = () => import("@/components/MAGRefDist");
const MasCompositionByYear = () => import("@/components/MasCompositionByYear");

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
