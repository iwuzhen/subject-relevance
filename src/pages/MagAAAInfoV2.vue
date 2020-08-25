<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-06-04 10:56:34
 * @LastEditors: ider
 * @LastEditTime: 2020-08-25 16:48:37
 * @Description: 
-->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          small-chips
          multiple
          deletable-chips
          clearable
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="limitSelect"
          :items="limitOpt"
          @change="getData"
          label="展示数量"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="queryTypeSelect"
          :items="queryTypeOpt"
          @change="getData"
          label="展示引用数为0的文章"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="60vh"
        >
          <v-container
            fluid
            fill-height
            id="chart2"
          > </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="120vh"
        >
          <v-container
            fluid
            fill-height
            id="chart1"
          > </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="50vh"
        >
          <v-container
            fluid
            fill-height
            id="chart3"
          > </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        col="4"
        v-for="(item, index) in gridData"
        :key="index"
      >
        <v-card>
          <v-card-title>{{ item.title }} </v-card-title>
          <v-data-table
            :headers="item.headers"
            :items="item.desserts"
            dense
            sort-desc
            class="elevation-1"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//
import { getMagAuthorsAndArticleInfoV2, getLinkTjv2 } from "@/api/index";
import { magCategory, extendEchartsOpts, defaultCategorySelect, extendLineSeries } from "@/api/data";

const Limiter = require("async-limiter");

