<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectSelect"
          :items="subjectOpt"
          small-chips
          deletable-chips
          clearable
          dense
          label="学科"
          multiple
          @change="getData"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="topPercent"
          :max="100"
          :min="0"
          dense
          hide-details
          step="5"
          hint="top percent"
          thumb-label="always"
          thumb-size="32"
          label="top percent"
          ticks
          class="align-center"
          @change="topLimit=0;getData()"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="topLimit"
          :max="10000"
          :min="0"
          dense
          hide-details
          step="100"
          hint="top Count"
          class="align-center"
          thumb-label="always"
          thumb-size="32"
          ticks
          label="top limit"
          @change="topPercent=0;getData()"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="linksInCount"
          :max="30"
          :min="0"
          dense
          hide-details
          step="1"
          hint="top Count"
          class="align-center"
          thumb-label="always"
          thumb-size="32"
          ticks
          label="linksin 最小数量"
          @change="getData"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="linksOutCount"
          :max="30"
          :min="0"
          dense
          hide-details
          step="1"
          hint="linksout 最小数量"
          class="align-center"
          thumb-label="always"
          thumb-size="32"
          ticks
          label="linksout 最小数量"
          @change="getData"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="filterD"
          :max="1"
          :min="0.5"
          dense
          hide-details
          step="0.01"
          hint="top Count"
          class="align-center"
          thumb-label="always"
          thumb-size="32"
          label="D 上限"
          ticks
          @change="getData"
        />
      </v-col>
      <v-col cols="6">
        <v-slider
          v-model="decimalLen"
          :max="10"
          :min="5"
          dense
          hide-details
          step="1"
          hint="top Count"
          class="align-center"
          thumb-label="always"
          thumb-size="32"
          ticks
          label="保留小数位"
          @change="getData"
        />
      </v-col>
      <v-col cols="6">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1900"
          dense
          hide-details
          hint="年份范围"
          thumb-label="always"
          thumb-size="32"
          label="年份范围"
          class="align-center"
          @change="getData"
        />

      </v-col>
      <v-col cols="2">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              class="ma-2"
              :color="btn1.color"
              v-on="on"
              @click="btn1.status=!btn1.status;btn1.text=btn1.status?'立即显示':'立即隐藏';btn1.color=btn1.status?'success':'secondary';drawChart_1()"
            >
              {{ btn1.text }}
            </v-btn>
          </template>
          <span>控制不足 top limit 数量的学科是否显示</span>
        </v-tooltip>
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
            id="subjectChart1"
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
            id="subjectChart2"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="DisruptionByYear_graph_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import { requestGoV2Wrap } from '@/api/index'
import _ from 'lodash'

