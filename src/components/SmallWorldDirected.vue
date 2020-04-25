<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 19:09:27
 * @LastEditors: ider
 * @LastEditTime: 2020-04-26 01:46:47
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
      <v-col align-self="center" cols="2">
        <v-btn color="light-blue lighten-2" dark @click.stop="dialog = true">
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
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          帮助说明
        </v-card-title>

        <v-card-text>
          <b>当前学科</b>： <br />wikipedia 中的学科。<br />
          <b>目标学科</b>： <br />当前学科中引用文章所属的学科。<br />
          <b>参数</b>： <br />小世界网络 平均路径长度。及其计算参数<br />
          <b>网络大小</b>：
          <br />网络大小限定在一定数量下，限定的规则是类距离排序<br />
          <b>图表说明</b> <br />
          <b>当前学科到目标学科</b
          >：当前学科下的所有文章，通过多层引用，到达目标学科下的所有文章，计算出来的小世界参数值。值越小，当前学科依赖目标学科越强<br />
          <b>目标学科到当前学科</b
          >：交换当前学科和目标学科进行计算，值越小，目标学科依赖当前学科越强<br />
          <b>学科间依赖</b>：图A 减去图B 的值，
          正值：目标学科更加依赖当前学科，负值：当前学科更加依赖目标学科<br />
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import smallworlddirect from "../data/smallworlddirect.json";
import { basiCategorys } from "@/api/data";
export default {
  name: "SmallWorld有向图学科间趋势",
  data() {
    return {
      dialog: false,
      loading: false,
      currentSubjectSelect: "",
      targetSubjectSelect: [],
      methodSelect: "average_path",
      graphSizeSelect: "2500",
      graphSizeOpt: [
        {
          value: "2000",
          text: "2000"
        },
        {
          value: "2500",
          text: "2500"
        },
        {
          value: "3000",
          text: "3000"
        },
        {
          value: "full",
          text: "二层类"
        }
      ],
      methodOpt: [
        {
          value: "average_path",
          text: "平均最短路径"
        },
        {
          value: "sd",
          text: "最短路径和"
        },
        {
          value: "sp",
          text: "联通路径量"
        },
        {
          value: "md",
          text: "MAX(最短路径)"
        }
      ],
      categoryOpt: basiCategorys
    };
  },
  computed: {
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
    async getData() {
      if (
        this.currentSubjectSelect.length === 0 ||
        this.targetSubjectSelect.length === 0
      ) {
        return false;
      }
      this.loading = true;
      let ret_data = {
        y: [], //正向数据
        b: [], //正反向之差
        c: [], //反向数据
        x: smallworlddirect.year,
        legend: this.targetSubjectSelect.map(value => {
          for (let key in smallworlddirect.source) {
            if (key === value) return key;
          }
        }),
        ymax: 0,
        ymin: 0
      };

      let ydata = {};
      for (let sbj of this.targetSubjectSelect) {
        ydata[sbj] = [];
      }
      for (let data of smallworlddirect.data) {
        for (let sbj of this.targetSubjectSelect) {
          if (
            smallworlddirect.source[this.currentSubjectSelect] === data.s &&
            smallworlddirect.source[sbj] === data.t &&
            this.graphSizeSelect == data.m
          ) {
            ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
              data[this.methodSelect];
            if (this.methodSelect === "average_path") {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] = Number(
                (data["sd"] / data["sp"]).toFixed(4)
              );
            } else {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
                data[this.methodSelect];
            }
          }
        }
      }

      let subdata = {};
      for (let sbj of this.targetSubjectSelect) {
        subdata[sbj] = [];
      }
      for (let data of smallworlddirect.data) {
        for (let sbj of this.targetSubjectSelect) {
          if (
            smallworlddirect.source[this.currentSubjectSelect] === data.t &&
            smallworlddirect.source[sbj] === data.s &&
            this.graphSizeSelect == data.m
          ) {
            subdata[sbj][smallworlddirect.year.indexOf(data.y)] =
              data[this.methodSelect];
            if (this.methodSelect === "average_path") {
              subdata[sbj][smallworlddirect.year.indexOf(data.y)] = Number(
                (data["sd"] / data["sp"]).toFixed(4)
              );
            } else {
              subdata[sbj][smallworlddirect.year.indexOf(data.y)] =
                data[this.methodSelect];
            }
          }
        }
      }
      let barDate = {};
      for (let sbj of this.targetSubjectSelect) {
        barDate[sbj] = [];
        for (let i = 0; i < ydata[sbj].length; i++) {
          barDate[sbj].push(
            parseFloat((ydata[sbj][i] - subdata[sbj][i]).toFixed(6))
          );
        }
      }

      for (let sbj of this.targetSubjectSelect) {
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
      var gridRight = "87%";
      var gridTop = 50;
      // var gridBottom = 80;
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
        legend: [
          {
            data: data.legend,
            //   right: "5%",
            left: "38%",
            top: "15%",
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
            top: "15%",
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
            top: "65%",
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
              smooth: false,
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
                smooth: false,
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
                smooth: false,
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
    }
  }
};
</script>
