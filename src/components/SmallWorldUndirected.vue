<template>
  <div class="page-discipline">
    <div class="selectbox">
      <span>目标学科 </span>
      <el-select
        v-model="subjectTarget"
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
      <span>参数 </span>
      <el-select
        v-model="methodOptions"
        class="methodSelect"
        collapse-tags
        placeholder="请选择"
      >
        <el-option
          v-for="item in methods"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.label === subjectTarget"
        ></el-option>
      </el-select>

      <el-button type="primary" @click="getData">确定</el-button>
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import smallworldundirect from "../data/smallworldundirect.json";
export default {
  name: "SmallWorldUndirected",
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
      methodOptions: "",
      methods: [
        {
          value: "avg_path",
          label: "平均最小距离"
        },
        {
          value: "clustering_coefficient",
          label: "聚集系数"
        },
        {
          value: "num_vertices",
          label: "边数"
        },
        {
          value: "num_edges",
          label: "点数"
        }
      ],
      loading: false
    };
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
    }
  },
  methods: {
    async getData() {
      if (this.subjectTarget.length === 0 || this.methodOptions.length === 0) {
        this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let data = {
        y: [],
        x: [],
        legend: this.subjectTarget,
        title: `小世界无向图逐年分布`
      };
      let ts = new Set();
      let legend = {};
      for (let sbj of this.subjectTarget) {
        legend[sbj] = [];
      }
      for (let row of smallworldundirect) {
        ts.add(row["year"]);
      }
      data["x"] = Array.from(ts).sort((x, y) => {
        return x - y;
      });
      for (let row of smallworldundirect) {
        if (this.subjectTarget.indexOf(row["category_name"]) > -1) {
          legend[row["category_name"]][data["x"].indexOf(row["year"])] =
            row[this.methodOptions];
        }
      }
      for (let sbj of this.subjectTarget) {
        data["y"].push(legend[sbj]);
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
            smooth: true,
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
  width: 150px;
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
