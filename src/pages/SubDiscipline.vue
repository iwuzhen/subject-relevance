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
      <v-col cols="2">
        <v-select
          v-model="subjectLevel"
          :items="levelOptions"
          @change="getData"
          label="相关学科"
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
import { getDistanceByFile } from "@/api/index";
import { extendEchartsOpts, extendLineSeries } from "@/api/data";
export default {
  name: "Cognitive_science相关度",
  data() {
    return {
      subjectTarget: "Cognitive science",
      subjectLevel: "1",
      categorys: ["Cognitive science"],
      levelOptions: ["1", "2", "mas"],
      loading: false
    };
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    this.getData();
    this.$store.commit("changeCurentPath", this.$options.name);
    window.onresize = () => {
      this.myChart.resize();
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      let opt = {
        strA: this.subjectTarget,
        level: this.subjectLevel
      };
      getDistanceByFile(opt)
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
      let _opt = extendEchartsOpts({
        title: {
          text: data.title,
          left: "35%"
        },
        legend: {
          data: data.legend
        },
        xAxis: {
          name: "Year",
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          name: "Semantic Distance",
          type: "value",
          max: 1
        },
        series: data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index],
            type: "line",
            smooth: false,
            data: item
          });
        })
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
