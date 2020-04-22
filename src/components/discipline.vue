<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          @change="getData"
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          @change="getData"
          small-chips
          multiple
          clearable
          label="相关学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          @change="getData"
          label="条件"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="subjectLevel"
          :items="levelOptions"
          @change="getData"
          label="level"
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
import { getWikiData } from "@/api/index";
export default {
  name: "wiki学科相关度",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksin",
      subjectLevel: "0",
      categorys: [
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Medicine",
        "Political science",
        "Psychology",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering disciplines",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering"
      ],
      enginerringChildren: [
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering"
      ],
      methodOptions: ["linksin", "linksout"],
      levelOptions: [
        {
          value: "0",
          text: "0 层"
        },
        {
          value: "1",
          text: "1 层"
        },
        {
          value: "2",
          text: " 2层"
        },
        {
          value: "1000",
          text: "top 1000 文章"
        },
        {
          value: "2000",
          text: "top 2000 文章"
        },
        {
          value: "3000",
          text: "top 3000 文章"
        },
        {
          value: "4000",
          text: "top 4000 文章"
        },
        {
          value: "5000",
          text: "top 5000 文章"
        }
      ],
      loading: false
    };
  },
  computed: {
    categorysOptions: function() {
      let subjectTarget = this.subjectTarget;
      return this.categorys.map(item => {
        let ret = {
          value: item,
          text: item
        };
        if (item == subjectTarget) ret["disabled"] = true;

        return ret;
      });
    },
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
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        return false;
      }
      this.loading = true;
      let subjectTarget = this.subjectTarget;
      let opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item == subjectTarget) {
              return false;
            }
            return true;
          })
          .join(","),
        method: this.methodValue,
        level: this.subjectLevel
      };
      getWikiData(opt)
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
              return y.data - x.data;
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data = params[i].data.toFixed(6);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          right: "5%",
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
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: "value",
          max: 1
        },
        series: data.y.map((item, index) => {
          return {
            name: data.legend[index],
            type: "line",
            smooth: false,
            data: item
          };
        })
      };
      return _opt;
    },
    subjectChange() {
      this.subjectRelevances = [];
    },
    selectChange() {
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
</style>
