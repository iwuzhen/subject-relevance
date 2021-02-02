<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='2')
      v-select(v-model='subjectTarget' :items='categorys' dense='' deletable-chips='' label='目标学科' @change='getData')
    v-col(cols='6')
      v-select(v-model='subjectRelevances' :items='categorysOptions' dense='' small-chips='' deletable-chips='' clearable='' multiple='' label='相关学科' @change='getData')
    v-col(cols='1')
      v-select(v-model='methodValue' :items='methodOptions' dense='' label='条件' @change='getData')
    v-col(cols='1')
      v-select(v-model='typeValue' :items='typeOptions' dense='' label='数据类型' @change='getData')
    v-col(cols='2')
      v-select(v-model='versionValue' :items='versionOptions' dense='' label='version' @change='getData')
  v-row
    v-col(cols='7')
      v-range-slider.align-center(v-model='years' :max='2020' :min='1955' dense='' hide-details='' hint='年份范围' @change='getData')
        template(v-slot:prepend='')
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='years[0]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 0, $event)')
        template(v-slot:append='')
          v-text-field.mt-0.pt-0(:value='years[1]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 1, $event)')
    v-col(cols='1')
      v-btn(:color="showAve ? 'light-green' : 'lime'" @click='\
      showAve = !showAve;\
      getData();\
      ') {{ showAve ? "关闭平均距离" : "开启平均距离" }}
    v-col(cols='1')
      v-btn(color='light-green' :disabled='currentAverageLine.name===null' @click='recordAveLine') 记录平均距离
    v-col(cols='1')
      v-btn(:disabled='averageLinedata.legend.length===0' color='light-green' @click='initAverageLinedata') 清空平均距离
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#masChart1(fluid='' fill-height='')
  v-row
    v-col
      comment(storagekey='GoogleDistance_graph_1')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#masChart2(fluid='' fill-height='')
  v-row
    v-col
      comment(storagekey='GoogleDistance_graph_2')

</template>

<script>
import { getGoogleDistance_tempdata } from '@/api/index'
import { extendEchartsOpts, MAGCoreCategorys2020, extendLineSeries, SELECT_MAG_DATA } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

const currentSubbjectOpt = MAGCoreCategorys2020.concat([{
  text: 'Business',
  value: 'Business'
}, {
  text: 'Art',
  value: 'Art'
}]).sort((a, b) => a.text.localeCompare(b.text))

export default {
  name: 'GoogleDistance',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MAG Google 距离中间数据',
      typeValue: 1,
      typeOptions: [{ text: '引用数', value: 0 }, { text: '引用交集数', value: 1 }],
      showAve: true,
      subjectTarget: '',
      subjectRelevances: SELECT_MAG_DATA,
      methodValue: 'linksin',
      years: [2007, 2020],
      categorys: currentSubbjectOpt,
      methodOptions: ['linksin', 'linksout'],
      bfValue: '不适用',
      bfOpt: ['不适用', 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015],
      loading: false,
      myChartIds: ['masChart1', 'masChart2'],
      averageLinedata: { title: '平均逐年距离图', legend: [], x: [], y: [] },
      currentAverageLine: { name: null, line: [] },
      count: 0,
      versionOptions: [{ text: '论文(去0 去Book 去Patent 按点)', value: 'tjart_nopb_delete_noref_v3_node' }],
      versionValue: 'tjart_nopb_delete_noref_v3_node'
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
        dbtype: 'mag',
        from: this.years[0],
        to: this.years[1],
        type: this.typeValue,
        level: -1,
        levelType: -1
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
    },
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
