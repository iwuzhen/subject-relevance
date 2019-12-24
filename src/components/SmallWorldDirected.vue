<template>
  <div class="page-discipline">
    <div class="selectbox">
      <span>当前学科 </span>
      <el-select
        v-model="currentSubject"
        placeholder="请选择"
        class="methodSelect"
        @change="currentSubjectChange"
      >
        <el-option
          v-for="item in currentSubjectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>目标学科 </span>
      <el-select
        v-model="targetSubject"
        class="methodSelect"
        collapse-tags
        placeholder="请选择"
        multiple
        @change="subjectChange"
      >
        <el-option
          v-for="item in targetSubjectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.label === currentSubject"
        ></el-option>
      </el-select>

      <span>参数 </span>
      <el-select
        v-model="mathodOption"
        class="methodSelect"
        placeholder="请选择"
        @change="subjectChange"
      >
        <el-option
          v-for="item in mathodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.label === currentSubject"
        ></el-option>
      </el-select>

      <!-- <el-button type="primary" @click="getData">确定</el-button> -->
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import smallworlddirect from "../data/smallworlddirect.json";
export default {
  name: "SmallWorldUndirected",
  data() {
    return {
      currentSubject: "",
      targetSubject: [],
      methodValue: "linksin",
      subjectLevel: "0",
      mathodOption: "",
      mathodOptions: [
        {
          value: "sd",
          label: "最短路径和"
        },
        {
          value: "sp",
          label: "联通路径量"
        },
        {
          value: "md",
          label: "MAX(最短路径)"
        },
        {
          value: "average_path",
          label: "平均最短路径"
        }
      ],

      loading: false
    };
  },
  computed: {
    currentSubjectOptions: function() {
      let ts = new Set();
      for (let row of smallworlddirect) {
        ts.add(row["s"]);
      }
      let _data = Array.from(ts).map(item => {
        return {
          value: item,
          label: item
        };
      });
      return _data;
    },
    targetSubjectOptions: function() {
      let ts = new Set();
      for (let row of smallworlddirect) {
        ts.add(row["t"]);
      }
      let _data = Array.from(ts).map(item => {
        return {
          value: item,
          label: item
        };
      });
      return _data;
    }
  },

  methods: {
    async getData() {
      if (
        this.currentSubject.length === 0 ||
        this.targetSubject.length === 0 ||
        this.mathodOption.length === 0
      ) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let data = {
        x: [],
        legend: this.targetSubject,
        title: `小世界有向图: 当前学科到目标学科的 2007 年统计分布`
      };
      let ts = new Set();
      let legend = {};
      for (let sbj of this.targetSubject) {
        legend[sbj] = [];
      }
      for (let row of smallworlddirect) {
        ts.add(row["y"]);
      }
      data["x"] = Array.from(ts).sort((x, y) => {
        return x - y;
      });
      for (let row of smallworlddirect) {
        if (
          this.currentSubject === row["s"] &&
          this.targetSubject.indexOf(row["t"]) > -1
        ) {
          if (this.mathodOption === "average_path") {
            data["x"][this.targetSubject.indexOf(row["t"])] =
              row["sd"] / row["sp"];
          } else {
            data["x"][this.targetSubject.indexOf(row["t"])] =
              row[this.mathodOption];
          }
        }
      }

      console.log(data);

      this.drawChart(data);
    },
    drawChart(data) {
      let myChart = this.$echarts.init(document.getElementById("subjectChart"));
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
          formatter: function(params) {
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _data;
              if (params[i].data) {
                _data = parseFloat(params[i].data.toFixed(6));
              } else {
                _data = null;
              }

              showHtm += `${_data}<br>`;
            }
            return showHtm;
          }
        },
        // legend: {
        //   data: data.legend,
        //   right: "5%",
        //   top: "10%",
        //   orient: "vertical"
        // },
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
          silent: true,
          splitLine: {
            show: true
          },
          data: data.legend
        },
        yAxis: {
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        series: {
          type: "bar",
          itemStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2378f7" },
                { offset: 0.7, color: "#2378f7" },
                { offset: 1, color: "#83bff6" }
              ])
            }
          },
          data: data.x
        }
      };
      return _opt;
    },
    subjectChange() {
      this.getData();
    },
    currentSubjectChange() {
      this.targetSubject = [];
      for (let each of this.targetSubjectOptions) {
        if (each.label !== this.currentSubject)
          this.targetSubject.push(each.value);
      }
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.page-discipline {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 40px;
  box-sizing: border-box;
}
.selectbox {
  padding: 20px 0;
  width: 1200px;
  margin: 0 auto;
  > .el-select {
    margin-right: 30px;
  }
}
.subjectRelevances {
  width: 300px;
}
.methodSelect {
  width: 280px;
}
.subjectLevel {
  width: 80px;
}
.echartsBox {
  width: 100%;
  min-width: 1200px;
  flex: 1;
}
</style>
