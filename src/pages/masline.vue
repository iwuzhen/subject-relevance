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
      <v-col cols="6">
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
          @change="linksChange"
          label="条件"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="qsValue"
          :items="qsOptions"
          dense
          @change="qsChange"
          label="筛选条件"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
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
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="bfValue"
          :items="bfOpt"
          dense
          @change="bfChange"
          label="只用该年以前的数据"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-btn
          :color="showAve ? 'light-green' : 'lime'"
          @click="
            showAve = !showAve;
            getData();
          "
        >{{ showAve ? "关闭平均相关度" : "开启平均相关度" }}</v-btn>
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
import { extendEchartsOpts, coreCategorys, extendLineSeries } from "@/api/data";
export default {
  name: "mag学科相关度",
  data() {
    return {
      qsValue: -1,
      qsOptions: [{ text: "学科内 Linksin 大于的值 0", value: 0 }, { text: "不筛选", value: -1 }, { text: "去掉被引用为0的论文，剩余7000万+", value: -2 }],
      showAve: true,
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksout",
      years: [1945, 2019],
      categorys: coreCategorys,
      methodOptions: ["linksout", "linksin"],
      bfValue: "不适用",
      bfOpt: ["不适用", 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],
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
    categorysOptions: function () {
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
    myChart: function () {
      return this.$echarts.init(document.getElementById("masChart"));
    }
  },
  methods: {
    qsChange() {
      if (this.qsValue == 0) {
        this.methodValue = "linksin";
        this.bfValue == "不适用";
      }
      this.getData();
    },

    bfChange() {
      if (this.bfValue != "不适用") {
        this.methodValue = "linksin";
        this.qsValue = -1;
      }
      this.getData();
    },

    linksChange() {
      if (this.methodValue == "linksout") {
        this.qsValue = -1;
        this.bfValue = "不适用";
      }
      this.getData();
    },

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
        to: this.years[1],
        qs: this.qsValue
      };

      if (this.bfValue != "不适用") {
        opt.bf = this.bfValue;
      }
      getMasData(opt)
        .then(res => {
          if (res.data.data) {
            if (this.subjectRelevances.length > 1 && this.showAve) {
              console.log(res.data.data);
              let aveLine = [];
              for (let i in res.data.data.x) {
                let ss = 0;
                for (let row of res.data.data.y) {
                  ss += row[i];
                }
                aveLine.push(ss / res.data.data.y.length);
              }
              res.data.data.y.push(aveLine);
              res.data.data.legend.push("平均相关度");
              this.drawChart(res.data.data);
            } else this.drawChart(res.data.data);
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
