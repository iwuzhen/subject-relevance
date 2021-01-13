<template lang="pug">
v-container(fluid)
  v-row
    v-col(v-for='(item,index) in ChartObj.Select' :key='index' :cols='item.cols')
      v-select(v-if='item.show!==false' v-model='options[item.name]' :items='item.items' :multiple='item.multiple' :deletable-chips='item.multiple' :clearable='item.multiple' :dense='item.multiple' :chips='item.multiple' :label='item.label' @change='getData')
    v-col(v-for='(item,index) in ChartObj.Slider' :key="index+'slide'" :cols='item.cols')
      v-slider.align-center(v-model='options[item.name]' :max='item.max' :min='item.min' dense hide-details :step='item.step' :hint='item.label' thumb-label='always' thumb-size='32' :label='item.label' ticks @change='getData')
    v-col(v-for='(item,index) in ChartObj.RangeSlider' :key="index+'rangeslide'" :cols='item.cols')
      v-range-slider.align-center(v-model='options[item.name]' :max='item.max' :min='item.min' dense hide-details :hint='item.label' @change='getData')
        template(v-slot:prepend)
          p(style='width: 9em') {{ item.label }}
          v-text-field.mt-0.pt-0(:value='options[item.name][0]' hide-details single-line type='number' style='width: 60px' @change='$set(options[item.name], 0, $event)')
        template(v-slot:append)
          v-text-field.mt-0.pt-0(:value='options[item.name][1]' hide-details single-line type='number' style='width: 60px' @change='$set(options[item.name], 1, $event)')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' :height='chartHeight')
        v-container#subjectChart(fluid fill-height)
  v-row
    v-col
      comment(v-if='ChartObj.ChName' :storagekey="ChartObj.ChName + '_chart_1'")

</template>

<script>

import { requestWrap } from '@/api/index'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'
import { MAGCoreCategorys2020, defaultCategorySelect, extendLineSeries, extendEchartsOpts } from '@/api/data'

export default {
  name: 'Template',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'template',
      options: { fz: '0' },
      ChartObj: {},
      myChartIds: ['subjectChart'],
      loading: false,
      chartHeight: '70vh'
    }
  },
  computed: {
    fzmode: {
      get: function() {
        return this.options.fz
      }
    }
  },
  watch: {
    fzmode() {
      this.exchange()
    }
  },
  mounted() {
    // 图表对象
    this.ChartObj = {
      ChName: '学科引用其他学科的逐年分布趋势',
      HandleResponseFunc: ([responseData, yaisa], ChartObj) => {
        const _opt = extendEchartsOpts({
          title: {
            text: responseData.data.title
          },
          legend: {
            data: responseData.data.legend
          },
          xAxis: {
            name: ChartObj.xAxisName,
            type: 'category',
            boundaryGap: false,
            data: responseData.data.x
          },
          yAxis: {
            name: yaisa,
            type: 'value'
          },
          series: _.zip(responseData.data.legend, responseData.data.y).map(item => {
            return extendLineSeries({
              name: item[0],
              type: 'line',
              smooth: false,
              data: item[1]
            })
          })
        })
        return _opt
      },
      RequestFunc: async(params) => {
        if (params.yearA < params.to_yearB) {
          params.to_yearB = params.yearA
        }
        // 当年
        const data = await requestWrap('mag/maglinkscf', 'post', params)
        let yaisa = 'percent'
        if (params.returnType === '0') {
          yaisa = 'count'
        }
        return [data, yaisa]
      },
      Select: [{
        name: 'fz',
        default: '0',
        label: '模式',
        show: true,
        cols: 2,
        items: [{
          text: '一查询多',
          value: '0'
        }, {
          text: '多查询一',
          value: '1'
        }]
      },
      {
        name: 'catA',
        default: 'Biology',
        label: '当前学科',
        show: true,
        cols: 2,
        items: MAGCoreCategorys2020
      }, {
        name: 'catB',
        default: defaultCategorySelect,
        label: '目标学科',
        multiple: true,
        show: true,
        cols: 8,
        items: MAGCoreCategorys2020
      }, {
        name: 'version',
        default: 'tjart_nopb_delete_noref_v3',
        label: '过滤条件',
        show: true,
        cols: 3,
        items: [{
          text: '文章 去0 去Book和Patent',
          value: 'tjart_nopb_delete_noref_v3'
        }]
      }, {
        name: 'type',
        default: 'linksout',
        label: '引用条件',
        show: true,
        cols: 2,
        items: [{
          text: 'linksout',
          value: 'linksout'
        }]
      }, {
        name: 'returnType',
        default: '1',
        label: '返回类型',
        multiple: false,
        cols: 2,
        items: [{
          text: '数值',
          value: '0'
        }, {
          text: '比例',
          value: '1'
        }]
      }],
      Slider: [{
        name: 'yearA',
        Default: 2017,
        label: '当前学科年份',
        step: 1,
        cols: 10,
        max: 2020,
        min: 1955
      }],
      RangeSlider: [{
        name: 'yearRange',
        startName: 'from_yearB',
        rangeDefault: [1980, 2020],
        endName: 'to_yearB',
        label: '目标学科年份范围',
        cols: 12,
        max: 2020,
        min: 1900
      }],
      xAxisName: 'Year',
      yAxisName: 'Count'
    }
    this.pageName = this.ChartObj.ChName
    this.$store.set('pages/page_name', this.pageName)
    this.chartHeight = this.ChartObj.chartHeight ? this.ChartObj.chartHeight : '70vh'
    // 配置默认值
    for (const row of this.ChartObj.Select) {
      this.options[row.name] = row.default
    }
    for (const row of this.ChartObj.RangeSlider) {
      this.options[row.name] = row.rangeDefault
    }
    if (this.ChartObj.Slider !== undefined) {
      for (const row of this.ChartObj.Slider) {
        this.options[row.name] = row.Default
      }
    }
    this.getData()
  },
  methods: {
    exchange() {
      console.log('exchange')
      const tmp_a = this.ChartObj.Select[1]
      const tmp_b = this.ChartObj.Select[2]
      tmp_b.label = '当前学科'
      tmp_a.label = '目标学科'
      this.ChartObj.Select[1] = tmp_b

      // this.ChartObj.Select[2] = tmp_a
      this.$set(this.ChartObj.Select, 2, tmp_a)
    },
    getData() {
      console.log(this.fzmode)
      // if (this.options.fz === '1') {
      //   console.log(this.options.fz)
      // }
      this.handle()
    },
    handle: _.debounce(async function() {
      this.loading = true
      // 参数处理
      const opt = {}
      for (const row of this.ChartObj.Select) {
        if (!row.multiple) {
          opt[row.name] = this.options[row.name]
        } else {
          opt[row.name] = this.options[row.name].join(',')
        }
      }
      for (const row of this.ChartObj.RangeSlider) {
        opt[row.startName] = this.options[row.name][0]
        opt[row.endName] = this.options[row.name][1]
      }
      if (this.ChartObj.Slider !== undefined) {
        for (const row of this.ChartObj.Slider) {
          opt[row.name] = this.options[row.name]
        }
      }

      const data = await this.ChartObj.RequestFunc(opt)
      if (data !== undefined) {
        const options = this.ChartObj.HandleResponseFunc(data, this.ChartObj)
        this.myChartObjs[0].setOption(options, true)
      } else {
        this.$emit('emitMesage', '请求失败')
      }

      this.loading = false
    }, 500)
  }
}
</script>
