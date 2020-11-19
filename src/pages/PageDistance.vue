<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-11-19 13:17:37
 * @LastEditors: ider
 * @LastEditTime: 2020-11-19 14:38:17
 * @Description:计算 page distacne
-->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          v-model="subjectTarget"
          auto-select-first
          chips
          deletable-chips
          filled
          :loading="loadingS"
          solo
          :items="categorys"
          :search-input.sync="searchS"
          cache-items
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="7">
        <v-autocomplete
          v-model="subjectRelevances"
          :items="categorys"
          :search-input.sync="searchT"
          cache-items
          auto-select-first
          :loading="loadingT"
          chips
          deletable-chips
          filled
          multiple
          solo
          label="相关学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          disabled
          label="类别"
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
    <v-row>
      <v-col>
        <comment v-if="storagekey!=''" :storagekey="storagekey" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { requestWrap } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

export default {
  name: 'CoreWiki',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: `wiki 文章距离计算`,
      subjectTarget: '',
      searchS: null,
      searchT: null,
      methodValue: 'linksin',
      pageCountSelect: '3000',
      categorys: [],
      subjectRelevances: [],
      methodOptions: ['linksin'],
      storagekey: '',
      loading: false,
      loadingS: false,
      loadingT: false,
      myChartIds: ['subjectChart']
    }
  },
  computed: {
  },
  watch: {
    async searchS(val) {
      this.loadingS = true
      val && val !== this.subjectTarget && await this.querySelections(val)
      this.loadingS = false
      console.log(this.loadingS)
    },
    async searchT(val) {
      this.loadingT = true
      val && val !== this.subjectRelevances && this.querySelections(val)
      this.loadingT = false
    }
  },
  mounted() {
  },
  methods: {
    querySelections: _.debounce(async function(v, func) {
      const opt = {
        art: v,
        limit: 10
      }
      try {
        const ret = await requestWrap('wiki/getWikiMHTitle', 'POST', opt)
        this.categorys = ret.data
      } catch (error) {
        this.$emit('emitMesage', '请求失败')
      }
    }, 200),
    getData: _.debounce(async function() {
      if (this.subjectRelevances.length === 0 || this.subjectTarget === '') {
        return
      }
      try {
        const opt = {
          strA: this.subjectTarget,
          strB: this.subjectRelevances.join(','),
          method: 'linksin'
        }
        const ret = await requestWrap('wiki/getWikiMHTitle', 'POST', opt)
        this.categorys = ret.data
      } catch (error) {
        this.$emit('emitMesage', '请求失败')
      }
      console.log('getData', this.subjectRelevances)
    //   this.loading = true
    }, 500),

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

