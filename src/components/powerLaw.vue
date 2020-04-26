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

<script>
import { getZipf } from "@/api/index";
import ecStat from "echarts-stat";
import { basiCategorys, extendEchartsOpts } from "@/api/data";

export default {
  name: "zipf幂律",
  data() {
    return {
      subjectTarget: [],
      categorys: basiCategorys,
      dataYear: null,
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
        "历年总和"
      ],
      loading: false
    };
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  methods: {
    async getData() {
      if (this.dataYear === "历年总和" && this.subjectTarget.length > 1) {
        this.subjectTarget = [];

        this.$emit("emitMesage", "历年总和只能选择一个学科");
        return;
      }
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

      getZipf(opt)
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
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let ymax = Math.max(...[].concat(...data.y));
      ymax = Math.ceil(ymax);
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
      // 排序
      // seriesList.sort((x, y) => {
      //   return y.data.slice(-1)[1] - x.data.slice(-1)[1];
      // });
      // console.log(seriesList);
      // 趋势线
      let myRegression = ecStat.regression("linear", seriesList[0].data);
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
          name: "log (rank)",
          type: "value",
          max: "dataMax"
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
