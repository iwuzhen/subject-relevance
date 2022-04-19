<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='2')
      v-select(v-model='currentSubject.select' :items='currentSubject.option' label='当前学科' @change='getData')
    v-col(cols='10')
      v-select(v-model='targetSubject.select' :items='targetSubject.option' small-chips multiple deletable-chips clearable label='目标学科' @change='getData')
    v-col(cols='2')
      v-select(v-model='version.select' :items='version.option' label='version' @change='getData')
    v-col(cols='2')
      v-select(v-model='view.select' :items='view.option' label='展示类型' @change='getData')

  v-row(v-for='chartid of myChartIds' :key='chartid')
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container(:id='chartid' fluid fill-height)
  v-row
    v-col
      comment(storagekey='MagDirectedDistance_graph_1')

</template>

<script>
import { requestGoV2Wrap } from '@/api/index'
import { MAGCoreCategorys2020_V1, extendEchartsOpts, extendLineSeries, SELECT_MAG_DATA_V1 } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

export default {
  name: 'MAV2',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '小世界有向距离',
      currentSubject: {
        option: MAGCoreCategorys2020_V1,
        select: 'Physics'
      },
      targetSubject: {
        option: MAGCoreCategorys2020_V1,
        select: SELECT_MAG_DATA_V1
      },
      version: {
        option: [{ text: '截至1990', value: 'v1' }],
        select: 'v1'
      },
      view: {
        option: [{ text: '平均最短距离', value: 1 }, { text: '总联通数', value: 2 }, { text: '总路径长度', value: 3 }],
        select: 1
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
    this.getData()
  },
  methods: {

    getData: _.debounce(async function() {
      if (this.targetSubject.select.length < 1) {
        return false
      }
      this.loading = true
      const opt = {
        source: [this.currentSubject.select],
        target: this.targetSubject.select,
        version: this.version.select
      }
      try {
        const res = await requestGoV2Wrap('/apigo/v2/mag/subject_directed', 'POST', opt)
        if (res.data) {
          // 获取所有 legend
          let legend = new Set()
          for (const item of res.data) {
            legend.add(item.T)
          }
          // 排序后的legend
          legend = Array.from(legend)

          // 组合 series
          const series = []
          for (const tName of legend) {
            const row = []
            for (const item of res.data) {
              if (tName === item.T) {
                let data = item.D / item.C
                if (this.view.select === 2) {
                  data = item.C
                } else if (this.view.select === 3) {
                  data = item.D
                }
                row.push([item.Year, data])
              }
            }
            series.push(row)
          }

          const tmpData = _.zip(series, legend).sort()
          console.log(tmpData)
          tmpData.sort((x, y) =>
            y[0][y[0].length - 1][1] - x[0][x[0].length - 1][1]
          )
          const [RetSeries, RetLegend] = _.unzip(tmpData)

          // 处理数据
          let yname = 'average distance'
          if (this.view.select === 2) {
            yname = '总联通数'
          } else if (this.view.select === 3) {
            yname = '总路径长度'
          }

          const _opt = extendEchartsOpts({
            title: {
              text: `${this.currentSubject.select} 到其他学科的路径距离`
            },
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
                  if (y.data === undefined) { return -1 }
                  return y.data[1] - x.data[1]
                })
                let showHtm = ` ${params[0].data[0]}<br>`
                for (let i = 0; i < params.length; i++) {
                  if (params[i].data === undefined) {
                    continue
                  }
                  const _text = params[i].seriesName
                  const _data = params[i].data[1]
                  const _marker = params[i].marker
                  showHtm += `${_marker}${_text}：${_data}<br>`
                }
                return showHtm
              }
            },
            legend: {
              data: RetLegend
            },
            xAxis: {
              name: 'Year',
              type: 'value',
              boundaryGap: false,
              min: 'dataMin',
              max: 'dataMax'
            },
            yAxis: {
              name: yname,
              type: 'value'
            },
            series: _.zip(RetSeries, RetLegend).map(item => {
              return extendLineSeries({
                name: item[1],
                type: 'line',
                smooth: false,
                data: item[0]
              })
            })

          })
          console.log(_opt)
          this.myChartObjs[0].setOption(_opt, true)
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      this.loading = false
    }, 2000)

  }
}
</script>

<style lang="less" scoped></style>