export default {
  name: "MAG数据统计_v2",
  data() {
    return {
      subjectTarget: defaultCategorySelect,
      limitSelect: 100,
      categorys: magCategory,
      limitOpt: [50, 100, 200, 400, 600, 800, 1000],
      loading: false,
      chartOpt1: {},
      chartOpt2: {},
      chartOpt3: {},
      queryTypeSelect: "1",
      queryTypeOpt: [
        { text: "是", value: "0" },
        { text: "否", value: "1" }
      ],
      gridData: []
    };
  },
  mounted() {
    // 队列 初始化
    this.asyncLimier = new Limiter({ concurrency: 1 });

    window.onresize = () => {
      this.myChart1.resize();
      this.myChart2.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
    this.getData()
  },
  computed: {
    myChart1: function () {
      return this.$echarts.init(document.getElementById("chart1"));
    },
    myChart2: function () {
      return this.$echarts.init(document.getElementById("chart2"));
    },
    myChart3: function () {
      return this.$echarts.init(document.getElementById("chart3"));
    }
  },
  watch: {
    // 更新图标
    chartOpt1: function (opt) {
      this.myChart1.setOption(opt, true);
    },
    chartOpt2: function (opt) {
      this.myChart2.setOption(opt, true);
    },
    chartOpt3: function (opt) {
      this.myChart3.setOption(opt, true);
    },
    subjectTarget: async function (newValue, oldValue) {
      this.loading = true;
      let diffArray = newValue.filter(item => !oldValue.includes(item));
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          await this.getOneDate(diffArray[0]);
          cb();
        });
      }
      this.asyncLimier.onDone(() => {
        this.getData();
      });
    }
  },
  methods: {
    async getOneDate(subject) {
      console.log("onedata,", subject);
      let retdata = [];
      for (let tr of [0, 1, 2]) {
        let opt = {
          str: subject,
          returnType: tr,
          queryType: this.queryTypeSelect,
          N: this.limitSelect
        };
        try {
          let repdata = await getMagAuthorsAndArticleInfoV2(opt);
          retdata.push(repdata.data);
        } catch (error) {
          this.$emit("emitMesage", `请求失败:${error}`);
        }
      }
      let retaveData = { linksout: {}, linksin: {} }
      for (let tr of ["linksout", "linksin"]) {
        let opt = {
          str: subject,
          method: tr,
          type: 0
        }
        let ret = await getLinkTjv2(opt)
        Object.assign(retaveData[tr], ret.data)
      }
      return [retdata, retaveData];
    },
    async getData() {
      // 需要拆分请求
      if (this.subjectTarget.length < 1) {
        return false;
      }
      this.loading = true;
      //   let reqData = null;
      //   let dataset1 = [],
      //     dataset2 = [];
      // 拼接 dataset
      let dataset1 = { dimensions: [], source: [] },
        dataset2 = { dimensions: [], source: [] },
        // 写实2个图
        dataset3 = { dimensions: ["product", "linksin", "linksout"], source: [] },
        dataset2Title = "",
        tabledata = {};
      let allKeys = [];
      for (let subjectName of this.subjectTarget) {
        let [retdata, retaveData] = await this.getOneDate(subjectName);

        console.log(retaveData)
        // dataset3
        dataset3.source.push({
          linksout: Object.values(retaveData.linksout)[0],
          linksin: Object.values(retaveData.linksin)[0],
          product: Object.keys(retaveData.linksout)[0]
        });

        //   dataset1
        allKeys.push(...Object.keys(retdata[0][subjectName]));
        retdata[0][subjectName].product = subjectName;
        dataset1.source.push(retdata[0][subjectName]);

        //   dataset2
        dataset2Title = retdata[2].title;
        dataset2.source.push([subjectName, retdata[2].y[0]]);
        dataset2.dimensions = retdata[2].x;

        // tabledata
        tabledata[subjectName] = Object.entries(retdata[1][subjectName]).map(
          item => {
            return { name: item[0], count: item[1] };
          }
        );
      }
      dataset2.source.sort((x, y) => {
        return y[1].slice(-1) - x[1].slice(-1);
      });
      dataset1.dimensions.push("product", ...Array.from(new Set(allKeys)));
      console.log("dataset1", dataset1)
      this.chartOpt1 = this.setOptions1(dataset1);
      this.chartOpt2 = this.setOptions2(dataset2, dataset2Title);

      this.chartOpt3 = this.setOptions3(dataset3);

      console.log("dataset3", dataset3)
      this.drawTable(tabledata);
      this.loading = false;
    },

    setOptions1(dataset) {
      let _opt = {
        dataset: dataset,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: "MAG 统计数据",
          textStyle: {
            fontSize: 24
          }
        },
        xAxis: [
          { type: "category", gridIndex: 0 },
          { type: "category", gridIndex: 1 },
          { type: "category", gridIndex: 2 },
          { type: "category", gridIndex: 3 },
          { type: "category", gridIndex: 4 }
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "作者数(去重)",
            nameTextStyle: { fontSize: 18 }
          },
          {
            gridIndex: 1,
            name: "作者数(不去重)",
            nameTextStyle: { fontSize: 18 }
          },
          { gridIndex: 2, name: "文章总数", nameTextStyle: { fontSize: 18 } },
          {
            gridIndex: 3,
            name: "作者数(去重)/文章数",
            nameTextStyle: { fontSize: 18 }
          },
          {
            gridIndex: 4,
            name: "作者数(不去重)/文章数",
            nameTextStyle: { fontSize: 18 }
          }
        ],
        grid: [
          { top: "10%", bottom: "67%", right: "55%" },
          { top: "10%", bottom: "67%", left: "55%" },
          { top: "41%", bottom: "35%", right: "55%" },
          { top: "41%", bottom: "35%", left: "55%" },
          { top: "72%", bottom: "3%", right: "55%" }
        ],
        series: [
          {
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: "product", y: "authors" }
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: { x: "product", y: "authors_nodiff" }
          },
          {
            type: "bar",
            xAxisIndex: 2,
            yAxisIndex: 2,
            encode: { x: "product", y: "articles" }
          },
          {
            type: "bar",
            xAxisIndex: 3,
            yAxisIndex: 3,
            encode: { x: "product", y: "authors_articles" }
          },
          {
            type: "bar",
            xAxisIndex: 4,
            yAxisIndex: 4,
            encode: { x: "product", y: "authors_nodiff_articles" }
          }
        ]
      };
      return _opt;
    },
    setOptions2(dataset, dataset2Title) {
      let _opt = extendEchartsOpts({
        title: {
          text: dataset2Title
        },
        legend: {
          data: dataset.source.map(item => {
            return item[0];
          })
        },
        xAxis: {
          name: "Rank",
          type: "category",
          boundaryGap: false,
          data: dataset.dimensions
        },
        yAxis: {
          name: "Paper Count",
          type: "value"
        },
        series: dataset.source.map(item => {
          return extendLineSeries({
            name: item[0],
            type: "line",
            smooth: false,
            data: item[1]
          });
        })
      });
      return _opt;
    },
    drawTable(data) {
      let ret_data = [];
      let headers = [
        {
          text: "作者",
          align: "start",
          sortable: false,
          value: "name"
        },
        {
          text: "文章数",
          align: "start",
          value: "count"
        }
      ];

      for (let subjectNmae in data) {
        ret_data.push({
          title: `${subjectNmae} 作者 Rank`,
          headers: headers,
          desserts: data[subjectNmae]
        });
      }

      this.gridData = ret_data;
      this.loading = false;
    },

    setOptions3(dataset) {
      let _opt = {
        dataset: dataset,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: "MAG 引用数/文章数",
          textStyle: {
            fontSize: 24
          }
        },
        xAxis: [
          { type: "category", gridIndex: 0 },
          { type: "category", gridIndex: 1 }
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "文章平均引用数（linksin）",
            nameTextStyle: { fontSize: 18 }
          },
          {
            gridIndex: 1,
            name: "文章平均引用数（linksout）",
            nameTextStyle: { fontSize: 18 }
          }
        ],
        grid: [
          { top: "95%", bottom: "80%", right: "55%" },
          { top: "95%", bottom: "80%", left: "55%" },
        ],
        series: [
          {
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: "product", y: "linksin" }
          },
          {
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: { x: "product", y: "linksout" }
          }
        ]
      };
      return _opt;
    },
  }
};
</script>
