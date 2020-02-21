<template>
  <div class="page-discipline">
    <div class="selectbox">
      <div class="selectitem">
        <span>目标学科</span>
        <el-select
          v-model="subjectRelevances"
          class="selectsubjectmax"
          placeholder="请选择"
          @change="getData"
          collapse-tags
          multiple
        >
          <el-option
            v-for="item in categorysOptions"
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
import { getMasArticlesTotal } from "@/api/index";
export default {
  name: "mas文章数",
  data() {
    return {
      subjectRelevances: [],
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
        },
        {
          value: "mas",
          label: "mas"
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
        this.$message.error("请选择完整");
        return false;
      }
      this.loading = true;
      let opt = {
        subjects: this.subjectRelevances.join(",")
      };
      getMasArticlesTotal(opt)
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
      console.log(this.subjectRelevances);
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
              smooth: true,
              data: Object.values(data[key])
            });
          }
          return ret;
        })(data)
      };
      return _opt;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
</style>
