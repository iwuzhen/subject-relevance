<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2019-07-21 13:24:25
 * @LastEditors: ider
 * @LastEditTime: 2020-11-30 19:54:15
 * @Description:
-->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          small-chips
          deletable-chips
          clearable
          dense
          label="学科"
          multiple
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
          :height="700* chartOpts.xdata.length + 'px'"
        >
          <v-container
            id="masChart"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getBL_level1 } from '@/api/index'
import Base from '@/utils/base'
import _ from 'lodash'

export default {
  name: 'MAGLevel1BL',
  extends: Base,
  data() {
    return {
      pageName: 'MAG level1层和父类的交集',
      categorys: ['Biology', 'Chemistry', 'Computer Science', 'Economics', 'Engineering disciplines', 'Environmental science', 'Geography', 'Geology', 'History', 'Materials Science', 'Mathematics', 'Medicine', 'Philosophy', 'Physics', 'Political Science', 'Psychology', 'Sociology'].sort().map(each => {
        return {
          text: each === 'Engineering disciplines' ? 'Engineering' : each,
          value: each
        }
      }),
      loading: false,
      subjectTarget: [],
      myChartIds: ['masChart'],
      chartOpts: {
        xdata: [],
        ydata: [],
        sdata: [],
        girds: []
      }
    }
  },
  methods: {
    getData: _.debounce(async function() {
      const opt = {
        str: this.subjectTarget.join(',')
      }
      const ret = await getBL_level1(opt)
      console.log(ret)

      // ================= data handle
      this.chartOpts = {
        xdata: [],
        ydata: [],
        sdata: [],
        girds: []
      }

      // 数据准备
      for (const [key, value] of Object.entries(ret.data)) {
        this.chartOpts.xdata.push(Object.keys(value))
        this.chartOpts.ydata.push(key)
        this.chartOpts.sdata.push(Object.values(value))
      }
      // 计算 gird
      for (let i = 0; i < this.chartOpts.xdata.length; i++) {
        this.chartOpts.girds.push({ top: 80 + i * 600, height: 500, right: '5%' })
      }

      console.log(this.chartOpts)
      const chartOpt = this.setOptions(this.chartOpts)
      setTimeout(() => {
        this.myChartObjs[0].setOption(chartOpt, true); this.myChartObjs[0].resize()
      }, 200)
    }, 1500),

    setOptions(dataset) {
      const _opt = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '交集数据',
          textStyle: {
            fontSize: 24
          }
        },
        xAxis: dataset.xdata.map((each, index) => {
          return {
            gridIndex: index,
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: -25
            },
            data: each
          }
        }),
        yAxis: dataset.ydata.map((each, index) => {
          return {
            gridIndex: index,
            name: each,
            nameTextStyle: { fontSize: 18 }
          }
        }),
        grid: dataset.girds,
        series: dataset.sdata.map((each, index) => {
          return {
            xAxisIndex: index,
            yAxisIndex: index,
            type: 'bar',
            data: each
          }
        })
      }
      return _opt
    }

  }
}
</script>
