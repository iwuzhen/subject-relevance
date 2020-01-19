<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>当前学科:</span>
        <el-select
          v-model="currentSubject"
          placeholder="请选择"
          class="methodSelect"
          @change="currentSubjectChange"
        >
          <el-option
            v-for="item in currentSubjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>目标学科 </span>
        <el-select
          v-model="targetSubject"
          class="methodSelect"
          collapse-tags
          placeholder="请选择"
          multiple
          @change="subjectChange"
        >
          <el-option
            v-for="item in targetSubjectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.value === currentSubject"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>参数 </span>
        <el-select
          v-model="mathodOption"
          class="methodSelect"
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in mathodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === currentSubject"
          ></el-option>
        </el-select>
      </div>

      <div class="selectitem">
        <span>反向 </span>
        <el-select
          v-model="reverseOption"
          class="methodSelect"
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in reverseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- <el-button type="primary" @click="getData">确定</el-button> -->
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import smallworlddirect from "../data/smallworlddirect.json";
export default {
  name: "SmallWorldUndirected",
  data() {
    return {
      currentSubject: "",
      targetSubject: [],
      methodValue: "linksin",
      subjectLevel: "0",
      reverseOption: 0,
      reverseOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      mathodOption: "average_path",
      mathodOptions: [
        {
          value: "average_path",
          label: "平均最短路径"
        },
        {
          value: "sd",
          label: "最短路径和"
        },
        {
          value: "sp",
          label: "联通路径量"
        },
        {
          value: "md",
          label: "MAX(最短路径)"
        }
      ],

      loading: false
    };
  },
  computed: {
    currentSubjectOptions: function() {
      let ret_data = [];
      for (let key in smallworlddirect.source) {
        ret_data.push({
          value: smallworlddirect.source[key],
          label: key
        });
      }
      return ret_data;
    },
    targetSubjectOptions: function() {
      let ret_data = [];
      for (let key in smallworlddirect.source) {
        ret_data.push({
          value: smallworlddirect.source[key],
          label: key
        });
      }
      return ret_data;
    },
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
  },
  methods: {
    async getData() {
      if (this.currentSubject.length === 0 || this.targetSubject.length === 0) {
        return false;
      }
      this.loading = true;
      let data = {
        y: [],
        x: smallworlddirect.year,
        legend: this.targetSubject.map(value => {
          for (let key in smallworlddirect.source) {
            if (smallworlddirect.source[key] === value) return key;
          }
        }),
        title: `小世界有向图`
      };

      let ydata = {};
      for (let sbj of this.targetSubject) {
        ydata[sbj] = [];
      }

      for (let data of smallworlddirect.data) {
        for (let sbj of this.targetSubject) {
          if (this.currentSubject === data.s && sbj === data.t) {
            ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
              data[this.mathodOption];
            if (this.mathodOption === "average_path") {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] = Number(
                (data["sd"] / data["sp"]).toFixed(4)
              );
            } else {
              ydata[sbj][smallworlddirect.year.indexOf(data.y)] =
                data[this.mathodOption];
            }
          }
        }
      }

      for (let sbj of this.targetSubject) {
        data["y"].push(ydata[sbj]);
      }

      console.log(data);

      this.drawChart(data);
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let _opt = {
        title: {
          text: data.title,
          left: "10%"
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
              let _data;
              if (params[i].data) {
                _data = parseFloat(params[i].data.toFixed(6));
              } else {
                _data = null;
              }

              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          right: "5%",
          top: "10%",
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
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: "value",
          max: "dataMax",
          min: "dataMin"
        },
        series: data.y.map((item, index) => {
          return {
            name: data.legend[index],
            type: "line",
            smooth: true,
            data: item
          };
        })
      };
      return _opt;
    },
    subjectChange() {
      this.getData();
    },
    currentSubjectChange() {
      // this.targetSubject = [];
      // for (let each of this.targetSubjectOptions) {
      //   if (each.label !== this.currentSubject)
      //     this.targetSubject.push(each.value);
      // }
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
.methodSelect {
  width: 200px;
}
</style>
