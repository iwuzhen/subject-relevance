<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          @change="getData"
          small-chips
          multiple
          clearable
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="dataYear"
          :items="dataYearopt"
          @change="getData"
          label="年份"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
6
<script>
import { getPagerankZipf } from "@/api/index";
import ecStat from "echarts-stat";
import { basiCategorys, extendEchartsOpts, extendLineSeries } from "@/api/data";

// tooyip 位置的x位置
var tipLegend = 0;

export default {
  name: "PageRank幂律分布",
  data() {
    return {
      subjectTarget: [],
      categorys: basiCategorys,
      dataYear: null,
      dataYearopt: [
        2007,
        2008,
        2009,
        2011,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        "历年总和"
      ],
      loading: false,
      chartOpt: {}
    };
  },
  watch: {
    // 更新图标
    chartOpt: function(opt) {
      this.myChart.setOption(opt, true);
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
    this.myChart.getZr().on("click", params => {
      var pointInPixel = [params.offsetX, params.offsetY];

      if (this.myChart.containPixel("grid", pointInPixel)) {
        // var xIndex = this.myChart2.convertFromPixel({ seriesIndex: 0 }, [
        //   params.offsetX,
        //   params.offsetY
        // ])[0];
        // console.log(xIndex);
        let series = [];
        for (let ix in this.chartOpt.legend.data) {
          series[
            tipLegend.indexOf(this.chartOpt.legend.data[ix])
          ] = this.chartOpt.series[ix];
        }
        this.chartOpt.legend.data = tipLegend;
        this.chartOpt.series = series;
        this.myChart.setOption(this.chartOpt, true);
      }
    });
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  methods: {
    subjectChange() {
      //   this.subjectRelevances = []
      this.yearChange();
    },
    yearChange() {
      if (this.dataYear === "历年总和" && this.subjectTarget.length > 1) {
        this.subjectTarget = [];
        this.$message.error("历年总和只能选择一个学科");
        return;
      }
      this.getData();
    },
    async getData() {
      if (this.subjectTarget.length < 1 || !this.dataYear) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectTarget.join(",")
      };
      if (this.dataYear !== "历年总和") {
        opt["year"] = this.dataYear;
      }

      getPagerankZipf(opt)
        .then(res => {
          if (res.data.data) {
            this.drawChart(res.data.data);
          } else {
            this.loading = false;
            this.$emit("emitMesage", "请求失败");
            return false;
          }
        })
        .catch(rej => {
          this.loading = false;
          this.$emit("emitMesage", `请求失败:${rej}`);
        });
    },
    drawChart(data) {
      this.chartOpt = this.setOptions(data);
      this.loading = false;
    },
    setOptions(data) {
      let ymax = Math.max(...[].concat(...data.y));
      ymax = Math.ceil(ymax * 10) / 10;
      let xmax = Math.max(...data.x);
      xmax = Math.ceil(xmax * 10) / 10;
      // 设置
      let seriesList = [];
      for (let i = 0; i < data.y.length; i++) {
        let dataItem = [];
        for (let j = 0; j < data.y[i].length; j++) {
          dataItem.push([data.x[j], data.y[i][j]]);
        }
        seriesList.push({
          name: data.legend[i],
          type: "scatter",
          symbolSize: 2,
          large: true,
          data: dataItem
        });
      }
      // 排序;
      seriesList.sort((x, y) => {
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1];
      });
      // 趋势线
      let myRegression = ecStat.regression("linear", seriesList[0].data);
      if (data.y.length === 1) {
        seriesList.push(
          extendLineSeries({
            name: "回归线",
            type: "line",
            showSymbol: false,
            smooth: false,
            data: myRegression.points,
            markPoint: {
              itemStyle: {
                normal: {
                  color: "transparent"
                }
              },
              label: {
                normal: {
                  show: true,
                  position: "left",
                  formatter: myRegression.expression,
                  textStyle: {
                    color: "#333",
                    fontSize: 14
                  }
                }
              },
              data: [
                {
                  coord: myRegression.points[myRegression.points.length - 1]
                }
              ]
            }
          })
        );
      }
      let _opt = extendEchartsOpts({
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
              return y.data[1] - x.data[1];
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data = params[i].data;
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：x${_data[0]},y：${_data[1]} <br>`;
            }
            tipLegend = params.map(item => item.seriesName);
            return showHtm;
          }
        },
        title: {
          text: data.title
        },
        legend: {
          data: seriesList.map(item => {
            return item.name;
          })
        },
        xAxis: {
          name: "log (rank)",
          type: "value",
          max: xmax
        },
        yAxis: {
          name: "log (citation)",
          type: "value",
          max: ymax
        },
        series: seriesList
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
