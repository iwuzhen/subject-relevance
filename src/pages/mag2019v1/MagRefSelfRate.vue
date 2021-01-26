<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          small-chips
          multiple
          deletable-chips
          clearable
          label="学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          dense
          label="条件"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="versionValue"
          :items="versionOptions"
          dense
          label="版本"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-range-slider
          v-model="years"
          :max="2020"
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
      <v-col>
        <v-btn
          :color="showAve ? 'light-green' : 'lime'"
          @click="
            showAve = !showAve;
            getData();
          "
        >{{ showAve ? "关闭平均自恋度" : "开启平均自恋度" }}</v-btn>
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
      <v-col>
        <comment storagekey="MagRefSelfRate_Chart_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getMagRefSelfRate } from '@/api/index'
import { extendEchartsOpts, coreCategorys, extendLineSeries, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

export default {
  name: 'MagRefSelfRate',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      versionValue: 'v2',
      versionOptions: ['v1', { text: 'v2全集,去重', value: 'v2' }, { text: 'v2全集,不去重', value: 'v2_distinct' }, { text: 'v2去0,不去重', value: 'delete_noref_v2_distinct' }],
      pageName: 'MAG 学科自恋度 v1&v2',
      showAve: true,
      subjectTarget: defaultCategorySelect,
      methodValue: 'linksin',
      years: [1900, 2019],
      categorys: coreCategorys,
      methodOptions: ['article', 'linksout', 'linksin'],
      loading: false,
      myChartIds: ['masChart1']
    }
  },
  computed: {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.subjectTarget.length < 1) {
        return false
      }
      this.loading = true
      const opt = {
        str: this.subjectTarget.join(','),
        method: this.methodValue,
        from: this.years[0],
        to: this.years[1],
        version: this.versionValue
      }
      try {
        const res = await getMagRefSelfRate(opt)
        console.log(res.data)
        if (this.subjectTarget.length > 1 && this.showAve) {
          const aveLine = []
          for (const i in res.data.x) {
            let ss = 0
            for (const row of res.data.y) {
              ss += row[i]
            }
            aveLine.push(ss / res.data.y.length)
          }
          res.data.y.push(aveLine)
          res.data.legend.push('平均自恋度')
          this.drawChart(res.data)
        } else this.drawChart(res.data)
      } catch (error) {
        this.loading = false
        this.$emit('emitMesage', `请求失败:${error}`)
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
          name: 'RefSelfRate',
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
