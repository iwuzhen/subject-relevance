<template>
  <div class="page-discipline">
    <div class="selectbox">
      <span>目标学科</span>
      <el-select v-model="subjectTarget" placeholder="请选择">
        <el-option
          v-for="item in categorysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>相关学科</span>
      <el-select v-model="subjectRelevances" multiple collapse-tags placeholder="请选择">
        <el-option
          v-for="item in categorysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>level</span>
      <el-select v-model="subjectLevel" placeholder="请选择">
        <el-option
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getData">确定</el-button>
    </div>
    <div class="echartsBox" id="subjectChart" v-loading="loading"></div>
  </div>
</template>

<script>
import { getData } from '@/api/index'
export default {
  name: 'discipline',
  data () {
    return {
      categorys: [
        'Artificial intelligence',
        'Philosophy',
        'Logic',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer science',
        'Psychology',
        'Linguistics',
        'Sociology',
        'History',
        'Economics',
        'Political science',
        'Engineering disciplines'
      ],
      subjectTarget: '',
      subjectRelevances: [],
      subjectLevel: '0',
      levelOptions: [
        {
          value: '0',
          label: '0'
        },
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        }
      ],
      loading: false
    }
  },
  computed: {
    categorysOptions: function () {
      return this.categorys.map(item => {
        return {
          value: item,
          label: item
        }
      })
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
        method: 'linksin',
        level: this.subjectLevel
      }
      let _data = await getData(opt)
      this.drawChart(_data.data.data)
    },
    drawChart (data) {
      let myChart = this.$echarts.init(document.getElementById('subjectChart'))
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
.page-discipline {
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
  > .el-select {
    margin-right: 30px;
  }
}
.echartsBox {
  width: 100%;
  flex: 1;
}
</style>
