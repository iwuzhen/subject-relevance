<template lang="pug">
v-container(fluid)
  v-row
    v-col(v-for='(item,index) in select' :key='index' :cols='item.cols')
      v-select(v-if='item.show!==false' v-model='options[item.name]' :items='item.items' :multiple='item.multiple' :deletable-chips='item.multiple' :clearable='item.multiple' :dense='item.multiple' :chips='item.multiple' :label='item.label' @change='dynamicChange(item.func)')

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' :height='chartHeight')
        v-container#subjectChart(fluid fill-height)
  v-row
    v-col
      comment(storagekey="wikipedia_smallworld_Chart_2021_1")
  .text-center
    v-dialog(v-model='dialog.state' width='80vw')
      v-card
        v-card-title.text-h5.grey.lighten-2
          | {{dialog.title}}
          v-spacer
          v-btn(@click='biliState = !biliState,initDigloChart()')
            | {{biliState?'显示数量':'显示比例'}}

        v-card.mx-auto(outlined :height='chartHeight')
          v-container#dialogChart(fluid fill-height)
</template>

<script>
import wikipedia_direct_xueshu_lv2 from '@/assets/data/wikipedia_direct_xueshu_lv2.json'
import wikipedia_direct_xueshu_lv3 from '@/assets/data/wikipedia_direct_xueshu_lv3.json'
import wikipedia_direct_subject_lv2 from '@/assets/data/wikipedia_direct_subject_lv2.json'
import wikipedia_direct_subject_lv3 from '@/assets/data/wikipedia_direct_subject_lv3.json'
import wikipedia_direct_subject_lv2_connect from '@/assets/data/wikipedia_direct_subject_lv2_connect.json'
import wikipedia_direct_subject_lv3_connect from '@/assets/data/wikipedia_direct_subject_lv3_connect.json'
import wikipedia_direct_xueshu_lv2_connect from '@/assets/data/wikipedia_direct_xueshu_lv2_connect.json'
import wikipedia_direct_xueshu_lv3_connect from '@/assets/data/wikipedia_direct_xueshu_lv3_connect.json'

import wikipeida_direct_xueshu_lv2_connect_v20211110 from '@/assets/data/wikipeida_direct_xueshu_lv2_connect_v20211110.json'
import wikipeida_direct_xueshu_lv2_v20211110 from '@/assets/data/wikipeida_direct_xueshu_lv2_v20211110.json'
import wikipeida_direct_xueshu_lv3_connect_v20211110 from '@/assets/data/wikipeida_direct_xueshu_lv3_connect_v20211110.json'
import wikipeida_direct_xueshu_lv3_v20211110 from '@/assets/data/wikipeida_direct_xueshu_lv3_v20211110.json'

import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import comment from '@/components/comment'
import Base from '@/utils/base'
import _ from 'lodash'

function formatNum(value) {
  if (!value && value !== 0) return 0

  const str = value.toString()
  const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}

function formatNumE(value) {
  var res = value.toString()
  var numN1 = 0
  var numN2 = 1
  var num1 = 0
  var num2 = 0
  var t1 = 1
  for (var k = 0; k < res.length; k++) {
    if (res[k] === '.') { t1 = 0 }
    if (t1) { num1++ } else { num2++ }
  }

  if (Math.abs(value) < 1 && res.length > 4) {
    for (var i = 2; i < res.length; i++) {
      if (res[i] === '0') {
        numN2++
      } else if (res[i] === '.') { continue } else { break }
    }
    var v = parseFloat(value)
    v = v * Math.pow(10, numN2)
    return v.toString() + 'e-' + numN2
  } else if (num1 > 4) {
    if (res[0] === '-') { numN1 = num1 - 2 } else { numN1 = num1 - 1 }
    v = parseFloat(value)
    v = v / Math.pow(10, numN1)
    if (num2 > 4) { v = v.toFixed(4) }
    return v.toString() + 'e' + numN1
  } else { return parseFloat(value) }
}

