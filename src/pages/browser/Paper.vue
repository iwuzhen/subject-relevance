<template lang="pug">
v-container(fluid)
  v-row
    v-col
      h1.v-heading.text-h4.text-sm-h4.mb-4 {{chart1.name}}
  v-row
    v-col(cols='2')
      v-select(v-model='chart1.subjectTarget_1' :items='chart1.categorys' dense deletable-chips label='学科1' @change='chart1Change')
    v-col(cols='2')
      v-select(v-model='chart1.subjectTarget_2' :items='chart1.categorys' dense deletable-chips label='学科2' @change='chart1Change')
    v-col(cols='2')
      v-select(v-model='chart1.subjectTarget_3' :items='chart1.categorys' dense deletable-chips label='学科3' @change='chart1Change')
    v-col(cols='2')
      v-select(v-model='chart1.subjectTarget_4' :items='chart1.categorys' dense deletable-chips label='学科4' @change='chart1Change')
    v-col(cols='8')
      v-select(v-model='chart1.subjectRelevances' :items='chart1.categorys' dense small-chips deletable-chips clearable multiple label='相关学科' @change='chart1Change')
    v-col(cols='2')
      v-select(v-model='chart1.version' :items='chart1.versionOpt' dense label='过滤条件' @change='chart1Change')
    v-col(cols='2')
      v-select(v-model='chart1.methodValue' :items='chart1.methodOptions' dense label='条件' @change='chart1Change')
  v-row
    v-col(cols='7')
      v-range-slider.align-center(v-model='chart1.years' :max='2020' :min='1955' dense hide-details hint='年份范围' @change='chart1Change')
        template(v-slot:prepend)
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='chart1.years[0]' hide-details single-line type='number' style='width: 60px' @change='$set(chart1.years, 0, $event)')
        template(v-slot:append)
          v-text-field.mt-0.pt-0(:value='chart1.years[1]' hide-details single-line type='number' style='width: 60px' @change='$set(chart1.years, 1, $event)')
  v-row
    page(size="A4")
      v-card.mx-auto(outlined :loading='chart1.loading' height='14.2cm')
        v-container#masChart1(fluid fill-height)
  v-row
    v-col
      comment(storagekey='Mag_google_distance_Chart_2020_1')
  v-row
    v-col(col='12')
      v-card.a4(outlined :loading='chart1.loading' height='70vh')
        v-container#masChart2(fluid fill-height)
  v-row
    v-col
      comment(storagekey='Mag_google_distance_Chart_2020_2')
</template>

<script>

import { getMasDatav2 } from '@/api/index'
import { extendEchartsOpts, MAGCoreCategorys2020_V1, extendLineSeries, SELECT_MAG_DATA_V1 } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

