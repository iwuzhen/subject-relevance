<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectTarget"
          placeholder="请选择"
          multiple
          collapse-tags
          @change="subjectChange"
        >
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>年份</span>
        <el-select
          v-model="yearTarget"
          class="yearSelect"
          collapse-tags
          placeholder="请选择"
          multiple
          @change="subjectChange"
        >
          <el-option
            v-for="item in yearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>图谱扩大方式</span>
        <el-select
          v-model="increaseTaeget"
          class="increaseSelect"
          collapse-tags
          placeholder="请选择"
          multiple
          @change="subjectChange"
        >
          <el-option
            v-for="item in increaseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>小世界指标</span>
        <el-select
          v-model="methodOptions"
          class="methodSelect"
          collapse-tags
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in methods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>图谱节点上限</span>
        <el-select
          v-model="nodeCounttarget"
          class="nodeCountSelect"
          collapse-tags
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in nodeCountOptions"
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
import smallworldundirectLimter from "../data/smallworldundirectLimter.json";
export default {
  name: "SmallWorldUndirected",
  data() {
    return {
      subjectTarget: [],
      subjectRelevances: [],
      yearTarget: [],
      increaseTaeget: [],
      nodeCounttarget: 4000,
      methodValue: "linksin",
      subjectLevel: "0",
      categorys: [
        "Psychology",
        "Literature",
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Political science",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering disciplines",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering",
        "Cognitive science",
        "Machine learning",
        "Blockchains",
        "Deep learning",
        "Theoretical computer science",
        "Quantum computing",
        "Genetic engineering",
        "Genome editing",
        "Anthropology",
        "Neuroscience"
      ],
      methodOptions: "ad",
      nodeCountOptions: [
        {
          value: 500,
          label: 500
        },
        {
          value: 1000,
          label: 1000
        },
        {
          value: 1500,
          label: 1500
        },
        {
          value: 2000,
          label: 2000
        },
        {
          value: 2500,
          label: 2500
        },
        {
          value: 3000,
          label: 3000
        },
        {
          value: 3500,
          label: 3500
        },
        {
          value: 4000,
          label: 4000
        },
        {
          value: 100000,
          label: "不限制"
        }
      ],
      increaseOptions: [
        {
          value: 2,
          label: "三层类距离扩大图谱"
        },
        {
          value: 0,
          label: "谷歌距离扩大图谱"
        },
        {
          value: 1,
          label: "随机扩大图谱"
        }
      ],
      methods: [
        {
          value: "ad",
          label: "平均最小距离"
        },
        {
          value: "cc",
          label: "聚集系数"
        }
      ],
      yearOptions: [
        {
          value: 2007,
          label: 2007
        },
        {
          value: 2008,
          label: 2008
        },
        {
          value: 2009,
          label: 2009
        },
        {
          value: 2011,
          label: 2011
        },
        {
          value: 2013,
          label: 2013
        },
        {
          value: 2014,
          label: 2014
        },
        {
          value: 2015,
          label: 2015
        },
        {
          value: 2016,
          label: 2016
        },
        {
          value: 2017,
          label: 2017
        },
        {
          value: 2018,
          label: 2018
        },
        {
          value: 2019,
          label: 2019
        }
      ],
      loading: false
    };
  },
  computed: {
    categorysOptions: function() {
      let that = this;
      let _data = that.categorys.map(item => {
        return {
          value: item,
          label: item
        };
      });
      return _data;
    }
  },
  methods: {
    async getData() {
      if (
        this.subjectTarget.length === 0 ||
        this.methodOptions.length === 0 ||
        this.yearTarget.length === 0 ||
        this.increaseTaeget.length === 0
      ) {
        // this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;

      // 数据初始化

      let tmp_dict = {};
      let legend = new Set();
      for (let x of this.subjectTarget) {
        for (let y of this.yearTarget) {
          for (let z of this.increaseTaeget) {
            let iName = "";
            if (z === 1) iName = "随机";
            else if (z === 2) iName = "三层类距离";
            else iName = "谷歌";
            let _id = `${x} - ${iName} - ${y}`;
            legend.add(_id);
            tmp_dict[_id] = {
              n: x,
              y: y,
              data: []
            };
          }
        }
      }

      for (let row of smallworldundirectLimter) {
        if (
          this.subjectTarget.indexOf(row["n"]) > -1 &&
          this.yearTarget.indexOf(row["y"]) > -1 &&
          this.increaseTaeget.indexOf(row["t"]) > -1 &&
          this.nodeCounttarget > row["nv"]
        ) {
          let iName = "";
          if (row["t"] === 1) iName = "随机";
          else if (row["t"] === 2) iName = "三层类距离";
          else iName = "谷歌";
          let _id = `${row["n"]} - ${iName} - ${row["y"]}`;
          tmp_dict[_id]["data"].push([row["nv"], row[this.methodOptions]]);
        }
      }

      let ret_seriest = [];
      for (let _id in tmp_dict) {
        ret_seriest.push({
          name: _id,
          type: "line",
          symbolSize: 5,
          large: true,
          data: tmp_dict[_id]["data"].sort((x, y) => {
            return x[0] - y[0];
          }),
          smooth: true
        });
      }
      let data = {
        series: ret_seriest,
        legend: Array.from(legend),
        title: `扩大图谱后的小世界趋势`
      };
      console.log(data);

      this.drawChart(data);
    },
    drawChart(data) {
      let myChart = this.$echarts.init(document.getElementById("subjectChart"));
      let options = this.setOptions(data);
      myChart.setOption(options, true);
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
              return y.data[1] - x.data[1];
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data_x = params[i].data[0];
              let _data_y = params[i].data[1].toFixed(4);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}： x=${_data_x} y=${_data_y}<br>`;
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
          name: "图谱节点数",
          type: "value",
          boundaryGap: false,
          max: "dataMax"
        },
        yAxis: {
          type: "value",
          max: "dataMax",
          min: "dataMin"
        },
        series: data.series
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
.methodSelect {
  width: 150px;
}
.nodeCountSelect {
  width: 100px;
}
.increaseSelect {
  width: 220px;
}
.yearSelect {
  width: 100px;
}
.subjectLevel {
  width: 100px;
}
</style>
