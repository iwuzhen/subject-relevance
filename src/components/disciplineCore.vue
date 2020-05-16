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
      <v-col cols="5">
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
          v-model="pageCountSelect"
          :items="pageCountOpt"
          @change="getData"
          label="文章数"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="levelSelect"
          :items="levelOpt"
          @change="getData"
          label="层数"
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
import { getDistanceCore } from "@/api/index";
import { extendEchartsOpts, coreCategorys, extendLineSeries } from "@/api/data";
export default {
  name: "CoreWiki学科相关度",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksin",
      pageCountSelect: "3000",
      categorys: coreCategorys,
      methodOptions: ["linksin", "linksout"],
      levelSelect: 3,
      levelOpt: [3, 4],
      pageCountOpt: [
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
        },
        {
          value: "6000",
          text: "top 6000 文章"
        },
        {
          value: "7000",
          text: "top 7000 文章"
        },
        {
          value: "8000",
          text: "top 8000 文章"
        },
        {
          value: "9000",
          text: "top 9000 文章"
        },
        {
          value: "10000",
          text: "top 10000 文章"
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
        level: this.pageCountSelect,
        levelType: this.levelSelect
      };
      getDistanceCore(opt)
        .then(res => {
          if (res.data) {
            this.drawChart(res.data);
          } else {
            this.loading = false;
            // this.$emit("emitMesage", "请求失败");
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
