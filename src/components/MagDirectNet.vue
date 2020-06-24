<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:38:54
 * @LastEditors: ider
 * @LastEditTime: 2020-06-24 13:14:31
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
      <v-col cols="2">
        <v-select
          v-model="quotaSelect"
          :items="quotaOpt"
          @change="getData"
          dense
          return-object
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
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="70vh">
          <v-container fluid fill-height id="subjectChart1"> </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="70vh">
          <v-container fluid fill-height id="subjectChart2"> </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" outlined :loading="loading" height="70vh">
          <v-container fluid fill-height id="subjectChart3"> </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { magCategory, extendEchartsOpts, extendLineSeries } from "@/api/data";
import { getMagUndirectNet } from "@/api/index";
const Limiter = require("async-limiter");

export default {
  name: "MAG_小世界网络",
  data() {
    return {
      loading: false,
      subjectTarget: [],
      yearSelect: [2015],
      quotaSelect: { text: "平均路径长度", value: "shortest path length" },
      nodeCountSelect: 40000,
      nodeCountOpt: [],
      quotaOpt: [
        {
          value: "shortest path length",
          text: "平均路径长度"
        },
        {
          value: "clustering coefficient",
          text: "集聚系数"
        },
        {
          value: "Number of edge",
          text: "联通子图边数"
        },
        {
          value: "Number of vertices",
          text: "联通子图节点数"
        }
      ],
      yearOpt: [
        1970,
        1975,
        1980,
        1985,
        1990,
        1995,
        2000,
        2005,
        2010,
        2015,
        2020
      ],
      categoryOpt: magCategory,
      chartOpt1: {},
      chartOpt2: {},
      chartOpt3: {},
      datacache: {}
    };
  },
  watch: {
    // 更新图标
    chartOpt1: function(opt) {
      this.myChart1.setOption(opt, true);
    },
    chartOpt2: function(opt) {
      this.myChart2.setOption(opt, true);
    },
    chartOpt3: function(opt) {
      this.myChart3.setOption(opt, true);
    },
    subjectTarget: async function(newValue, oldValue) {
      this.loading = true;
      let diffArray = newValue.filter(item => !oldValue.includes(item));
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          console.log("asyc");
          for (let year of this.yearSelect) {
            await this.getOneDate(diffArray[0], year);
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
    myChart1: function() {
      return this.$echarts.init(document.getElementById("subjectChart1"));
    },
    myChart2: function() {
      return this.$echarts.init(document.getElementById("subjectChart2"));
    },
    myChart3: function() {
      return this.$echarts.init(document.getElementById("subjectChart3"));
    }
  },
  mounted() {
    this.nodeCountOpt = [];
    for (let i = 1000; i <= 100000; i += 1000) {
      this.nodeCountOpt.push(i);
    }
    this.asyncLimier = new Limiter({ concurrency: 1 });
    window.onresize = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },

  methods: {
    // 单次请求缓存
    async getOneDate(subject, year) {
      let opt = {
        name: subject,
        year: year,
        toplimit: this.nodeCountSelect
      };
      try {
        if (this.datacache[JSON.stringify(opt)]) {
          return this.datacache[JSON.stringify(opt)];
        }
        let ret = await getMagUndirectNet(opt);
        this.datacache[JSON.stringify(opt)] = ret;
        return ret;
      } catch (error) {
        this.$emit("emitMesage", `请求失败:${subject} ${error}`);
      }
    },

    async getData() {
      if (this.subjectTarget.length === 0 || this.yearSelect.length === 0) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;

      // 数据初始化
      let tmp_dict_year = {};
      let tmp_dict_top = {};
      let tmp_dict_node = {};

      // 年度趋势
      for (let x of this.subjectTarget) {
        let repdata = await this.getOneDate(x, this.yearSelect[0]);
        if (!repdata) {
          continue;
        }
        let _id = `${x}`;
        tmp_dict_year[_id] = {
          data: []
        };

        for (let year of this.yearOpt) {
          tmp_dict_year[_id].data.push([
            year,
            repdata.by_year[this.quotaSelect.value][String(year)]
          ]);
        }
      }
      let ret_seriest = [];
      for (let _id in tmp_dict_year) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: "line",
            symbolSize: 5,
            large: true,
            data: tmp_dict_year[_id].data.sort((x, y) => {
              return x[0] - y[0];
            }),
            smooth: false
          })
        );
      }
      let data = {
        series: ret_seriest,
        title: `排名前${this.nodeCountSelect}学科,组成的联通网络小世界的${this.quotaSelect.text}年度趋势`
      };
      this.chartOpt1 = this.setOptions(data);

      // 规模趋势
      for (let x of this.subjectTarget) {
        for (let y of this.yearSelect) {
          let repdata = await this.getOneDate(x, y);
          if (!repdata) {
            continue;
          }
          let _id = `${y}_${x}`;
          tmp_dict_top[_id] = {
            data: []
          };

          for (let nodeCount of this.nodeCountOpt) {
            tmp_dict_top[_id].data.push([
              nodeCount,
              repdata.by_limit[this.quotaSelect.value][String(nodeCount)]
            ]);
          }
        }
      }
      ret_seriest = [];
      for (let _id in tmp_dict_top) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: "line",
            symbolSize: 5,
            large: true,
            data: tmp_dict_top[_id].data.sort((x, y) => {
              return x[0] - y[0];
            }),
            smooth: false
          })
        );
      }
      data = {
        series: ret_seriest,
        title: `按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势`
      };
      this.chartOpt2 = this.setOptions(data, {
        xname: "节点规模数",
        subtext: "学科内排名前 X 的组成的小世界网络"
      });
      console.log(this.chartOpt2);

      // 实际规模趋势
      for (let x of this.subjectTarget) {
        for (let y of this.yearSelect) {
          let repdata = await this.getOneDate(x, y);
          if (!repdata) {
            continue;
          }

          let _id = `${y}_${x}`;
          tmp_dict_node[_id] = {
            data: []
          };

          for (let nodeCount in repdata.by_node[this.quotaSelect.value]) {
            tmp_dict_node[_id].data.push([
              Number(nodeCount),
              repdata.by_node[this.quotaSelect.value][nodeCount]
            ]);
          }
        }
      }
      ret_seriest = [];
      for (let _id in tmp_dict_node) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: "line",
            symbolSize: 5,
            large: true,
            data: tmp_dict_node[_id].data.sort((x, y) => {
              return x[0] - y[0];
            }),
            smooth: false
          })
        );
      }
      data = {
        series: ret_seriest,
        title: `头部实际联通的小世界网络 ${this.quotaSelect.text} 规模趋势`
      };
      this.chartOpt3 = this.setOptions(data, {
        xname: "节点规模数",
        xtype: "value",
        subtext: "学科内头部排名组成的联通节点数为 X 的小世界网络"
      });

      console.log(this.chartOpt3);
      this.loading = false;
    },

    setOptions(data, obj = { xname: "Year", xtype: "category", subtext: "" }) {
      // 排序
      data.series.sort((x, y) => {
        if (!x.data.slice(-1)[0][1]) {
          return 1;
        }
        if (!y.data.slice(-1)[0][1]) {
          return -1;
        }
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1];
      });

      // // 获取 y 轴的最大最小值
      // var yMax = null;
      // for (let series_t of data.series) {
      //   let gradientList = [];
      //   for (let row of series_t.data) {
      //     gradientList.push(row[1]);
      //   }
      //   let tmp = (Math.floor(Math.max(...gradientList) * 10) + 1) / 10;
      //   if (yMax === null) yMax = tmp;
      //   else if (yMax < tmp) yMax = tmp;
      // }

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
              if (!x.data[1]) {
                return 1;
              }
              if (!y.data[1]) {
                return -1;
              }
              return y.data[1] - x.data[1];
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data = params[i].data;
              let _marker = params[i].marker;
              showHtm += `${_marker}${_data[1]}, ${_text} <br>`;
            }
            return showHtm;
          }
        },
        title: {
          text: data.title,
          left: "center",
          subtext: obj.subtext
        },
        legend: {
          data: data.series.map(item => {
            return item.name;
          })
        },
        xAxis: {
          name: obj.xname,
          type: obj.xtype,
          boundaryGap: false,
          max: "dataMax"
        },
        yAxis: {
          name: this.quotaSelect.text,
          type: "value"
          // max: yMax
        },
        series: data.series
      });
      return _opt;
    }
  }
};
</script>
