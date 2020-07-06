<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          small-chips
          multiple
          @change="getData"
          label="学科"
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
      <!-- <v-col cols="8">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1900"
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
      </v-col> -->
      <v-col>
        <v-btn
          :color="showAve ? 'light-green' : 'lime'"
          @click="
            showAve = !showAve;
            getData();
          "
          >{{ showAve ? "关闭平均自恋度" : "开启平均自恋度" }}</v-btn
        ></v-col
      >
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
import { getMagRefSelfRate } from "@/api/index";
import { extendEchartsOpts, coreCategorys, extendLineSeries } from "@/api/data";
export default {
  name: "mag学科自恋度",
  data() {
    return {
      showAve: true,
      subjectTarget: "",
      methodValue: "linksin",
      years: [1900, 2000],
      categorys: coreCategorys,
      methodOptions: ["linksout", "linksin"],
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
    myChart: function() {
      return this.$echarts.init(document.getElementById("masChart"));
    }
  },
  methods: {
    async getData() {
      if (this.subjectTarget.length < 1) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectTarget.join(","),
        method: this.methodValue,
        from: this.years[0],
        to: this.years[1]
      };
      getMagRefSelfRate(opt)
        .then(res => {
          if (res.data) {
            if (this.subjectTarget.length > 1 && this.showAve) {
              console.log(res.data);
              let aveLine = [];
              for (let i in res.data.x) {
                let ss = 0;
                for (let row of res.data.y) {
                  ss += row[i];
                }
                aveLine.push(ss / res.data.y.length);
              }
              res.data.y.push(aveLine);
              res.data.legend.push("平均相关度");
              this.drawChart(res.data);
            } else this.drawChart(res.data);
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
          name: "RefSelfRate",
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
