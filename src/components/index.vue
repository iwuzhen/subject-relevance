<template>
  <div class="indexPage">
    <div class="page-container page-component"></div>
    <h1>wikipedia</h1>
    <div class="enterButton">
      <router-link to="/discipline">学科相关度</router-link>
      <router-link to="/SubDiscipline">单学科相关度</router-link>
      <router-link to="/powerlaw">Zipf 幂律</router-link>
      <router-link to="/ZipfByNodes">Zipf 幂律斜率</router-link>

      <router-link to="/DegreeDistribution">幂律度分布</router-link>
      <router-link to="/powerLawPageRank">PageRank幂律</router-link>
      <router-link to="/viewandedits">访问量&编辑量</router-link>
      <router-link to="/ArticlesTotal">文章数查询</router-link>
    </div>

    <h1>MAS</h1>
    <div class="enterButton">
      <router-link to="/masline">学科相关度</router-link>
      <router-link to="/MasArticlesTotal">文章数</router-link>
    </div>
    <h1>wikipedia 分类层次</h1>
    <div class="enterButton">
      <a href="http://wikidb.lambdax.cn:5555/wikidb_web/first.jsp">分类层次</a>
    </div>
    <h1>小世界无向图</h1>
    <div class="enterButton">
      <router-link to="/SmallWorldUndirectedLimit">规模趋势</router-link>
      <router-link to="/SmallWorldUndirected">逐年趋势</router-link>
    </div>
    <h1>小世界有向图</h1>
    <div class="enterButton">
      <router-link to="/SmallWorldDirected">学科间趋势</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.indexPage {
  text-align: left;
  padding: 0 10vw;

  h1 {
    display: inline;
  }
  .enterButton {
    // position: fixed;
    display: flex;
    margin: 10px 0 30px;

    // left: 50%;
    // top: 40%;
    // transform: translate(-50%, -50%);
  }
  a {
    display: block;
    height: 50px;
    width: 8vw;
    padding: 0 5px;
    line-height: 50px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background: #409eff;
    border-color: #409eff;
    &:hover {
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;
    }
    & + a {
      margin-left: 20px;
    }
  }
}
</style>
