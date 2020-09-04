<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          chips
          multiple
          dense
          deletable-chips
          clearable
          label="目标学科"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-container
            id="subjectChart"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getMasArticlesTotal } from '@/api/index'
import { extendEchartsOpts, defaultCategorySelect, coreCategorys, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'Mag',
  extends: Base,
  data() {
    return {
      pageName: 'MAG 文章数',
      subjectRelevances: defaultCategorySelect,
      categorys: coreCategorys,
      typeOptions: [
        {
          value: '0',
          text: '否'
        },
        {
          value: '1',
          text: '是'
        },
        {
          value: 'mas',
          text: 'mag'
        }
      ],
      levelOptions: ['0', '1', '2'],
      myChartIds: ['subjectChart'],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.subjectRelevances.length === 0) {
        return false
      }
      this.loading = true
      const opt = {
        subjects: this.subjectRelevances.join(',')
      }
      getMasArticlesTotal(opt)
        .then(res => {
          if (res.data) {
            console.log(res.data)
            this.drawChart(res.data)
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
      console.log(this.subjectRelevances)
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const years = Object.keys(Object.values(data)[0])
      const _opt = extendEchartsOpts({
        title: {
          text: '学科 article 数量'
        },
        legend: {
          data: Object.keys(data)
        },
        xAxis: {
          name: 'Year',
          type: 'category',
          boundaryGap: false,
          data: years
        },
        yAxis: {
          name: 'Count',
          type: 'value'
        },
        series: Object.entries(data).map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: Object.values(item[1])
          })
        })
      })
      return _opt
    }
  }
}
</script>
