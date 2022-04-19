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
      <v-col cols="6">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          small-chips
          multiple
          deletable-chips
          clearable
          label="相关学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          label="条件"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="subjectLevel"
          :items="levelOptions"
          label="level"
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
import { getWikiData } from '@/api/index'
import { extendEchartsOpts, lessCategorys, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'Wiki',
  extends: Base,
  data() {
    return {
      pageName: 'wiki 学科相关度',
      subjectTarget: '',
      subjectRelevances: [],
      methodValue: 'linksin',
      subjectLevel: '0',
      categorys: lessCategorys,
      methodOptions: ['linksin', 'linksout'],
      levelOptions: [
        {
          value: '0',
          text: '0 层'
        },
        {
          value: '1',
          text: '1 层'
        },
        {
          value: '2',
          text: ' 2层'
        },
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
  methods: {
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
        level: this.subjectLevel
      }
      getWikiData(opt)
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
