<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="strA"
          :items="categorys"
          label="当前学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="10">
        <v-select
          v-model="strB"
          :items="categorys"
          small-chips
          multiple
          deletable-chips
          clearable
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col :cols="8">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1900"
          dense
          hide-details
          hint="年份跨度"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 100px">年份跨度</p>
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
          v-model="version"
          :items="versionSelect"
          label="数据集"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row
      v-for="(item,index) in myChartIds"
      :key="index"
    >
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="60vh"
        >
          <v-container
            :id="item"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in gridData"
        :key="index"
        col="4"
      >
        <v-card>
          <v-card-title>{{ item.title }} </v-card-title>
          <v-data-table
            :headers="item.headers"
            :items="item.desserts"
            dense
            sort-desc
            class="elevation-1"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="MagJJByCat_chart_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { requestWrap } from '@/api/index'
import { defaultCategorySelect, extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]))

const Limiter = require('async-limiter')

export default {
  name: 'MagJJbyCat',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MAG 学科文章交集分布',
      strA: 'Physics',
      strB: defaultCategorySelect,
      limitSelect: 100,
      categorys: ['Theoretical physics', 'Applied physics', 'Experimental physics', 'Number theory',
        'Algebra', 'Geometry', 'Applied mathematics', 'Operating system', 'Discrete mathematics',
        'Earth science', 'Materials science', 'Geology', 'Geography', 'Environmental science', 'Medicine',
        'Psychology', 'Logic', 'Philosophy', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Sociology',
        'Economics', 'Political science', 'Linguistics', 'History', 'Computer science',
        'Artificial intelligence', 'Engineering disciplines', 'Chemical engineering', 'Civil engineering',
        'Electrical engineering', 'Mechanical engineering', 'Biological engineering',
        'Computer engineering', 'Industrial engineering', 'Environmental engineering', 'Cognitive science',
        'Machine learning', 'Blockchains', 'Deep learning', 'Theoretical computer science',
        'Quantum computing', 'Genetic engineering', 'Genome editing', 'Anthropology', 'Neuroscience',
        'Literature'],
      versionSelect: [{
        text: '全集',
        value: 'v2'
      }, {
        text: '去掉引用为0的数据',
        value: 'delete_noref_v2'
      }],
      version: 'v2',
      years: [2016, 2018],
      myChartIds: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'chart6'],
      gridData: [],
      loading: false
    }
  },
  computed: {
  },
  watch: {
    // 更新图标
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
        this.getData()
      })
    }
  },
  mounted() {
    // 队列 初始化
    this.asyncLimier = new Limiter({ concurrency: 1 })
    this.getData()
  },
  methods: {
    async getData() {
      const opt = {
        'strA': this.strA,
        'strB': this.strB.filter(subject => subject !== this.strA).join(','),
        'version': this.version,
        'type': '0', // 0:不按年分布(二维图，无图例) 1:按年分布(三维图,含图例)
        'valueType': '0', // 0:学科论文数 1:交集数值 2:比例
        'from': this.years[0],
        'to': this.years[1]
      }
      // 表1
      let response = await requestWrap('/mag/getJJByCat', 'post', opt)
      let datazip = zip(response.data.x, response.data.y)
      datazip.sort()
      let datasetBar = { dimensions: [], source: [] }
      datasetBar.dimensions.push('product', 'value')
      datasetBar.source = datazip.map(item => { return { product: item[0], value: item[1] } })
      this.myChartObjs[0].setOption(this.setOptionsBar(datasetBar, response.data.title), true)
      // 表2
      opt.valueType = '1'
      response = await requestWrap('/mag/getJJByCat', 'post', opt)
      datazip = zip(response.data.x, response.data.y)
      datazip.sort()
      datasetBar = { dimensions: [], source: [] }
      datasetBar.dimensions.push('product', 'value')
      datasetBar.source = datazip.map(item => { return { product: item[0], value: item[1] } })
      this.myChartObjs[1].setOption(this.setOptionsBar(datasetBar, response.data.title), true)
      // 表3
      opt.valueType = '2'
      response = await requestWrap('/mag/getJJByCat', 'post', opt)
      datazip = zip(response.data.x, response.data.y)
      datazip.sort()
      datasetBar = { dimensions: [], source: [] }
      datasetBar.dimensions.push('product', 'value')
      datasetBar.source = datazip.map(item => { return { product: item[0], value: item[1] } })
      this.myChartObjs[2].setOption(this.setOptionsBar(datasetBar, response.data.title), true)

      // 表4
      opt.type = '1'
      opt.valueType = '0'
      response = await requestWrap('/mag/getJJByCat', 'post', opt)
      console.log(response.data)
      this.myChartObjs[3].setOption(this.setOptionsLine(response.data), true)
      // 表5
      opt.valueType = '1'
      response = await requestWrap('/mag/getJJByCat', 'post', opt)
      this.myChartObjs[4].setOption(this.setOptionsLine(response.data), true)
      // 表6
      opt.valueType = '2'
      response = await requestWrap('/mag/getJJByCat', 'post', opt)
      this.myChartObjs[5].setOption(this.setOptionsLine(response.data), true)
    },

    setOptionsBar(dataset, title) {
      const _opt = {
        dataset: dataset,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: title,
          textStyle: {
            fontSize: 24
          }
        },
        xAxis: [
          {
            type: 'category', gridIndex: 0,
            axisLabel: {
              interval: 0,
              rotate: -25
            }
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: '',
            nameTextStyle: { fontSize: 18 }
          }
        ],
        // grid: [
        //   { top: '10%', bottom: '5%', right: '5%', left: '5%' }
        // ],
        series: [
          {
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'product', y: 'value' }
          }
        ]
      }
      return _opt
    },

    setOptionsLine(dataset) {
      const _opt = extendEchartsOpts({

        title: {
          text: dataset.title,
          textStyle: {
            fontSize: 24
          }
        },
        xAxis: {
          name: 'year',
          type: 'category',
          boundaryGap: false,
          data: dataset.x
        },
        yAxis: {
          name: '',
          type: 'value'
        },
        // grid: [
        //   { top: '10%', bottom: '5%', right: '5%', left: '5%' }
        // ],
        series: zip(dataset.legend, dataset.y).map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })

      })
      return _opt
    }
  }
}
</script>
