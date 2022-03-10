<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='8')
      v-select(v-model='option.subject.select', :items='option.subject.opt', small-chips, multiple, deletable-chips, clearable, label='目标学科', @change='getData')
    v-col(cols='2')
      v-select(v-model='option.type.select', :items='option.type.opt', label='数据维度', @click='getData').
    v-col(cols='2')
      v-select(v-model='option.logBase.select', :items='option.logBase.opt',disabled, label='对数底数', @change='getData').
    v-col(cols='4')
      v-select(v-model='option.mode.select', :items='option.mode.opt', label='有向网络模型', @change='getData').

  v-row(v-for='chartid of myChartIds', :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container(:id='chartid', fluid, fill-height).

  v-row
    v-col
      comment(storagekey='wiki 结构熵_chart_1').

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
        'in': [0.5507, 0.5618, 0.574, 0.5657, 0.5667, 0.5667, 0.5676, 0.572, 0.5667, 0.5848, 0.5891, 0.5922, 0.5952, 0.5969, 0.5953, 0.5948, 0.5946, 0.5985, 0.6103, 0.6261, 0.6276, 0.6302, 0.6321, 0.6506, 0.6517, 0.6516, 0.6527, 0.6538, 0.6549, 0.6566, 0.6579, 0.6586, 0.6667, 0.6606, 0.6614, 0.6619, 0.6788, 0.663, 0.6636, 0.6638, 0.664, 0.6646, 0.666, 0.6666, 0.6672, 0.6679, 0.6687, 0.6696, 0.6709, 0.6719, 0.6731, 0.674, 0.6746, 0.6756, 0.6766, 0.6778, 0.6789, 0.6794, 0.6804, 0.6811, 0.6816, 0.6826, 0.6833, 0.6841, 0.6848, 0.6855, 0.6863, 0.6872, 0.688],
        'out': [0.8929, 0.8902, 0.8876, 0.8923, 0.8935, 0.8941, 0.8937, 0.8942, 0.8935, 0.8967, 0.8971, 0.8985, 0.8989, 0.8993, 0.9001, 0.9011, 0.901, 0.901, 0.9015, 0.9019, 0.9024, 0.9025, 0.9025, 0.9005, 0.9007, 0.9009, 0.901, 0.9012, 0.9014, 0.9013, 0.9011, 0.901, 0.9003, 0.9008, 0.9004, 0.9004, 0.8983, 0.9004, 0.9004, 0.9005, 0.9007, 0.9007, 0.9002, 0.9002, 0.9002, 0.9001, 0.9001, 0.9001, 0.8998, 0.8999, 0.8998, 0.8997, 0.8995, 0.8993, 0.899, 0.8987, 0.8986, 0.8982, 0.898, 0.898, 0.898, 0.8979, 0.8978, 0.8975, 0.8975, 0.8975, 0.8976, 0.8977, 0.8975],
        'all': [0.743, 0.7468, 0.7514, 0.7502, 0.7511, 0.7512, 0.7513, 0.7535, 0.7511, 0.7602, 0.7622, 0.7641, 0.7657, 0.7669, 0.7665, 0.7668, 0.7668, 0.7687, 0.7745, 0.782, 0.7831, 0.7844, 0.7854, 0.7927, 0.7935, 0.7936, 0.7941, 0.7948, 0.7954, 0.7962, 0.7967, 0.7969, 0.7956, 0.7977, 0.7979, 0.7981, 0.7947, 0.7987, 0.799, 0.7991, 0.7993, 0.7997, 0.8001, 0.8005, 0.8007, 0.8011, 0.8014, 0.8018, 0.8023, 0.8028, 0.8033, 0.8037, 0.8039, 0.8043, 0.8047, 0.8052, 0.8058, 0.8059, 0.8063, 0.8067, 0.8071, 0.8076, 0.8079, 0.8082, 0.8086, 0.809, 0.8095, 0.8099, 0.8102],
        'in_e': [13.9217, 14.2271, 14.5364, 14.6847, 14.8571, 15.0552, 15.2801, 15.5107, 14.8571, 15.9741, 16.1825, 16.3369, 16.4821, 16.6055, 16.6992, 16.7763, 16.8676, 16.9725, 17.1553, 17.3638, 17.4483, 17.5254, 17.5989, 17.8202, 17.874, 17.9142, 17.9635, 18.0091, 18.052, 18.0969, 18.1417, 18.1743, 18.4564, 18.2518, 18.2891, 18.3177, 18.8732, 18.3786, 18.409, 18.4344, 18.4616, 18.4923, 18.5302, 18.5602, 18.5867, 18.6158, 18.643, 18.6715, 18.7053, 18.7337, 18.7644, 18.792, 18.817, 18.8435, 18.8709, 18.9004, 18.9292, 18.9549, 18.9803, 19.0027, 19.0275, 19.0554, 19.0793, 19.1026, 19.1266, 19.1526, 19.1774, 19.2004, 19.2258],
        'out_e': [16.8918, 17.1551, 17.4019, 17.7025, 17.9145, 18.1596, 18.4151, 18.6478, 17.9145, 19.0853, 19.2872, 19.4436, 19.582, 19.707, 19.847, 19.9487, 20.0504, 20.1276, 20.2164, 20.2837, 20.3609, 20.4178, 20.4761, 20.5027, 20.5484, 20.5959, 20.6356, 20.6781, 20.7166, 20.7473, 20.7784, 20.809, 20.8369, 20.8702, 20.8955, 20.9213, 20.9324, 20.9726, 20.9975, 21.0235, 21.0502, 21.0728, 21.0917, 21.1151, 21.1377, 21.1576, 21.1786, 21.1983, 21.2163, 21.2362, 21.2547, 21.2721, 21.2892, 21.3036, 21.3162, 21.3293, 21.3448, 21.3597, 21.3721, 21.3858, 21.4002, 21.4137, 21.4264, 21.4376, 21.4507, 21.4673, 21.4825, 21.4965, 21.5101],
        'all_e': [15.749, 16.0397, 16.3225, 16.5567, 16.7519, 16.9749, 17.215, 17.4451, 16.7519, 17.8853, 18.0847, 18.2363, 18.3738, 18.497, 18.6139, 18.7028, 18.797, 18.8862, 19.0181, 19.1496, 19.2279, 19.2926, 19.3564, 19.4712, 19.5199, 19.563, 19.607, 19.6497, 19.6887, 19.7255, 19.7623, 19.7931, 19.9424, 19.86, 19.8902, 19.9165, 20.1926, 19.9706, 19.9973, 20.0224, 20.0484, 20.0729, 20.0994, 20.1249, 20.1484, 20.1716, 20.1947, 20.2175, 20.242, 20.2649, 20.2884, 20.3095, 20.3296, 20.3491, 20.3681, 20.3882, 20.4095, 20.4291, 20.4468, 20.464, 20.482, 20.5001, 20.517, 20.533, 20.5504, 20.5703, 20.5887, 20.6057, 20.6236],
        'd_d': [5.666e-05, 4.818e-05, 4.098e-05, 3.589e-05, 3.182e-05, 2.752e-05, 2.335e-05, 2.01e-05, 3.182e-05, 1.543e-05, 1.357e-05, 1.247e-05, 1.158e-05, 1.08e-05, 9.885e-06, 9.383e-06, 8.768e-06, 8.355e-06, 7.713e-06, 7.221e-06, 6.866e-06, 6.648e-06, 6.41e-06, 5.976e-06, 5.858e-06, 5.733e-06, 5.602e-06, 5.487e-06, 5.407e-06, 5.341e-06, 5.251e-06, 5.172e-06, 4.617e-06, 5.005e-06, 4.928e-06, 4.872e-06, 3.864e-06, 4.772e-06, 4.717e-06, 4.655e-06, 4.602e-06, 4.559e-06, 4.513e-06, 4.466e-06, 4.424e-06, 4.389e-06, 4.357e-06, 4.323e-06, 4.29e-06, 4.258e-06, 4.227e-06, 4.197e-06, 4.166e-06, 4.148e-06, 4.13e-06, 4.111e-06, 4.093e-06, 4.053e-06, 4.04e-06, 4.024e-06, 4.009e-06, 4.003e-06, 3.989e-06, 3.976e-06, 3.961e-06, 3.944e-06, 3.935e-06, 3.926e-06, 3.911e-06],
        'd_n': [0.0002091, 0.0001785, 0.0001523, 0.0001339, 0.0001189, 0.000103, 8.748e-05, 7.534e-05, 0.0001189, 5.779e-05, 5.074e-05, 4.662e-05, 4.327e-05, 4.036e-05, 3.692e-05, 3.505e-05, 3.274e-05, 3.119e-05, 2.875e-05, 2.687e-05, 2.554e-05, 2.471e-05, 2.382e-05, 2.215e-05, 2.171e-05, 2.124e-05, 2.074e-05, 2.031e-05, 2.001e-05, 1.976e-05, 1.942e-05, 1.911e-05, 1.701e-05, 1.848e-05, 1.818e-05, 1.797e-05, 1.419e-05, 1.759e-05, 1.739e-05, 1.715e-05, 1.695e-05, 1.679e-05, 1.661e-05, 1.643e-05, 1.627e-05, 1.613e-05, 1.601e-05, 1.588e-05, 1.575e-05, 1.563e-05, 1.551e-05, 1.539e-05, 1.527e-05, 1.52e-05, 1.513e-05, 1.506e-05, 1.498e-05, 1.484e-05, 1.478e-05, 1.472e-05, 1.466e-05, 1.463e-05, 1.457e-05, 1.452e-05, 1.446e-05, 1.439e-05, 1.435e-05, 1.431e-05, 1.425e-05] }
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
      const filter_e_data = []
      const filter_dd_data = []
      const filter_nd_data = []
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

      // filter_e_data = filter_e_data.filter(item => item[0] !== 'wikipedia')
      // filter_dd_data = filter_dd_data.filter(item => item[0] !== 'wikipedia')
      // filter_nd_data = filter_nd_data.filter(item => item[0] !== 'wikipedia')

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
