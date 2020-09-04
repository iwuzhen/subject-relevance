<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2019-07-21 13:24:25
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 15:04:35
 * @Description:
-->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="7">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          dense
          label="学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="limitValue"
          :items="limitOpt"
          dense
          label="学科网络限制"
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
      <v-col cols="1">
        <v-select
          v-model="viewSelect"
          :items="viewOpt"
          dense
          label="显示内容"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          id="masChart"
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { coreCategorys } from '@/api/data'
import { getMasYearRefDist } from '@/api/index'
import Base from '@/utils/base'

export default {
  name: 'MAGV2',
  extends: Base,
  data() {
    return {
      pageName: 'MAG学科引用年份热力图 v2',
      showAve: true,
      subjectTarget: '',
      methodValue: 'linksin',
      categorys: coreCategorys,
      methodOptions: ['linksin'],
      loading: false,
      viewSelect: '百分比',
      viewOpt: ['百分比', '引用数'],
      limitValue: 100000,
      limitOpt: [100000],
      myChartIds: ['masChart']
    }
  },
  methods: {
    async getData() {
      const opt = {
        name: this.subjectTarget,
        refer: this.methodValue,
        toplimit: this.limitValue,
        version: 'v2'
      }
      if (this.limitValue === '不限制') {
        opt.toplimit = 100000000
      }
      console.log(opt)
      const ret = await getMasYearRefDist(opt)
      const xData = []
      const retData = []
      if (this.viewSelect === '引用数') {
        for (let i = 1950; i <= 2019; i++) {
          xData.push(String(i))

          if (!ret[i]) {
            // 为空
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), 0])
            }
          } else {
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), ret[i][j] || 0])
            }
          }
        }
      } else {
        // 百分比
        for (let i = 1950; i <= 2019; i++) {
          xData.push(String(i))

          if (!ret[i]) {
            // 为空
            for (let j = 1950; j <= 2019; j++) {
              retData.push([String(i), String(j), 0])
            }
          } else {
            let sum = 0
            for (let j = 1950; j <= 2019; j++) {
              sum += ret[i][j] || 0
            }
            for (let j = 1950; j <= 2019; j++) {
              let da = (ret[i][j] || 0) / sum
              da = da > 0 ? da.toFixed(5) : da
              retData.push([String(i), String(j), da])
            }
          }
        }
      }

      const chartOpt = this.setOpt(xData, xData, retData)

      this.myChartObjs[0].setOption(chartOpt, true)
    },
    setOpt(xData, yData, Data) {
      const viewSelect = this.viewSelect
      const option = {
        tooltip: {
          trigger: 'item',
          textStyle: {
            align: 'left'
          },
          axisPointer: {
            type: 'cross',
            animation: true,
            label: {
              backgroundColor: '#505765'
            }
          },
          formatter: function(params) {
            let showHtm
            if (viewSelect === '百分比') {
              showHtm = ` ${params.seriesName}<br>${params.marker} ${
                params.name
              } -> ${params.value[1]}:   ${Math.floor(
                params.value[2] * 10000000
              ) / 100000}%`
            } else {
              showHtm = ` ${params.seriesName}<br>${params.marker} ${params.name} -> ${params.value[1]}:   ${params.value[2]}`
            }
            return showHtm
          }
        },
        xAxis: {
          type: 'category',
          name: '文章年份',
          data: xData
        },
        yAxis: {
          type: 'category',
          name: '引用年份',
          data: yData
        },
        visualMap: {
          min: 0,
          max:
            this.viewSelect === '百分比'
              ? 1
              : Math.max(
                ...Data.map(each => {
                  return each[2]
                })
              ),
          calculable: true,
          realtime: false,
          inRange: {
            color: [
              // "#313695",
              // "#4575b4",
              // "#74add1",
              // "#abd9e9",
              // "#e0f3f8",
              '#ffffff',
              // "#ffffbf",
              // "#fee090",
              // "#fdae61",
              // "#f46d43",
              '#d73027',
              '#a50026',
              '#990000'
            ]
          }
        },
        series: [
          {
            name: this.subjectTarget,
            type: 'heatmap',
            data: Data,
            emphasis: {
              itemStyle: {
                borderColor: '#333',
                borderWidth: 1
              }
            },
            progressive: 1000,
            animation: false
          }
        ]
      }
      return option
    }
  }
}
</script>
