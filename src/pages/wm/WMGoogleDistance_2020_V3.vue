<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='2')
      v-select(v-model='subjectTarget' :items='categorys' dense deletable-chips label='目标学科' @change='getData')
    v-col(cols='6')
      v-select(v-model='subjectRelevances' :items='categorysOptions' dense small-chips deletable-chips clearable multiple label='相关学科' @change='getData')
    v-col(cols='2')
      v-select(v-model='version' :items='versionOpt' dense label='过滤条件' @change='getData')
    v-col(cols='2')
      v-select(v-model='methodValue' :items='methodOptions' dense label='条件' @change='getData')
  v-row
    v-col(cols='7')
      v-range-slider.align-center(v-model='years' :max='2020' :min='1955' dense hide-details hint='年份范围' @change='getData')
        template(v-slot:prepend)
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='years[0]' hide-details single-line type='number' style='width: 60px' @change='$set(years, 0, $event)')
        template(v-slot:append)
          v-text-field.mt-0.pt-0(:value='years[1]' hide-details single-line type='number' style='width: 60px' @change='$set(years, 1, $event)')
    v-col(cols='1')
      v-btn(:color="showAve ? 'light-green' : 'lime'" @click='showAve = !showAve; getData();') {{ showAve ? "关闭平均距离" : "开启平均距离" }}
    v-col(cols='1')
      v-btn(color='light-green' :disabled='currentAverageLine.name===null' @click='recordAveLine') 记录平均距离
    v-col(cols='1')
      v-btn(:disabled='averageLinedata.legend.length===0' color='light-green' @click='initAverageLinedata') 清空平均距离图
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container#masChart1(fluid fill-height)

  v-row
    article(size="A4")
      v-card.mx-auto(outlined :loading='loading["masChart1"]' height='14.2cm')
        v-container#masChart3(fluid fill-height)
  v-row
    v-col
      comment(storagekey='Mag_google_distance_Chart_2020_1')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container#masChart2(fluid fill-height)
  v-row
    v-col
      comment(storagekey='WM_google_distance_Chart_2020_2')

</template>
<script>

import { getMasDatav2 } from '@/api/index'
import { extendEchartsOpts, MAGCoreCategorys2020, extendLineSeries, SELECT_MAG_DATA } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
// import _ from 'lodash'

