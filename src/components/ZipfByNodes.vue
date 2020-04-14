<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:06:14
 * @LastEditors: ider
 * @LastEditTime: 2020-04-14 16:18:19
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="subjectSelect"
          :items="categoryOpt"
          small-chips
          dense
          multiple
          deletable-chips
          @change="getData"
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          dense
          @change="calZipf"
          label="年份"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-range-slider
          v-model="nodeRange"
          :max="nodeMax"
          :min="nodeMin"
          dense
          hide-details
          @change="yearChange"
          hint="求斜率范围"
          class="align-center"
        >
          <template v-slot:prepend>
            <p style="width: 100px">求斜率范围</p>
            <v-text-field
              :value="nodeRange[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(nodeRange, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="nodeRange[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(nodeRange, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="50vh"
          id="subjectChart1"
        >
        </v-card>
      </v-col>
      <v-col col="6">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="50vh"
          id="subjectChart2"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getZipfByNodes } from "@/api/index";
import ecStat from "echarts-stat";

import * as localforage from "localforage";

export default {
  name: "zipf幂律斜率",
  data() {
    return {
      store: localforage.createInstance({
        name: "subject",
        version: 1.0,
        storeName: "ZipfByNodes", // Should be alphanumeric, with underscores.
        description: "store tree"
      }),
      loading: false,
      nodeRange: [250, 2500],
      nodeMax: 10000,
      nodeMin: 0,
      subjectSelect: [],
      yearSelect: null,
      yearOpt: [
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
      categoryOpt: [
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
      ]
    };
  },
  mounted() {
    window.onresize = () => {
      this.myChart1.resize();
      this.myChart2.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  computed: {
    myChart1: function() {
      return this.$echarts.init(document.getElementById("subjectChart1"));
    },
    myChart2: function() {
      return this.$echarts.init(document.getElementById("subjectChart2"));
    }
  },
  methods: {
    getData() {
      this.yearChange();
      this.calZipf();
    },
    yearChange() {
      /**
       * @description: 多个学科的斜率历年趋势
       */
      if (this.subjectSelect.length < 1) {
        return;
      }
      this.calMulitYear();
    },
    async calMulitYear() {
      let resList = [];
      this.loading = true;
      for (let subject of this.subjectSelect) {
        let opt = {
          str: subject,
          N: 10000
        };
        // 缓存
        let self = this;
        let resquestKey = JSON.stringify(opt);
        await self.store
          .getItem(resquestKey)
          .then(async function(value) {
            if (!value) {
              let response = await getZipfByNodes(opt);
              if (response.data.data) {
                value = response.data.data;
                await self.store.setItem(resquestKey, response.data.data);
              } else {
                this.$message.error("请求失败");
              }
            }
            resList.push(value);
            let options = self.setOptions_slope(resList);
            self.myChart1.setOption(options, true);
            self.loading = false;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },
    async calZipf() {
      if (this.subjectSelect.length < 1 || !this.yearSelect) {
        return false;
      }
      if (this.subjectSelect.length > 1 && !this.yearSelect === 1111) {
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectSelect.join(","),
        N: 10000
      };
      if (this.yearSelect !== 1111) {
        opt["year"] = this.yearSelect;
      }

      let self = this;
      let resquestKey = JSON.stringify(opt);

      await self.store
        .getItem(resquestKey)
        .then(async function(value) {
          if (!value) {
            let response = await getZipfByNodes(opt);
            if (response.data.data) {
              value = response.data.data;
              await self.store.setItem(resquestKey, response.data.data);
            } else {
              this.$message.error("请求失败");
            }
          }
          let options = self.setOptions_zipf(value);
          self.myChart2.setOption(options, true);
          self.loading = false;
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    setOptions_slope(dataList) {
      // 原始线
      let seriesList = [];
      let lengnds = [];
      var yMax = null,
        yMin = null;
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
        let tmp = (Math.floor(Math.max(...gradientList) * 10) + 1) / 10;
        if (yMax === null) yMax = tmp;
        else if (yMax < tmp) yMax = tmp;
        tmp = (Math.ceil(Math.min(...gradientList) * 10) - 1) / 10;
        if (yMin === null) yMin = tmp;
        else if (yMin > tmp) yMin = tmp;
        let title = data.title.replace(" zipf分布", "");
        seriesList.push({
          name: title,
          type: "line",
          smooth: false,
          data: gradientList
        });
        lengnds.push(title);
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
          top: "50%",
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
          data: this.yearOpt
        },
        yAxis: {
          type: "value",
          max: yMax,
          name: "斜率",
          min: yMin
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
        });
      }
      let ymax = Math.floor(Math.max(...[].concat(...data.y)) * 10) + 1;

      console.log(data);
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
          top: "50%",
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
          max: ymax / 10,
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
