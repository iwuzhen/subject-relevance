<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='2')
      v-select(v-model='option.peopleSubject.select' :items='option.peopleSubject.opt' label='当前人' @change='getData')
    v-col(cols='5')
      v-select(v-model='option.targetSubject.select' :items='option.targetSubject.opt' chips multiple dense clearable deletable-chips label='目标学科' @change='getSubjectDegree')
    v-col(cols='5')
      v-select(v-model='option.targetPeopleSubject.select' :items='option.targetPeopleSubject.opt' chips multiple dense deletable-chips clearable label='目标人' @change='getPeopleDegree')
    v-col(cols='2')
      v-select(v-model='option.method.select' :items='option.method.opt' disabled dense label='条件' @change='getData')
  v-row
    v-col(col='12')
      v-card#subjectChart1.mx-auto(outlined :loading='loading' height='45vh')
  v-row
    v-col(col='12')
      v-card#subjectChart2.mx-auto(outlined :loading='loading' height='45vh')
  v-row
    v-col
      comment(storagekey='wikipedia_build_disruption_people_graph_1').
</template>

<script>
import { requestWrap } from '@/api/index'

import comment from '@/components/comment'
import {
  peopleCategorys,
  extendEchartsOpts,
  extendLineSeries
} from '@/api/data'
import Base from '@/utils/base'

const peopleOpt = peopleCategorys.map(item => {
  return {
    value: item[0],
    text: item[1]
  }
})
export default {
  name: 'WikiPeople',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wiki 人的相关度',
      option: {
        peopleSubject: {
          select: 'Biology',
          opt: peopleOpt
        },
        targetSubject: {
          select: ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
            'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
            'Materials science', 'Engineering disciplines', 'Environmental science', 'Medicine'],
          opt: ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
            'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
            'Materials science', 'Engineering disciplines', 'Environmental science', 'Medicine']
        },
        targetPeopleSubject: {
          select: ['Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
            'Chemistry', 'Sociology', 'Linguistics', 'Computer science'],
          opt: peopleOpt
        },
        method: {
          select: 'linksin',
          opt: ['linksin']
        }
      },

      dialog: false,
      loading: false,
      myChartIds: ['subjectChart1', 'subjectChart2']
    }
  },
  computed: {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getSubjectDegree() {
      if (!this.option.peopleSubject.select || this.option.targetSubject.select.length === 0) {
        return false
      }
      this.loading = true
      const opt = {
        strA: this.option.peopleSubject.select,
        strB: this.option.targetSubject.select.filter(item => item !== this.option.peopleSubject.select).join(','),
        method: this.option.method.select,
        'btype': 'peopleAndCat'
      }
      try {
        const retData = await requestWrap('/wiki/getDistanceByPeopleAndCats_newDB', 'POST', opt)
        console.log(retData)
        const _opt = this.setOptions(retData.data)
        this.myChartObjs[0].setOption(_opt, true)
      } catch (error) {
        this.$emit('emitMesage', '请求失败', error)
      } finally {
        this.loading = false
      }

      // const options = this.setOptions(chartData)
      // this.myChartObjs[0].setOption(options, true)
    },
    async getPeopleDegree() {
      if (!this.option.peopleSubject.select || this.option.targetPeopleSubject.select.length === 0) {
        return false
      }
      this.loading = true
      const opt = {
        strA: this.option.peopleSubject.select,
        strB: this.option.targetPeopleSubject.select.filter(item => item !== this.option.peopleSubject.select).join(','),
        method: this.option.method.select,
        'btype': 'peopleAndPeople'
      }
      try {
        const retData = await requestWrap('/wiki/getDistanceByPeoples_newDB', 'POST', opt)
        console.log(retData)
        const _opt = this.setOptions(retData.data)
        this.myChartObjs[1].setOption(_opt, true)
      } catch (error) {
        this.$emit('emitMesage', '请求失败', error)
      } finally {
        this.loading = false
      }
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
