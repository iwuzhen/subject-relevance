import Vue from "vue";
import Router from "vue-router";
import IndexPage from "@/components/index";
import Discipline from "@/components/discipline";
import Masline from "@/components/masline";
import wikiPageCount from "@/components/ArticlesTotal";
import SubDiscipline from "@/components/SubDiscipline";
import MasArticlesTotal from "@/components/MasArticlesTotal";
import PowerLaw from "@/components/powerLaw";
import ViewAndEdits from "@/components/ViewAndEdits";
import SmallWorldUndirected from "@/components/SmallWorldUndirected";
import SmallWorldUndirectedLimit from "@/components/SmallWorldUndirectedLimit";
import SmallWorldDirected from "@/components/SmallWorldDirected";
import powerLawPageRank from "@/components/powerLawPageRank";
import DegreeDistribution from "@/components/DegreeDistribution";
import ZipfByNodes from "@/components/ZipfByNodes";
import WikiTree from "@/components/WikiTree";
import BritannicaTree from "@/components/BritannicaTree";
import Home from "@/views/Home";
import BanShuaiQi from "@/components/BanShuaiQi";
import TopArticles from "@/components/TopArticles";
import disciplinePeople from "@/components/disciplinePeople";
import PeopleZipfByNodes from "@/components/PeopleZipfByNodes";
import PeopleInnerZipfByNodes from "@/components/PeopleInnerZipfByNodes";

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
      path: "/Home",
      name: "Home",
      component: Home
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
    }
  ]
});