export default {
  name: 'Magbubbles',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wiki 学科小世界',
      myChartIds: ['subjectChart'],
      loading: false,
      biliState: false,
      options: {},
      paramscache: {},
      filter_data: {},
      dialog: {
        state: false,
        title: 'my title'
      },
      chartHeight: '70vh',
      select: [
        {
          name: 'type',
          default: 0,
          label: '数据维度',
          multiple: false,
          show: true,
          cols: 2,
          items: [
            { text: '点数', value: 0 },
            { text: '边数', value: 1 },
            { text: '文章数', value: 2 },
            { text: '平均度', value: 3 },
            { text: '平均最短距离', value: 4 },
            { text: '距离中位数', value: 5 },
            { text: '距离最大数', value: 6 },
            { text: '90%有效直径', value: 8 },
            { text: 'ln(N)/ln(k)', value: 7 },
            { text: '边密度', value: 9 }
          ]
        },
        {
          name: 'model',
          default: 0,
          label: '有向网络模型',
          multiple: false,
          show: true,
          cols: 3,
          items: [
            { text: '学术圈-调和网络-lv2', value: 0 },
            { text: '学术圈-调和网络-lv3', value: 1 },
            { text: '单学科-调和网络-lv2', value: 2 },
            { text: '单学科-调和网络-lv3', value: 3 },
            { text: '学术圈-联通网络-lv2', value: 4 },
            { text: '学术圈-联通网络-lv3', value: 5 },
            { text: '单学科-联通网络-lv2', value: 6 },
            { text: '单学科-联通网络-lv3', value: 7 },
            { text: '精简学术圈-调和网络-lv2', value: 8 },
            { text: '精简学术圈-调和网络-lv3', value: 9 },
            { text: '精简学术圈-联通网络-lv2', value: 10 },
            { text: '精简学术圈-联通网络-lv3', value: 11 }
          ]
        }
      ]
    }
  },
  mounted() {
    for (const row of this.select) {
      this.options[row.name] = row.default
    }
    this.getData()
    this.myChartObjs[0].on('click', params => {
      // if (params.targetType === 'axisLabel') {
      this.dialog.state = true
      this.paramscache = params
      setTimeout(this.initDigloChart, 500)
    })
  },
  methods: {
    async initDigloChart() {
      const params = this.paramscache
      const dialogChart = this.$echarts.init(document.getElementById('dialogChart'))
      let data = this.filter_data[params.seriesIndex][2][params.dataIndex]
      let ytype = 'log'
      let b = '数量'
      if (this.biliState) {
        b = '比例'
        let sum = 0
        for (const item of data) {
          sum += item
        }
        const cacheData = []
        for (const item of data) {
          cacheData.push((item / sum).toFixed(3))
        }
        data = cacheData
        console.log(data)
        ytype = 'value'
      }

      this.dialog.title = `${params.name} ${this.filter_data[params.seriesIndex][0]} ${b} 分布`
      const option = {
        backgroundColor: 'rgba(255,255,255,.3)',
        xAxis: [
          {

            type: 'category',
            data: _.range(0, data.length)
          }
        ],
        yAxis:
          {
            type: ytype,
            axisLabel: {
              formatter: formatNumE
            }
          },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  rotate: 90,
                  position: 'insideBottom',
                  align: 'left',
                  verticalAlign: 'middle',
                  formatter: obj => {
                    return formatNum(obj.data)
                  }
                }
              }
            },
            data: data
          }
        ]
      }
      console.log(option)
      dialogChart.setOption(option, true)
    },
    dynamicChange(func) {
      if (func) {
        func(this)
      } else {
        this.getData()
      }
    },
    getData: _.debounce(async function() {
      this.loading = true
      // 参数处理
      const params = {}
      for (const row of this.select) {
        if (!row.multiple) {
          params[row.name] = this.options[row.name]
        } else {
          params[row.name] = this.options[row.name].join(',')
        }
      }

      const getmiddle = (dataList) => {
        let sum = 0
        for (const i in dataList) {
          sum += dataList[i]
        }
        sum = sum / 2
        let sum_cache = 0
        for (const i in dataList) {
          sum_cache += dataList[i]
          if (sum_cache > sum) {
            return i
          }
        }
        return null
      }
      let networkData
      switch (params.model) {
        case 0:
          networkData = wikipedia_direct_xueshu_lv2
          break
        case 1:
          networkData = wikipedia_direct_xueshu_lv3
          break
        case 2:
          networkData = wikipedia_direct_subject_lv2
          break
        case 3:
          networkData = wikipedia_direct_subject_lv3
          break
        case 4:
          networkData = wikipedia_direct_xueshu_lv2_connect
          break
        case 5:
          networkData = wikipedia_direct_xueshu_lv3_connect
          break
        case 6:
          networkData = wikipedia_direct_subject_lv2_connect
          break
        case 7:
          networkData = wikipedia_direct_subject_lv3_connect
          break
        case 8:
          networkData = wikipeida_direct_xueshu_lv2_v20211110
          break
        case 9:
          networkData = wikipeida_direct_xueshu_lv3_v20211110
          break
        case 10:
          networkData = wikipeida_direct_xueshu_lv2_connect_v20211110
          break
        case 11:
          networkData = wikipeida_direct_xueshu_lv3_connect_v20211110
          break
        default:
          break
      }
      const xData = []
      for (const year of _.range(2004, 2022, 1)) {
        for (const q of [1, 2, 3, 4]) {
          if (year === 2021 && q > 1) {
            continue
          }
          if (year === 2004 && q < 2) {
            continue
          }
          xData.push(`${year}Q${q}`)
        }
      }
      const vName = ''

      const filter_data = []
      for (const item of Object.entries(networkData)) {
      // console.log(item)
        if (params.type === 0) {
        // 点数
          filter_data.push([
            item[0],
            item[1]['gs'],
            item[1]['ct']
          ])
        } else if (params.type === 2) {
        // 文章数
          filter_data.push([
            item[0],
            item[1]['ss'],
            item[1]['ct']
          ])
        } else if (params.type === 7) {
        // ln(N)/ln(k)
          filter_data.push([
            item[0],
            item[1]['ct'].map((e, index) => {
              if (e && e.length > 2 && e[1] !== item[1]['gs'][index] && item[1]['gs'][index] > 0) {
                return (Math.log(item[1]['gs'][index]) / Math.log(e[1] / item[1]['gs'][index])).toFixed(4)
              } else {
                return null
              }
            }),
            item[1]['ct']
          ])
        } else if (params.type === 6) {
        // 距离最大数
          filter_data.push([
            item[0],
            item[1]['ct'] ? item[1]['ct'].map(e => { if (e && e.length > 0) return e.length - 1 }) : null,
            item[1]['ct']
          ])
        } else if (params.type === 8) {
          // 90% 有效直径
          filter_data.push([
            item[0],
            item[1]['ct'] ? item[1]['ct'].map(e => {
              if (e && e.length > 0) {
                // 计算总数
                let sum = 0
                for (const i in e) {
                  sum += e[i]
                }
                let cache = 0
                for (const i in e) {
                  cache += e[i]
                  if (cache > 0.9 * sum) {
                    return i - 1
                  }
                }
                return e.length - 1
              }
            }) : null,
            item[1]['ct']
          ])
        } else if (params.type === 5) {
        // 距离中位数
          filter_data.push([
            item[0],
            item[1]['ct'] ? item[1]['ct'].map(e => getmiddle(e)) : null,
            item[1]['ct']
          ])
        } else if (params.type === 4) {
        // 平均最短距离
          filter_data.push([
            item[0],
            item[1]['ad'],
            item[1]['ct']
          ])
        } else if (params.type === 3) {
        // 平均度
          filter_data.push([
            item[0],
            item[1]['ct'].map((e, index) => {
              if (e && e.length > 2) return e[1] / item[1]['gs'][index]
              else { return null }
            }),
            item[1]['ct']
          ])
        } else if (params.type === 1) {
        // 边数
          filter_data.push([
            item[0],
            item[1]['ct'].map(e => {
              if (e && e.length > 2) return e[1]
              else { return null }
            }),
            item[1]['ct']
          ])
        } else if (params.type === 9) {
        // 边密度
          filter_data.push([
            item[0],
            item[1]['ct'].map((e, index) => {
              if (e && e.length > 2) return e[1] / (item[1]['gs'][index] * (item[1]['gs'][index] - 1))
              else { return null }
            }),
            item[1]['ct']
          ])
          console.log(filter_data)
        }
      }
      filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))
      this.filter_data = filter_data
      const _opt = extendEchartsOpts({
        title: {
          text: '小世界属性'
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: vName,
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          },
          min: function(value) {
            return Math.floor(value.min * 10) / 10
          }
        },
        series: filter_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      console.log(_opt)
      this.myChartObjs[0].setOption(_opt, true)
      this.loading = false
    }, 1000)
  }
}
</script>
