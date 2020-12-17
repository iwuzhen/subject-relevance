<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10">
        <v-select
          v-model="subjectSelect"
          :items="subjectOpt"
          small-chips
          multiple
          deletable-chips
          clearable
          label="目标学科"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="typeSelect"
          :items="typeOpt"
          label="世界类型"
          @click="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <v-slider
          v-model="yearSelect"
          :max="2020"
          :min="1955"
          dense
          hide-details
          step="1"
          hint="幂律分布指定年"
          thumb-label="always"
          thumb-size="32"
          label="幂律分布指定年"
          ticks
          class="align-center"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <v-range-slider
          v-model="nodeRange"
          :max="100000"
          :min="1"
          dense
          hide-details
          hint="求斜率范围"
          class="align-center"
          @change="getData"
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
      <v-col cols="11">
        <v-range-slider
          v-model="yearRange"
          :max="2020"
          :min="1955"
          dense
          hide-details
          hint="学科趋势年份范围"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 100px">学科趋势年份范围</p>
            <v-text-field
              :value="yearRange[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(yearRange, 0, $event)"
            />
          </template>
          <template v-slot:append>
            <v-text-field
              :value="yearRange[1]"
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
      <v-col col="12">
        <v-card>
          <v-data-table
            :headers="girdHeaders"
            hide-default-footer
            :items="gridData"
            class="elevation-1"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-for="chartid of myChartIds" :key="chartid">
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-container
            :id="chartid"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="ZipfAndInnerzipfByYearV3_graph_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { requestWrap } from '@/api/index'
import { MAGCoreCategorys2020, extendEchartsOpts, extendLineSeries, defaultCategorySelect } from '@/api/data'
import ecStat from 'echarts-stat'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

// tooyip 位置的x位置
var tipLegend = 0
export default {
  name: 'MAV2',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '幂律及其随时间变化趋势',
      girdHeaders: [],
      yearSelect: 2000,
      nodeRange: [100, 10000],
      yearRange: [2000, 2010],
      typeSelect: 'zipf',
      typeOpt: [{ text: '世界', value: 'zipf' }, { text: '小世界', value: 'innerzipf' }],
      subjectSelect: defaultCategorySelect,
      subjectOpt: MAGCoreCategorys2020,
      loading: false,
      chartOpt: {},
      chartData: {},
      gridData: [],
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3']
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    // 队列 初始化
    this.myChartObjs[0].getZr().on('click', params => {
      var pointInPixel = [params.offsetX, params.offsetY]

      if (this.myChartObjs[0].containPixel('grid', pointInPixel)) {
        // var xIndex = this.myChartObjs[0].convertFromPixel({ seriesIndex: 0 }, [
        //   params.offsetX,
        //   params.offsetY
        // ])[0];
        // console.log(xIndex);
        const series = []
        for (const ix in this.chartOpt.legend.data) {
          series[
            tipLegend.indexOf(this.chartOpt.legend.data[ix])
          ] = this.chartOpt.series[ix]
        }
        this.chartOpt.legend.data = tipLegend
        this.chartOpt.series = series
        this.myChartObjs[0].setOption(this.chartOpt, true)
      }
    })
    this.getData()
  },
  methods: {
    // 计算斜率
    calSlope() {
      const lines = []
      for (const row of this.chartData.y) {
        const line = []
        for (const i in this.chartData.x) {
          line.push([this.chartData.x[i], row[i]])
        }
        lines.push(line)
      }
      const retData = { name: '斜率' }
      const retHeader = [
        {
          text: '学科',
          align: 'start',
          value: 'name'
        }
      ]
      for (const i in lines) {
        const myRegression = ecStat.regression(
          'linear',
          lines[i].slice(this.nodeRange[0], this.nodeRange[1])
        )

        retData[
          this.chartData.legend[i]
        ] = myRegression.parameter.gradient.toFixed(4)
        retHeader.push({
          text: this.chartData.legend[i],
          value: this.chartData.legend[i]
        })
      }
      this.gridData = [retData]
      this.girdHeaders = retHeader
      // console.log(this.gridData);
      // console.log(this.girdHeaders);
    },
    getData: _.debounce(async function() {
      if (this.subjectSelect.length < 1) {
        return false
      }
      this.loading = true

      // chart 1
      let opt = {
        cats: this.subjectSelect.join(','),
        type: this.typeSelect,
        year: this.yearSelect,
        from_node: this.nodeRange[0],
        to_node: this.nodeRange[1]
      }
      try {
        const res = await requestWrap('/mag/getZipfAndInnerzipfByYear_v3', 'POST', opt)
        if (res.data) {
          this.chartData = res.data
          this.chartOpt = this.setOptions(res.data)
          this.myChartObjs[0].setOption(this.chartOpt, true)
          this.calSlope()
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      // chart 2,3
      opt = {
        cats: this.subjectSelect.join(','),
        type: this.typeSelect,
        from_node: this.nodeRange[0],
        to_node: this.nodeRange[1],
        from: this.yearRange[0],
        to: this.yearRange[1]
      }
      try {
        const res = await requestWrap('/mag/getZipfAndInnerzipfByYear_v3', 'POST', opt)
        if (res.data) {
          const data = res.data
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
              name: 'power law',
              type: 'value'
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
          this.myChartObjs[1].setOption(_opt, true)
        }
        if (res.data_node) {
          const data = res.data_node
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
              name: 'Count',
              type: 'value'
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
          this.myChartObjs[2].setOption(_opt, true)
        }
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      this.loading = false
    }, 2000),
    setOptions(data) {
      // let ymax = Math.max(...[].concat(...data.y));
      // ymax = Math.ceil(ymax * 10) / 10;
      let xmax = Math.max(...data.x)
      xmax = Math.ceil(xmax * 10) / 10
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
      } // 排序;
      seriesList.sort((x, y) => {
        // console.log(y.data.slice(-1)[0][1], x.data.slice(-1)[0][1]);
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1]
      })

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
          max: xmax,
          name: 'log (rank)'
        },
        yAxis: {
          type: 'value',
          // max: ymax,
          name: 'log (citation)'
        },
        series: seriesList
      })
      return _opt
    }
  }
}
</script>

<style lang="less" scoped></style>
