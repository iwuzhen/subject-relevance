<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='8')
      v-select(v-model='option.subject.select', :items='option.subject.opt', small-chips, multiple, deletable-chips, clearable, label='目标学科', @change='getData').

    v-col(cols='2')
      v-select(v-model='option.type.select', :items='option.type.opt', label='世界类型', @click='getData').
    v-col(cols='2')
      v-select(v-model='option.level.select', :items='option.level.opt', label='层次', @change='getData').
    v-col(cols='2')
      v-select(v-model='option.year.select', :items='option.year.opt', label='幂律分布指定年', @change='switchYearMonth').
    v-col(cols='3')
      v-select(v-model='option.month.select', :items='option.month.opt', label='month', @change='switchYearMonth').

  v-row
    v-col(cols='11')
      v-range-slider.align-center(v-model='option.nodeRange', thumb-label='always', :max='30000', :min='1', dense, hide-details, label='求斜率范围', hint='求斜率范围', @change='getData')
        template(v-slot:prepend)
        template(v-slot:append)
  //- v-row
  //-   v-col(cols='11')
  //-     v-range-slider.align-center(v-model='yearRange', :max='2021',thumb-label='always', :min='2007', dense, hide-details, label='学科趋势年份范围', hint='学科趋势年份范围', @change='getData')
  //-       template(v-slot:prepend)
  //-       template(v-slot:append)
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
      comment(storagekey='CoreZipfByNodes_new_graph_2').

</template>

<script>
import { requestWrap } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'

import ecStat from 'echarts-stat'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'
import axios from 'axios'

const mergeQuotaData = (dataArray) => {
  const x = []
  const y = []
  // eslint-disable-next-line no-unused-vars
  for (const _ in dataArray[0].legend) {
    y.push([])
  }
  for (const j in dataArray[0].x) {
    for (const i of [1, 2, 3, 0]) {
      x.push(dataArray[i].x[j])
      for (const f in dataArray[0].legend) {
        y[f].push(dataArray[i].y[f][j])
      }
    }
  }
  const ret = Object.assign({}, dataArray[0])
  ret.x = x
  ret.y = y
  return ret
}

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
      option: {
        year: {
          select: 2020,
          opt: _.range(2004, 2022)
        },
        level: {
          select: 2,
          opt: [2, 3]
        },
        month: {
          select: 3,
          opt: [3, 6, 9, 12]
        },
        subject: {
          select: ['Biology', 'Physics', 'Chemistry', 'Political science', 'Computer science', 'Psychology', 'Sociology', 'Engineering disciplines', 'Environmental science', 'Geology', 'Materials science', 'Mathematics', 'Philosophy'],
          opt: ['Biology', 'Physics', 'Chemistry', 'Political science', 'Computer science', 'Psychology', 'Economics', 'Sociology', 'Engineering disciplines', 'Environmental science', 'Geography', 'Geology', 'Linguistics', 'Materials science', 'Mathematics', 'Medicine', 'Philosophy'].sort()

        },
        type: {
          select: 'zipf',
          opt: [
            {
              text: '世界幂律',
              value: 'zipf'
            },
            {
              text: '小世界幂律',
              value: 'innerzipf'
            },
            {
              text: '学术圈幂律',
              value: 'xueshu_zipf'
            }
          ]
        },
        nodeRange: [1, 10000],
        yearRange: [2004, 2021]
      },
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
    switchYearMonth: _.debounce(async function() {
      if (this.option.month.select === 3 && this.option.year.select === 2004) {
        this.option.month.select = 6
      }
      if (this.option.year.select === 2021) {
        this.option.month.select = 3
      }
      this.getData()
    }, 200),
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
      console.log(lines)
      for (const i in lines) {
        const myRegression = ecStat.regression(
          'linear',
          lines[i].slice(this.option.nodeRange[0], this.option.nodeRange[1])
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
    monthReq(opt, month) {
      const opt_ = Object.assign({}, opt)
      opt_.month = month
      return requestWrap('/wiki/getCoreZipfByNodes_newDB', 'POST', opt_)
    },
    getData: _.debounce(async function() {
      if (this.option.subject.select.length < 1) {
        return false
      }
      this.loading = true
      // chart 1
      let opt = {
        cats: this.option.subject.select.join(','),
        type: this.option.type.select,
        year: this.option.year.select,
        month: this.option.month.select,
        from_node: this.option.nodeRange[0],
        to_node: this.option.nodeRange[1],
        level: this.option.level.select
      }
      try {
        const res = await requestWrap('/wiki/getCoreZipfByNodes_newDB', 'POST', opt)
        if (res.data) {
          this.chartData = res.data
          this.chartOpt = this.setOptions_chart1(res.data)
          this.myChartObjs[0].setOption(this.chartOpt, true)
          this.calSlope()
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
        throw error
      }

      // chart 2,3
      opt = {
        cats: this.option.subject.select.join(','),
        type: this.option.type.select,
        year: '',
        from_node: this.option.nodeRange[0],
        to_node: this.option.nodeRange[1],
        level: this.option.level.select
      }
      // console.log(mergeQuotaData, axios)
      axios.all([this.monthReq(opt, 3), this.monthReq(opt, 6), this.monthReq(opt, 9), this.monthReq(opt, 12)]).then(ret => {
        let data = mergeQuotaData(ret.map(obj => obj.data))
        this.chartOpt = this.setOptions(data, 'power law')
        this.myChartObjs[1].setOption(this.chartOpt, true)

        data = mergeQuotaData(ret.map(obj => obj.data_node))
        console.log('allp:', data)
        this.chartOpt = this.setOptions(data, 'count')
        this.myChartObjs[2].setOption(this.chartOpt, true)
      }).catch(() => {
        this.$emit('emitMesage', '请求失败')
      }).finally(() => {
        this.loading = false
      })
    }, 2000),
    setOptions_chart1(data) {
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
    },
    setOptions(data, yname) {
      // 设置
      const seriesList = _.zip(data.legend, data.y).map(item => {
        return extendLineSeries({
          name: item[0],
          type: 'line',
          smooth: false,
          data: item[1]
        })
      })
      // 排序;
      seriesList.sort((x, y) => {
        return y.data.slice(-1)[0] - x.data.slice(-1)[0]
      })

      const _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: seriesList.map(item => {
            return item.name
          })
        },
        xAxis: {
          type: 'category',
          // max: xmax,
          name: 'date',
          data: data.x
        },
        yAxis: {
          type: 'value',
          // max: ymax,
          name: yname
        },
        series: seriesList
      })
      return _opt
    }
  }
}
</script>

<style lang="less" scoped></style>
