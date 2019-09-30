<template>
  <div class="page-discipline">
    <div class="selectbox">
      <span>目标学科</span>
      <el-select v-model="subjectTarget" placeholder="请选择" multiple @change="subjectChange">
        <el-option
          v-for="item in categorysOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>level</span>
      <el-select v-model="subjectLevel" class="subjectLevel" placeholder="请选择">
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
import { getDistanceByFile } from '@/api/index'
export default {
  name: 'discipline',
  data () {
    return {
      subjectTarget: ['Cognitive science'],
      subjectLevel: '1',
      categorys: [
        'Cognitive science'
      ],
      levelOptions: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: 'mas',
          label: 'mas'
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
    },
    SubCategorysOptions: function () {
      let that = this
      let _data = that.enginerringChildren.map(item => {
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
      if (!this.subjectTarget) {
        this.$message.error('请选择完整')
        return false
      }
      this.loading = true
      let opt = {
        strA: this.subjectTarget.join(','),
        level: this.subjectLevel
      }
      getDistanceByFile(opt)
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
    },
    subjectChange () {
    //   this.subjectRelevances = []
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
  width: 1200px;
  margin: 0 auto;
  > .el-select {
    margin-right: 30px;
  }
}
.subjectRelevances {
  width: 300px;
}
.methodSelect {
  width: 100px;
}
.subjectLevel {
  width: 80px;
}
.echartsBox {
  width: 100%;
  min-width: 1200px;
  flex: 1;
}
</style>
