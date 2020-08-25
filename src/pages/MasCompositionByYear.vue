<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          @change="getData"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          @change="getData"
          label="起始年份"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="refSelect"
          :items="refOpt"
          @change="getData"
          label="引用关系"
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
        >
          <v-container
            fluid
            fill-height
            id="subjectChart"
          > </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getMasCompositionByYear } from "@/api/index";
import { extendEchartsOpts, coreCategorys, extendLineSeries, defaultCategorySelect } from "@/api/data";
export default {
  name: "mag学科引用年度分布",
  data() {
    return {
      subjectRelevances: defaultCategorySelect,
      categorys: coreCategorys,
      yearSelect: 1980,
      yearOpt: [1950, 1960, 1970, 1980, 1990, 1995, 2000],
      refSelect: "linksin",
      refOpt: ["linksin", "linksout"],
      loading: false
    };
  },
  computed: {
    myChart: function () {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
    this.getData()
  },
  methods: {
    async getData() {
      if (this.subjectRelevances.length === 0) {
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectRelevances.join(","),
        year: this.yearSelect,
        method: this.refSelect
      };
      getMasCompositionByYear(opt)
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
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let _opt = extendEchartsOpts({
        title: {
          text: data.title
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
          name: "Percent",
          type: "value"
        },
        series: data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index],
            type: "line",
            smooth: false,
            data: item.map(each => {
              console.log(each);
              if (each == Infinity) {
                return 0;
              }
              return each.toFixed(5);
            })
          });
        })
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
