<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:06:14
 * @LastEditors: ider
 * @LastEditTime: 2020-04-26 14:24:02
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
      <v-col cols="3">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          dense
          @change="calZipf"
          label="年份"
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="nodeCountSelect"
          :items="nodeCountOpt"
          dense
          @change="getData"
          label="节点数量"
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
          height="45vh"
          id="subjectChart1"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="45vh"
          id="subjectChart2"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getPeopleZipfByNodes } from "@/api/index";
import ecStat from "echarts-stat";
import { peopleCategorys, extendEchartsOpts } from "@/api/data";

export default {
  name: "zipf幂律斜率（人）（世界）",
  data() {
    return {
      loading: false,
      nodeRange: [250, 2500],
      nodeMin: 0,
      subjectSelect: [],
      nodeCountSelect: 5000,
      nodeCountOpt: [1000, 2000, 3000, 4000, 5000],
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
      categoryOpt: peopleCategorys
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
    nodeMax: function() {
      return this.nodeCountSelect;
    },
    myChart1: function() {
      return this.$echarts.init(document.getElementById("subjectChart1"));
    },
    myChart2: function() {
      return this.$echarts.init(document.getElementById("subjectChart2"));
    }
  },
  methods: {
    getData() {
      if (this.nodeCountSelect < this.nodeRange[1]) {
        this.nodeRange[1] = this.nodeCountSelect;
      }
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
          N: this.nodeCountSelect
        };
        await getPeopleZipfByNodes(opt)
          .then(res => {
            if (res.data) {
              resList.push(res.data);
              this.loading = false;
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
      }
      let options = this.setOptions_slope(resList);
      this.myChart1.setOption(options, true);
    },
    async calZipf() {
      if (this.subjectSelect.length < 1 || !this.yearSelect) {
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectSelect.join(","),
        N: this.nodeCountSelect,
        year: this.yearSelect
      };
      await getPeopleZipfByNodes(opt)
        .then(res => {
          if (res.data) {
            let options = this.setOptions_zipf(res.data);
            this.myChart2.setOption(options, true);
            this.loading = false;
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

    setOptions_slope(dataList) {
      // 原始线
      let seriesTitleArray = [];
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
        let title = data.title.replace(" zipf分布", "");
        // 为了排序，放在一起
        seriesTitleArray.push([
          title,
          {
            name: title,
            type: "line",
            smooth: false,
            data: gradientList
          }
        ]);
      }
      seriesTitleArray.sort((x, y) => {
        return y[1].data.slice(-1) - x[1].data.slice(-1);
      });
      let _opt = extendEchartsOpts({
        title: {
          text: "斜率趋势"
        },
        legend: {
          data: seriesTitleArray.map(item => {
            return item[0];
          })
        },
        xAxis: {
          type: "category",
          name: "Year",
          data: this.yearOpt
        },
        yAxis: {
          type: "value",
          name: "Slope"
        },
        series: seriesTitleArray.map(item => {
          return item[1];
        })
      });
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
      // 排序
      // seriesList.sort((x, y) => {
      //   return y.data.slice(-1) - x.data.slice(-1);
      // });
      // 趋势线
      let myRegression = ecStat.regression(
        "linear",
        seriesList[0].data.slice(this.nodeRange[0], this.nodeRange[1])
      );
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
      let xmax = Math.floor(Math.max(...data.x) * 10) + 1;
      console.log(data);
      let _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: seriesList.map(item => {
            return item.name;
          })
        },
        xAxis: {
          type: "value",
          max: xmax / 10,
          name: "log (rank)"
        },
        yAxis: {
          type: "value",
          max: ymax / 10,
          name: "log (citation)",
          min: 0
        },
        series: seriesList
      });
      return _opt;
    }
  }
};
</script>
