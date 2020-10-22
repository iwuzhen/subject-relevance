<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          deletable-chips
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="10">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          dense
          small-chips
          deletable-chips
          clearable
          multiple
          label="相关学科"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1900"
          dense
          hide-details
          hint="年份范围"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 100px">年份范围</p>
            <v-text-field
              :value="years[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(years, 0, $event)"
            />
          </template>
          <template v-slot:append>
            <v-text-field
              :value="years[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(years, 1, $event)"
            />
          </template>
        </v-range-slider>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          dense
          deletable-chips
          label="统计因子"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="versionSelect"
          :items="versionOpt"
          dense
          deletable-chips
          label="基础数据"
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
            id="masChart1"
            fluid
            fill-height
          />
        </v-card>
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
            id="masChart2"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getYinguoData } from '@/api/index'
import { extendEchartsOpts, coreCategorys, extendLineSeries, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'
coreCategorys.push({
  text: 'Theoretical physics',
  value: 'Theoretical physics'
})

coreCategorys.push({
  text: 'Discrete mathematics',
  value: 'Discrete mathematics'
})

export default {
  name: 'MagTrade',
  extends: Base,
  data() {
    return {
      pageName: 'mag 因果关系-贸易比例',
      methodSelect: 'article',
      methodOpt: ['article', 'linksin', 'linksout', { text: 'Import_and_export', value: 'Import_and_export' }],
      versionSelect: 'v2',
      versionOpt: [{ text: 'v2 全集,去重', value: 'v2' }, { text: 'v2 全集,不去重', value: 'v2_distinct' }, { text: 'v2 去 0,不去重', value: 'delete_noref_v2_distinct' }],
      showAve: true,
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect,
      years: [1945, 2018],
      categorys: coreCategorys,
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
          value: item.value,
          text: item.text
        }
        if (item.value === this.subjectTarget) ret['disabled'] = true
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
        db: 'mag',
        method: this.methodSelect,
        type: 0,
        from: this.years[0],
        to: this.years[1],
        version: this.versionSelect
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
    },
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
