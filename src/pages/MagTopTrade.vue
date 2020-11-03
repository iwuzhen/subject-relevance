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
          v-model="topNSelect"
          :items="topNOpt"
          disabled
          dense
          deletable-chips
          label="top 数"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="versionSelect"
          :items="versionOpt"
          disabled
          dense
          deletable-chips
          label="version"
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
        <comment storagekey="MagTopTrade_Chart_1" />
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
    <v-row>
      <v-col>
        <comment storagekey="MagTopTrade_Chart_2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { requestWrap } from '@/api/index'
import { extendEchartsOpts, coreCategorys, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

coreCategorys.push({
  text: 'Theoretical physics',
  value: 'Theoretical physics'
})

coreCategorys.push({
  text: 'Discrete mathematics',
  value: 'Discrete mathematics'
})

export default {
  name: 'MagTopTrade',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'mag topN因果关系-贸易比例',
      methodSelect: 'linksin',
      methodOpt: ['linksin', 'linksout'],
      topNSelect: 5000,
      topNOpt: [5000],
      versionSelect: 'v2',
      versionOpt: ['v2'],
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect,
      categorys: coreCategorys,
      loading: false,
      myChartIds: ['masChart1', 'masChart2']
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
        method: this.methodSelect,
        topN: this.topNSelect,
        type: 0,
        version: this.versionSelect
      }
      // 趋势图,柱状图
      await requestWrap('/mag/getYinguoData_top', 'post', opt)
        .then(res => {
          if (res.data) {
            console.log(res.data)
            const opt = extendEchartsOpts({
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
            this.myChartObjs[0].setOption(opt, true)
          } else {
            this.loading = false
            this.$emit('emitMesage', '解析失败')
            return false
          }
        })
        .catch(rej => {
          this.loading = false
          this.$emit('emitMesage', `请求失败:${rej}`)
          throw rej
        })
        // 正负图
      opt.type = 1
      await requestWrap('/mag/getYinguoData_top', 'post', opt)
        .then(res => {
          if (res.data) {
            console.log(res.data)

            const opt = extendEchartsOpts({
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
            this.myChartObjs[1].setOption(opt, true)
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
      this.loading = false
    } }
}
</script>
