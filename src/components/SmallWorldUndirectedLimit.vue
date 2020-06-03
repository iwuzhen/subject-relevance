<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:38:54
 * @LastEditors: ider
 * @LastEditTime: 2020-06-03 23:57:29
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="subjectTarget"
          :items="categoryOpt"
          small-chips
          dense
          deletable-chips
          multiple
          label="当前学科"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          @change="getData"
          small-chips
          dense
          deletable-chips
          multiple
          label="年份"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          @change="getData"
          dense
          small-chips
          multiple
          label="网络扩大方式"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="quotaSelect"
          :items="quotaOpt"
          @change="getData"
          dense
          label="小世界指标"
        ></v-select>
      </v-col>

      <v-col cols="2">
        <v-select
          v-model="nodeCountSelect"
          :items="nodeCountOpt"
          @change="getData"
          dense
          label="网络节点上限"
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
            <b>网络扩大方式</b>： <br />按照 Wikipedia
            三层类距离为顺序，不同规模下的网络的小世界属性 <br />按照 google
            距离距离为顺序，不同规模下的网络的小世界属性
            <br />随机顺序，不同规模下的网络的小世界属性<br /><b>小世界指标</b
            >： <br />小世界网络指标有两个指标，平均路径长度，集聚系数。<br /><b
              >节点上限</b
            >： <br />图表中展示的节点的最大数量<br />
          </p>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { basiCategorys, extendEchartsOpts, extendLineSeries } from "@/api/data";
import { getScaleTrend } from "@/api/index";
const Limiter = require("async-limiter");

export default {
  name: "Core_SmallWorld无向图规模趋势",
  data() {
    return {
      dialog: false,
      loading: false,
      subjectTarget: [],
      yearSelect: [2020],
      methodSelect: ["google"],
      quotaSelect: "average_distance",
      nodeCountSelect: 8000,
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
      quotaOpt: [
        {
          value: "average_distance",
          text: "平均路径长度"
        },
        {
          value: "clustering_coefficient",
          text: "集聚系数"
        }
      ],
      methodOpt: [
        {
          value: "google",
          text: "谷歌距离"
        },
        {
          value: "random",
          text: "随机排序"
        },
        {
          value: "category",
          text: "类距离"
        }
      ],

      yearOpt: [
        2007,
        2008,
        2009,
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
      categoryOpt: basiCategorys,
      chartOpt: {}
    };
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
          for (let year of this.yearSelect) {
            for (let method of this.methodSelect) {
              await this.getOneDate(diffArray[0], year, method);
            }
          }
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
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    this.asyncLimier = new Limiter({ concurrency: 1 });
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },

  methods: {
    async getOneDate(subject, year, method) {
      let opt = {
        name: subject,
        year: year,
        method: method,
        version: "undirect_graph_normal_v1",
        quota: this.quotaSelect,
        limit: 10000
      };
      try {
        return await getScaleTrend(opt);
      } catch (error) {
        this.$emit("emitMesage", `请求失败:${error}`);
      }
    },

    async getData() {
      if (
        this.subjectTarget.length === 0 ||
        this.yearSelect.length === 0 ||
        this.methodSelect.length === 0
      ) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;

      // 数据初始化

      let tmp_dict = {};
      let legend = new Set();

      for (let x of this.subjectTarget) {
        for (let y of this.yearSelect) {
          for (let z of this.methodSelect) {
            let repdata = await this.getOneDate(x, y, z);

            let _id = `${x} -${z}- ${y}`;
            legend.add(_id);
            tmp_dict[_id] = {
              n: x,
              y: y,
              data: []
            };
            console.log(x, y, z);
            for (let i in repdata.x) {
              if (repdata.x[i] <= this.nodeCountSelect) {
                tmp_dict[_id].data.push([repdata.x[i], repdata.y[i]]);
              }
            }
          }
        }
      }

      let ret_seriest = [];
      for (let _id in tmp_dict) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: "line",
            symbolSize: 5,
            large: true,
            data: tmp_dict[_id]["data"].sort((x, y) => {
              return x[0] - y[0];
            }),
            smooth: false
          })
        );
      }
      let data = {
        series: ret_seriest,
        legend: Array.from(legend),
        title: `扩大图谱后的小世界趋势`
      };
      this.drawChart(data);
    },
    drawChart(data) {
      this.chartOpt = this.setOptions(data);
      this.loading = false;
    },
    setOptions(data) {
      // 排序
      data.series.sort((x, y) => {
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1];
      });

      // 获取 y 轴的最大最小值
      var yMax = null;
      for (let series_t of data.series) {
        let gradientList = [];
        for (let row of series_t.data) {
          gradientList.push(row[1]);
        }
        let tmp = (Math.floor(Math.max(...gradientList) * 10) + 1) / 10;
        if (yMax === null) yMax = tmp;
        else if (yMax < tmp) yMax = tmp;
      }

      let _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: data.series.map(item => {
            return item.name;
          })
        },
        xAxis: {
          name: "图谱节点数",
          type: "value",
          boundaryGap: false,
          max: "dataMax"
        },
        yAxis: {
          type: "value",
          max: yMax
        },
        series: data.series
      });
      return _opt;
    }
  }
};
</script>
