<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:06:14
 * @LastEditors: ider
 * @LastEditTime: 2020-05-18 02:29:53
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="5">
        <v-select
          v-model="subjectSelect"
          :items="categoryOpt"
          small-chips
          dense
          multiple
          deletable-chips
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          dense
          @change="calZipf"
          label="年份"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="nodeCountSelect"
          :items="nodeCountOpt"
          dense
          @change="getData"
          label="节点数量"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="typeSelect"
          :items="typeOpt"
          dense
          @change="getData"
          label="网络类型"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="levelSelect"
          :items="levelOpt"
          dense
          @change="calZipf"
          label="层数"
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
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="45vh">
          <v-container fluid fill-height id="subjectChart1"> </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="45vh">
          <v-container fluid fill-height id="subjectChart2"> </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getCoreZipfByNodes } from "@/api/index";
import ecStat from "echarts-stat";
import { coreCategorys, extendEchartsOpts, extendLineSeries } from "@/api/data";
import { localCache } from "@/api/cache";
let LC = new localCache({
  storeName: "corezipfbynodes", // Should be alphanumeric, with underscores.
  description: "store api"
});

export default {
  name: "Core_zipf幂律斜率",
  data() {
    return {
      loading: false,
      nodeRange: [250, 2500],
      nodeMin: 0,
      subjectSelect: [],
      nodeCountSelect: 10000,
      nodeCountOpt: [
        1000,
        2000,
        3000,
        4000,
        5000,
        6000,
        7000,
        8000,
        9000,
        10000
      ],
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
      levelSelect: 3,
      levelOpt: [3, 4],
      typeSelect: "zipf",
      typeOpt: [
        {
          value: "zipf",
          text: "世界幂律"
        },
        {
          value: "innerzipf",
          text: "小世界幂律"
        }
      ],
      categoryOpt: coreCategorys,
      chartOptYear: {},
      chartOptZipf: {}
    };
  },
  watch: {
    // 更新图标
    chartOptYear: function(opt) {
      this.myChart1.setOption(opt, true);
    },
    chartOptZipf: function(opt) {
      this.myChart2.setOption(opt, true);
    },
    subjectSelect: async function(newValue, oldValue) {
      this.loading = true;
      let diffArray = newValue.filter(item => !oldValue.includes(item));
      if (diffArray.length > 0) {
        await this.handleSlopeTrend(diffArray[0]);
      }
      await this.calMulitYear(newValue);
      await this.calZipf();
    }
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
    async handleSlopeTrend(subject) {
      // 计算单学科的年度趋势，并缓存
      let opt = {
        str: subject,
        N: this.nodeCountSelect,
        level: this.levelSelect,
        type: this.typeSelect
      };

      let LCKEY = `${JSON.stringify(opt)}_${this.nodeRange[0]}_${
        this.nodeRange[1]
      }`;
      let item = await LC.getItem(LCKEY);
      if (!item) {
        try {
          let res = await getCoreZipfByNodes(opt);
          if (res.data) {
            let gradientList = [];
            for (let i = 0; i < res.data.y.length; i++) {
              let dataItem = [];
              for (let j = 0; j < res.data.y[i].length; j++) {
                dataItem.push([res.data.x[j], res.data.y[i][j]]);
              }
              let myRegression = ecStat.regression(
                "linear",
                dataItem.slice(this.nodeRange[0], this.nodeRange[1])
              );
              gradientList.push(myRegression.parameter.gradient.toFixed(4));
            }

            let title = res.data.title.replace(" zipf分布", "");
            item = [
              title,
              extendLineSeries({
                name: title,
                type: "line",
                smooth: false,
                data: gradientList
              })
            ];
            await LC.setItem(LCKEY, item);
          }
        } catch (error) {
          this.$emit("emitMesage", `请求失败:${error}`);
          return;
        }
      }
      return item;
    },
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
      let seriesTitleArray = [];
      this.loading = true;
      for (let subject of this.subjectSelect) {
        let item = await this.handleSlopeTrend(subject);
        console.log(item);
        seriesTitleArray.push(item);
      }
      seriesTitleArray.sort((x, y) => {
        return y[1].data.slice(-1) - x[1].data.slice(-1);
      });

      this.chartOptYear = extendEchartsOpts({
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
          max: (function(seriesTitleArray) {
            let yList = [];
            for (let item of seriesTitleArray) {
              yList = yList.concat(item[1].data);
            }
            return (Math.floor(Math.max(...yList) * 10) + 1) / 10;
          })(seriesTitleArray),
          type: "value",
          name: "Slope"
        },
        series: seriesTitleArray.map(item => {
          return item[1];
        })
      });

      this.loading = false;
    },
    async calZipf() {
      if (this.subjectSelect.length < 1 || !this.yearSelect) {
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectSelect.join(","),
        N: this.nodeCountSelect,
        year: this.yearSelect,
        level: this.levelSelect,
        type: this.typeSelect
      };
      await getCoreZipfByNodes(opt)
        .then(res => {
          if (res.data) {
            this.chartOptZipf = this.setOptions_zipf(res.data);
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
          symbolSize: 2,
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
      // let ymax = Math.floor(Math.max(...[].concat(...data.y)) * 10) + 1;
      let xmax = Math.floor(Math.max(...data.x) * 10) + 1;

      console.log(data);
      let _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: data.legend
        },
        xAxis: {
          type: "value",
          max: xmax / 10,
          name: "log (rank)"
        },
        yAxis: {
          type: "value",
          // max: ymax / 10,
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
