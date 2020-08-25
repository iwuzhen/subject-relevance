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
          deletable-chips
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
      <v-col cols="2">
        <v-select
          v-model="nodeCount"
          :items="nodeCountOptions"
          @change="getData"
          label="节点数"
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
        >
          <v-container
            fluid
            fill-height
            id="subjectChart"
          > </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDfb } from "@/api/index";
import { basiCategorys, extendEchartsOpts, defaultCategorySelect } from "@/api/data";
// tooyip 位置的x位置
var tipLegend = 0;
export default {
  name: "subject幂律度分布",
  data() {
    return {
      subjectTarget: defaultCategorySelect,
      categorys: basiCategorys,
      dataYear: 2019,
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
        2019
      ],
      nodeCount: 10000,
      loading: false,
      chartOpt: {}
    };
  },
  watch: {
    // 更新图标
    chartOpt: function (opt) {
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
        // var xIndex = this.myChart.convertFromPixel({ seriesIndex: 0 }, [
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
    this.getData()
  },
  computed: {
    nodeCountOptions: function () {
      let ret_list = [];
      for (let i = 1000; i <= 10000; i += 1000) {
        ret_list.push(i);
      }
      return ret_list;
    },
    myChart: function () {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  methods: {
    subjectChange() {
      //   this.subjectRelevances = []
      this.yearChange();
    },
    yearChange() {
      if (this.dataYear === 1111 && this.subjectTarget.length > 1) {
        this.subjectTarget = [];
        this.$emit("emitMesage", `历年总和只能选择一个学科`);
        return;
      }
      this.getData();
    },
    async getData() {
      if (this.subjectTarget.length < 1 || !this.dataYear) {
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

      getDfb(opt)
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
      } // 排序;
      seriesList.sort((x, y) => {
        console.log(y.data.slice(-1)[0][1], x.data.slice(-1)[0][1]);
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1];
      });

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
          formatter: function (params) {
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
          type: "value",
          max: xmax,
          name: "log (Degree)"
        },
        yAxis: {
          type: "value",
          max: ymax,
          name: "log (Count)"
        },
        series: seriesList
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
