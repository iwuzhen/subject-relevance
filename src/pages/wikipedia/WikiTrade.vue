<template lang='pug'>
v-container(fluid)
  v-row
      v-col(cols='2')
        v-select(v-model='subjectTarget', :items='categorys', dense, deletable-chips, label='目标学科', @change='getData')
      v-col(cols='10')
        v-select(v-model='subjectRelevances', :items='categorysOptions', dense, small-chips, deletable-chips, clearable, multiple, label='相关学科', @change='getData')
  v-row
    v-col(cols='2')
      v-select(v-model='methodSelect', :items='methodOpt', dense, deletable-chips, label='统计因子', @change='getData')
    v-col(cols='2')
      v-select(v-model='typeSelect', :items='typeOpt', dense, deletable-chips, label='图表类型', @change='getData')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container#masChart1(fluid, fill-height)
  v-row
    v-col
      comment(storagekey='wiki_Trade_Chart_1')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined, :loading='loading', height='70vh')
        v-container#masChart2(fluid, fill-height)
  v-row
    v-col
      comment(storagekey='wiki_Trade_Chart_2')

</template>

<script>
import { getYinguoData } from '@/api/index'
import { extendEchartsOpts, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

const v5Subject = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
  'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
  'Literature', 'History'].sort()

export default {
  name: 'MagTrade',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'mag 因果关系-贸易比例',
      methodSelect: 'linksout',
      methodOpt: ['linksin', 'linksout', { text: 'Import_and_export', value: 'Import_and_export' }],
      typeSelect: 0,
      typeOpt: [{ text: '趋势图', value: 0 }, { text: '正负图', value: 1 }],
      showAve: true,
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect1,
      categorys: v5Subject,
      loading: false,
      myChartIds: ['masChart1', 'masChart2'],
      averageLinedata: { title: '平均逐年距离图', legend: [], x: [], y: [] },
      currentAverageLine: { name: null, line: [] },
      count: 0

    }
  },
  computed: {
    categorysOptions: function() {
      return this.categorys.map(item => {
        const ret = {
          value: item,
          text: item
        }
        if (item === this.subjectTarget) ret['disabled'] = true
        return ret
      })
    }
  },
  methods: {

    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
      // this.$message.error("请选择完整");
        return false
      }
      this.handle()
    },
    handle: _.debounce(async function() {
      this.loading = true
      const opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item === this.subjectTarget) {
              return false
            }
            return true
          })
          .join(','),
        db: 'wiki',
        version: 'v5',
        method: this.methodSelect,
        type: this.typeSelect
        // from: this.years[0],
        // to: this.years[1],
      }
      if (this.methodSelect === 'authors_jj') {
        opt.returnType = this.returnType.Select
        opt.pureType = this.pureType.Select
      }
      // 趋势图
      await getYinguoData(opt)
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
              this.drawChart(res.data, 0, '比例')
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
      // 正负图
      opt.type = 1
      await getYinguoData(opt)
        .then(res => {
          if (res.data) {
            this.drawChart(res.data, 1, '影响力')
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
    }, 2000),

    drawChart(data, chartindex, yname) {
      const options = this.setOptions(data, yname)
      this.myChartObjs[chartindex].setOption(options, true)
      this.loading = false
    },

    setOptions(data, yname) {
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
          name: yname,
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
