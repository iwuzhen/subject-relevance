<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="subjectLevel"
          :items="levelOptions"
          label="相关学科"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          id="subjectChart"
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDistanceByFile } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'CognitiveScience',
  extends: Base,
  data() {
    return {
      pageName: 'Cognitive science 相关度',
      subjectTarget: 'Cognitive science',
      subjectLevel: '1',
      categorys: ['Cognitive science'],
      levelOptions: ['1', '2', 'mas'],
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      const opt = {
        strA: this.subjectTarget,
        level: this.subjectLevel
      }
      getDistanceByFile(opt)
        .then(res => {
          if (res.data.data) {
            this.drawChart(res.data.data)
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
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
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

<style lang="less" scoped></style>
