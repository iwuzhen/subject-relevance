<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-13 18:06:14
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 15:39:10
 * @Description:
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="subjectSelect"
          :items="categoryOpt"
          small-chips
          dense
          multiple
          deletable-chips
          label="目标人"
        />
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          dense
          label="年份"
          @change="calZipf"
        />
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="nodeCountSelect"
          :items="nodeCountOpt"
          dense
          label="节点数量"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-range-slider
          v-model="nodeRange"
          :max="nodeMax"
          :min="nodeMin"
          dense
          hide-details
          hint="求斜率范围"
          class="align-center"
          @change="yearChange"
        >
          <template v-slot:prepend>
            <p style="width: 100px">求斜率范围</p>
            <v-text-field
              :value="nodeRange[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(nodeRange, 0, $event)"
            />
          </template>
          <template v-slot:append>
            <v-text-field
              :value="nodeRange[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(nodeRange, 1, $event)"
            />
          </template>
        </v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card class="mx-auto" outlined :loading="loading" height="45vh">
          <v-container id="subjectChart1" fluid fill-height />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card class="mx-auto" outlined :loading="loading" height="45vh">
          <v-container id="subjectChart2" fluid fill-height />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getPeopleZipfByNodes } from '@/api/index'
import ecStat from 'echarts-stat'
import {
  peopleCategorys,
  extendEchartsOpts,
  extendLineSeries
} from '@/api/data'
import { localCache } from '@/api/cache'
import Base from '@/utils/base'

// tooyip 位置的x位置
var tipLegend = 0
// eslint-disable-next-line new-cap
const LC = new localCache({
  storeName: 'peoplezipfbynodes', // Should be alphanumeric, with underscores.
  description: 'store api'
})

