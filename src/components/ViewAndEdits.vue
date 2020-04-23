<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          @change="getData"
          chips
          multiple
          dense
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="dataType"
          :items="dataTypeOptions"
          @change="getData"
          label="数据类型"
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
import { getViewAndEdits } from "@/api/index";
import { basiCategorys } from "@/api/data";
export default {
  name: "ve访问量和编辑量",
  data() {
    return {
      subjectTarget: [],
      subjectLevel: 0,
      categorys: basiCategorys,
      levelOptions: [
        {
          value: 0,
          text: "0"
        },
        {
          value: 1,
          text: "1"
        },
        {
          value: 2,
          text: "2"
        },
        {
          value: "1000",
          text: "top 1000"
        }
      ],
      dataType: 0,
      dataTypeOptions: [
        {
          value: 0,
          text: "访问量"
        },
        {
          value: 1,
          text: "编辑量"
        }
      ],
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
      if (
        this.subjectTarget.length < 1 ||
        this.dataType.length < 1 ||
        this.subjectLevel.length < 1
      ) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        str: this.subjectTarget.join(","),
        type: this.dataType,
        level: this.subjectLevel
      };
      getViewAndEdits(opt)
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
      let ymax = Math.max(...[].concat(...data.y));
      let digit = Math.floor(ymax).toString().length;
      ymax = Math.ceil(ymax / 10 ** (digit - 2)) * 10 ** (digit - 2);
      let _opt = {
        title: {
          text: data.title,
          left: "40%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: true,
            label: {
              backgroundColor: "#505765"
            }
          },

          textStyle: {
            align: "left"
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
          name: "Date",
          type: "category",
          boundaryGap: false,
          data: data.x,
          max: "dataMax"
        },
        yAxis: {
          name: "Count",
          type: "value",
          max: ymax
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
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
.subjectRelevances {
  width: 300px;
}
.dataType {
  width: 100px;
}
.subjectLevel {
  width: 120px;
}
</style>
