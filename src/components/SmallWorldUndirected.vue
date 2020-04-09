<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectTarget"
          class="selectsubjectmax"
          placeholder="请选择"
          multiple
          collapse-tags
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
        <span>参数</span>
        <el-select
          v-model="methodOptions"
          class="selectsubjectmax"
          collapse-tags
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>数据源</span>
        <el-select
          v-model="sourceOption"
          class="selectsubjectmax"
          placeholder="请选择"
          @change="sourceChange"
        >
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="selectitem">
        <el-button type="primary" size="medium" @click="helpMessage"
          >参数说明</el-button
        >
      </div>
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import smallworldundirect from "../data/smallworldundirect.json";
export default {
  name: "SmallWorld无向图逐年趋势",
  data() {
    return {
      subjectTarget: [],
      subjectRelevances: [],
      methodValue: "linksin",
      subjectLevel: "0",
      categorys: [
        "Literature",
        "Psychology",
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Political science",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering disciplines",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering",
        "Cognitive science",
        "Machine learning",
        "Blockchains",
        "Deep learning",
        "Theoretical computer science",
        "Quantum computing",
        "Genetic engineering",
        "Genome editing",
        "Anthropology",
        "Neuroscience"
      ],
      methodOptions: "a",
      methods: [
        {
          value: "a",
          label: "平均路径长度"
        },
        {
          value: "c",
          label: "集聚系数"
        },
        {
          value: "nv",
          label: "网络点数"
        },
        {
          value: "ne",
          label: "网络边数"
        }
      ],
      sourceOption: "w-2500",
      sourceOptions: [
        {
          value: "w-2000",
          label: "wikipedia top 2000"
        },
        {
          value: "w-2500",
          label: "wikipedia top 2500"
        },
        {
          value: "w-3000",
          label: "wikipedia top 3000"
        },
        {
          value: "g-2000",
          label: "google top 2000"
        },
        {
          value: "g-2500",
          label: "google top 2500"
        },
        {
          value: "g-3000",
          label: "google top 3000"
        },
        {
          value: "w2",
          label: "wikipedia level 2"
        },
        {
          value: "w3",
          label: "wikipedia level 3"
        },
        {
          value: "m",
          label: "Mas (尚未完整)"
        }
      ],
      loading: false
    };
  },
  computed: {
    categorysOptions: function() {
      let _data;
      _data = this.categorys.map(item => {
        return {
          value: item,
          label: item
        };
      });

      return _data;
    },
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  methods: {
    helpMessage() {
      this.$notify({
        dangerouslyUseHTMLString: true,
        title: "参数说明",
        message:
          "<b>目标学科</b>：	<br>wikipedia 中的学科。<br>\
<b>参数</b>：		<br>小世界网络指标有两个指标，平均路径长度，集聚系数。<br>\
			网络总点数，网络连接边数。<br>\
<b>数据源</b>：		<br>按 wikipedia category 计算出的前 2000,2500,3000个节点的组成的网络。<br>\
			按 google 距离计算出的前 2000,2500,3000个节点的组成的网络。<br>\
			Wikipedia 全部的 2 层类下的文章组成的网络。<br>\
			Wikipedia 全部的 3 层类下的文章组成的网络。<br>\
			Mas 学科下的论文的组成的网络。",
        position: "top-left"
      });
    },
    async getData() {
      if (this.subjectTarget.length === 0 || this.methodOptions.length === 0) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let data = {
        y: [],
        x: [],
        legend: this.subjectTarget,
        title: `小世界无向图逐年分布`
      };
      let selectSubjectIds = [];
      for (let selectSubjectName of this.subjectTarget) {
        selectSubjectIds.push(smallworldundirect["n"][selectSubjectName]);
      }
      let ts = new Set();
      let legend = {};
      for (let sbj of selectSubjectIds) {
        legend[sbj] = [];
      }

      let dataItem = smallworldundirect[this.sourceOption];
      for (let row of dataItem) {
        ts.add(row["y"]);
      }
      data["x"] = Array.from(ts).sort((x, y) => {
        return x - y;
      });

      for (let row of dataItem) {
        if (selectSubjectIds.indexOf(row["n"]) > -1) {
          legend[row["n"]][data["x"].indexOf(row["y"])] =
            row[this.methodOptions];
        }
      }
      for (let sbj of selectSubjectIds) {
        data["y"].push(legend[sbj]);
      }

      console.log(data);

      this.drawChart(data);
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
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
              let _data;
              if (params[i].data) {
                _data = parseFloat(params[i].data.toFixed(6));
              } else {
                _data = null;
              }

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
          max: "dataMax"
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
      this.getData();
    },
    sourceChange() {
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
.subjectRelevances {
  width: 300px;
}
.methodSelect {
  width: 150px;
}
.subjectLevel {
  width: 80px;
}
</style>
