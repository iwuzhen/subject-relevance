<template>
  <div class="indexPage">
    <div class="enterButton">
      <router-link to="/discipline">wiki学科相关度</router-link>
      <router-link to="/SubDiscipline">单个学科相关度</router-link>

      <router-link to="/ArticlesTotal">wiki文章数查询</router-link>
      <router-link to="/masline">mas学科相关度</router-link>
      <router-link to="/MasArticlesTotal">mas文章数</router-link>
      <a href="http://wikidb.lambdax.cn:5555/wikidb_web/first.jsp">分类层次</a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.indexPage {
  .enterButton {
    position: absolute;
    display: flex;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    a {
      display: block;
      height: 50px;
      width: 12vw;
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
}
</style>
