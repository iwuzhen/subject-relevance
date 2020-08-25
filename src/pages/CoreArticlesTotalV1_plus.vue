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
          dense
          deletable-chips
          clearable
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="subjecType"
          :items="typeOptions"
          @change="getData"
          label="是否统计子类数目"
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
import { getArticlesTotalByCore_plus } from "@/api/index";
import {
  extendEchartsOpts,
  wikiArticleCategory,
  extendLineSeries, defaultCategorySelect
} from "@/api/data";

export default {
  name: "CoreArticleTotal_v1_plus",
  data() {
    return {
      subjectRelevances: defaultCategorySelect,
      subjectLevel: "0",
      subjecType: "0",
      categorys: wikiArticleCategory,
      typeOptions: [
        {
          value: "0",
          text: "否"
        },
        {
          value: "1",
          text: "是"
        }
      ],
      levelOptions: ["0", "1", "2", "3", "4", "5"],
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
      if (this.subjectLevel === "0" && this.subjecType === "1") {
        this.$emit("emitMesage", "0 层没有子类");
        return false;
      }
      this.loading = true;
      let opt = {
        subjects: this.subjectRelevances.join(","),
        level: this.subjectLevel,
        type: this.subjecType
      };
      getArticlesTotalByCore_plus(opt)
        .then(res => {
          if (res) {
            this.drawChart(res);
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
