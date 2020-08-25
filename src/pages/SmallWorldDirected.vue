<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 19:09:27
 * @LastEditors: ider
 * @LastEditTime: 2020-08-25 17:32:57
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="currentSubjectSelect"
          :items="categoryOpt"
          @change="getData"
          label="当前学科"
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="targetSubjectSelect"
          :items="categoryOpt"
          small-chips
          multiple
          deletable-chips
          clearable
          @change="getData"
          label="目标学科"
        ></v-select>
      </v-col>

      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          label="参数"
          @change="getData"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="graphSizeSelect"
          :items="graphSizeOpt"
          label="网络大小"
          @change="getData"
        ></v-select>
      </v-col>
      <v-col
        align-self="center"
        cols="2"
      >
        <v-btn
          color="light-blue lighten-2"
          dark
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          帮助说明
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="80vh"
          id="subjectChart"
        >
          <!-- <div class="echartsBox" id="subjectChart"></div
      > -->
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          帮助说明
        </v-card-title>

        <v-card-text>
          <b>当前学科</b>： <br />wikipedia 中的学科。<br />
          <b>目标学科</b>： <br />当前学科中引用文章所属的学科。<br />
          <b>参数</b>： <br />小世界网络 平均路径长度。及其计算参数<br />
          <b>网络大小</b>：
          <br />网络大小限定在一定数量下，限定的规则是类距离排序<br />
          <b>图表说明</b> <br />
          <b>当前学科到目标学科</b>：当前学科下的所有文章，通过多层引用，到达目标学科下的所有文章，计算出来的小世界参数值。值越小，当前学科依赖目标学科越强<br />
          <b>目标学科到当前学科</b>：交换当前学科和目标学科进行计算，值越小，目标学科依赖当前学科越强<br />
          <b>学科间依赖</b>：图A 减去图B 的值，
          正值：目标学科更加依赖当前学科，负值：当前学科更加依赖目标学科<br />
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getDirectedByYear } from "@/api/index";
// import smallworlddirect from "../data/smallworlddirect.json";
import { basiCategorys, extendLineSeries } from "@/api/data";

