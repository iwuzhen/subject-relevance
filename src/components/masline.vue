<template>
  <div class="page-masline">
    <div class="selectbox">
      <el-row type="flex">
        <span class="title">目标学科</span>
        <el-select v-model="subjectTarget" placeholder="请选择">
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="title">相关学科</span>
        <el-select
          v-model="subjectRelevances"
          class="subjectRelevances"
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in categorysOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="title">条件</span>
        <el-select v-model="methodValue" placeholder="请选择">
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
      <el-row type="flex">
        <span class="title">年份范围</span>
        <el-slider v-model="years" range :min="1950" :max="2019"></el-slider>
        <el-button type="primary" @click="getData">确定</el-button>
      </el-row>
    </div>
    <div class="echartsBox" id="masChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getData } from '@/api/index'
export default {
  name: 'discipline',
  data () {
    return {
      subjectTarget: '',
      subjectRelevances: [],
      methodValue: 'linksin',
      years: [1950, 2019],
      categorys: [
        'biology',
        'chemistry',
        'computer science',
        'economics',
        'history',
        'linguistics',
        'literature',
        'logic',
        'mathematics',
        'philosophy',
        'physics',
        'political science',
        'psychology',
        'sociology'
      ],
      methodOptions: [
        {
          value: 'linksin',
          label: 'linksin'
        },
        {
          value: 'linksout',
          label: 'linksout'
        }
      ],
      loading: false
    }
  },
  computed: {
    categorysOptions: function () {
      let that = this
      let _data = that.categorys.map(item => {
        return {
          value: item,
          label: item
        }
      })
      return _data
    }
  },
  methods: {
    async getData () {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        this.$message.error('请选择完整')
        return false
      }
      this.loading = true
      let opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances.join(','),
        method: this.methodValue,
        from: this.years[0],
        to: this.years[1]
      }
      getData(opt)
        .then(res => {
          if (res.data.data) {
            this.drawChart(res.data.data)
          } else {
            this.loading = false
            this.$message.error('请求失败')
            return false
          }
        })
        .catch(rej => {
          this.loading = false
          this.$message.error('请求失败')
        })
    },
    drawChart (data) {
      let myChart = this.$echarts.init(document.getElementById('masChart'))
      let options = this.setOptions(data)
      myChart.setOption(options, true)
      this.loading = false
    },
    setOptions (data) {
      let _opt = {
        title: {
          text: data.title,
          left: '10%'
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          },
          formatter: function (params) {
            let showHtm = ` ${params[0].name}<br>`
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName
              let _data = params[i].data.toFixed(6)
              let _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        legend: {
          data: data.legend,
          right: '5%',
          top: '10%',
          orient: 'vertical'
        },
        grid: {
          left: '8%',
          right: '20%',
          bottom: '5%',
          containLabel: true
        },
        toolbox: {
          right: '20%',
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: 'value',
          max: 1
        },
        series: data.y.map((item, index) => {
          return {
            name: data.legend[index],
            type: 'line',
            smooth: true,
            data: item
          }
        })
      }
      return _opt
    }
  }
}
</script>

<style lang="less" scoped>
.page-masline {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 40px;
  box-sizing: border-box;
}
.selectbox {
  padding: 20px 0;
  width: 1200px;
  margin: 0 auto;
  > .el-row {
    & + .el-row {
      margin-top: 10px;
    }
  }
  .title {
    display: block;
    line-height: 40px;
    margin-right: 5px;
  }
  .el-select {
    margin-right: 30px;
  }
  .el-slider {
    width: 875px;
    margin-left: 15px;
    margin-right: 50px;
  }
}
.subjectRelevances {
  width: 300px;
}
.echartsBox {
  width: 100%;
  min-width: 1200px;
  flex: 1;
}
</style>