export default {
  name: 'MagV3',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'Paper chart',
      myChartIds: ['masChart1', 'masChart2'],
      chart1: {
        name: 'MAG Knowledge Distance',
        qsValue: -1,
        qsOptions: [{ text: '去掉引用为0的。按边', value: -100 },
          { text: '不筛选,按边', value: -99 },
          { text: '不筛选,按点', value: -1 },
          { text: '去掉被引用为0的文章，剩余7000万+,按点', value: -2 },
          { text: '引用top百分之十文章,按点', value: 10 },
          { text: '引用top百分之三十文章,按点', value: 30 }],
        subjectTarget_1: 'Mathematics',
        subjectTarget_2: 'Physics',
        subjectTarget_3: 'Biology',
        subjectTarget_4: 'Philosophy',
        subjectRelevances: SELECT_MAG_DATA_V1,
        methodValue: 'linksin',
        years: [1955, 2020],
        categorys: MAGCoreCategorys2020_V1,
        methodOptions: ['linksin', 'linksout'],
        loading: false,
        version: 'delete_noref_v3_node',
        versionOpt: [{
          value: 'delete_noref_v3_node',
          text: '文章的距离，去0，去Book和去Patent，按点'
        }, {
          value: 'delete_noref_v3_edge',
          text: '文章的距离，去0，去Book和去Patent，按边'
        }, {
          value: 'tjart_only_noPatent_delete_noref_v3_node',
          text: '文章的距离，去0，去Patent，按点'
        }, {
          value: 'tjart_only_noPatent_delete_noref_v3_edge',
          text: '文章的距离，去0，去Patent，按边'
        }, {
          value: 'tjbook_only_noPatent_delete_noref_v3_node',
          text: '书的距离，去0，去Patent，按点'
        }, {
          value: 'tjbook_only_noPatent_delete_noref_v3_edge',
          text: '书的距离，去0，去Patent，按边'
        }]
      }
    }
  },
  computed: {
  },
  mounted() {
    this.chart1Change()
  },
  methods: {
    async chart1Change() {
      if (this.chart1.subjectRelevances.length === 0) {
        return
      }
      this.chart1.loading = true
      //   初始化参数
      const InitRequestOpt = (subjectTarget) => {
        return {
          strA: subjectTarget,
          strB: this.chart1.subjectRelevances
            .filter(item => {
              if (item === subjectTarget) {
                return false
              }
              return true
            })
            .join(','),
          method: this.chart1.methodValue,
          from: this.chart1.years[0],
          to: this.chart1.years[1],
          qs: this.chart1.qsValue,
          version: this.chart1.version,
          bf: -1
        }
      }

      const getSeries = data => {
        const series = data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index],
            type: 'line',
            smooth: false,
            symbol: 'none',
            symbolSize: 0,
            data: item
          })
        })
        //  添加 mark line
        series.push({
          type: 'line',
          markLine: {
            symbol: ['none', 'none'],
            label: {
              show: false
            },
            lineStyle: {
              color: 'grey',
              width: 2
            },
            data: [
              {
                yAxis: 0.9
              }, {
                yAxis: 0.7
              }, {
                yAxis: 0.5
              }
            ]
          }
        })
        return series
      }

      try {
        // let opt = InitRequestOpt(this.chart1.subjectTarget_1)
        // let res = await getMasDatav2(opt)
        // // const series1 = getSeries(res.data)
        // opt = InitRequestOpt(this.chart1.subjectTarget_2)
        // res = await getMasDatav2(opt)

        // // const series2 = getSeries(res.data)
        // opt = InitRequestOpt(this.chart1.subjectTarget_3)
        // res = await getMasDatav2(opt)

        // const series3 = getSeries(res.data)
        const opt = InitRequestOpt(this.chart1.subjectTarget_4)
        const res = await getMasDatav2(opt)

        const series4 = getSeries(res.data)
        const data = res.data

        const chartOpt = extendEchartsOpts({
          title: {
            text: this.chart1.subjectTarget_4,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20
            }
          },
          legend: {
            type: 'scroll',
            left: '70%',
            right: 'left',
            // top: 'middle',
            top: 0,
            textStyle: {
              fontSize: 18,
              color: '#000'
            },
            orient: 'vertical',
            data: data.legend
          },

          xAxis: {
            name: 'Year',
            type: 'category',
            boundaryGap: false,
            data: data.x,
            minorSplitLine: {
              fontSize: 14
            },
            axisLabel: {
              fontSize: 16,
              // rotate: -90,
              color: '#000',
              interval: (index, value) => {
                if (index === 0) {
                  return true
                } else if (value === '1960') {
                  return false
                }
                if (Number(value) % 10 === 0) {
                  return true
                }
                return false
              }
            },
            axisTick: {
              show: true,
              interval: 'auto'
            },
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              color: '#000',
              align: 'center',
              fontSize: 18,
              verticalAlign: 'bottom'
            }
          },
          yAxis: {
            name: 'Knowledge Distance',
            type: 'value',
            // max: 1,
            min: 0.2,
            minorSplitLine: {
              fontSize: 18
            },
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
              align: 'center',
              // fontWeight: 'bolder',
              fontSize: 18,
              color: '#000'
            },
            splitLine: {
              show: false
            },
            interval: 0.1,
            axisLabel: {
              color: '#000',
              fontSize: 16,
              formatter: value => {
                if ([0, 0.2, 0.5, 0.7, 0.9, 1].includes(value)) {
                  return value
                } return ''
              }
            },
            axisTick: {
              show: true
            }
          },
          grid: {
            left: '5%',
            right: '33%',
            bottom: '8%',
            containLabel: true
          },
          series: series4
        })
        console.log(chartOpt)
        this.myChartObjs[0].setOption(chartOpt, true)
        this.chart1.loading = false
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      } finally {
        this.chart1.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
page[size="A4"] {
  background: white;
  width: 21cm;
  height: 29.7cm;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
</style>
