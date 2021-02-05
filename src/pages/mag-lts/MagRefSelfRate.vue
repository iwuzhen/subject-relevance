<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='8')
      v-select(v-model='subjectTarget' :items='categorys' dense='' small-chips='' multiple='' deletable-chips='' clearable='' label='学科' @change='getData')
    v-col(cols='2')
      v-select(v-model='methodValue' :items='methodOptions' dense='' label='条件' @change='getData')
    v-col(cols='2')
      v-select(v-model='versionValue' :items='versionOptions' dense='' label='版本' @change='getData')
    v-col(cols='2')
      v-select(v-model='magVersionSelect' :items='magVersionOpt' dense='' label='MAG 版本' @change='versionCHange')
    v-col(cols='8')
      v-range-slider.align-center(v-model='years' :max='2020' :min='1900' dense='' hide-details='' hint='年份范围' @change='getData')
        template(v-slot:prepend='')
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='years[0]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 0, $event)')
        template(v-slot:append='')
          v-text-field.mt-0.pt-0(:value='years[1]' hide-details='' single-line='' type='number' style='width: 60px' @change='$set(years, 1, $event)')
    v-col
      v-btn(:color="showAve ? 'light-green' : 'lime'" @click='\
      showAve = !showAve;\
      getData();\
      ') {{ showAve ? "关闭平均自恋度" : "开启平均自恋度" }}
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#masChart1(fluid='' fill-height='')
  v-row
    v-col
      comment(storagekey='MagRefSelfRate_Chart_1')
</template>

<script>
import { getMagRefSelfRate } from '@/api/index'
import { extendEchartsOpts, coreCategorys, extendLineSeries, MAGCoreCategorys2020_V1, defaultCategorySelect, SELECT_MAG_DATA_V1 } from '@/api/data'
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
      pageName: 'MAG 学科自恋度 2020',
      showAve: true,
      subjectTarget: defaultCategorySelect,
      methodValue: 'linksin',
      methodOptions: ['article', 'linksout', 'linksin'],
      years: [1900, 2019],
      categorys: coreCategorys,

      magVersionSelect: 2020,
      magVersionOpt: [2019, 2020],
      loading: false,
      myChartIds: ['masChart1']
    }
  },
  computed: {
  },
  mounted() {
    this.versionCHange()
  },
  methods: {
    versionCHange() {
      if (this.magVersionSelect === 2020) {
        this.methodOptions = ['linksout', 'linksin']
        if (!this.methodOptions.includes(this.methodValue)) {
          this.methodValue = 'linksin'
        }
        this.categorys = MAGCoreCategorys2020_V1
        this.versionValue = 'tjart_nopb_delete_noref_v3'
        this.versionOptions = [{ text: '论文(去0 去Book，去Patent)', value: 'tjart_nopb_delete_noref_v3' }]
        this.subjectTarget = SELECT_MAG_DATA_V1
      } else if (this.magVersionSelect === 2019) {
        this.methodValue = 'linksin'
        this.methodOptions = ['article', 'linksout', 'linksin']
        this.categorys = coreCategorys
        this.versionValue = 'v2'
        this.versionOptions = ['v1', { text: 'v2全集,去重', value: 'v2' }, { text: 'v2全集,不去重', value: 'v2_distinct' }, { text: 'v2去0,不去重', value: 'delete_noref_v2_distinct' }]
      }
      this.getData()
    },
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
