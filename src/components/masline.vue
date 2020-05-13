<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          deletable-chips
          @change="getData"
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="8">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          dense
          small-chips
          multiple
          @change="getData"
          label="相关学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          dense
          @change="getData"
          label="条件"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1950"
          dense
          hide-details
          @change="getData"
          hint="年份范围"
          class="align-center"
        >
          <template v-slot:prepend>
            <p style="width: 100px">年份范围</p>
            <v-text-field
              :value="years[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(years, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :value="years[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(years, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="masChart"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getMasData } from "@/api/index";
import { extendEchartsOpts, coreCategorys } from "@/api/data";
export default {
  name: "mag学科相关度",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksout",
      years: [1950, 2019],
      categorys: coreCategorys,
      methodOptions: ["linksout"],
      loading: false
    };
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
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
      return this.$echarts.init(document.getElementById("masChart"));
    }
  },
  methods: {
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        // this.$message.error("请选择完整");
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
        from: this.years[0],
        to: this.years[1]
      };
      getMasData(opt)
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
      let myChart = this.$echarts.init(document.getElementById("masChart"));
      let options = this.setOptions(data);
      myChart.setOption(options, true);
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
          name: "Correlation degree",
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
      });
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped></style>
