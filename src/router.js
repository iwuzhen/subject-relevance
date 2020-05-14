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
const SmallWorldDirected = () => import("@/components/SmallWorldUndirected");
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