export default {
  name: 'MagV3',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'VM 学科相关度 2020（当时的距离）',
      qsValue: -1,
      qsOptions: [{ text: '不筛选,按点', value: -1 }],
      showAve: false,
      subjectTarget: '',
      subjectRelevances: SELECT_MAG_DATA,
      methodValue: 'linksin',
      years: [1955, 2017],
      categorys: MAGCoreCategorys2020.concat([{
        text: 'Business',
        value: 'Business'
      }, {
        text: 'Art',
        value: 'Art'
      }]).sort((a, b) => a.text.localeCompare(b.text)),
      methodOptions: ['linksin', 'linksout'],
      bfValue: -1,
      bfOpt: [-1],
      loading: false,
      myChartIds: ['masChart1', 'masChart2', 'masChart3'],
      averageLinedata: { title: '平均逐年距离图', legend: [], x: [], y: [] },
      version: 'vm_v0',
      versionOpt: [{
        value: 'vm_v0',
        text: 'VM'
      }],
      currentAverageLine: { name: null, line: [] },
      count: 0
    }
  },
  computed: {
    categorysOptions: function() {
      return this.categorys.map(item => {
        const ret = {
          value: item.value,
          text: item.text
        }
        if (item.value === this.subjectTarget) ret['disabled'] = true
        return ret
      })
    }
  },
  methods: {
    initAverageLinedata() {
      this.averageLinedata = { title: '平均逐年距离图', legend: [], x: [], y: [] }
      const options = this.setOptions(this.averageLinedata)
      this.myChartObjs[1].setOption(options, true)
      this.count = 0
    },
    recordAveLine() {
      this.count += 1
      this.averageLinedata.legend.push(this.currentAverageLine.name + `（${this.count}）`)
      this.averageLinedata.y.push(this.currentAverageLine.line)
      const options = this.setOptions(this.averageLinedata)
      this.myChartObjs[1].setOption(options, true)
      console.log(this.averageLinedata)
    },

    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true
      const subjectTarget = this.subjectTarget
      const opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item === subjectTarget) {
              return false
            }
            return true
          })
          .join(','),
        method: this.methodValue,
        from: this.years[0],
        to: this.years[1],
        qs: this.qsValue,
        level: -1,
        version: this.version
      }

      if (this.bfValue !== '不适用') {
        opt.bf = this.bfValue
      }
      getMasDatav2(opt)
        .then(res => {
          if (res.data) {
            if (this.subjectRelevances.length > 1 && this.showAve) {
              this.averageLinedata.x = res.data.x
              const aveLine = []
              for (const i in res.data.x) {
                let ss = 0
                for (const row of res.data.y) {
                  ss += row[i]
                }
                aveLine.push(ss / res.data.y.length)
              }
              this.currentAverageLine.line = aveLine
              this.currentAverageLine.name = this.subjectTarget
              res.data.y.push(aveLine)
              res.data.legend.push('平均距离')
              this.drawChart(res.data)
            } else this.drawChart(res.data)
          } else {
            this.loading = false
            this.$emit('emitMesage', '请求失败')
            return false
          }
        })
        .catch(rej => {
          this.loading = false
          this.$emit('emitMesage', `请求失败:${rej}`)
        })
    },
    drawChart(data) {
      console.log(data)
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const series = data.y.map((item, index) => {
        return extendLineSeries({
          name: data.legend[index],
          type: 'line',
          smooth: false,
          data: item
        })
      })
      //  添加 mark line
      series.push({
        type: 'line',
        markLine: {
          symbol: ['none', 'none'],
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
      const _opt = extendEchartsOpts({
        title: {
          text: this.subjectTarget
        },
        legend: {
          type: 'scroll',
          left: '82%',
          right: 'left',
          // top: 'middle',
          top: 70,
          textStyle: {
            fontSize: 13
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
          }
        },
        yAxis: {
          name: 'Knowledge Distance',
          type: 'value',
          // max: 1,
          min: 0.2,
          minorSplitLine: {
            fontSize: 14
          },
          splitLine: {
            show: false
          }
        },
        series: series
      })
      this.setPaperOptions(data)
      return _opt
    },
    setPaperOptions(data) {
      const chartOpt = extendEchartsOpts({
        title: {
          text: this.subjectTarget.replace('biology', 'Biology'),
          textStyle: {
            fontWeight: 'normal',
            fontSize: 20
          },
          left: '30%'
          // right: 'auto'
        },
        legend: {
          type: 'scroll',
          left: '70%',
          right: 'left',
          // top: 'middle',
          top: '11%',
          textStyle: {
            fontSize: 12,
            color: '#000'
          },
          orient: 'vertical'
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
        series: data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index].replace('engineer', 'Engineer').replace('science', 'Science').replace('intelli', 'Intelli').replace('editing', 'Editing'),
            type: 'line',
            smooth: false,
            symbol: 'none',
            symbolSize: 0,
            data: item
          })
        })

      //   series: _.zip(data.legend, data.y).map(item => {
      //     return extendLineSeries({
      //       name: item[0].replace('engineer', 'Engineer').replace('science', 'Science').replace('intelli', 'Intelli').replace('editing', 'Editing'),
      //       type: 'line',
      //       smooth: false,
      //       symbol: 'none',
      //       symbolSize: 0,
      //       data: item[1]
      //     })
      //   })
      })
      chartOpt.series.push({
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
      console.log(chartOpt)
      this.myChartObjs[2].setOption(chartOpt, true)
    }
  }
}
</script>

<style lang="less" scoped>
article[size="A4"] {
  background: white;
  width: 21cm;
  height: 29.7cm;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
</style>
