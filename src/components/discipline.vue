<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectTarget"
          class="selectsubjectmax"
          placeholder="请选择"
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
        <span>相关学科</span>
        <el-select
          v-model="subjectRelevances"
          class="selectsubjectmax"
          multiple
          collapse-tags
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.label === subjectTarget"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>条件</span>
        <el-select
          v-model="methodValue"
          class="methodSelect"
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="selectitem">
        <span>level</span>
        <el-select
          v-model="subjectLevel"
          class="selectsubjectmiddle"
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- <el-button class="selectitem" type="primary" @click="getData"
        >确定</el-button
      > -->
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getWikiData } from "@/api/index";
export default {
  name: "wiki学科相关度",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      methodValue: "linksin",
      subjectLevel: "0",
      categorys: [
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Medicine",
        "Political science",
        "Psychology",
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
        "Environmental engineering"
      ],
      enginerringChildren: [
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering"
      ],
      methodOptions: [
        {
          value: "linksin",
          label: "linksin"
        },
        {
          value: "linksout",
          label: "linksout"
        }
      ],
      levelOptions: [
        {
          value: "0",
          label: "0 层"
        },
        {
          value: "1",
          label: "1 层"
        },
        {
          value: "2",
          label: " 2层"
        },
        {
          value: "5000",
          label: "top 5000 文章"
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
        this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances.join(","),
        method: this.methodValue,
        level: this.subjectLevel
      };
      getWikiData(opt)
        .then(res => {
          if (res.data.data) {
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
              let _data = params[i].data.toFixed(6);
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
          max: 1
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
      this.subjectRelevances = [];
    },
    selectChange() {
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
</style>
