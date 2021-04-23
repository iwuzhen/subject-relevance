<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2021-01-06 17:39:20
 * @LastEditors: ider
 * @LastEditTime: 2021-04-22 13:23:50
 * @LastEditTime: 2021-01-26 17:54:43
 * @Description:
-->
<template lang="pug">
v-container(fluid)
    v-row
        v-col(cols="2")
            v-select(v-model="subjectX",:items="categorys",dense,deletable-chips,label="学科 X",@change="getData")
        v-col(cols="2")
            v-select(v-model="subjectY",:items="categorys",dense,deletable-chips,label="学科 Y",@change="getData")
        v-col(cols="8")
            v-select(v-model="subjectRelevances",:items="categorys",dense,
                small-chips,deletable-chips,multiple,label="相关学科",@change="getData")

        v-col(cols="2")
            v-btn(@click="showTitle=!showTitle;getData()") {{showTitle===true?"关闭泡泡 title":"开启泡泡 title"}}

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
// import { extendEchartsOpts, MAGCoreCategorys2020, extendLineSeries, SELECT_MAG_DATA } from '@/api/data'
import { MAGCoreCategorys2020, SELECT_MAG_DATA, extendEchartsOpts } from '@/api/data'
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
      pageName: 'MAG 学科相关度 2020 相关二向图',
      myChartIds: ['masChart1'],
      loading: false,
      categorys: MAGCoreCategorys2020,
      subjectX: 'Biology',
      subjectY: 'Physics',
      subjectRelevances: SELECT_MAG_DATA,
      knowledge: 0,
      showTitle: true
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
        from: 1955,
        to: 2020,
        qs: -1,
        version: 'delete_noref_v3_node'
      }
      this.knowledge = 10
      const retObj = {}
      try {
        // x 轴
        let ret = await getMasDatav2(opt)
        this.knowledge = 30
        for (const i in ret.data.x) {
          retObj[ret.data.x[i]] = {}
          for (const j in ret.data.y) {
            retObj[ret.data.x[i]][ret.data.legend[j]] = [ret.data.y[j][i]]
          }
        }

        // y 轴
        opt.strA = this.subjectY
        ret = await getMasDatav2(opt)
        this.knowledge = 60
        for (const i in ret.data.x) {
          for (const j in ret.data.y) {
            retObj[ret.data.x[i]][ret.data.legend[j]].push(ret.data.y[j][i])
          }
        }

        // 学科大小
        opt = {
          doctype: 1,
          cats: calSubject.join(','),
          version: 'v3',
          yeartype: 0,
          from: 1955,
          to: 2020
        }
        ret = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', opt)

        this.knowledge = 100
        const allSize = _.flattenDeep(ret.data.y)
        const maxSize = Math.pow(_.max(allSize), 1 / 3)
        const minSize = Math.pow(_.min(allSize), 1 / 3)
        for (const i in ret.data.x) {
          for (const j in ret.data.y) {
            retObj[ret.data.x[i]][ret.data.legend[j]].push(ret.data.y[j][i], ret.data.legend[j], ret.data.x[i])
          }
        }
        // 象限区域线
        const markLine = {
          type: 'line',
          markLine: {
            label: {
              show: false
            },
            symbol: ['none', 'none'],
            lineStyle: {
              color: 'grey',
              width: 1
            },
            data: [
              {
                yAxis: 0.5
              }, {
                xAxis: 0.5
              }
            ]
          }
        }
        // 计算 timeline series
        const timelineSeries = []
        Object.entries(retObj).forEach(item => {
          const row = []
          Object.entries(item[1]).forEach(subitem => {
            row.push({
              name: subitem[0],
              data: [subitem[1]],
              type: 'scatter',
              symbolSize: function(data) {
                return Math.floor((70 * (Math.pow(Number(data[2]), 1 / 3) - minSize)) / (maxSize - minSize) + 5)
              },
              label: {
                show: this.showTitle,
                position: 'top',
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
                  position: 'top'
                }
              },
              itemStyle: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            })
          })
          row.push(markLine)
          timelineSeries.push(row)
        })
        console.log(timelineSeries)
        // 处理 echart opt
        const subjectY = this.subjectY
        const subjectX = this.subjectX
        const option = {
          baseOption: extendEchartsOpts({
            timeline: {
              axisType: 'category',
              orient: 'vertical',
              autoPlay: true,
              inverse: true,
              playInterval: 400,
              left: null,
              loop: false,
              right: 0,
              top: 20,
              bottom: 20,
              width: 55,
              height: null,
              label: {
                color: '#999'
              },
              symbol: 'none',
              lineStyle: {
                color: '#555'
              },
              checkpointStyle: {
                color: '#bbb',
                borderColor: '#777',
                borderWidth: 2
              },
              controlStyle: {
                showNextBtn: false,
                showPrevBtn: false,
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                label: {
                  color: '#fff'
                },
                controlStyle: {
                  color: '#aaa',
                  borderColor: '#aaa'
                }
              },
              data: ret.data.x
            },
            legend: {
              type: 'scroll',
              left: '80%',
              right: 'left',
              top: 'middle',
              textStyle: {
                fontSize: 13
              },
              orient: 'vertical'
            },
            grid: {
              left: '5%',
              right: '25%',
              top: '20%',
              bottom: '5%',
              containLabel: true
            },
            title: [{
              text: ret.data.x[0],
              textAlign: 'center',
              left: '85%',
              bottom: '5%',
              textStyle: {
                fontSize: 30
                // color: 'rgba(255, 255, 255, 0.7)'
              }
            }, {
              text: 'Two-dimensional distance',
              left: 'center',
              top: 0,
              textStyle: {
                // color: '#aaa',
                fontWeight: 'normal',
                fontSize: 20
              }
            }],
            tooltip: {
              padding: 5,
              textStyle: {
                color: '#fff'
              },
              backgroundColor: '#222',
              borderColor: '#777',
              borderWidth: 1,
              formatter: function(params) {
                let showHtm = ` ${params[0].seriesName}<br>`
                showHtm += `${subjectX}：${params[0].value[0]}<br>`
                showHtm += `${subjectY}：${params[0].value[1]}<br>`
                showHtm += `subject size：${params[0].value[2]}<br>`
                return showHtm
              }
            },

            xAxis: {
              name: this.subjectX,
              type: 'value',
              max: 1.001,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLabel: {
                fontSize: 16
              },
              splitNumber: 2,
              nameTextStyle: { fontSize: 16 }
            },
            yAxis: {
              name: this.subjectY,
              type: 'value',
              max: 1.001,
              axisLabel: {
                fontSize: 16
              },
              splitNumber: 2,
              splitLine: {
                show: false
              },
              nameTextStyle: { fontSize: 16 }
            },

            series: timelineSeries[0],
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut'
          }),
          options: timelineSeries.map(item => {
            return {
              series: item,
              title: { show: true, text: item[0].data[0][4] }
            }
          })
        }
        this.myChartObjs[0].setOption(option, true)
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    }, 1000)
  }
}
</script>
