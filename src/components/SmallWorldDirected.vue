<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>当前学科:</span>
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
      </div>
      <div class="selectitem">
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
            :disabled="item.value === currentSubject"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
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
      </div>

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
      reverseOption: 0,
      reverseOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      mathodOption: "average_path",
      mathodOptions: [
        {
          value: "average_path",
          label: "平均最短路径"
        },
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
        }
      ],
      subjRank: [
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
      loading: false
    };
  },
  computed: {
    currentSubjectOptions: function() {
      let ret_data = [];
      for (let key of this.subjRank) {
        ret_data.push({
          value: smallworlddirect.source[key],
          label: key
        });
      }
      return ret_data;
    },
    targetSubjectOptions: function() {
      let ret_data = [];
      for (let key of this.subjRank) {
        ret_data.push({
          value: smallworlddirect.source[key],
          label: key
        });
      }
      return ret_data;
    },
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
  },
  methods: {
    async getData() {
      if (this.currentSubject.length === 0 || this.targetSubject.length === 0) {
        return false;
      }
      this.loading = true;
      let data = {
        y: [],
        b: [],
        x: smallworlddirect.year,
        legend: this.targetSubject.map(value => {
          for (let key in smallworlddirect.source) {
            if (smallworlddirect.source[key] === value) return key;
          }
        })
      };

      let ydata = {};
      for (let sbj of this.targetSubject) {
        ydata[sbj] = [];
      }
      for (let data of smallworlddirect.data) {
        for (let sbj of this.targetSubject) {
          if (this.currentSubject === data.s && sbj === data.t) {
            ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
              data[this.mathodOption];
            if (this.mathodOption === "average_path") {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] = Number(
                (data["sd"] / data["sp"]).toFixed(4)
              );
            } else {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
                data[this.mathodOption];
            }
          }
        }
      }

      let subdata = {};
      for (let sbj of this.targetSubject) {
        subdata[sbj] = [];
      }
      for (let data of smallworlddirect.data) {
        for (let sbj of this.targetSubject) {
          if (this.currentSubject === data.t && sbj === data.s) {
            subdata[sbj][smallworlddirect.year.indexOf(data.y)] =
              data[this.mathodOption];
            if (this.mathodOption === "average_path") {
              subdata[sbj][smallworlddirect.year.indexOf(data.y)] = Number(
                (data["sd"] / data["sp"]).toFixed(4)
              );
            } else {
              subdata[sbj][smallworlddirect.year.indexOf(data.y)] =
                data[this.mathodOption];
            }
          }
        }
      }
      let barDate = {};
      for (let sbj of this.targetSubject) {
        barDate[sbj] = [];
        for (let i = 0; i < ydata[sbj].length; i++) {
          barDate[sbj].push(
            parseFloat((ydata[sbj][i] - subdata[sbj][i]).toFixed(6))
          );
        }
      }

      for (let sbj of this.targetSubject) {
        data["y"].push(ydata[sbj]);
        data.b.push(barDate[sbj]);
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
        title: [
          {
            text: "当前学科 到 目标学科",
            left: "center"
          },
          {
            top: "50%",
            left: "center",
            text:
              "学科间依赖，正值：目标学科依赖当前学科，负值：当前学科依赖目标学科"
          }
        ],
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          },
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              return y.data - x.data;
            });
            let flag = 0;
            let showHtm = `${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data;
              if (params[i].data) {
                _data = parseFloat(params[i].data.toFixed(6));
              } else {
                _data = null;
              }

              let _marker = params[i].marker;
              if (flag == 0 && params[i].axisIndex == 1) {
                showHtm += `<br><br>学科之间依赖性<br>`;
                flag = 1;
              }
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
        grid: [
          {
            height: "38%",
            left: "8%",
            right: "20%",
            containLabel: true
          },
          {
            top: "55%",
            left: "8%",
            right: "20%",
            height: "38%",
            containLabel: true
          }
        ],
        toolbox: {
          right: "20%",
          trigger: "axis",
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            gridIndex: 0,
            data: data.x,
            name: "年"
          },
          {
            type: "category",
            boundaryGap: false,
            gridIndex: 1,
            data: data.x,
            name: "年",
            position: "top"
          }
        ],
        yAxis: [
          {
            type: "value",
            max: "dataMax",
            gridIndex: 0,
            min: "dataMin",
            name: "指标"
          },
          {
            nameLocation: "start",
            name: "距离之差",
            type: "value",
            max: function(value) {
              return Math.max(Math.abs(value.min), Math.abs(value.max));
            },
            gridIndex: 1,
            min: function(value) {
              return -Math.max(Math.abs(value.min), Math.abs(value.max));
            }
          }
        ],
        axisPointer: {
          link: { xAxisIndex: "all" }
        },
        series: (data => {
          let ee = data.b.map((item, index) => {
            return {
              name: data.legend[index],
              type: "line",
              smooth: true,
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: item
            };
          });
          ee.push(
            ...data.y.map((item, index) => {
              return {
                name: data.legend[index],
                type: "line",
                smooth: true,
                data: item,
                xAxisIndex: 0,
                yAxisIndex: 0
              };
            })
          );
          return ee;
        })(data)
      };
      return _opt;
    },
    subjectChange() {
      this.getData();
    },
    currentSubjectChange() {
      // this.targetSubject = [];
      // for (let each of this.targetSubjectOptions) {
      //   if (each.label !== this.currentSubject)
      //     this.targetSubject.push(each.value);
      // }
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
.methodSelect {
  width: 200px;
}
</style>
