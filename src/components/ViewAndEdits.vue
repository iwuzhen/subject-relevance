<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科 </span>
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
        <span>数据类型 </span>
        <el-select
          v-model="dataType"
          class="dataType"
          @change="subjectChange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>level </span>
        <el-select
          v-model="subjectLevel"
          class="subjectLevel"
          placeholder="请选择"
          @change="subjectChange"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button class="selectitem" type="primary" @click="getData"
        >确定</el-button
      >
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getViewAndEdits } from "@/api/index";
export default {
  name: "discipline",
  data() {
    return {
      subjectTarget: [],
      subjectLevel: 0,
      categorys: [
        "Literature",
        "Psychology",
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
      levelOptions: [
        {
          value: 0,
          label: "0"
        },
        {
          value: 1,
          label: "1"
        },
        {
          value: 2,
          label: "2"
        },
        {
          value: "1000",
          label: "top 1000"
        }
      ],
      dataType: 0,
      dataTypeOptions: [
        {
          value: 0,
          label: "访问量"
        },
        {
          value: 1,
          label: "编辑量"
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
    },
    SubCategorysOptions: function() {
      let that = this;
      let _data = that.enginerringChildren.map(item => {
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
            // let keyIndex = []
            // let newLegend = []
            // let newY = []
            // console.log(this.subjectTarget)
            // for (let key of this.subjectTarget) {
            //   if (res.data.data['legend'].indexOf(key) >= 0) {
            //     keyIndex.push(res.data.data['legend'].indexOf(key))
            //     newLegend.push(key)
            //   }
            // }
            // for (let key of keyIndex) {
            //   newY.push(res.data.data['y'][key])
            // }
            // res.data.data['legend'] = newLegend
            // res.data.data['y'] = newY
            // console.log(res.data.data)
            this.drawChart(res.data.data);
          } else {
            this.loading = false;
            this.$message.error("请求失败");
            return false;
          }
        })
        .catch(rej => {
          this.loading = false;
          this.$message.error(`请求失败:${rej}`);
        });
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
          data: data.x,
          max: "dataMax"
        },
        yAxis: {
          type: "value",
          max: "dataMax"
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
