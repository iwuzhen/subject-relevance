<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='2')
      v-select(v-model='subjectTarget', :items='categorys', dense, deletable-chips, label='目标学科', @change='getData').
    v-col(cols='5')
      v-select(v-model='subjectRelevances', :items='categorysOptions', dense, small-chips, deletable-chips, clearable, multiple, label='相关学科', @change='getData').
    v-col(cols='1')
      v-select(v-model='methodValue', :items='methodOptions', dense, label='条件', @change='getData').
    v-col(cols='1')
      v-select(v-model='typeValue', :items='typeOptions', dense, label='数据类型', @change='getData').
    v-col(cols='1')
      v-select(v-model='versionValue', :items='versionOptions', dense, label='version', @change='getData').
    v-col(cols='1')
      v-select(v-model='levelValue', :items='levelOpt', dense, label='level', @change='getData').
    v-col(cols='1')
      v-select(v-model='levelTypeValue', :items='levelTypeOpt', dense, label='level type', @change='getData').
  v-row
    v-col(cols='7')
      v-range-slider.align-center(v-model='years', :max='2020', :min='2007', dense, hide-details, hint='年份范围', @change='getData')
        template(v-slot:prepend)
        template(v-slot:append)
    v-col(cols='1')
      v-btn(:color="showAve ? 'light-green' : 'lime'", @click='showAve = !showAve;getData();') {{ showAve ? "关闭平均距离" : "开启平均距离" }}
    v-col(cols='1')
      v-btn(color='light-green', :disabled='currentAverageLine.name===null', @click='recordAveLine') 记录平均距离
    v-col(cols='1')
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
      comment(storagekey='WikiGoogleDistance_chart_1').
</template>

<script>
import { getGoogleDistance_tempdata } from '@/api/index'
import { extendEchartsOpts, coreCategorys1, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'
import _ from 'lodash'
import comment from '@/components/comment'

export default {
  name: 'WIKIGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'WIKI Google 距离中间数据',
      typeValue: 1,
      typeOptions: [{ text: '引用数', value: 0 }, { text: '引用交集数', value: 1 }],
      showAve: true,
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect1,
      methodValue: 'linksin',
      years: [2007, 2020],
      categorys: coreCategorys1,
      methodOptions: ['linksin', 'linksout'],
      bfValue: '不适用',
      bfOpt: ['不适用', 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],
      loading: false,
      myChartIds: ['masChart1', 'masChart2'],
      averageLinedata: { title: '平均逐年距离图', legend: [], x: [], y: [] },
      currentAverageLine: { name: null, line: [] },
      count: 0,
      versionOptions: ['v3', 'v4', 'v5_node', 'v5_edge', 'article'],
      versionValue: 'v3',
      levelValue: 1000,
      levelOpt: [{ text: '不选择', value: -1 }, 1000, 2000, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
      levelTypeValue: 2,
      levelTypeOpt: [{ value: -1, text: '不选择' }, 2, 3]
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

    getData: _.debounce(async function() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      // 补丁
      this.loading = true
      if (this.versionValue === 'v5_node' || this.versionValue === 'v5_edge') {
        this.levelValue = -1
        this.levelTypeValue = 3
      } else if (this.versionValue === 'v4') {
        if (this.levelValue === -1) {
          this.levelValue = 1000
          this.levelTypeValue = 2
        }
        if (this.levelTypeValue === -1) {
          this.levelTypeValue = 2
        }
      } else if (this.versionValue === 'v3') {
        if (this.levelValue === -1) {
          this.levelValue = 1000
          this.levelTypeValue = 2
        }
        if (this.levelTypeValue === -1) {
          this.levelTypeValue = 2
        }
      } else if (this.versionValue === 'v4') {
        this.levelTypeValue = 2
      } else if (this.versionValue === 'article') {
        this.levelValue = -1
        this.methodValue = 'linksin'
        this.levelTypeValue = -1
      }
      const opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item === this.subjectTarget && this.typeValue === 1) {
              return false
            }
            return true
          })
          .join(','),
        version: this.versionValue,
        method: this.methodValue,
        dbtype: 'wiki',
        from: this.years[0],
        to: this.years[1],
        type: this.typeValue,
        level: this.levelValue,
        levelType: this.levelTypeValue
      }
      getGoogleDistance_tempdata(opt)
        .then(res => {
          if (res.data) {
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
