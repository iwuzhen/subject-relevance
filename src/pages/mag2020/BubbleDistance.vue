<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2021-01-06 17:39:20
 * @LastEditors: ider
 * @LastEditTime: 2021-01-07 00:06:19
 * @Description:
-->
<template lang="pug">
v-container(fluid)
    v-row
        v-col(cols="2")
            v-select(v-model="subjectX",:items="categorys",dense,deletable-chips,label="学科 X",@change="getData")
        v-col(cols="2")
            v-select(v-model="subjectY",:items="categorys",dense,deletable-chips,label="学科 Y",@change="getData")
        v-col(cols="6")
            v-select(v-model="subjectRelevances",:items="categorys",dense,
                small-chips,deletable-chips,multiple,label="相关学科",@change="getData")

        v-col(cols="6")
            v-slider(v-model="year",:max="2020",:min="1950",dense,hide-details,step="1",hint="top percent",thumb-label="always",thumb-size="32",label="year",ticks,class="align-center",@change="getData")

    v-row(v-for="chartid of myChartIds",:key="chartid")
        v-col(col="12")
            v-card(class="mx-auto",outlined,:loading="loading",height="70vh")
                template(slot="progress")
                    v-progress-linear(height="25",v-model="knowledge",striped)
                        strong {{ Math.ceil(knowledge) }}%
                v-container(:id="chartid",fluid,fill-height,)
    v-row
      v-col
        comment(storagekey="Mag_bubbles_distance_Chart_2020_1")
</template>

<script>
import comment from '@/components/comment'
import Base from '@/utils/base'
import _ from 'lodash'
// import { extendEchartsOpts, MAGCoreCategorys2020, extendLineSeries, defaultCategorySelect } from '@/api/data'
import { MAGCoreCategorys2020, defaultCategorySelect, extendEchartsOpts } from '@/api/data'
import { getMasDatav2, requestWrap } from '@/api/index'
// import echarts from 'echarts'

export default {
  name: 'Magbubbles',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MAG 学科相关度 2020 泡泡图',
      myChartIds: ['masChart1'],
      loading: false,
      categorys: MAGCoreCategorys2020,
      subjectX: 'Chemistry',
      subjectY: 'Physics',
      subjectRelevances: defaultCategorySelect,
      year: 2020,
      knowledge: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: _.debounce(async function() {
      this.knowledge = 0
      this.loading = true
      // 去除 xy轴
      const calSubject = this.subjectRelevances
        .filter(item => {
          if (item === this.subjectX) {
            return false
          }
          if (item === this.subjectY) {
            return false
          }
          return true
        })
      let opt = {
        strA: this.subjectX,
        strB: calSubject.join(','),
        method: 'linksin',
        from: this.year,
        to: this.year,
        qs: -1,
        version: 'delete_noref_v3_node'
      }
      this.knowledge = 10
      const retObj = {}
      try {
        // x 轴
        let ret = await getMasDatav2(opt)
        this.knowledge = 30
        for (const i in ret.data.data.y) {
          retObj[ret.data.data.legend[i]] = [ret.data.data.y[i][0]]
        }

        // y 轴
        opt.strA = this.subjectY
        ret = await getMasDatav2(opt)
        this.knowledge = 60
        for (const i in ret.data.data.y) {
          retObj[ret.data.data.legend[i]].push(ret.data.data.y[i][0])
        }

        // 学科大小
        opt = {
          doctype: 1,
          cats: calSubject.join(','),
          version: 'v3',
          yeartype: 0,
          from: this.year,
          to: this.year
        }
        ret = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', opt)

        this.knowledge = 100
        const allSize = _.flattenDeep(ret.data.y)
        const maxSize = Math.pow(_.max(allSize), 1 / 3)
        const minSize = Math.pow(_.min(allSize), 1 / 3)
        console.log(ret)
        for (const i in ret.data.y) {
          retObj[ret.data.legend[i]].push(ret.data.y[i][0], ret.data.legend[i])
        }

        // 处理 echart opt
        const subjectY = this.subjectY
        const subjectX = this.subjectX
        const _opt = extendEchartsOpts({
          title: {
            text: '气泡图'
          },
          tooltip: {
            trigger: 'item',
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
              let showHtm = ` ${params.seriesName}<br>`

              showHtm += `${subjectX}：${params.value[0]}<br>`
              showHtm += `${subjectY}：${params.value[1]}<br>`
              showHtm += `subject size：${params.value[2]}<br>`
              return showHtm
            }
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
            orient: 'vertical'
            // data: data.legend
          },

          xAxis: {
            name: this.subjectX,
            type: 'value',
            max: 1,
            boundaryGap: false
          },
          yAxis: {
            name: this.subjectY,
            type: 'value',
            max: 1
            // splitLine: {
            //   show: false
            // }
          },
          series: Object.entries(retObj).map((item) => {
            return {
              name: item[0],
              data: [item[1]],
              type: 'scatter',
              symbolSize: function(data) {
                return Math.floor((80 * (Math.pow(Number(data[2]), 1 / 3) - minSize)) / (maxSize - minSize) + 5)
              },
              label: {
                show: true,
                formatter: function(param) {
                  return param.data[3]
                }
              },
              emphasis: {
                label: {
                  show: true,
                  formatter: function(param) {
                    return param.data[3]
                  },
                  position: 'inside'
                }
              },
              itemStyle: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          })
        })
        console.log(_opt)
        this.myChartObjs[0].setOption(_opt, true)
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    }, 2000)
  }
}
</script>
