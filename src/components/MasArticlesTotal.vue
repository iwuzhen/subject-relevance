<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          @change="getData"
          chips
          multiple
          dense
          label="目标学科"
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
import { getMasArticlesTotal } from "@/api/index";
export default {
  name: "mas文章数",
  data() {
    return {
      subjectRelevances: [],
      categorys: [
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Political science",
        "Psychology",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering"
      ],
      typeOptions: [
        {
          value: "0",
          text: "否"
        },
        {
          value: "1",
          text: "是"
        },
        {
          value: "mas",
          text: "mas"
        }
      ],
      levelOptions: ["0", "1", "2"],
      loading: false
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
      if (this.subjectRelevances.length === 0) {
        return false;
      }
      this.loading = true;
      let opt = {
        subjects: this.subjectRelevances.join(",")
      };
      getMasArticlesTotal(opt)
        .then(res => {
          if (res.data) {
            this.drawChart(res.data);
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
      console.log(this.subjectRelevances);
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let years = Object.keys(data[this.subjectRelevances[0]]);
      let _opt = {
        title: {
          text: "学科 article 数量",
          left: "40%"
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
              let _data = params[i].data;
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: Object.keys(data),
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
          name: "Year",
          type: "category",
          boundaryGap: false,
          data: years
        },
        yAxis: {
          name: "Count",
          type: "value",
          max: (data => {
            let max = 100;
            for (let key in data) {
              max = Math.max(
                max,
                Math.max.apply(null, Object.values(data[key]))
              );
            }
            return Math.ceil(max / 100) * 100;
          })(data)
        },
        series: (data => {
          let ret = [];
          for (let key in data) {
            ret.push({
              name: key,
              type: "line",
              smooth: false,
              data: Object.values(data[key])
            });
          }
          return ret;
        })(data)
      };
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
</style>
