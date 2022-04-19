<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='2')
      v-select(v-model='peopleSubjectSelect' :items='defaultPeopleSubjectOpt' label='当前人' @change='getData')
    v-col(cols='5')
      v-select(v-model='targetSubjectSelect' :items='subjectOpt' chips='' multiple='' dense='' clearable='' deletable-chips='' label='目标学科' @change='targetSubjectChange')
    v-col(cols='5')
      v-select(v-model='targetPeopleSubjectSelect' :items='peopleSubjectOpt' chips='' multiple='' dense='' deletable-chips='' clearable='' label='目标人' @change='targetPeopleSubjectChange')
    v-col(cols='2')
      v-select(v-model='methodSelect' :items='methodOpt' dense='' label='条件' @change='getData')
    v-col(cols='2')
      v-select(v-model='levelSelect' :items='levelOpt' dense='' label='level' @change='getData')
  v-row
    v-col(col='12')
      v-card#subjectChart1.mx-auto(outlined='' :loading='loading' height='45vh')
  v-row
    v-col(col='12')
      v-card#subjectChart2.mx-auto(outlined='' :loading='loading' height='45vh')
</template>

<script>
import { getDistanceByPeopleAndCats, getDistanceByPeoples } from '@/api/index'

import {
  peopleCategorys,
  extendEchartsOpts,
  lessPersonCategorys,
  extendLineSeries
} from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'WikiPeople',
  extends: Base,
  data() {
    return {
      pageName: 'wiki 人的相关度',
      peopleSubjectSelect: '',
      targetSubjectSelect: [],
      targetPeopleSubjectSelect: [],
      methodSelect: 'linksin',
      levelSelect: '1000',
      defaultPeopleSubjectOpt: peopleCategorys.map(item => {
        return {
          value: item[0],
          text: item[1]
        }
      }),
      subjectOpt: lessPersonCategorys,
      methodOpt: ['linksin'],
      levelOpt: [
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
          value: '4000',
          text: 'top 4000 文章'
        },
        {
          value: '5000',
          text: 'top 5000 文章'
        }
      ],
      dialog: false,
      loading: false,
      myChartIds: ['subjectChart1', 'subjectChart2']
    }
  },
  computed: {
    unionCategory: function() {
      const peopleCategoryValues = new Set(
        peopleCategorys.map(item => {
          return item[0]
        })
      )
      return new Set(this.subjectOpt.filter(x => peopleCategoryValues.has(x)))
    },
    peopleSubjectOpt: function() {
      const peopleSubjectSelect = this.peopleSubjectSelect
      return peopleCategorys.map(item => {
        const ret = {
          value: item[0],
          text: item[1]
        }
        if (item[0] === peopleSubjectSelect) ret['disabled'] = true
        return ret
      })
    }
  },
  methods: {
    async targetSubjectChange() {
      // 学科和人关联
      const newTargetPeopleSubjectSelect = new Set()
      for (const subject of this.targetSubjectSelect) {
        if (this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject)
        }
      }
      for (const subject of this.targetPeopleSubjectSelect) {
        if (!this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject)
        }
      }
      this.targetPeopleSubjectSelect = Array.from(newTargetPeopleSubjectSelect)
      this.getData()
    },
    async targetPeopleSubjectChange() {
      const newTargetPeopleSubjectSelect = new Set()
      for (const subject of this.targetPeopleSubjectSelect) {
        if (this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject)
        }
      }
      for (const subject of this.targetSubjectSelect) {
        if (!this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject)
        }
      }
      this.targetSubjectSelect = Array.from(newTargetPeopleSubjectSelect)
      this.getData()
    },
    async getSubjectDegree() {
      if (!this.peopleSubjectSelect || this.targetSubjectSelect.length === 0) {
        return false
      }
      let chartData
      this.loading = true
      if (this.targetSubjectSelect.length > 0) {
        const opt = {
          strA: this.peopleSubjectSelect,
          strB: this.targetSubjectSelect.join(','),
          method: this.methodSelect,
          level: this.levelSelect
        }
        const retData = await getDistanceByPeopleAndCats(opt)
        if (retData.data) {
          chartData = retData.data
        } else {
          // this.$emit("emitMesage", "请求失败");
        }
      }
      const options = this.setOptions(chartData)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    async getPeopleDegree() {
      if (
        !this.peopleSubjectSelect ||
        this.targetPeopleSubjectSelect.length === 0
      ) {
        return false
      }
      let chartData
      this.loading = true

      if (this.targetPeopleSubjectSelect.length > 0) {
        const peopleSubjectSelect = this.peopleSubjectSelect
        const opt = {
          strA: this.peopleSubjectSelect,
          strB: this.targetPeopleSubjectSelect
            .filter(item => {
              if (item === peopleSubjectSelect) {
                return false
              }
              return true
            })
            .join(','),
          method: this.methodSelect,
          level: this.levelSelect
        }
        const retData = await getDistanceByPeoples(opt)
        if (retData.data) {
          chartData = retData.data
        } else {
          // this.$emit("emitMesage", "请求失败");
        }
      }

      const options = this.setOptions(chartData)
      this.myChartObjs[1].setOption(options, true)
      this.loading = false
    },
    async getData() {
      this.getSubjectDegree()
      this.getPeopleDegree()
    },

    setOptions(data) {
      const _opt = extendEchartsOpts({
        title: {
          text: data.title,
          left: '35%'
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
          name: 'Semantic Distance',
          type: 'value',
          max: 1
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