export default {
  name: 'Zipf',
  extends: Base,
  data() {
    return {
      pageName: 'zipf幂律斜率（人）（世界）',
      loading: false,
      nodeRange: [250, 2500],
      nodeMin: 0,
      subjectSelect: [],
      nodeCountSelect: 5000,
      nodeCountOpt: [1000, 2000, 3000, 4000, 5000],
      yearSelect: null,
      yearOpt: [
        2007,
        2008,
        2009,
        2010,
        2011,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020
      ],
      categoryOpt: peopleCategorys.map(item => {
        return {
          value: item[0],
          text: item[1]
        }
      }),

      chartOptYear: {},
      chartOptZipf: {},
      myChartIds: ['subjectChart1', 'subjectChart2']
    }
  },
  computed: {
    nodeMax: function() {
      return this.nodeCountSelect
    }
  },
  watch: {
    // 更新图标
    chartOptYear: function(opt) {
      this.myChartObjs[0].setOption(opt, true)
    },
    chartOptZipf: function(opt) {
      this.myChartObjs[1].setOption(opt, true)
    },
    subjectSelect: async function(newValue, oldValue) {
      this.loading = true
      const diffArray = newValue.filter(item => !oldValue.includes(item))
      if (diffArray.length > 0) {
        await this.handleSlopeTrend(diffArray[0])
      }
      await this.calMulitYear(newValue)
      await this.calZipf()
    }
  },
  mounted() {
    this.myChartObjs[1].getZr().on('click', params => {
      var pointInPixel = [params.offsetX, params.offsetY]

      if (this.myChartObjs[1].containPixel('grid', pointInPixel)) {
        // var xIndex = this.myChart2.convertFromPixel({ seriesIndex: 0 }, [
        //   params.offsetX,
        //   params.offsetY
        // ])[0];
        // console.log(xIndex);
        const series = []
        for (const ix in this.chartOptZipf.legend.data) {
          series[
            tipLegend.indexOf(this.chartOptZipf.legend.data[ix])
          ] = this.chartOptZipf.series[ix]
        }
        this.chartOptZipf.legend.data = tipLegend
        this.chartOptZipf.series = series
        this.myChartObjs[1].setOption(this.chartOptZipf, true)
      }
    })
  },
  methods: {
    async handleSlopeTrend(subject) {
      // 计算单学科的年度趋势，并缓存
      const opt = {
        str: subject,
        N: this.nodeCountSelect
      }

      const LCKEY = `${JSON.stringify(opt)}_${this.nodeRange[0]}_${
        this.nodeRange[1]
      }`
      let item = await LC.getItem(LCKEY)
      if (!item) {
        try {
          const res = await getPeopleZipfByNodes(opt)
          if (res.data) {
            const gradientList = []
            for (let i = 0; i < res.data.y.length; i++) {
              const dataItem = []
              for (let j = 0; j < res.data.y[i].length; j++) {
                dataItem.push([res.data.x[j], res.data.y[i][j]])
              }
              const myRegression = ecStat.regression(
                'linear',
                dataItem.slice(this.nodeRange[0], this.nodeRange[1])
              )
              gradientList.push(myRegression.parameter.gradient.toFixed(4))
            }

            const title = res.data.title.replace(' zipf分布', '')
            item = [
              title,
              extendLineSeries({
                name: title,
                type: 'line',
                smooth: false,
                data: gradientList
              })
            ]
            await LC.setItem(LCKEY, item)
          }
        } catch (error) {
          this.$emit('emitMesage', `请求失败:${error}`)
          return
        }
      }
      return item
    },
    getData() {
      if (this.nodeCountSelect < this.nodeRange[1]) {
        this.nodeRange[1] = this.nodeCountSelect
      }
      this.yearChange()
      this.calZipf()
    },
    yearChange() {
      /**
       * @description: 多个学科的斜率历年趋势
       */
      if (this.subjectSelect.length < 1) {
        return
      }
      this.calMulitYear()
    },
    async calMulitYear() {
      const seriesTitleArray = []
      this.loading = true
      for (const subject of this.subjectSelect) {
        const item = await this.handleSlopeTrend(subject)
        seriesTitleArray.push(item)
      }
      seriesTitleArray.sort((x, y) => {
        return y[1].data.slice(-1) - x[1].data.slice(-1)
      })
      this.chartOptYear = extendEchartsOpts({
        title: {
          text: '斜率趋势'
        },
        legend: {
          data: seriesTitleArray.map(item => {
            return item[0]
          })
        },
        xAxis: {
          type: 'category',
          name: 'Year',
          data: this.yearOpt
        },
        yAxis: {
          type: 'value',
          name: 'Slope'
        },
        series: seriesTitleArray.map(item => {
          return item[1]
        })
      })
      this.loading = false
    },
    async calZipf() {
      if (this.subjectSelect.length < 1 || !this.yearSelect) {
        return false
      }
      this.loading = true
      const opt = {
        str: this.subjectSelect.join(','),
        N: this.nodeCountSelect,
        year: this.yearSelect
      }
      await getPeopleZipfByNodes(opt)
        .then(res => {
          if (res.data) {
            this.chartOptZipf = this.setOptions_zipf(res.data)
            this.loading = false
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
    },

    setOptions_zipf(data) {
      // 设置
      const seriesList = []
      for (let i = 0; i < data.y.length; i++) {
        const dataItem = []
        for (let j = 0; j < data.y[i].length; j++) {
          dataItem.push([data.x[j], data.y[i][j]])
        }
        seriesList.push({
          name: data.legend[i],
          type: 'scatter',
          symbolSize: 2,
          large: true,
          data: dataItem
        })
      }
      // 排序
      // seriesList.sort((x, y) => {
      //   return y.data.slice(-1) - x.data.slice(-1);
      // });
      // 趋势线
      const myRegression = ecStat.regression(
        'linear',
        seriesList[0].data.slice(this.nodeRange[0], this.nodeRange[1])
      )
      if (data.y.length === 1) {
        seriesList.push(
          extendLineSeries({
            name: '回归线',
            type: 'line',
            showSymbol: false,
            smooth: false,
            data: myRegression.points,
            markPoint: {
              itemStyle: {
                normal: {
                  color: 'transparent'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  formatter: myRegression.expression,
                  textStyle: {
                    color: '#333',
                    fontSize: 14
                  }
                }
              },
              data: [
                {
                  coord: myRegression.points[myRegression.points.length - 1]
                }
              ]
            }
          })
        )
      }
      const xmax = Math.floor(Math.max(...data.x) * 10) + 1
      console.log(data)
      const _opt = extendEchartsOpts({
        tooltip: {
          trigger: 'axis',
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
            params.sort((x, y) => {
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].name}<br>`
            for (let i = 0; i < params.length; i++) {
              const _text = params[i].seriesName
              const _data = params[i].data
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：x${_data[0]},y：${_data[1]} <br>`
            }
            tipLegend = params.map(item => item.seriesName)
            return showHtm
          }
        },
        title: {
          text: data.title
        },
        legend: {
          data: seriesList.map(item => {
            return item.name
          })
        },
        xAxis: {
          type: 'value',
          max: xmax / 10,
          name: 'log (rank)'
        },
        yAxis: {
          type: 'value',
          name: 'log (citation)',
          min: 0
        },
        series: seriesList
      })
      return _opt
    }
  }
}
</script>
