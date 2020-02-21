<template>
  <div id="app">
    <componentsHeader />
    <router-view />
  </div>
</template>

<script>
import componentsHeader from "./components/Header";
export default {
  components: { componentsHeader },
  name: "App"
};
</script>

<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  &:before {
    content: "";
    background-color: #f4f4f4;
    opacity: 0.4;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>