const Limiter = require("async-limiter");
export default {
  name: "SmallWorld有向图学科间趋势",
  data() {
    return {
      dialog: false,
      loading: false,
      currentSubjectSelect: "",
      targetSubjectSelect: [],
      methodSelect: "average_distance",
      graphSizeSelect: 2500,
      graphSizeOpt: [
        {
          value: 2000,
          text: "2000"
        },
        {
          value: 2500,
          text: 2500
        },
        {
          value: 3000,
          text: "3000"
        },
        {
          value: 999999,
          text: "二层类"
        }
      ],
      methodOpt: [
        {
          value: "average_distance",
          text: "平均最短路径"
        },
        {
          value: "sum_short_dist",
          text: "最短路径和"
        },
        {
          value: "sum_connect_path",
          text: "联通路径量"
        },
        {
          value: "max_distance",
          text: "MAX(最短路径)"
        }
      ],
      categoryOpt: basiCategorys,
      chartOpt: {}
    };
  },
  watch: {
    // 更新图标
    chartOpt: function (opt) {
      this.myChart.setOption(opt, true);
    },
    targetSubjectSelect: async function (newValue, oldValue) {
      if (this.currentSubjectSelect.length === 0) return;
      this.loading = true;
      let diffArray = newValue.filter(item => !oldValue.includes(item));
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          console.log("asyc");
          await this.getOneDate(diffArray[0]);
          console.log("aover");
          cb();
        });
      }
      this.asyncLimier.onDone(() => {
        console.log("all done:");
        this.getData();
      });
    }
  },
  computed: {
    myChart: function () {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    // 队列 初始化
    this.asyncLimier = new Limiter({ concurrency: 1 });
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  methods: {
    async getOneDate(subject) {
      console.log("onedata,", subject);
      let opt = {
        source: this.currentSubjectSelect,
        target: subject,
        version: "direct_graph_normal_v1",
        toplimit: this.graphSizeSelect,
        quota: this.methodSelect
      };
      try {
        return await getDirectedByYear(opt);
      } catch (error) {
        this.$emit("emitMesage", `请求失败:${error}`);
      }
    },
    async getData() {
      if (
        this.currentSubjectSelect.length === 0 ||
        this.targetSubjectSelect.length === 0
      ) {
        return false;
      }
      this.loading = true;

      let allYear = [],
        subjectData = [];
      for (let subjectName of this.targetSubjectSelect) {
        let repdata = await this.getOneDate(subjectName);
        console.log(repdata);
        allYear.push(...repdata.a.x, ...repdata.b.x, ...repdata.c.x);
        subjectData.push([subjectName, repdata]);
      }
      allYear = Array.from(new Set(allYear));
      subjectData.sort((x, y) => {
        return y[1].a.y.slice(-1) - x[1].a.y.slice(-1);
      });

      let ret_data = {
        y: subjectData.map(item => {
          let rowdata = [];
          for (let i in item[1].a.x) {
            rowdata[allYear.indexOf(item[1].a.x[i])] = item[1].a.y[i];
          }
          return rowdata;
        }),
        b: subjectData.map(item => {
          let rowdata = [];
          for (let i in item[1].b.x) {
            rowdata[allYear.indexOf(item[1].c.x[i])] = item[1].c.y[i];
          }
          return rowdata;
        }), //正反向之差
        c: subjectData.map(item => {
          let rowdata = [];
          for (let i in item[1].c.x) {
            rowdata[allYear.indexOf(item[1].b.x[i])] = item[1].b.y[i];
          }
          return rowdata;
        }), //反向数据
        x: allYear,
        legend: subjectData.map(item => {
          return item[0];
        }),
        ymax: 0,
        ymin: 0
      };
      ret_data.ymax =
        Math.ceil(
          Math.max(...[].concat(...ret_data.y), ...[].concat(...ret_data.c)) *
          10
        ) / 10;
      ret_data.ymin =
        Math.floor(
          Math.min(...[].concat(...ret_data.y), ...[].concat(...ret_data.c)) *
          10
        ) / 10;

      console.log(ret_data);
      this.chartOpt = this.setOptions(ret_data);
      this.loading = false;
    },
    setOptions(data) {
      var gridWidth = "33%";
      var gridHeight = "35%";
      var gridRight = "87%";
      var gridTop = 50;
      let _opt = {
        title: [
          {
            textStyle: {
              fontSize: 15
            },
            text: "A 当前学科 到 目标学科",
            left: "10%"
          },
          {
            textStyle: {
              fontSize: 15
            },
            text: "B 目标学科 到 当前学科",
            left: "60%"
          },
          {
            textStyle: {
              fontSize: 15
            },
            top: "50%",
            left: "center",
            text:
              "C 学科间依赖，正值：目标学科依赖当前学科，负值：当前学科依赖目标学科"
          }
        ],
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left",
            fontSize: 12
          },
          position: function (pos, params, el, elRect, size) {
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
          formatter: function (params) {
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
        legend: [
          {
            data: data.legend,
            //   right: "5%",
            left: "38%",
            top: "10%",
            textStyle: {
              fontSize: 14
            },
            orient: "vertical",
            z: 999
          },
          {
            data: data.legend,
            //   right: "5%",
            left: gridRight,
            top: "10%",
            textStyle: {
              fontSize: 14
            },
            orient: "vertical",
            z: 999
          },
          {
            data: data.legend,
            //   right: "5%",
            left: gridRight,
            top: "60%",
            textStyle: {
              fontSize: 14
            },
            orient: "vertical",
            z: 999
          }
        ],
        grid: [
          {
            top: gridTop,
            width: gridWidth,
            height: gridHeight,
            left: "1%",
            containLabel: true
          },
          {
            top: gridTop,
            width: gridWidth,
            height: gridHeight,
            right: "15%",
            containLabel: true
          },
          {
            top: "55%",
            left: "1%",
            right: "15%",
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
            max: function (value) {
              return (
                Math.ceil(
                  Math.max(Math.abs(value.min), Math.abs(value.max)) * 10
                ) / 10
              );
            },
            gridIndex: 2,
            min: function (value) {
              return (
                -Math.ceil(
                  Math.max(Math.abs(value.min), Math.abs(value.max)) * 10
                ) / 10
              );
            }
          }
        ],
        axisPointer: {
          link: { xAxisIndex: "all" }
        },
        series: (data => {
          let ee = data.b.map((item, index) => {
            return extendLineSeries({
              name: data.legend[index],
              type: "line",
              smooth: false,
              xAxisIndex: 2,
              yAxisIndex: 2,
              data: item
            });
          });
          ee.push(
            ...data.y.map((item, index) => {
              return extendLineSeries({
                name: data.legend[index],
                type: "line",
                smooth: false,
                data: item,
                xAxisIndex: 0,
                yAxisIndex: 0
              });
            })
          );
          ee.push(
            ...data.c.map((item, index) => {
              return extendLineSeries({
                name: data.legend[index],
                type: "line",
                smooth: false,
                data: item,
                xAxisIndex: 1,
                yAxisIndex: 1
              });
            })
          );
          return ee;
        })(data)
      };
      return _opt;
    }
  }
};
</script>