export default {
  name: 'MagDisrcuptionByYear',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '学科颠覆度年度分布',
      subjectSelect: ['Biology', 'Chemistry', 'Computer science',
        'Economics', 'Geography',
        'History', 'Literature', 'Materials science',
        'Mathematics', 'Medicine', 'Philosophy',
        'Physics', 'Quantum computing'],
      subjectOpt: [
        'Algebra', 'Anthropology', 'Applied mathematics',
        'Applied physics', 'Artificial intelligence', 'Biological engineering',
        'Biology', 'Chemical engineering',
        'Chemistry', 'Civil engineering',
        'Cognitive science', 'Computer engineering',
        'Computer science', 'Deep learning',
        'Discrete mathematics', 'Earth science', 'Economics',
        'Electrical engineering', 'Engineering disciplines',
        'Environmental engineering', 'Environmental science', 'Experimental physics',
        'Genetic engineering', 'Genome editing',
        'Geography', 'Geology', 'Geometry', 'History',
        'Industrial engineering', 'Linguistics', 'Literature',
        'Logic', 'Machine learning', 'Materials science',
        'Mathematics', 'Mechanical engineering',
        'Medicine', 'Neuroscience', 'Number theory', 'Operating system',
        'Philosophy', 'Physics', 'Political science', 'Psychology',
        'Quantum computing', 'Sociology', 'Theoretical computer science', 'Theoretical physics'
      ],
      topPercent: 0,
      topLimit: 1000,
      linksOutCount: 0,
      linksInCount: 0,
      filterD: 0.99,
      years: [1945, 2017],
      decimalLen: 5,
      btn1: {
        status: false,
        text: '立即隐藏',
        color: 'secondary'
      },
      loading: false,
      myChartIds: ['subjectChart1', 'subjectChart2']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 画第一个图
    async drawChart_1() {
      const opt = {
        subjects: this.subjectSelect,
        yearStart: this.years[0],
        yearEnd: this.years[1],
        linksOutCount: this.linksOutCount,
        linksInCount: this.linksInCount,
        filterD: this.filterD,
        topLimit: this.topLimit,
        topPercent: this.topPercent,
        decimalLen: this.decimalLen
      }
      const ret = await requestGoV2Wrap('/apigo/v2/mag/disruption_by_year', 'POST', opt)
      const allYears = ret.data.map(item => item.year)
      const maxYear = _.max(allYears)
      const minYear = _.min(allYears)
      const xAxisData = _.range(minYear, maxYear + 1)
      const subjectItem = _.groupBy(ret.data, item => item.name)
      const dataArray = []
      for (const [k, v] of Object.entries(subjectItem)) {
        // 按 yea 排序
        v.sort((x, y) => x.year - y.year)
        dataArray.push([k, v])
      }
      dataArray.sort((x, y) => _.last(y[1]).d - _.last(x[1]).d)
      console.log(dataArray)

      let chartOpt = extendEchartsOpts({
        title: {
          text: '学科颠覆度'
        },
        legend: {
          bottom: 10,
          orient: 'vertical',
          data: dataArray.map(item => item[0])
        },
        yAxis: {
          type: 'value',
          name: 'D'
        },
        xAxis: {
          name: 'year',
          data: xAxisData,
          position: 'buttom',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: -55
          }
        },
        series: dataArray.map((item, index) => {
          // 按年份归位，防止有的年份缺失
          const dataArray = []
          item[1].forEach(element => {
            // 隐藏
            if (this.btn1.status === true && this.topLimit > 0 && element.slice < this.topLimit) {
              return
            }
            dataArray[xAxisData.indexOf(element.year)] = element.d
          })
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: dataArray
          })
        })
      })
      this.myChartObjs[0].setOption(chartOpt, true)
      // 文章数
      chartOpt = extendEchartsOpts({
        title: {
          text: '学科文章数'
        },
        legend: {
          bottom: 10,
          orient: 'vertical',
          data: dataArray.map(item => item[0])
        },
        yAxis: {
          type: 'value',
          name: 'Count'
        },
        xAxis: {
          name: 'year',
          data: xAxisData,
          position: 'buttom',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: -55
          }
        },
        series: dataArray.map((item, index) => {
          // 按年份归位，防止有的年份缺失
          const dataArray = []
          item[1].forEach(element => {
            dataArray[xAxisData.indexOf(element.year)] = element.slice
          })
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: dataArray
          })
        })
      })

      this.myChartObjs[1].setOption(chartOpt, true)
    },
    getData: _.debounce(async function() {
      this.loading = true
      await this.drawChart_1()

      this.loading = false
      // 开始获取数据

      // let opt = extendEchartsOpts({
      //   title: {
      //     text: '学科全集'
      //   },
      //   legend: {
      //     bottom: 10,
      //     orient: 'vertical',
      //     data: current_subject_data.map(item => item[0])
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   xAxis: {
      //     data: current_subject_data.map(item => item[0]),
      //     position: 'buttom',
      //     axisTick: {
      //       alignWithLabel: true
      //     },
      //     axisLabel: {
      //       interval: 0,
      //       rotate: -55
      //     }
      //   },
      //   series: [{
      //     name: 'Sale',
      //     type: 'bar',
      //     data: current_subject_data.map(item => item[1])
      //   }]
      // })
      // this.myChartObjs[0].setOption(opt, true)

      // // 图 2
      // // 数组列表
      // const xaxis = []
      // for (let i = 5; i <= this.TopPercent; i += 5) {
      //   xaxis.push(i)
      // }
      // const legend = current_subject_data.map((item, index) => {
      //   return [Disruption.data[item[0]].y[xaxis.length - 1], item[0]]
      // })
      // legend.sort((a, b) => b[0] - a[0])
      // // 生成 opt
      // opt = extendEchartsOpts({
      //   title: {
      //     text: 'Subject Disruption Trend by Page'
      //   },
      //   legend: {
      //     data: legend.map(item => item[1])
      //   },
      //   xAxis: {
      //     name: 'Percent',
      //     type: 'category',
      //     boundaryGap: false,
      //     data: xaxis
      //   },
      //   yAxis: {
      //     name: 'Average Disruption',
      //     type: 'value',
      //     max: 1
      //   },
      //   series: current_subject_data.map((item, index) => {
      //     return extendLineSeries({
      //       name: item[0],
      //       type: 'line',
      //       smooth: false,
      //       data: Disruption.data[item[0]].y.slice(0, xaxis.length)
      //     })
      //   })
      // })

      // this.myChartObjs[1].setOption(opt, true)
    }, 2000)

  }
}
</script>
