<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectTarget"
          placeholder="请选择"
          multiple
          collapse-tags
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
        <span>年份</span>
        <el-select
          v-model="dataYear"
          class="dataYear"
          placeholder="请选择"
          @change="yearChange"
          :disabled="chartType === 0"
        >
          <el-option
            v-for="item in dataYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>节点数</span>
        <el-select
          v-model="nodeCount"
          class="dataYear"
          disabled
          placeholder="请选择"
          @change="yearChange"
        >
          <el-option
            v-for="item in nodeCountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>图表类型</span>
        <el-select v-model="chartType" class="chartType" placeholder="请选择">
          <el-option
            v-for="item in chartTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <el-button class="selectitem" type="primary" @click="getData"
          >确定</el-button
        >
      </div>
      <div id="slider" class="selectitem">
        <el-row type="flex">
          <span class="title">点数计算范围</span>
          <el-slider
            v-model="nodeRange"
            range
            :min="0"
            :max="nodeCount"
            @change="getData"
          ></el-slider>
        </el-row>
      </div>
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getZipfByNodes } from "@/api/index";
import ecStat from "echarts-stat";

var dataCache = {};
export default {
  name: "powerLaw",
  data() {
    return {
      chartType: 0,
      chartTypeOptions: [
        {
          value: 0,
          label: "斜率趋势"
        },
        {
          value: 1,
          label: "zipf 点图"
        }
      ],
      subjectTarget: [],
      nodeCount: 10000,
      nodeRange: [0, 10000],
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
      dataYear: 2007,
      dataYearopt: [
        2007,
        2008,
        2009,
        2010,
        2011,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020
      ],
      loading: false
    };
  },
  mounted() {
    // this.drawChart();
  },
  computed: {
    nodeCountOptions: function() {
      let ret_list = [];
      for (let i = 1000; i <= 10000; i += 1000) {
        ret_list.push({
          value: i,
          label: i
        });
      }
      return ret_list;
    },
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
    dataYearOptions: function() {
      let that = this;
      let _data = that.dataYearopt.map(item => {
        return {
          value: item,
          label: item
        };
      });
      _data.push({
        value: 1111,
        label: "历年总和"
      });
      return _data;
    }
  },
  methods: {
    getData() {
      if (this.chartType === 0) {
        this.yearChange();
      } else {
        this.calZipf();
      }
    },
    yearChange() {
      /**
       * @description: 多个学科的斜率历年趋势
       */
      if (this.subjectTarget.length < 1) {
        this.$message.error("请选择一个学科");
        return;
      }
      // this.getData();
      this.calMulitYear();
    },
    async calMulitYear() {
      let resList = [];
      this.loading = true;
      for (let subject of this.subjectTarget) {
        let opt = {
          str: subject,
          N: 10000
        };
        // 缓存
        let res = dataCache[JSON.stringify(opt)];
        if (!res) {
          let response = await getZipfByNodes(opt);
          if (response.data.data) {
            res = response.data.data;
            dataCache[JSON.stringify(opt)] = res;
          } else {
            this.loading = false;
            this.$message.error("请求失败");
            return false;
          }
        }
        resList.push(res);
      }
      let options = this.setOptions_slope(resList);
      let myChart = this.$echarts.init(document.getElementById("subjectChart"));
      myChart.setOption(options, true);
      this.loading = false;
    },
    async calZipf() {
      if (this.subjectTarget.length < 1 || !this.dataYear) {
        this.$message.error("请选择完整");
        return false;
      }
      if (this.subjectTarget.length > 1 && !this.dataYear === 1111) {
        this.$message.error("历年全部只能选择一个学科");
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectTarget.join(","),
        N: this.nodeCount
      };
      if (this.dataYear !== 1111) {
        opt["year"] = this.dataYear;
      }

      getZipfByNodes(opt)
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
      let myChart = this.$echarts.init(document.getElementById("subjectChart"));
      let options = this.setOptions_zipf(data);
      myChart.setOption(options, true);
      this.loading = false;
    },

    setOptions_slope(dataList) {
      // 原始线
      let seriesList = [];
      let lengnds = [];
      for (let data of dataList) {
        let gradientList = [];
        for (let i = 0; i < data.y.length; i++) {
          let dataItem = [];
          for (let j = 0; j < data.y[i].length; j++) {
            dataItem.push([data.x[j], data.y[i][j]]);
          }

          let myRegression = ecStat.regression(
            "linear",
            dataItem.slice(this.nodeRange[0], this.nodeRange[1])
          );

          gradientList.push(myRegression.parameter.gradient.toFixed(4));
        }
        seriesList.push({
          name: data.title,
          type: "line",
          smooth: true,
          data: gradientList
        });
        lengnds.push(data.title);
      }

      let _opt = {
        title: {
          text: "斜率趋势",
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
              // console.log(params);
              let _text = params[i].seriesName;
              let _data_y = params[i].data;
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data_y}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: lengnds,
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
          name: "年",
          data: this.dataYearopt
        },
        yAxis: {
          type: "value",
          max: "dataMax",
          name: "斜率",
          min: "dataMin"
        },
        series: seriesList
      };
      return _opt;
    },
    setOptions_zipf(data) {
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
          symbolSize: 5,
          large: true,
          data: dataItem
        });
      }

      // 趋势线
      let myRegression = ecStat.regression(
        "linear",
        seriesList[0].data.slice(this.nodeRange[0], this.nodeRange[1])
      );
      console.log(this.nodeRange);
      if (data.y.length === 1) {
        seriesList.push({
          name: "回归线",
          type: "line",
          showSymbol: false,
          smooth: true,
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
        });
      }
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
              return y.data[1] - x.data[1];
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data_x = params[i].data[0].toFixed(4);
              let _data_y = params[i].data[1].toFixed(4);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}： x=${_data_x} y=${_data_y}<br>`;
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
          type: "value",
          max: "dataMax",
          name: "度数 log"
        },
        yAxis: {
          type: "value",
          max: "dataMax",
          name: "数量 log",
          min: 0
        },
        series: seriesList
      };
      return _opt;
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
  width: 100px;
}
.dataYear {
  width: 100px;
}
.chartType {
  width: 130px;
}
#slider {
  width: 80vw;
  .el-row {
    display: contents;
  }
}
</style>
