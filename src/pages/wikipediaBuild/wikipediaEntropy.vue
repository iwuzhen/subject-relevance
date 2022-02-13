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
import wikipedia_struct_entropy_lv2_loge from '@/assets/data /wikipedia_struct_entropy_lv2_loge.json'
import wikipedia_struct_entropy_lv3_loge from '@/assets/data/wikipedia_struct_entropy_lv3_loge.json'

import { requestWrap } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'

import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

export default {
  name: 'WikipediaEntropy',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wikipeda entropy',
      girdHeaders: [],
      option: {
        mode: {
          select: '有向网络模型',
          opt: [
            { text: '精简学术圈-lv2', value: 0 },
            { text: '精简学术圈-lv3', value: 1 }
          ]
        },
        subject: {
          select: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
            'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology'],
          opt: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
            'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology'].sort()

        },
        type: {
          select: '2',
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
      const opt = {
        cats: this.option.subject.select.join(','),
        type: this.option.type.select,
        year: this.option.year.select,
        month: this.option.month.select,
        level: this.option.level.select,
        islog: this.option.islog.select,
        x_from: this.option.nodeRange[0],
        x_to: this.option.nodeRange[1],
        y_to: this.option.y_to
      }
      if (this.option.mode.select === '逐年的斜率分布') {
        opt.year = 'all'
      }
      try {
        const res = await requestWrap('/wiki/getDfb_newDB', 'POST', opt)
        if (res.data) {
          if (opt.year === 'all') {
            this.chartOpt = this.setOptions(res.data)
            this.myChartObjs[0].setOption(this.chartOpt, true)
          } else {
            this.setSlope(res.xl)
            this.chartData = res.data
            this.chartOpt = this.setOptions_chart1(res.data)
            this.myChartObjs[0].setOption(this.chartOpt, true)
          }
          // this.calSlope()
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
        throw error
      } finally {
        this.loading = false
      }
    }, 2000),
    setOptions_chart1(data) {
      // let ymax = Math.max(...[].concat(...data.y));
      // ymax = Math.ceil(ymax * 10) / 10;
      console.log(data)
      // let xmax = Math.max(...data.x)
      // xmax = Math.ceil(xmax * 10) / 10
      // 设置
      const seriesList = []
      for (const key in data) {
        const dataValue = Object.entries(data[key]).map(item => [Number(item[0]), item[1]])
        dataValue[0][0] = 0
        seriesList.push({
          name: key,
          type: 'scatter',
          symbolSize: 5,
          large: true,
          data: dataValue
        })
      } // 排序;
      // seriesList.sort((x, y) => {
      //   // console.log(y.data.slice(-1)[0][1], x.data.slice(-1)[0][1]);
      //   return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1]
      // })

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
            return showHtm
          }
        },
        title: {
          text: '幂律度分布'
        },
        legend: {
          data: seriesList.map(item => {
            return item.name
          })
        },
        xAxis: {
          type: 'value',
          // max: xmax,
          name: this.option.islog.select === 1 ? 'log (degree)' : 'degree'
        },
        yAxis: {
          type: 'value',
          // max: ymax,
          name: this.option.islog.select === 1 ? 'log (count)' : 'count'
        },
        series: seriesList
      })
      console.log(_opt)
      return _opt
    },
    setOptions(data) {
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
          text: '逐年的斜率分布'
        },
        legend: {
          data: data.legend
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
          name: ''
        },
        series: seriesList
      })
      return _opt
    }
  }
}
</script>

<style lang="less" scoped></style>
