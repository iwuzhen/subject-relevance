<template>
  <div class="indexPage">
    <div class="page-container page-component"></div>
    <h1>wikipedia</h1>
    <div class="enterButton">
      <router-link to="/discipline"><p>学科相关度</p></router-link>
      <router-link to="/SubDiscipline"><p>单学科相关度</p></router-link>
      <router-link to="/powerlaw"><p>Zipf 幂律</p></router-link>
      <router-link to="/ZipfByNodes"><p>Zipf 幂律斜率</p></router-link>
      <router-link to="/DegreeDistribution"><p>幂律度分布</p></router-link>
      <router-link to="/powerLawPageRank"><p>PageRank幂律</p></router-link>
      <router-link to="/viewandedits"><p>访问量&编辑量</p></router-link>
      <router-link to="/ArticlesTotal"><p>文章数查询</p></router-link>
    </div>

    <h1>MAS</h1>
    <div class="enterButton">
      <router-link to="/masline"><p>学科相关度</p></router-link>
      <router-link to="/MasArticlesTotal"><p>文章数</p></router-link>
    </div>
    <h1>wikipedia 分类层次</h1>
    <div class="enterButton">
      <a href="http://wikidb.lambdax.cn:5555/wikidb_web/first.jsp"
        ><p>分类层次</p></a
      >
    </div>
    <h1>小世界无向图</h1>
    <div class="enterButton">
      <router-link to="/SmallWorldUndirectedLimit"><p>规模趋势</p></router-link>
      <router-link to="/SmallWorldUndirected"><p>逐年趋势</p></router-link>
    </div>
    <h1>小世界有向图</h1>
    <div class="enterButton">
      <router-link to="/SmallWorldDirected"><p>学科间趋势</p></router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("changeCurentPath", null);
  }
};
</script>

<style lang="less">
.indexPage {
  text-align: left;
  padding: 0 10vw;

  // h1 {
  //   display: inline;
  // }
  .enterButton {
    display: flex;
    flex-wrap: wrap;
    margin: 1rem 0 1rem;
    a {
      display: flex;
      height: 3rem;
      width: 8rem;
      margin: 0.5rem 0.5rem;
      align-items: center;
      text-align: center;
      // align-items: center;
      // align-self: center;
      text-decoration: none;
      color: #fff;
      background: #409eff;
      border-color: #409eff;
      &:hover {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
      p {
        position: relative;
        margin: auto;
      }
    }
  }
}
</style>
