<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          small-chips
          multiple
          clearable
          label="目标学科"
        ></v-select>
      </v-col> </v-row
    ><v-row>
      <v-col cols="10">
        <v-range-slider
          v-model="nodeRange"
          :max="nodeMax"
          :min="nodeMin"
          dense
          hide-details
          @change="calSlope"
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
        <v-card>
          <v-data-table
            :headers="girdHeaders"
            hide-default-footer
            :items="gridData"
            class="elevation-1"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="70vh"
          ><v-container fluid fill-height id="subjectChart"> </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getMagZipf } from "@/api/index";
import { magCategory, extendEchartsOpts } from "@/api/data";
import ecStat from "echarts-stat";
const Limiter = require("async-limiter");

// tooyip 位置的x位置
var tipLegend = 0;
export default {
  name: "MAG幂律度分布",
  data() {
    return {
      girdHeaders: [],
      nodeRange: [100, 40000],
      nodeMax: 100000,
      nodeMin: 1,
      subjectTarget: [],
      loading: false,
      chartOpt: {},
      chartData: {},
      gridData: []
    };
  },
  mounted() {
    // 队列 初始化
    this.asyncLimier = new Limiter({ concurrency: 1 });

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
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    },
    categorys: function() {
      let categoryArray = magCategory.map(item => {
        return {
          value: item,
          text: item
        };
      });
      categoryArray.unshift({ text: "All (混合幂律)", value: "all" });
      return categoryArray;
    }
  },
  watch: {
    // 更新图标
    chartOpt: function(opt) {
      this.myChart.setOption(opt, true);
    },
    subjectTarget: async function(newValue, oldValue) {
      this.loading = true;
      let diffArray = newValue.filter(item => !oldValue.includes(item));
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          console.log("asyc");
          await this.getOneDate(diffArray[0]);
          console.log("aover");
          cb();
        });
      }
      this.asyncLimier.onDone(() => {
        console.log("all done:");
        this.getData();
      });
    }
  },
  methods: {
    calSlope() {
      let lines = [];
      for (let row of this.chartData.y) {
        let line = [];
        for (let i in this.chartData.x) {
          line.push([this.chartData.x[i], row[i]]);
        }
        lines.push(line);
      }
      let retData = { name: "斜率" };
      let retHeader = [
        {
          text: "学科",
          align: "start",
          value: "name"
        }
      ];
      for (let i in lines) {
        let myRegression = ecStat.regression(
          "linear",
          lines[i].slice(this.nodeRange[0], this.nodeRange[1])
        );

        retData[
          this.chartData.legend[i]
        ] = myRegression.parameter.gradient.toFixed(4);
        retHeader.push({
          text: this.chartData.legend[i],
          value: this.chartData.legend[i]
        });
      }
      this.gridData = [retData];
      this.girdHeaders = retHeader;
      console.log(this.gridData);
      console.log(this.girdHeaders);
    },
    async getOneDate(subject) {
      console.log("onedata,", subject);
      let opt = {
        str: subject
      };
      try {
        await getMagZipf(opt);
      } catch (error) {
        this.$emit("emitMesage", `请求失败:${error}`);
      }
    },
    async getData() {
      // 需要拆分请求
      if (this.subjectTarget.length < 1) {
        return false;
      }
      this.loading = true;
      let reqData = null;
      for (let subjectName of this.subjectTarget) {
        let opt = {
          str: subjectName
        };
        try {
          let res = await getMagZipf(opt);
          if (res.data) {
            if (!reqData) {
              reqData = res.data;
            } else {
              reqData.legend.push(res.data.legend[0]);
              reqData.y.push(res.data.y[0]);
            }
          }
        } catch (error) {
          this.$emit("emitMesage", `请求失败:${error}`);
        }
      }

      console.log(reqData);
      this.chartData = reqData;
      this.chartOpt = this.setOptions(reqData);
      this.calSlope();
      this.loading = false;
    },

    setOptions(data) {
      // let ymax = Math.max(...[].concat(...data.y));
      // ymax = Math.ceil(ymax * 10) / 10;
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
          type: "value",
          max: xmax,
          name: "log (rank)"
        },
        yAxis: {
          type: "value",
          // max: ymax,
          name: "log (citation)"
        },
        series: seriesList
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
