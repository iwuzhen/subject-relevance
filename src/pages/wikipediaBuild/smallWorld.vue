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
      options: {},
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
            { text: 'ln(N)/ln(k)', value: 7 }
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
            { text: '单学科-联通网络-lv3', value: 7 }
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
  },
  methods: {
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
            item[1]['gs']
          ])
        } else if (params.type === 2) {
        // 文章数
          filter_data.push([
            item[0],
            item[1]['ss']
          ])
        } else if (params.type === 7) {
        // ln(N)/ln(k)
          filter_data.push([
            item[0],
            item[1]['ct'].map((e, index) => {
              if (e.length > 2 && e[1] !== item[1]['gs'][index] && item[1]['gs'][index] > 0) {
                return (Math.log(item[1]['gs'][index]) / Math.log(e[1] / item[1]['gs'][index])).toFixed(4)
              } else {
                return null
              }
            })
          ])
        } else if (params.type === 6) {
        // 距离最大数
          filter_data.push([
            item[0],
            item[1]['ct'].map(e => { if (e.length > 0) return e.length - 1 })
          ])
        } else if (params.type === 5) {
        // 距离中位数
          filter_data.push([
            item[0],
            item[1]['ct'].map(e => getmiddle(e))
          ])
        } else if (params.type === 4) {
        // 平均最短距离
          filter_data.push([
            item[0],
            item[1]['ad']
          ])
        } else if (params.type === 3) {
        // 平均度
          filter_data.push([
            item[0],
            item[1]['ct'].map((e, index) => {
              if (e.length > 2) return e[1] / item[1]['gs'][index]
              else { return null }
            })
          ])
        } else if (params.type === 1) {
        // 边数
          filter_data.push([
            item[0],
            item[1]['ct'].map(e => {
              if (e.length > 2) return e[1]
              else { return null }
            })
          ])
        }
      }
      console.log(filter_data)
      filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

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
      this.myChartObjs[0].setOption(_opt, true)
      this.loading = false
    }, 1000)
  }
}
</script>
