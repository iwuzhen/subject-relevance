<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='2')
      v-select(v-model='option.subjectTarget.select', :items='option.subjectTarget.opt', dense, deletable-chips, label='目标学科', @change='getData').
    v-col(cols='5')
      v-select(v-model='option.subjectRelevances.select', :items='option.subjectRelevances.opt', dense, small-chips, deletable-chips, clearable, multiple, label='相关学科', @change='getData').
    v-col(cols='2')
      v-select(v-model='option.method.select', :items='option.method.opt', dense, label='条件', @change='getData').
    v-col(cols='2')
      v-select(v-model='option.type.select', :items='option.type.opt', dense, label='数据类型', @change='getData').
    v-col(cols='2')
      v-select(v-model='option.version.select', :items='option.version.opt', dense, label='version', @change='getData').
    v-col(cols='2')
      v-select(v-model='option.levelType.select', :items='option.levelType.opt', dense, label='level type', @change='getData').
    v-col(cols='2')
      v-btn(:color="showAve ? 'light-green' : 'lime'", @click='showAve = !showAve;getData();') {{ showAve ? "关闭平均距离" : "开启平均距离" }}
    v-col(cols='2')
      v-btn(color='light-green', :disabled='currentAverageLine.name===null', @click='recordAveLine') 记录平均距离
    v-col(cols='2')
      v-btn(:disabled='averageLinedata.legend.length===0', color='light-green', @click='initAverageLinedata') 清空距离图
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container#masChart1(fluid, fill-height).
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container#masChart2(fluid, fill-height).
  v-row
    v-col
      comment(storagekey='WikiGoogleDistance_2022_chart_1').
</template>

<script>
import { getGoogleDistance_tempdata } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import _ from 'lodash'
import comment from '@/components/comment'

const Subjects = ['Biology', 'Physics', 'Chemistry', 'Political science', 'Computer science', 'Psychology', 'Economics', 'Sociology', 'Engineering disciplines', 'Environmental science', 'Geography', 'Geology', 'Linguistics', 'Materials science', 'Mathematics', 'Medicine', 'Philosophy'].sort()

export default {
  name: 'WIKIGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'WIKI Google 距离中间数据',
      option: {
        subjectTarget: {
          select: 'Biology',
          opt: Subjects
        },
        subjectRelevances: {
          select: Subjects.concat(),
          opt: Subjects
        },
        version: {
          select: 'v5_node_newDB_new_noLiterature',
          opt: [{
            text: 'v5_排除文学_季度',
            value: 'v5_node_newDB_new_noLiterature'
          }, {
            text: 'v5_排除文学_季度_学术',
            value: 'v5_xueshu_node_newDB_new_noLiterature'
          }]
        },
        method: {
          select: 'linksin',
          opt: ['linksin', 'linksout']
        },
        type: {
          select: 0,
          opt: [{ text: '引用数', value: 0 }, { text: '引用交集数', value: 1 }]
        },
        levelType: {
          select: 2,
          opt: [2, 3]
        }
      },
      showAve: true,
      subjectTarget: '',
      subjectRelevances: Subjects,
      years: [2007, 2020],
      categorys: Subjects,
      bfValue: '不适用',
      bfOpt: ['不适用', 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],
      loading: false,
      myChartIds: ['masChart1', 'masChart2'],
      averageLinedata: { title: '平均逐年距离图', legend: [], x: [], y: [] },
      currentAverageLine: { name: null, line: [] },
      count: 0
    }
  },
  mounted() {
    this.getData()
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

    getData: _.debounce(async function() {
      // return
      if (!this.option.subjectTarget.select || this.option.subjectRelevances.select === 0) {
        return false
      }
      // 补丁
      this.loading = true
      const opt = {
        strA: this.option.subjectTarget.select,
        strB: this.option.subjectRelevances.select
          .filter(item => {
            if (item === this.option.subjectTarget.select) {
              return false
            }
            return true
          })
          .join(','),
        version: this.option.version.select,
        method: this.option.method.select,
        dbtype: 'wiki_newDB',
        // from: this.years[0],
        // to: this.years[1],
        type: this.option.type.select,
        level: -1,
        levelType: this.option.levelType.select,
        from: 2007,
        to: 2021
      }
      getGoogleDistance_tempdata(opt)
        .then(res => {
          if (res.data) {
            console.log(res.data)
            if (this.subjectRelevances.length > 1 && this.showAve) {
              console.log(res.data)
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
    }, 500),
    drawChart(data) {
      console.log(data)
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: data.legend
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          name: 'Count',
          type: 'value'
        },
        series: data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index],
            type: 'line',
            smooth: false,
            data: item
          })
        })
      })
      return _opt
    }
  }
}
</script>
