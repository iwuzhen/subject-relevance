<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='8')
      v-select(v-model='subjectSelect', :items='subjectOpt', small-chips, multiple, deletable-chips, clearable, label='目标学科', @click='getData').

    v-col(cols='2')
      v-select(v-model='typeSelect', :items='typeOpt', label='世界类型', @click='getData').
    v-col(cols='2')
      v-select(v-model='level', :items='levelOpt', label='层次', @click='getData').
    v-col(cols='2')
      v-select(v-model='yearSelect', :items='yearOpt', label='幂律分布指定年', @click='getData').
    v-col(cols='3')
      v-select(v-model='versionSelect', :items='versionOpt', label='version', @click='getData').

  v-row
    v-col(cols='11')
      v-range-slider.align-center(v-model='nodeRange', thumb-label='always', :max='100000', :min='1', dense, hide-details, label='求斜率范围', hint='求斜率范围', @change='getData')
        template(v-slot:prepend)
        template(v-slot:append)
  v-row
    v-col(cols='11')
      v-range-slider.align-center(v-model='yearRange', :max='2021',thumb-label='always', :min='2007', dense, hide-details, label='学科趋势年份范围', hint='学科趋势年份范围', @change='getData')
        template(v-slot:prepend)
        template(v-slot:append)
  v-row
    v-col(col='12')
      v-card
        v-data-table.elevation-1(:headers='girdHeaders', hide-default-footer, :items='gridData').

  v-row(v-for='chartid of myChartIds', :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container(:id='chartid', fluid, fill-height).

  v-row
    v-col
      comment(storagekey='CoreZipfByNodes_new_graph_1').

</template>

<script>
import { requestWrap } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import ecStat from 'echarts-stat'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'
const subjectsV5 = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
  'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
  'Literature', 'History', 'Materials science', 'Engineering disciplines', 'Environmental science',
  'Medicine']
