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
      let ret_data = {
        y: [], //正向数据
        b: [], //正反向之差
        c: [], //反向数据
        x: smallworlddirect.year,
        legend: this.targetSubject.map(value => {
          for (let key in smallworlddirect.source) {
            if (smallworlddirect.source[key] === value) return key;
          }
        }),
        ymax: 0,
        ymin: 0
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
        ret_data.y.push(ydata[sbj]);
        ret_data.c.push(subdata[sbj]);
        ret_data.b.push(barDate[sbj]);
      }

      ret_data.ymax = Math.max(
        ...[].concat(...ret_data.y),
        ...[].concat(...ret_data.c)
      );
      ret_data.ymin = Math.min(
        ...[].concat(...ret_data.y),
        ...[].concat(...ret_data.c)
      );
      console.log(ret_data);
      this.drawChart(ret_data);
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      var gridWidth = "35%";
      var gridHeight = "35%";
      // var gridLeft = 80;
      var gridRight = 50;
      var gridTop = 50;
      // var gridBottom = 80;
      let _opt = {
        title: [
          {
            textStyle: {
              fontSize: 15
            },
            text: "当前学科 到 目标学科",
            left: "10%"
          },
          {
            textStyle: {
              fontSize: 15
            },
            text: "目标学科 到 当前学科",
            left: "60%"
          },
          {
            textStyle: {
              fontSize: 15
            },
            top: "50%",
            left: "center",
            text:
              "学科间依赖，正值：目标学科依赖当前学科，负值：当前学科依赖目标学科"
          }
        ],
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left",
            fontSize: 18
          },
          position: function(pos, params, el, elRect, size) {
            var obj = {};
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 60;
            obj[["top", "bottom"][+(pos[1] < size.viewSize[1] / 2)]] = 20;
            return obj;
          },
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            let showHtm = `${params[0].name}<br>`;
            let zhenxiang = [];
            let nixiang = [];
            let chazhi = [];
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data;
              if (params[i].data) {
                _data = parseFloat(params[i].data.toFixed(6));
              } else {
                _data = null;
              }

              let _marker = params[i].marker;
              if (params[i].axisIndex == 0) {
                zhenxiang.push([_marker, _text, _data]);
              } else if (params[i].axisIndex == 1) {
                nixiang.push([_marker, _text, _data]);
              } else if (params[i].axisIndex == 2) {
                chazhi.push([_marker, _text, _data]);
              }
            }
            zhenxiang.sort((x, y) => {
              return y[2] - x[2];
            });
            nixiang.sort((x, y) => {
              return y[2] - x[2];
            });
            chazhi.sort((x, y) => {
              return y[2] - x[2];
            });
            showHtm += "当前学科到目标学科<br>";
            for (let row of zhenxiang) {
              showHtm += `${row[0]} ${row[1]}：${row[2]}<br>`;
            }
            showHtm += "目标学科到当前学科<br>";
            for (let row of nixiang) {
              showHtm += `${row[0]} ${row[1]}：${row[2]}<br>`;
            }
            showHtm += "差值图<br>";
            for (let row of chazhi) {
              showHtm += `${row[0]} ${row[1]}：${row[2]}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          // right: "5%",
          right: gridRight,
          top: "50%",
          orient: "vertical"
        },
        grid: [
          {
            top: gridTop,
            width: gridWidth,
            height: gridHeight,
            left: "8%",
            containLabel: true
          },
          {
            top: gridTop,
            width: gridWidth,
            height: gridHeight,
            right: gridRight,
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
            name: "年"
          },
          {
            type: "category",
            boundaryGap: false,
            gridIndex: 2,
            data: data.x,
            name: "年",
            position: "top"
          }
        ],
        yAxis: [
          {
            type: "value",
            max: data.ymax,
            gridIndex: 0,
            min: data.ymin,
            name: "指标"
          },
          {
            type: "value",
            max: data.ymax,
            gridIndex: 1,
            min: data.ymin,
            name: "指标"
          },
          {
            nameLocation: "start",
            name: "距离之差",
            type: "value",
            max: function(value) {
              return Math.max(Math.abs(value.min), Math.abs(value.max));
            },
            gridIndex: 2,
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
              xAxisIndex: 2,
              yAxisIndex: 2,
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
          ee.push(
            ...data.c.map((item, index) => {
              return {
                name: data.legend[index],
                type: "line",
                smooth: true,
                data: item,
                xAxisIndex: 1,
                yAxisIndex: 1
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
.echartsBox {
  height: 120vh;
}
</style>
