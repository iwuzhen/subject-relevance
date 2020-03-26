<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span class="title">目标学科</span>
        <el-select
          v-model="subjectTarget"
          class="selectsubjectmax"
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="selectitem">
        <span class="title">相关学科</span>
        <el-select
          v-model="subjectRelevances"
          class="selectsubjectmax"
          multiple
          collapse-tags
          placeholder="请选择"
          @change="getData"
        >
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>

      <div class="selectitem">
        <span class="title">条件</span>
        <el-select v-model="methodValue" @change="getData" placeholder="请选择">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div id="slider" class="selectitem">
        <el-row type="flex">
          <span class="title">年份范围</span>
          <el-slider
            v-model="years"
            range
            :min="1950"
            @change="getData"
            :max="2019"
          ></el-slider>
        </el-row>
      </div>
      <el-button type="primary" class="selectitem" @click="getData"
        >确定</el-button
      >
    </div>
    <div class="echartsBox" id="masChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getMasData } from "@/api/index";
export default {
  name: "mas学科相关度",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksin",
      years: [1950, 2019],
      categorys: [
        "biology",
        "chemistry",
        "computer science",
        "economics",
        "history",
        "linguistics",
        "literature",
        "logic",
        "mathematics",
        "philosophy",
        "physics",
        "political science",
        "psychology",
        "sociology"
      ],
      methodOptions: [
        {
          value: "linksin",
          label: "linksin"
        },
        {
          value: "linksout",
          label: "linksout"
        }
      ],
      loading: false
    };
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  computed: {
    categorysOptions: function() {
      let that = this;
      let _data = that.categorys.map(item => {
        return {
          value: item,
          label: item
        };
      });
      return _data;
    },
    myChart: function() {
      return this.$echarts.init(document.getElementById("masChart"));
    }
  },
  methods: {
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances.join(","),
        method: this.methodValue,
        from: this.years[0],
        to: this.years[1]
      };
      getMasData(opt)
        .then(res => {
          if (res.data.data) {
            this.drawChart(res.data.data);
          } else {
            this.loading = false;
            this.$message.error("请求失败");
            return false;
          }
        })
        .catch(rej => {
          this.loading = false;
          this.$message.error(`请求失败:${rej}`);
        });
    },
    drawChart(data) {
      let myChart = this.$echarts.init(document.getElementById("masChart"));
      let options = this.setOptions(data);
      myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let _opt = {
        title: {
          text: data.title,
          left: "10%"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          },
          axisPointer: {
            type: "cross",
            animation: true,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              return y.data - x.data;
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data = params[i].data.toFixed(6);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          right: "5%",
          top: "10%",
          orient: "vertical"
        },
        grid: {
          left: "8%",
          right: "20%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          right: "20%",
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: "value",
          max: 1
        },
        series: data.y.map((item, index) => {
          return {
            name: data.legend[index],
            type: "line",
            smooth: false,
            data: item
          };
        })
      };
      return _opt;
    },
    subjectChange() {
      this.subjectRelevances = [];
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
#slider {
  display: flex;
  width: 20rem;
  .el-row {
    display: flex;
    // margin: 0 auto;
    align-items: center;
    .el-slider {
      margin-left: 15px;
      display: block;
      position: relative;
      width: 12rem;
    }
  }
}
</style>
