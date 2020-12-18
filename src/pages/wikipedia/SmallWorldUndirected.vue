<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:38:54
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 16:00:53
 * @Description:
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="5">
        <v-select
          v-model="subjectTarget"
          :items="categoryOpt"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="quotaSelect"
          :items="quoteOpt"
          label="小世界指标"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          label="网络扩大方式"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="limitSelect"
          :items="limitOpt"
          label="网络大小"
          @change="getData"
        />
      </v-col>
      <v-col
        align-self="center"
        cols="2"
      >
        <v-btn
          color="light-blue lighten-2"
          dark
          small
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          参数
        </v-btn>
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
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          参数说明
        </v-card-title>

        <v-card-text>
          <p>
            <b>目标学科</b>： <br>wikipedia 中的学科。<br>
            <b>参数</b>：
            <br>小世界网络指标有两个指标，平均路径长度，集聚系数。<br>
            网络总点数，网络连接边数。<br>
            <b>数据源</b>： <br>按 wikipedia category 计算出的前
            2000,2500,3000个节点的组成的网络。<br>
            按 google 距离计算出的前 2000,2500,3000个节点的组成的网络。<br>
            Wikipedia 全部的 2 层类下的文章组成的网络。<br>
            Wikipedia 全部的 3 层类下的文章组成的网络。<br>
            Mag 学科下的论文的组成的网络。
          </p>
        </v-card-text>

        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { basiCategorys, extendEchartsOpts, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import { getUndirectedByYear } from '@/api/index'
import Base from '@/utils/base'
const Limiter = require('async-limiter')

export default {
  name: 'SmallWorld',
  extends: Base,
  data() {
    return {
      pageName: 'SmallWorld 无向图逐年趋势',
      dialog: false,
      subjectTarget: defaultCategorySelect1,
      quotaSelect: 'average_distance',
      quoteOpt: [
        {
          value: 'average_distance',
          text: '平均路径长度'
        },
        {
          value: 'clustering_coefficient',
          text: '集聚系数'
        },
        {
          value: 'number_node',
          text: '网络点数'
        },
        {
          value: 'number_edge',
          text: '网络边数'
        }
      ],
      limitSelect: 4000,
      limitOpt: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
      categoryOpt: basiCategorys,

      methodSelect: 'google',
      methodOpt: ['random', 'google', 'category'],
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById('subjectChart'))
    }
  },
  watch: {
    subjectTarget: async function(newValue, oldValue) {
      this.loading = true
      const diffArray = newValue.filter(item => !oldValue.includes(item))
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          await this.getOneDate(diffArray[0])

          cb()
        })
      }
      this.asyncLimier.onDone(() => {
        console.log('all done:')
        this.getData()
      })
    }
  },
  mounted() {
    this.asyncLimier = new Limiter({ concurrency: 1 })
    this.getData()
  },
  methods: {
    async getOneDate(subject) {
      const opt = {
        name: subject,
        method: this.methodSelect,
        version: 'undirect_graph_normal_v1',
        quota: this.quotaSelect,
        limit: this.limitSelect
      }
      try {
        return await getUndirectedByYear(opt)
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }
    },
    async getData() {
      if (this.subjectTarget.length === 0) {
        return false
      }
      this.loading = true
      const data = {
        y: [],
        x: [],
        legend: [],
        title: `小世界无向图逐年分布`
      }
      // let selectSubjectIds = [];
      const allSubject = {}
      let allYears = []
      const legend = []
      const emptySubject = []

      for (const selectSubjectName of this.subjectTarget) {
        const repdata = await this.getOneDate(selectSubjectName)
        if (repdata.x === null) {
          emptySubject.push(selectSubjectName)
          continue
        }
        allSubject[selectSubjectName] = repdata
        legend.push(selectSubjectName)
        allYears.push(...repdata.x)
      }
      if (emptySubject.length > 0) {
        this.$emit('emitMesage', `${emptySubject},没有数据`)
      }
      if (legend.length === 0) {
        this.loading = false
        this.$emit('emitMesage', `没有更新图表`)
        return
      }

      allYears = Array.from(new Set(allYears)).sort()
      data.x = allYears
      data.legend = legend

      for (const selectSubjectName of legend) {
        const yArray = []
        for (const year of allSubject[selectSubjectName].x) {
          yArray[allYears.indexOf(year)] =
            allSubject[selectSubjectName].y[
              allSubject[selectSubjectName].x.indexOf(year)
            ]
        }
        data.y.push(yArray)
      }

      console.log(data)
      this.drawChart(data)
    },
    drawChart(data) {
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const series = data.y.map((item, index) => {
        return extendLineSeries({
          name: data.legend[index],
          type: 'line',
          smooth: false,
          data: item
        })
      })
      console.log(series)
      // 排序
      series.sort((x, y) => {
        return y.data.slice(-1)[0] - x.data.slice(-1)[0]
      })

      const _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: series.map(item => {
            return item.name
          })
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: 'value'
        },
        series: series
      })
      return _opt
    }
  }
}
</script>
