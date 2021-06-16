<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='12')
      v-select(v-model='lineRange.select' :items='lineRange.option' label='范围选择' @change='getData' multiple small-chips deletable-chips clearable)
    v-col(cols='8')
      v-range-slider.align-center(v-model='years' :max='2020' :min='1950' dense='' hide-details='' hint='年份范围' @change='getData')
        template(v-slot:prepend='')
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='years[0]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 0, $event)')
        template(v-slot:append='')
          v-text-field.mt-0.pt-0(:value='years[1]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 1, $event)')
    v-col(cols='5')
      v-select(v-model='revLine.select' :items='revLine.option' label='相对参照系，分母' @change='getData' clearable)

  v-row(v-for='chartid of myChartIds' :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container(:id='chartid' fluid fill-height)
  v-row
    v-col
      comment(storagekey='Magdisruptionbyyear_graph_1')

</template>

<script>
import { requestGoV2Wrap } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

const lineData = {
  'all mag': {
    type: 'all'
  },
  'no linksin': {
    type: 'nolink'
  },
  'no linksout': {
    type: 'nout'
  },
  '-1 ~ 1': {
    'startD': -1,
    'endD': 1
  },
  '-0.4 ~ 0.4': {
    'startD': -0.4,
    'endD': 0.4
  },
  '-0.3 ~ 0.3': {
    'startD': -0.3,
    'endD': 0.3
  },
  '-0.2 ~ 0.2': {
    'startD': -0.2,
    'endD': 0.2
  },
  '-0.1 ~ 0.1': {
    'startD': -0.1,
    'endD': 0.1
  },
  '-0.01 ~ 0.01': {
    'startD': -0.01,
    'endD': 0.01
  },
  '-1 ~ -0.5': {
    'startD': -1,
    'endD': -0.5
  },
  '-1 ~ -0.1': {
    'startD': -1,
    'endD': -0.1
  },
  '-1 ~ -00.1': {
    'startD': -1,
    'endD': -0.01
  },
  '-1 ~ 0': {
    'startD': -1,
    'endD': 0
  },
  '0 ~ 1': {
    'startD': 0,
    'endD': 1
  },
  '0.0008 ~ 1': {
    'startD': 0.0008,
    'endD': 1
  },
  '0.01 ~ 1': {
    'startD': 0.01,
    'endD': 1
  },
  '0.1 ~ 1': {
    'startD': 0.1,
    'endD': 1
  },
  '0.5 ~ 1': {
    'startD': 0.5,
    'endD': 1
  }
}

export default {
  name: 'DisruptionTrendByYear',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MGA 颠覆度年度分布',
      lineRange: {
        option: Object.keys(lineData),
        select: ['all mag', '0.0008 ~ 1']
      },
      revLine: {
        option: Object.keys(lineData),
        select: null
      },
      years: [1950, 2020],
      loading: false,
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3']
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.getData()
  },
  methods: {

    getData: _.debounce(async function() {
      if (this.lineRange.select.length < 1) {
        return false
      }
      this.loading = true

      const line_data = []
      const startYear = 1950
      const endYear = 2020
      const year_range = _.range(this.years[0], this.years[1] + 1)

      let revRow = []
      for (const key of this.lineRange.select) {
        const opt = {
          'startYear': startYear,
          'endYear': endYear
        }
        Object.assign(opt, lineData[key])
        try {
          const res = await requestGoV2Wrap('/apigo/v2/mag/disruption_trend_by_year', 'POST', opt)
          line_data.push([key, res.data])

          if (this.revLine.select === key) {
            revRow = res.data
          }
        } catch (error) {
          console.log(error)
        }
      }
      line_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

      let _opt = extendEchartsOpts({
        title: {
          text: `dx 分布`
        },
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
              if (y.data === undefined) { return -1 }
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].data[0]}<br>`
            for (let i = 0; i < params.length; i++) {
              if (params[i].data === undefined) {
                continue
              }
              const _text = params[i].seriesName
              const _data = params[i].data[1]
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        legend: {
          data: line_data.map(item => item[0])
        },
        xAxis: {
          name: 'Year',
          type: 'value',
          boundaryGap: false,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          name: revRow.length === 0 ? 'count' : 'percent',
          type: 'value'
        },
        series: line_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: year_range.map((year, index) => [year, revRow.length === 0 ? item[1][index] : item[1][index] / revRow[index]])
          })
        })

      })
      console.log(_opt)
      this.myChartObjs[0].setOption(_opt, true)

      // 计算 ddx
      const ddx_line_data = []
      let revDdxRow = []
      for (const row of line_data) {
        const ddx = [0]
        let last = 0
        for (const v of row[1]) {
          ddx.push(v - last)
          last = v
        }
        ddx_line_data.push([row[0], ddx])

        if (this.revLine.select === row[0]) {
          revDdxRow = ddx
        }
      }

      ddx_line_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

      _opt = extendEchartsOpts({
        title: {
          text: `ddx 分布`
        },
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
              if (y.data === undefined) { return -1 }
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].data[0]}<br>`
            for (let i = 0; i < params.length; i++) {
              if (params[i].data === undefined) {
                continue
              }
              const _text = params[i].seriesName
              const _data = params[i].data[1]
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        legend: {
          data: ddx_line_data.map(item => item[0])
        },
        xAxis: {
          name: 'Year',
          type: 'value',
          boundaryGap: false,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          name: revDdxRow.length === 0 ? 'count' : 'percent',
          type: 'value'
        },
        series: ddx_line_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: year_range.map((year, index) => [year, revDdxRow.length === 0 ? item[1][index] : item[1][index] / revDdxRow[index]])
          })
        })

      })
      console.log(_opt)
      this.myChartObjs[1].setOption(_opt, true)

      // 总量
      const sum_line_data = []
      revDdxRow = []
      for (const row of line_data) {
        const ddx = []
        let last = 0
        for (const v of row[1]) {
          ddx.push(v + last)
          last += v
        }
        sum_line_data.push([row[0], ddx])

        if (this.revLine.select === row[0]) {
          revDdxRow = ddx
        }
      }

      sum_line_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))
      _opt = extendEchartsOpts({
        title: {
          text: `总量 分布`
        },
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
              if (y.data === undefined) { return -1 }
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].data[0]}<br>`
            for (let i = 0; i < params.length; i++) {
              if (params[i].data === undefined) {
                continue
              }
              const _text = params[i].seriesName
              const _data = params[i].data[1]
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        legend: {
          data: sum_line_data.map(item => item[0])
        },
        xAxis: {
          name: 'Year',
          type: 'value',
          boundaryGap: false,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          name: revDdxRow.length === 0 ? 'count' : 'percent',
          type: 'value'
        },
        series: sum_line_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: year_range.map((year, index) => [year, revDdxRow.length === 0 ? item[1][index] : item[1][index] / revDdxRow[index]])
          })
        })

      })
      console.log(_opt)
      this.myChartObjs[2].setOption(_opt, true)

      this.loading = false
    }, 2000)

  }
}
</script>

<style lang="less" scoped></style>
