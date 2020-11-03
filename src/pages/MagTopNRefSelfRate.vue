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
          disabled
          dense
          label="版本"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="topNValue"
          :items="topNOptions"
          disabled
          dense
          label="topN"
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
      <v-col>
        <comment storagekey="MagTopNRefSelfRate_Chart_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { requestWrap } from '@/api/index'
import { extendEchartsOpts, coreCategorys, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

export default {
  name: 'Mag',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      versionValue: 'v2',
      versionOptions: ['v1', 'v2'],
      pageName: 'mag topN学科自恋度',
      showAve: true,
      subjectTarget: defaultCategorySelect,
      methodValue: 'linksin',
      categorys: coreCategorys,
      methodOptions: ['linksout', 'linksin'],
      topNValue: 5000,
      topNOptions: [5000],
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
        topN: this.topNValue,
        version: this.versionValue
      }
      try {
        const res = await requestWrap('/mag/getMagRefSelfRate_top', 'post', opt)
        console.log(res.data)
        const chartoption = extendEchartsOpts({
          title: {
            text: res.data.title,
            left: 'center'
          },
          legend: {
            bottom: 10,
            orient: 'vertical',
            data: res.data.x
          },
          grid: {
            left: 'left',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          yAxis: {
            type: 'value'
          },
          xAxis: {
            data: res.data.x,
            position: 'buttom',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: -55
            }
          },
          series: [{
            name: 'Sale',
            type: 'bar',
            data: res.data.y
          }]
        })
        this.myChartObjs[0].setOption(chartoption, true)
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
