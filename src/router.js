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
    }
  ]
});