// tooyip 位置的x位置
var tipLegend = 0
export default {
  name: 'MAV2',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '幂律及其随时间变化趋势',
      girdHeaders: [],
      yearSelect: 2021,
      yearOpt: [2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      level: 4,
      levelOpt: [3, 4],
      nodeRange: [1, 1000],
      yearRange: [2007, 2021],
      typeSelect: 'innerzipf',
      typeOpt: [{ text: '世界', value: 'zipf' }, { text: '小世界', value: 'innerzipf' }],
      subjectSelect: subjectsV5,
      subjectOpt: subjectsV5,
      versionSelect: 'v5',
      versionOpt: [{
        text: 'v5',
        value: 'v5'
      }, {
        text: '学术 v5',
        value: 'xueshu_v5'
      }, {
        text: '学术 v5 去文学历史',
        value: 'xueshu_noHistoryAndLiterature_v5'
      }],
      loading: false,
      chartOpt: {},
      chartData: {},
      gridData: [],
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3']
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    // 队列 初始化
    this.myChartObjs[0].getZr().on('click', params => {
      var pointInPixel = [params.offsetX, params.offsetY]

      if (this.myChartObjs[0].containPixel('grid', pointInPixel)) {
        // var xIndex = this.myChartObjs[0].convertFromPixel({ seriesIndex: 0 }, [
        //   params.offsetX,
        //   params.offsetY
        // ])[0];
        // console.log(xIndex);
        const series = []
        for (const ix in this.chartOpt.legend.data) {
          series[
            tipLegend.indexOf(this.chartOpt.legend.data[ix])
          ] = this.chartOpt.series[ix]
        }
        this.chartOpt.legend.data = tipLegend
        this.chartOpt.series = series
        this.myChartObjs[0].setOption(this.chartOpt, true)
      }
    })
    this.getData()
  },
  methods: {
    // 计算斜率
    calSlope() {
      const lines = []
      for (const row of this.chartData.y) {
        const line = []
        for (const i in this.chartData.x) {
          line.push([this.chartData.x[i], row[i]])
        }
        lines.push(line)
      }
      const retData = { name: '斜率' }
      const retHeader = [
        {
          text: '学科',
          align: 'start',
          value: 'name'
        }
      ]
      for (const i in lines) {
        const myRegression = ecStat.regression(
          'linear',
          lines[i].slice(this.nodeRange[0], this.nodeRange[1])
        )

        retData[
          this.chartData.legend[i]
        ] = myRegression.parameter.gradient.toFixed(4)
        retHeader.push({
          text: this.chartData.legend[i],
          value: this.chartData.legend[i]
        })
      }
      this.gridData = [retData]
      this.girdHeaders = retHeader
    },
    getData: _.debounce(async function() {
      if (this.subjectSelect.length < 1) {
        return false
      }
      this.loading = true

      // chart 1
      let opt = {
        cats: this.subjectSelect.join(','),
        type: this.typeSelect,
        year: this.yearSelect,
        from_node: this.nodeRange[0],
        to_node: this.nodeRange[1],
        version: this.versionSelect,
        level: this.level
      }
      try {
        const res = await requestWrap('/wiki/getCoreZipfByNodes_new', 'POST', opt)
        if (res.data) {
          this.chartData = res.data
          this.chartOpt = this.setOptions(res.data)
          this.myChartObjs[0].setOption(this.chartOpt, true)
          this.calSlope()
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      // chart 2,3
      opt = {
        cats: this.subjectSelect.join(','),
        type: this.typeSelect,
        from_node: this.nodeRange[0],
        to_node: this.nodeRange[1],
        from: this.yearRange[0],
        to: this.yearRange[1],
        version: this.versionSelect,
        level: this.level
      }
      try {
        const res = await requestWrap('/wiki/getCoreZipfByNodes_new', 'POST', opt)
        if (res.data) {
          const data = res.data
          const _opt = extendEchartsOpts({
            title: {
              text: data.title
            },
            legend: {
              data: data.legend
            },
            xAxis: {
              name: 'Year',
              type: 'category',
              boundaryGap: false,
              data: data.x
            },
            yAxis: {
              name: 'power law',
              type: 'value'
            },
            series: data.y.map((item, index) => {
              return extendLineSeries({
                name: data.legend[index],
                type: 'line',
                smooth: false,
                data: item
              })
            })
          })
          this.myChartObjs[1].setOption(_opt, true)
        }
        if (res.data_node) {
          const data = res.data_node
          const _opt = extendEchartsOpts({
            title: {
              text: data.title
            },
            legend: {
              data: data.legend
            },
            xAxis: {
              name: 'Year',
              type: 'category',
              boundaryGap: false,
              data: data.x
            },
            yAxis: {
              name: 'Count',
              type: 'value'
            },
            series: data.y.map((item, index) => {
              return extendLineSeries({
                name: data.legend[index],
                type: 'line',
                smooth: false,
                data: item
              })
            })
          })
          this.myChartObjs[2].setOption(_opt, true)
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      this.loading = false
    }, 2000),
    setOptions(data) {
      // let ymax = Math.max(...[].concat(...data.y));
      // ymax = Math.ceil(ymax * 10) / 10;
      let xmax = Math.max(...data.x)
      xmax = Math.ceil(xmax * 10) / 10
      // 设置
      const seriesList = []
      for (let i = 0; i < data.y.length; i++) {
        const dataItem = []
        for (let j = 0; j < data.y[i].length; j++) {
          dataItem.push([data.x[j], data.y[i][j]])
        }
        seriesList.push({
          name: data.legend[i],
          type: 'scatter',
          symbolSize: 5,
          large: true,
          data: dataItem
        })
      } // 排序;
      seriesList.sort((x, y) => {
        // console.log(y.data.slice(-1)[0][1], x.data.slice(-1)[0][1]);
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1]
      })

      const _opt = extendEchartsOpts({
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          },
          axisPointer: {
            type: 'cross',
            animation: true,
            label: {
              backgroundColor: '#505765'
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              return y.data[1] - x.data[1]
            })
            let showHtm = ` x: ${params[0].data[0]},<br>`
            for (let i = 0; i < params.length; i++) {
              const _text = params[i].seriesName
              const _data = params[i].data
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data[1]} <br>`
            }
            tipLegend = params.map(item => item.seriesName)
            return showHtm
          }
        },
        title: {
          text: data.title
        },
        legend: {
          data: seriesList.map(item => {
            return item.name
          })
        },
        xAxis: {
          type: 'value',
          max: xmax,
          name: 'log (rank)'
        },
        yAxis: {
          type: 'value',
          // max: ymax,
          name: 'log (citation)'
        },
        series: seriesList
      })
      return _opt
    }
  }
}
</script>

<style lang="less" scoped></style>
