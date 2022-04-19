<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='2')
      v-select(v-model='subjectTarget' :items='categorys' label='目标学科' @change='getData')
    v-col(cols='10')
      v-select(v-model='subjectRelevances' :items='categorysOptions' small-chips='' multiple='' deletable-chips='' clearable='' label='相关学科' @change='getData')
    v-col(cols='2')
      v-select(v-model='methodValue' :items='methodOptions' label='条件' @change='getData')
    v-col(v-if='pageCountOpt.length>1' cols='2')
      v-select(v-model='pageCountSelect' :items='pageCountOpt' label='文章数' @change='getData')
    v-col(cols='2')
      v-select(v-model='versionSelect' :items='versionOpt' label='version' @change='getData')
    v-col(v-if='levelOpt.length>1' cols='1')
      v-select(v-model='levelSelect' :items='levelOpt' label='层数' @change='levelChange')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart(fluid='' fill-height='')
  v-row
    v-col
      comment(v-if="storagekey!=''" :storagekey='storagekey')
</template>

<script>
import { getDistanceCore } from '@/api/index'
import { WIKI_TOP_CATEGORY, extendEchartsOpts, coreCategorys1, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

coreCategorys1.push({
  text: 'Theoretical physics',
  value: 'Theoretical physics'
})

const SessionXData = []
for (const year of _.range(2007, 2022)) {
  for (const session of _.range(1, 5)) {
    if (year === 2021 && session === 2) {
      break
    }
    SessionXData.push(`${year}-S${session}`)
  }
}

export default {
  name: 'CoreWiki',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: `Core Wiki 学科相关度 ${this.$route.query.version} `,
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect1,
      methodValue: 'linksin',
      pageCountSelect: '3000',
      categorys: coreCategorys1,
      methodOptions: ['linksin', 'linksout'],
      levelSelect: 3,
      levelOpt: [3],
      versionSelect: '',
      versionOpt: [],
      storagekey: '',
      pageCountOpt: [
        {
          value: '1000',
          text: 'top 1000 文章'
        },
        {
          value: '2000',
          text: 'top 2000 文章'
        },
        {
          value: '3000',
          text: 'top 3000 文章'
        },
        {
          value: '3500',
          text: 'top 3500 文章'
        },
        {
          value: '4000',
          text: 'top 4000 文章'
        },
        {
          value: '5000',
          text: 'top 5000 文章'
        },
        {
          value: '6000',
          text: 'top 6000 文章'
        },
        {
          value: '7000',
          text: 'top 7000 文章'
        },
        {
          value: '8000',
          text: 'top 8000 文章'
        },
        {
          value: '9000',
          text: 'top 9000 文章'
        },
        {
          value: '10000',
          text: 'top 10000 文章'
        }
      ],
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  computed: {
    categorysOptions: function() {
      const subjectTarget = this.subjectTarget
      return this.categorys.map(item => {
        const ret = {
          value: item.value,
          text: item.text
        }
        if (item.value === subjectTarget) ret['disabled'] = true
        return ret
      })
    }
  },
  mounted() {
    const v5Subject = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
      'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
      'Literature', 'History', 'Materials science', 'Engineering disciplines', 'Environmental science',
      'Medicine'].sort()

    this.storagekey = `disciplineCore_Chart_${this.$route.query.version}`
    if (this.$route.query.version === 'v1') {
      this.levelOpt = [3, 4]
      this.versionSelect = 'v1'
      this.versionOpt = ['v1']
    } else if (this.$route.query.version === 'v2') {
      this.levelOpt = [3]
      this.versionSelect = 'v2'
      this.versionOpt = ['v2']
    } else if (this.$route.query.version === 'v3') {
      this.levelOpt = [2, 3]
      this.versionSelect = 'v3'
      this.versionOpt = ['v3']
    } else if (this.$route.query.version === 'v4') {
      this.levelOpt = [2]
      this.levelSelect = 2
      this.methodValue = 'linksout'
      this.versionSelect = 'v4'
      this.versionOpt = ['v4']
    } else if (this.$route.query.version === 'v5') {
      this.levelOpt = [2, 3, 4]
      this.levelSelect = 4
      this.methodValue = 'linksout'
      this.pageCountSelect = -1
      this.pageCountOpt = [-1]
      this.versionSelect = 'v5_xueshu_noHistoryAndLiterature_node'
      this.versionOpt = ['v5_node', 'v5_edge',
        { text: '学术圈', value: 'v5_xueshu_node' },
        {
          text: '学术圈去历史文学',
          value: 'v5_xueshu_noHistoryAndLiterature_node'
        }]

      this.categorys = v5Subject.map(item => {
        let text = item
        if (item === 'Engineering disciplines') {
          text = 'Engineering'
        }
        return {
          text: text,
          value: item
        }
      })
    } else if (this.$route.query.version === 'article') {
      this.levelOpt = [-1]
      this.levelSelect = -1
      this.methodValue = 'linksin'
      this.methodOptions = ['linksin']
      this.pageCountSelect = -1
      this.pageCountOpt = [-1]
      this.versionSelect = 'article'
      this.versionOpt = ['article']
    } else if (this.$route.query.version === 'v5_new') {
      this.levelOpt = [2, 3]
      this.levelSelect = 3
      this.methodValue = 'linksout'
      this.methodOptions = ['linksin', 'linksout']
      this.pageCountSelect = -1
      this.pageCountOpt = [-1]
      this.versionSelect = 'v5_xueshu_node_newDB_new_noLiterature_session'
      this.versionOpt = [
        { text: 'v5', value: 'v5_node_newDB' },
        { text: 'v5 学术圈', value: 'v5_xueshu_node_newDB' },
        { text: 'v5 排除文学-季度', value: 'v5_node_newDB_new_noLiterature_session' },
        { text: 'v5 学术圈 排除文学-季度', value: 'v5_xueshu_node_newDB_new_noLiterature_session' }
      ]

      this.subjectRelevances = WIKI_TOP_CATEGORY
      this.categorys = WIKI_TOP_CATEGORY.map(item => {
        let text = item
        if (item === 'Engineering disciplines') {
          text = 'Engineering'
        }
        return {
          text: text,
          value: item
        }
      })
    }

    this.subjectRelevances = this.subjectRelevances.filter(item =>
      v5Subject.includes(item)
    )
  },
  methods: {
    levelChange() {
      if (this.$route.query.version === 'v5') {
        if (this.levelSelect === 2) {
          this.versionSelect = 'v5_xueshu_node'
          this.versionOpt = ['v5_node',
            { text: '学术圈', value: 'v5_xueshu_node' }
          ]
          let v5Subject = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
            'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
            'Literature', 'History', 'Materials science', 'Engineering disciplines', 'Environmental science',
            'Medicine', 'Art', 'Business'].sort()
          if (this.versionSelect === 'v5_xueshu_noHistoryAndLiterature_node') {
            v5Subject = v5Subject.filter(item => !['History', 'Literature'].includes(item))
          }

          this.subjectRelevances = v5Subject
          this.subjectRelevances = this.subjectRelevances.filter(item =>
            v5Subject.includes(item)
          )
          this.categorys = v5Subject.map(item => {
            let text = item
            if (item === 'Engineering disciplines') {
              text = 'Engineering'
            }
            return {
              text: text,
              value: item
            }
          })
        } else {
          this.versionOpt = ['v5_node', 'v5_edge',
            { text: '学术圈', value: 'v5_xueshu_node' },
            {
              text: '学术圈去历史文学',
              value: 'v5_xueshu_noHistoryAndLiterature_node'
            }]
          let v5Subject = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
            'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
            'Literature', 'History', 'Materials science', 'Engineering disciplines', 'Environmental science',
            'Medicine'].sort()
          if (this.versionSelect === 'v5_xueshu_noHistoryAndLiterature_node') {
            v5Subject = v5Subject.filter(item => !['History', 'Literature'].includes(item))
          }
          this.subjectRelevances = v5Subject
          this.subjectRelevances = this.subjectRelevances.filter(item =>
            v5Subject.includes(item)
          )
          this.categorys = v5Subject.map(item => {
            let text = item
            if (item === 'Engineering disciplines') {
              text = 'Engineering'
            }
            return {
              text: text,
              value: item
            }
          })
        }
      }
      this.getData()
    },
    async session_draw_1(opt) {
      // 非学术圈
      const session = ['v5_node_newDB_new_noLiterature_3', 'v5_node_newDB_new_noLiterature_6', 'v5_node_newDB_new_noLiterature_9', 'v5_node_newDB_new_noLiterature_12']
      await this.session_do_draw(session, opt)
    },
    async session_draw_2(opt) {
      // 学术圈
      const session = ['v5_xueshu_node_newDB_new_noLiterature_3', 'v5_xueshu_node_newDB_new_noLiterature_6', 'v5_xueshu_node_newDB_new_noLiterature_9', 'v5_xueshu_node_newDB_new_noLiterature_12']
      await this.session_do_draw(session, opt)
    },
    async session_do_draw(session, opt) {
      const nextData = []
      for (const sess of session) {
        opt.btype = sess
        const data = await getDistanceCore(opt)
        nextData.push(data.data)
      }
      // 重组 data
      const retData = {
        title: nextData[0].title,
        legend: nextData[0].legend,
        x: SessionXData,
        y: []
      }
      // eslint-disable-next-line no-unused-vars
      for (const _ in retData.legend) {
        retData.y.push([])
      }
      // 组合
      const yDictList = []
      for (const i in nextData) {
        const tmpDict = {}
        for (const j in nextData[i].legend) {
          tmpDict[nextData[i].legend[j]] = _.reverse(nextData[i].y[j])
        }
        yDictList.push(tmpDict)
      }
      while (yDictList[0][retData.legend[0]].length > 0) {
        for (const i in yDictList) {
          for (const leg_i in retData.legend) {
            if (yDictList[i][retData.legend[leg_i]].length > 0) {
              retData.y[leg_i].push(
                yDictList[i][retData.legend[leg_i]].pop()
              )
            }
          }
        }
      }
      console.log(retData)
      this.drawChart(retData)
    },
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
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
        level: this.pageCountSelect,
        levelType: this.levelSelect,
        btype: this.versionSelect
      }
      if (this.versionSelect === 'v5_node_newDB_new_noLiterature_session') {
        await this.session_draw_1(opt)
        this.loading = false
      } else if (this.versionSelect === 'v5_xueshu_node_newDB_new_noLiterature_session') {
        await this.session_draw_2(opt)
        this.loading = false
      } else {
        getDistanceCore(opt)
          .then(res => {
            if (res.data) {
              this.drawChart(res.data)
            } else {
              this.loading = false
              // this.$emit("emitMesage", "请求失败");
              return false
            }
          })
          .catch(rej => {
            this.loading = false
            this.$emit('emitMesage', `请求失败:${rej}`)
          })
      }
    },
    drawChart(data) {
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const _opt = extendEchartsOpts({
        title: {
          text: this.subjectTarget,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        legend: {
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
          minorSplitLine: {
            fontSize: 14
          },
          // max: 1,
          // max: 'dataMax',
          min: function(value) {
            console.log(Math.floor(value.min * 10 - 1) / 10)
            return Math.floor(value.min * 10) / 10
          }
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

