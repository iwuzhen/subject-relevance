<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2019-07-21 13:24:25
 * @LastEditors: ider
 * @LastEditTime: 2020-07-22 21:32:56
 * @Description: 
-->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="7">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          @change="getData"
          label="学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="limitValue"
          :items="limitOpt"
          dense
          @change="getData"
          label="学科网络限制"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          dense
          @change="getData"
          label="条件"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="viewSelect"
          :items="viewOpt"
          dense
          @change="getData"
          label="显示内容"
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
          id="masChart"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { coreCategorys } from "@/api/data";
import { getMasYearRefDist } from "@/api/index";

export default {
  name: "MAG学科引用年份热力图",
  data() {
    return {
      showAve: true,
      subjectTarget: "",
      methodValue: "linksin",
      categorys: coreCategorys,
      methodOptions: ["linksout", "linksin"],
      loading: false,
      viewSelect: "百分比",
      viewOpt: ["百分比", "引用数"],
      chartOpt: {},
      limitValue: "不限制",
      limitOpt: ["不限制", 100000]
    };
  },
  watch: {
    // 更新图标
    chartOpt: function(opt) {
      this.myChart.setOption(opt, true);
    }
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("masChart"));
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
      let opt = {
        name: this.subjectTarget,
        refer: this.methodValue,
        toplimit: this.limitValue
      };
      if (this.limitValue == "不限制") {
        opt.toplimit = 100000000;
      }
      console.log(opt);
      let ret = await getMasYearRefDist(opt);
      let xData = [];
      let retData = [];
      if (this.viewSelect == "引用数") {
        for (let i = 1950; i <= 2019; i++) {
          xData.push(String(i));

          if (!ret[i]) {
            // 为空
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), 0]);
            }
          } else {
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), ret[i][j] || 0]);
            }
          }
        }
      } else {
        // 百分比
        for (let i = 1950; i <= 2019; i++) {
          xData.push(String(i));

          if (!ret[i]) {
            // 为空
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), 0]);
            }
          } else {
            let sum = 0;
            for (let j = 1950; j <= 2019; j++) {
              sum += ret[i][j] || 0;
            }
            for (let j = 1950; j <= 2019; j++) {
              let da = (ret[i][j] || 0) / sum;
              da = da > 0 ? da.toFixed(5) : da;
              retData.push([String(i), String(j), da]);
            }
          }
        }
      }

      this.chartOpt = this.setOpt(xData, xData, retData);
      console.log(this.chartOpt);
    },
    setOpt(xData, yData, Data) {
      let viewSelect = this.viewSelect;
      let option = {
        tooltip: {
          trigger: "item",
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
            let showHtm;
            if (viewSelect == "百分比") {
              showHtm = ` ${params.seriesName}<br>${params.marker} ${
                params.name
              } -> ${params.value[1]}:   ${Math.floor(
                params.value[2] * 10000000
              ) / 100000}%`;
            } else {
              showHtm = ` ${params.seriesName}<br>${params.marker} ${params.name} -> ${params.value[1]}:   ${params.value[2]}`;
            }
            return showHtm;
          }
        },
        xAxis: {
          type: "category",
          name: "文章年份",
          data: xData
        },
        yAxis: {
          type: "category",
          name: "引用年份",
          data: yData
        },
        visualMap: {
          min: 0,
          max:
            this.viewSelect == "百分比"
              ? 1
              : Math.max(
                  ...Data.map(each => {
                    return each[2];
                  })
                ),
          calculable: true,
          realtime: false,
          inRange: {
            color: [
              // "#313695",
              // "#4575b4",
              // "#74add1",
              // "#abd9e9",
              // "#e0f3f8",
              "#ffffff",
              // "#ffffbf",
              // "#fee090",
              // "#fdae61",
              // "#f46d43",
              "#d73027",
              "#a50026",
              "#990000"
            ]
          }
        },
        series: [
          {
            name: this.subjectTarget,
            type: "heatmap",
            data: Data,
            emphasis: {
              itemStyle: {
                borderColor: "#333",
                borderWidth: 1
              }
            },
            progressive: 1000,
            animation: false
          }
        ]
      };
      return option;
    }
  }
};
</script>
