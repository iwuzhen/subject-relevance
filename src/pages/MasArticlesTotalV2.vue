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
import { getMasArticlesTotalV2 } from "@/api/index";
import { extendEchartsOpts, coreCategorys, extendLineSeries } from "@/api/data";
export default {
  name: "mag文章数 v2",
  data() {
    return {
      subjectRelevances: [],
      categorys: coreCategorys,
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
          text: "mag"
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
      getMasArticlesTotalV2(opt)
        .then(res => {
          if (res.data) {
            console.log(res.data);
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
      let years = Object.keys(Object.values(data)[0]);
      let _opt = extendEchartsOpts({
        title: {
          text: "学科 article 数量"
        },
        legend: {
          data: Object.keys(data)
        },
        xAxis: {
          name: "Year",
          type: "category",
          boundaryGap: false,
          data: years
        },
        yAxis: {
          name: "Count",
          type: "value"
        },
        series: Object.entries(data).map(item => {
          return extendLineSeries({
            name: item[0],
            type: "line",
            smooth: false,
            data: Object.values(item[1])
          });
        })
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
