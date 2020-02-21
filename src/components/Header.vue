<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-02-21 11:55:56
 * @LastEditors: ider
 * @LastEditTime: 2020-02-21 19:47:27
 * @Description: 
 -->

<template>
  <header>
    <nav id="navbar">
      <div class="container">
        <!-- <h1><router-link to="/">wikiKnogen</router-link></h1> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentPath">{{
            currentPath
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    currentPath: function() {
      return this.$store.state.curentPath;
    }
  }
};
</script>

<style lang="less">
@import url("../assets/style/common.less");
#navbar {
  background: #333;
  color: #fff;
  overflow: auto;
  .el-breadcrumb {
    float: left;
    padding: 1rem;
    span {
      font-size: 1rem;
      color: #fff;
      &:hover {
        color: #409eff;
        border-color: #b3d8ff;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
}
@media screen and (max-width: 767px) {
}
</style>
