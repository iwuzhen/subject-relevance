<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='8')
      v-select(v-model='option.subject.select', :items='option.subject.opt', small-chips, multiple, deletable-chips, clearable, label='目标学科', @change='getData')
    v-col(cols='2')
      v-select(v-model='option.type.select', :items='option.type.opt', label='数据维度', @click='getData').
    v-col(cols='2')
      v-select(v-model='option.logBase.select', :items='option.logBase.opt', label='对数底数', @change='getData').
    v-col(cols='4')
      v-select(v-model='option.mode.select', :items='option.mode.opt', label='有向网络模型', @change='getData').

  v-row(v-for='chartid of myChartIds', :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container(:id='chartid', fluid, fill-height).

  v-row
    v-col
      comment(storagekey='CoreZipfByNodes_new_graph_2').

</template>

<script>

import wikipedia_struct_entropy_lv2_log2 from '@/assets/data/wikipedia_struct_entropy_lv2_log2.json'
import wikipedia_struct_entropy_lv3_log2 from '@/assets/data/wikipedia_struct_entropy_lv3_log2.json'
import wikipedia_struct_entropy_lv2_loge from '@/assets/data/wikipedia_struct_entropy_lv2_loge.json'
import wikipedia_struct_entropy_lv3_loge from '@/assets/data/wikipedia_struct_entropy_lv3_loge.json'

import { extendEchartsOpts, extendLineSeries } from '@/api/data'

import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

function formatNum(value) {
  if (!value && value !== 0) return 0

  const str = value.toString()
  const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}

export default {
  name: 'WikipediaEntropy',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wikipeda entropy',
      option: {
        mode: {
          select: 0,
          opt: [
            { text: '精简学术圈-lv2', value: 0 },
            { text: '精简学术圈-lv3', value: 1 }
          ]
        },
        subject: {
          select: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
            'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology'],
          opt: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
            'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology']
        },
        type: {
          select: 2,
          opt: [
            { text: 'linksin', value: 0 },
            { text: 'linksout', value: 1 },
            { text: '无向网络', value: 2 }
          ]
        },
        logBase: {
          select: '2',
          opt: ['2', 'e'] }
      },
      loading: false,
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4']
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    // 队列 初始化
    this.getData()
  },
  methods: {
    getData: _.debounce(async function() {
      if (this.option.subject.select.length < 1) {
        return false
      }
      this.loading = true
      // chart 1
      let networkData
      switch (true) {
        case (this.option.mode.select === 0 && this.option.logBase.select === '2'):
          networkData = wikipedia_struct_entropy_lv2_log2
          break
        case (this.option.mode.select === 0 && this.option.logBase.select === 'e'):
          networkData = wikipedia_struct_entropy_lv2_loge
          break
        case (this.option.mode.select === 1 && this.option.logBase.select === '2'):
          networkData = wikipedia_struct_entropy_lv3_log2
          break
        case (this.option.mode.select === 1 && this.option.logBase.select === 'e'):
          networkData = wikipedia_struct_entropy_lv3_loge
          break
        default:
          break
      }
      console.log('this.option.subject', this.option.subject.select)
      networkData['wikipedia'] = {
        all: [0.747, 0.751, 0.75, 0.751, 0.751, 0.751, 0.754, 0.751, 0.76, 0.762, 0.764, 0.766, 0.767, 0.766, 0.767, 0.767, 0.769, 0.774, 0.782, 0.783, 0.784, 0.785, 0.793, 0.793, 0.794, 0.794, 0.795, 0.795, 0.796, 0.797, 0.797, 0.796, 0.798, 0.798, 0.798, 0.795, 0.799, 0.799, 0.799, 0.799, 0.8, 0.8, 0.801, 0.801, 0.801, 0.801, 0.802, 0.802, 0.803, 0.803, 0.804, 0.804, 0.804, 0.805, 0.805, 0.806, 0.806, 0.806, 0.807, 0.807, 0.808, 0.778, 0.778, 0.778, 0.778, 0.778, 0.778],
        in: [0.562, 0.574, 0.566, 0.567, 0.567, 0.568, 0.572, 0.567, 0.585, 0.589, 0.592, 0.595, 0.597, 0.595, 0.595, 0.595, 0.598, 0.61, 0.626, 0.628, 0.63, 0.632, 0.651, 0.652, 0.652, 0.653, 0.654, 0.655, 0.657, 0.658, 0.659, 0.667, 0.661, 0.661, 0.662, 0.679, 0.663, 0.664, 0.664, 0.664, 0.665, 0.666, 0.667, 0.667, 0.668, 0.669, 0.67, 0.671, 0.672, 0.673, 0.674, 0.675, 0.676, 0.677, 0.678, 0.679, 0.679, 0.68, 0.681, 0.682, 0.683, 0.701, 0.702, 0.702, 0.703, 0.704, 0.704],
        out: [0.89, 0.888, 0.892, 0.893, 0.894, 0.894, 0.894, 0.893, 0.897, 0.897, 0.898, 0.899, 0.899, 0.9, 0.901, 0.901, 0.901, 0.902, 0.902, 0.902, 0.902, 0.902, 0.9, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.9, 0.901, 0.9, 0.9, 0.898, 0.9, 0.9, 0.901, 0.901, 0.901, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.899, 0.899, 0.899, 0.899, 0.899, 0.898, 0.898, 0.898, 0.898, 0.898, 0.886, 0.886, 0.886, 0.886, 0.886, 0.886]
      }
      console.log(networkData)
      const xData = []
      for (const year of _.range(2004, 2022, 1)) {
        for (const q of [1, 2, 3, 4]) {
          if (year === 2021 && q > 3) {
            continue
          }
          if (year === 2004 && q <= 3) {
            continue
          }
          xData.push(`${year}Q${q}`)
        }
      }

      const filter_data = []
      let filter_e_data = []
      let filter_dd_data = []
      let filter_nd_data = []
      for (const item of Object.entries(networkData)) {
        if (this.option.subject.select.indexOf(item[0]) < 0) {
          continue
        }
        // 网络密度
        filter_dd_data.push([
          item[0],
          item[1]['d_d']
        ])
        filter_nd_data.push([
          item[0],
          item[1]['d_n']
        ])
        // console.log(item)
        if (this.option.type.select === 0) {
        // 点数
          filter_data.push([
            item[0],
            item[1]['in']
          ])
          filter_e_data.push([
            item[0],
            item[1]['in_e']
          ])
        } else if (this.option.type.select === 1) {
        // 文章数
          filter_data.push([
            item[0],
            item[1]['out']
          ])
          filter_e_data.push([
            item[0],
            item[1]['out_e']
          ])
        } else if (this.option.type.select === 2) {
        // ln(N)/ln(k)
          filter_data.push([
            item[0],
            item[1]['all']
          ])
          filter_e_data.push([
            item[0],
            item[1]['all_e']
          ])
        }
      }
      console.log(filter_data, filter_e_data)
      filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

      filter_e_data = filter_e_data.filter(item => item[0] !== 'wikipedia')
      filter_dd_data = filter_dd_data.filter(item => item[0] !== 'wikipedia')
      filter_nd_data = filter_nd_data.filter(item => item[0] !== 'wikipedia')

      filter_e_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

      // 标准结构熵
      let _opt = extendEchartsOpts({
        title: {
          text: `底数${this.option.logBase.select}  标准结构熵`
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: 'Count',
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

      // 结构熵
      _opt = extendEchartsOpts({
        title: {
          text: `底数${this.option.logBase.select} 结构熵`
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: 'Count',
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          },
          min: function(value) {
            return Math.floor(value.min * 10) / 10
          }
        },
        series: filter_e_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      this.myChartObjs[1].setOption(_opt, true)

      // 有向网络密度
      _opt = extendEchartsOpts({
        title: {
          text: `有向网络密度`
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: 'Density',
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          },
          min: function(value) {
            return Math.floor(value.min * 10) / 10
          }
        },
        series: filter_dd_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      this.myChartObjs[2].setOption(_opt, true)

      // 无向网络密度
      _opt = extendEchartsOpts({
        title: {
          text: `无向网络密度`
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: 'Density',
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          },
          min: function(value) {
            return Math.floor(value.min * 10) / 10
          }
        },
        series: filter_nd_data.map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      this.myChartObjs[3].setOption(_opt, true)

      this.loading = false
    }, 2000)
  }
}
</script>

<style lang="less" scoped></style>
