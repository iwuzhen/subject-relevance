<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectRelevances"
          class="selectsubjectmax"
          placeholder="请选择"
          collapse-tags
          multiple
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
        <span>是否统计子类数目</span>
        <el-select
          v-model="subjecType"
          @change="subjectChange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in typeOptions"
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
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getArticlesTotal } from "@/api/index";
export default {
  name: "ArticleTotal",
  data() {
    return {
      subjectRelevances: [],
      subjectLevel: "0",
      subjecType: "0",
      categorys: [
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
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
      typeOptions: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      levelOptions: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
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
      if (this.subjectRelevances.length === 0) {
        // this.$message.error("请选择完整");
        return false;
      }
      if (this.subjectLevel === "0" && this.subjecType === "1") {
        this.$message.error("0 层没有子类");
        return false;
      }
      this.loading = true;
      let opt = {
        subjects: this.subjectRelevances.join(","),
        level: this.subjectLevel,
        type: this.subjecType
      };
      getArticlesTotal(opt)
        .then(res => {
          if (res.data) {
            this.drawChart(res.data);
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
      let years = Object.keys(data[this.subjectRelevances[0]]);
      let _opt = {
        title: {
          text: "学科 article 数量",
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
              let _data = params[i].data;
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: Object.keys(data),
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
          data: years
        },
        yAxis: {
          type: "value",
          max: (data => {
            let max = 100;
            for (let key in data) {
              max = Math.max(
                max,
                Math.max.apply(null, Object.values(data[key]))
              );
            }
            return Math.ceil(max / 100) * 100;
          })(data)
        },
        series: (data => {
          let ret = [];
          for (let key in data) {
            ret.push({
              name: key,
              type: "line",
              smooth: false,
              data: Object.values(data[key])
            });
          }
          return ret;
        })(data)
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
  width: 100px;
}
.subjectLevel {
  width: 80px;
}
</style>
