<template>
  <div class="indexPage">
    <div class="enterButton">
      <router-link to="/discipline">wikipedia学科相关度</router-link>
      <router-link to="/masline">mas学科相关度</router-link>
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
      padding: 0 10px;
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
