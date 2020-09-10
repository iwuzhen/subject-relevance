<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          label="起始年份"
          @change="getData"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="refSelect"
          :items="refOpt"
          label="引用关系"
          @change="getData"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="refRangeSelect"
          :items="refRangeOpt"
          label="引用范围"
          @change="getData"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="versionSelect"
          :items="versionOpt"
          label="版本"
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
import { getMasCompositionByYear } from '@/api/index'
import { extendEchartsOpts, coreCategorys, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'Mag',
  extends: Base,
  data() {
    return {
      pageName: 'MAG 学科引用年度分布',
      subjectRelevances: defaultCategorySelect1,
      categorys: coreCategorys,
      yearSelect: 1980,
      yearOpt: [1950, 1960, 1970, 1980, 1990, 1995, 2000],
      refSelect: 'linksin',
      refOpt: ['linksin', 'linksout'],
      myChartIds: ['subjectChart'],
      loading: false,
      versionSelect: 'v2',
      versionOpt: ['v1', 'v2'],
      refRangeSelect: 0,
      refRangeOpt: [{ text: '全集引用', value: 0 }, { text: '学科内部引用', value: 1 }]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.versionSelect === 'v1' && this.refRangeSelect === 1) {
        this.$emit('emitMesage', 'v1 版本没有计算学科内部引用')
      }

      if (this.subjectRelevances.length === 0) {
        return false
      }
      this.loading = true
      const opt = {
        str: this.subjectRelevances.join(','),
        year: this.yearSelect,
        method: this.refSelect,
        version: this.versionSelect,
        type: this.refRangeSelect
      }
      getMasCompositionByYear(opt)
        .then(res => {
          if (res.data) {
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
          name: 'Percent',
          type: 'value'
        },
        series: data.y.map((item, index) => {
          return extendLineSeries({
            name: data.legend[index],
            type: 'line',
            smooth: false,
            data: item.map(each => {
              // eslint-disable-next-line eqeqeq
              if (each == Infinity) {
                return 0
              }
              return each
            })
          })
        })
      })
      return _opt
    }
  }
}
</script>

<style lang="less" scoped></style>
