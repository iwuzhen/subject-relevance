<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:38:54
 * @LastEditors: ider
 * @LastEditTime: 2020-04-26 14:38:44
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="5">
        <v-select
          v-model="currentSubjectSelect"
          :items="categoryOpt"
          @change="getData"
          chips
          multiple
          dense
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          @change="getData"
          label="小世界指标"
        ></v-select>
      </v-col>

      <v-col cols="3">
        <v-select
          v-model="sourceSelect"
          :items="sourceOpt"
          @change="getData"
          label="数据源"
        ></v-select>
      </v-col>
      <v-col align-self="center" cols="2">
        <v-btn
          color="light-blue lighten-2"
          dark
          small
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          参数
        </v-btn>
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
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          参数说明
        </v-card-title>

        <v-card-text>
          <p>
            <b>目标学科</b>： <br />wikipedia 中的学科。<br />
            <b>参数</b>：
            <br />小世界网络指标有两个指标，平均路径长度，集聚系数。<br />
            网络总点数，网络连接边数。<br />
            <b>数据源</b>： <br />按 wikipedia category 计算出的前
            2000,2500,3000个节点的组成的网络。<br />
            按 google 距离计算出的前 2000,2500,3000个节点的组成的网络。<br />
            Wikipedia 全部的 2 层类下的文章组成的网络。<br />
            Wikipedia 全部的 3 层类下的文章组成的网络。<br />
            Mas 学科下的论文的组成的网络。
          </p>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import smallworldundirect from "../data/smallworldundirect.json";
import { basiCategorys, extendEchartsOpts } from "@/api/data";
export default {
  name: "SmallWorld无向图逐年趋势",
  data() {
    return {
      dialog: false,
      currentSubjectSelect: [],
      methodSelect: "a",
      methodOpt: [
        {
          value: "a",
          text: "平均路径长度"
        },
        {
          value: "c",
          text: "集聚系数"
        },
        {
          value: "nv",
          text: "网络点数"
        },
        {
          value: "ne",
          text: "网络边数"
        }
      ],
      sourceSelect: "w-2500",
      sourceOpt: [
        {
          value: "w-2000",
          text: "wikipedia top 2000"
        },
        {
          value: "w-2500",
          text: "wikipedia top 2500"
        },
        {
          value: "w-3000",
          text: "wikipedia top 3000"
        },
        {
          value: "g-2000",
          text: "google top 2000"
        },
        {
          value: "g-2500",
          text: "google top 2500"
        },
        {
          value: "g-3000",
          text: "google top 3000"
        },
        {
          value: "w2",
          text: "wikipedia level 2"
        },
        {
          value: "w3",
          text: "wikipedia level 3"
        },
        {
          value: "m",
          text: "Mas (尚未完整)"
        }
      ],
      categoryOpt: basiCategorys,
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
      if (this.currentSubjectSelect.length === 0) {
        return false;
      }
      this.loading = true;
      let data = {
        y: [],
        x: [],
        legend: this.currentSubjectSelect,
        title: `小世界无向图逐年分布`
      };
      let selectSubjectIds = [];
      for (let selectSubjectName of this.currentSubjectSelect) {
        selectSubjectIds.push(smallworldundirect["n"][selectSubjectName]);
      }
      let ts = new Set();
      let legend = {};
      for (let sbj of selectSubjectIds) {
        legend[sbj] = [];
      }

      let dataItem = smallworldundirect[this.sourceSelect];
      for (let row of dataItem) {
        ts.add(row["y"]);
      }
      data["x"] = Array.from(ts).sort((x, y) => {
        return x - y;
      });

      for (let row of dataItem) {
        if (selectSubjectIds.indexOf(row["n"]) > -1) {
          legend[row["n"]][data["x"].indexOf(row["y"])] =
            row[this.methodSelect];
        }
      }
      for (let sbj of selectSubjectIds) {
        data["y"].push(legend[sbj]);
      }
      console.log(data);
      this.drawChart(data);
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let series = data.y.map((item, index) => {
        return {
          name: data.legend[index],
          type: "line",
          smooth: false,
          data: item
        };
      });
      console.log(series);
      // 排序
      series.sort((x, y) => {
        return y.data.slice(-1)[0] - x.data.slice(-1)[0];
      });

      let _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: series.map(item => {
            return item.name;
          })
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: "value"
        },
        series: series
      });
      return _opt;
    }
  }
};
</script>
