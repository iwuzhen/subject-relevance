<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:38:54
 * @LastEditors: ider
 * @LastEditTime: 2020-04-22 21:27:09
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="currentSubjectSelect"
          :items="categoryOpt"
          @change="getData"
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
          v-model="netSelect"
          :items="netOpt"
          @change="getData"
          dense
          small-chips
          multiple
          label="网络扩大方式"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
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
import smallworldundirectLimter from "../data/smallworldundirectLimter.json";
import { basiCategorys } from "@/api/data";

export default {
  name: "SmallWorld无向图规模趋势",
  data() {
    return {
      dialog: false,
      loading: false,
      currentSubjectSelect: [],
      yearSelect: [],
      netSelect: [0],
      methodSelect: "ad",
      nodeCountSelect: 4000,
      nodeCountOpt: [500, 2000, 4000, 6000, 10000],
      methodOpt: [
        {
          value: "ad",
          text: "平均路径长度"
        },
        {
          value: "cc",
          text: "集聚系数"
        }
      ],
      netOpt: [
        {
          value: 2,
          text: "三层类距离"
        },
        {
          value: 0,
          text: "谷歌距离"
        },
        {
          value: 1,
          text: "随机排序"
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
      categoryOpt: basiCategorys
    };
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
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
      if (
        this.currentSubjectSelect.length === 0 ||
        this.yearSelect.length === 0 ||
        this.netSelect.length === 0
      ) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;

      // 数据初始化

      let tmp_dict = {};
      let legend = new Set();
      for (let x of this.currentSubjectSelect) {
        for (let y of this.yearSelect) {
          for (let z of this.netSelect) {
            let iName = "";
            if (z === 1) iName = "随机";
            else if (z === 2) iName = "类排序";
            else iName = "谷歌";
            let _id = `${x} -${iName}- ${y}`;
            legend.add(_id);
            tmp_dict[_id] = {
              n: x,
              y: y,
              data: []
            };
            console.log(x, y, z);
            for (let row of smallworldundirectLimter[x][y][z]) {
              if (this.nodeCountSelect > row["nv"]) {
                tmp_dict[_id].data.push([row["nv"], row[this.methodSelect]]);
              }
            }
          }
        }
      }

      let ret_seriest = [];
      for (let _id in tmp_dict) {
        ret_seriest.push({
          name: _id,
          type: "line",
          symbolSize: 5,
          large: true,
          data: tmp_dict[_id]["data"].sort((x, y) => {
            return x[0] - y[0];
          }),
          smooth: false
        });
      }
      let data = {
        series: ret_seriest,
        legend: Array.from(legend),
        title: `扩大图谱后的小世界趋势`
      };
      console.log(data);

      this.drawChart(data);
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
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
              let _data_x = params[i].data[0];
              let _data_y = params[i].data[1].toFixed(4);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}： x=${_data_x} y=${_data_y}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          right: "4%",
          top: "35%",
          textStyle: {
            fontSize: 14
          },
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
      };
      return _opt;
    }
  }
};
</script>
