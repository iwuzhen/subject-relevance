<template>
  <div class="page-discipline">
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import powerLawData from "../data/powerLaw.json";
import ecStat from "echarts-stat";

export default {
  name: "powerLaw",
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.drawChart();
  },
  computed: {
    chartData: function() {
      let _data = [];
      let tmpData = powerLawData.filter(item => {
        return item[1] > 0;
      });
      for (let i = 0; i < tmpData.length; i++) {
        // for (let i = 0; i < 2000; i++) {
        _data.push([
          Math.log(i + 1) / Math.log(10),
          Math.log(tmpData[i][1]) / Math.log(10)
          // tmpData[i][0]
        ]);
      }
      return _data;
    },
    myRegression: function() {
      return ecStat.regression("polynomial", this.chartData, 4);
    }
  },
  methods: {
    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("subjectChart"));
      let options = this.setOptions();
      myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions() {
      let _opt = {
        title: {
          text: "幂律分布",
          left: "10%"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          },
          formatter: function(datas) {
            var res = "";
            for (var i = 0, length = datas.length; i < length; i++) {
              res +=
                "article name: " +
                datas[i].data[2] +
                "<br/>" +
                datas[i].seriesName +
                "：" +
                datas[i].data[1] +
                "<br/>";
            }
            return res;
          }
        },

        xAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          max: "dataMax"
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          max: "dataMax"
        },
        series: [
          {
            name: "links in count",
            type: "scatter",
            label: {
              emphasis: {
                show: true,
                position: "left",
                textStyle: {
                  color: "blue",
                  fontSize: 16
                }
              }
            },
            data: this.chartData
          },
          {
            name: "line",
            type: "line",
            showSymbol: false,
            smooth: true,
            data: this.myRegression.points,
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
                  formatter: this.myRegression.expression,
                  textStyle: {
                    color: "#333",
                    fontSize: 14
                  }
                }
              },
              data: [
                {
                  coord: this.myRegression.points[
                    this.myRegression.points.length - 1
                  ]
                }
              ]
            }
          }
        ]
      };
      return _opt;
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
  width: 100px;
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
