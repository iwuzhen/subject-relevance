<template>
  <div>
    <h1>Base compoments</h1>
  </div>
</template>

<script>
/**
 * 公共部分，
 */
export default {
  name: "Base",
  data() {
    return {
      pageName: "",    //页面名称
      myChartIds: [],    //图全部放在这里初始化
    };
  },
  mounted() {
    this.$store.commit("changeCurentPath", this.pageName);
    window.onresize = () => {
      this.myChartObjs.forEach(element => {
        element.resize();
      });
    };
  },
  computed: {
    //  图的对象集合
    myChartObjs: function () {
      return this.myChartIds.map(each => this.$echarts.init(document.getElementById(each)))
    }
  }
}
</script>>