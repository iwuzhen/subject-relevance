<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='8')
      v-select(v-model='option.subject.select', :items='option.subject.opt', small-chips, multiple, deletable-chips, clearable, label='目标学科', @change='getData')
    v-col(cols='2')
      v-select(v-model='option.type.select', :items='option.type.opt', label='数据维度', @click='getData').
    v-col(cols='4')
      v-select(v-model='option.mode.select', :items='option.mode.opt', label='有向网络模型', @change='getData').

  v-row(v-for='chartid of myChartIds', :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container(:id='chartid', fluid, fill-height).

  v-row
    v-col
      comment(storagekey='wiki_network_entropy_chart_1').

</template>

<script>

import { extendEchartsOpts, extendLineSeries } from '@/api/data'

import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

import wikipedia_network_entropy_lv2_log2 from '@/assets/data/wikipedia_network_entropy_lv2_log2.json'
import wikipedia_network_entropy_lv3_log2 from '@/assets/data/wikipedia_network_entropy_lv3_log2.json'

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
        }
      },
      loading: false,
      myChartIds: ['subjectChart1']
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
        case (this.option.mode.select === 0):
          networkData = wikipedia_network_entropy_lv2_log2
          break
        case (this.option.mode.select === 1):
          networkData = wikipedia_network_entropy_lv3_log2
          break
        default:
          break
      }
      console.log('this.option.subject', this.option.subject.select)
      networkData['wikipedia'] = {
        'o': [4.8513, 4.9514, 5.0222, 5.1467, 5.1999, 5.252, 5.2917, 5.3185, 5.1999, 5.3696, 5.3871, 5.4169, 5.4471, 5.4709, 5.4739, 5.4983, 5.5022, 5.5106, 5.4764, 5.446, 5.4446, 5.4554, 5.4607, 5.3954, 5.4121, 5.4264, 5.4395, 5.448, 5.4614, 5.474, 5.4832, 5.4915, 5.6461, 5.5054, 5.5133, 5.5233, 5.8301, 5.5435, 5.5507, 5.5558, 5.563, 5.5714, 5.5779, 5.5856, 5.5946, 5.6035, 5.614, 5.622, 5.6305, 5.6389, 5.6472, 5.6555, 5.6636, 5.6734, 5.6829, 5.6911, 5.7013, 5.7095, 5.718, 5.7259, 5.735, 5.747, 5.7555, 5.7632, 5.7718, 5.782, 5.7929, 5.803, 5.8128],
        'i': [4.2723, 4.356, 4.4137, 4.4728, 4.5094, 4.5403, 4.5671, 4.589, 4.5094, 4.6577, 4.6759, 4.7043, 4.7344, 4.753, 4.7506, 4.7597, 4.75, 4.7628, 4.7615, 4.7642, 4.7561, 4.7679, 4.7689, 4.7742, 4.7866, 4.7944, 4.8021, 4.8125, 4.8283, 4.8459, 4.8555, 4.8681, 4.8163, 4.8869, 4.8927, 4.902, 4.7938, 4.9173, 4.9229, 4.9263, 4.9318, 4.9346, 4.9436, 4.9479, 4.9588, 4.9645, 4.9793, 4.9869, 4.9975, 5.0078, 5.0187, 5.0274, 5.0354, 5.0451, 5.0542, 5.0628, 5.0733, 5.0737, 5.0823, 5.0891, 5.0917, 5.101, 5.108, 5.1163, 5.1203, 5.1288, 5.1353, 5.1483, 5.1567],
        'a': [5.4184, 5.5025, 5.5639, 5.6649, 5.711, 5.7538, 5.7889, 5.8148, 5.711, 5.8715, 5.887, 5.9164, 5.9484, 5.9748, 5.9728, 5.9958, 5.9985, 6.0105, 5.9862, 5.9674, 5.9673, 5.98, 5.9861, 5.9404, 5.9581, 5.9711, 5.9829, 5.9932, 6.009, 6.0241, 6.0349, 6.0449, 6.0762, 6.0614, 6.0691, 6.079, 6.0732, 6.1003, 6.1083, 6.1135, 6.1209, 6.1296, 6.1389, 6.1473, 6.1568, 6.1663, 6.1776, 6.1866, 6.1964, 6.2056, 6.2152, 6.2241, 6.2329, 6.2436, 6.2542, 6.2635, 6.2748, 6.2819, 6.2916, 6.3006, 6.3102, 6.3223, 6.3316, 6.3402, 6.3484, 6.3592, 6.3703, 6.3812, 6.3918] }
      // 'o': [4.9514, 5.0222, 5.1467, 5.1999, 5.252, 5.2917, 5.3185, 5.1999, 5.3696, 5.3871, 5.4169, 5.4471, 5.4709, 5.4739, 5.4983, 5.5022, 5.5106, 5.4764, 5.446, 5.4446, 5.4554, 5.4607, 5.3954, 5.4121, 5.4264, 5.4395, 5.448, 5.4614, 5.474, 5.4832, 5.4915, 5.6461, 5.5054, 5.5133, 5.5233, 5.8301, 5.5435, 5.5507, 5.5558, 5.563, 5.5714, 5.5779, 5.5856, 5.5946, 5.6035, 5.614, 5.622, 5.6305, 5.6389, 5.6472, 5.6555, 5.6636, 5.6734, 5.6829, 5.6911, 5.7013, 5.7095, 5.718, 5.7259, 5.735, 5.747, 5.7555, 5.7632, 5.7718, 5.782, 5.7929, 5.803, 5.8128],
      // 'i': [4.356, 4.4137, 4.4728, 4.5094, 4.5403, 4.5671, 4.589, 4.5094, 4.6577, 4.6759, 4.7043, 4.7344, 4.753, 4.7506, 4.7597, 4.75, 4.7628, 4.7615, 4.7642, 4.7561, 4.7679, 4.7689, 4.7742, 4.7866, 4.7944, 4.8021, 4.8125, 4.8283, 4.8459, 4.8555, 4.8681, 4.8163, 4.8869, 4.8927, 4.902, 4.7938, 4.9173, 4.9229, 4.9263, 4.9318, 4.9346, 4.9436, 4.9479, 4.9588, 4.9645, 4.9793, 4.9869, 4.9975, 5.0078, 5.0187, 5.0274, 5.0354, 5.0451, 5.0542, 5.0628, 5.0733, 5.0737, 5.0823, 5.0891, 5.0917, 5.101, 5.108, 5.1163, 5.1203, 5.1288, 5.1353, 5.1483, 5.1567],
      // 'a': [5.5025, 5.5639, 5.6649, 5.711, 5.7538, 5.7889, 5.8148, 5.711, 5.8715, 5.887, 5.9164, 5.9484, 5.9748, 5.9728, 5.9958, 5.9985, 6.0105, 5.9862, 5.9674, 5.9673, 5.98, 5.9861, 5.9404, 5.9581, 5.9711, 5.9829, 5.9932, 6.009, 6.0241, 6.0349, 6.0449, 6.0762, 6.0614, 6.0691, 6.079, 6.0732, 6.1003, 6.1083, 6.1135, 6.1209, 6.1296, 6.1389, 6.1473, 6.1568, 6.1663, 6.1776, 6.1866, 6.1964, 6.2056, 6.2152, 6.2241, 6.2329, 6.2436, 6.2542, 6.2635, 6.2748, 6.2819, 6.2916, 6.3006, 6.3102, 6.3223, 6.3316, 6.3402, 6.3484, 6.3592, 6.3703, 6.3812, 6.3918] }
      console.log(networkData)
      const xData = []
      for (const year of _.range(2004, 2022, 1)) {
        for (const q of [1, 2, 3, 4]) {
          if (year === 2021 && q > 1) {
            continue
          }
          xData.push(`${year}Q${q}`)
        }
      }

      const filter_data = []
      for (const item of Object.entries(networkData)) {
        if (this.option.subject.select.indexOf(item[0]) < 0) {
          continue
        }

        // console.log(item)
        if (this.option.type.select === 0) {
        // 点数
          filter_data.push([
            item[0],
            item[1]['i']
          ])
        } else if (this.option.type.select === 1) {
        // 文章数
          filter_data.push([
            item[0],
            item[1]['o']
          ])
        } else if (this.option.type.select === 2) {
        // ln(N)/ln(k)
          filter_data.push([
            item[0],
            item[1]['a']
          ])
        }
      }
      console.log(filter_data)
      filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

      // 网络熵
      const _opt = extendEchartsOpts({
        title: {
          text: `度分布熵`
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: 'Entropy',
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
    }, 2000)
  }
}
</script>

<style lang="less" scoped></style>
