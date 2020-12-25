<template>
  <v-container fluid>
    <v-row>
      <v-col cols="7">
        <v-select
          v-model="subjectTarget"
          :items="categoryOpt"
          small-chips
          dense
          deletable-chips
          clearable
          multiple
          label="当前学科"
        />
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          small-chips
          dense
          deletable-chips
          label="年份截至"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearRangeSelect"
          :items="yearRangeOpt"
          dense
          deletable-chips
          label="年份范围"
          @change="getData"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="2">
        <v-select
          v-model="quotaSelect"
          :items="quotaOpt"
          dense
          return-object
          label="小世界指标"
          @change="getData"
        />
      </v-col>

      <v-col cols="2">
        <v-select
          v-model="citationSelect"
          :items="citationOpt"
          dense
          disabled
          return-object
          label="引用关系"
          @change="getData"
        />
      </v-col>

      <v-col cols="2">
        <v-select
          v-model="nodeCountSelect"
          :items="nodeCountOpt"
          dense
          label="网络节点上限"
          @change="getData"
        />
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
        <comment storagekey="Mag_small_world_2020_Chart" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { extendEchartsOpts, MAGCoreCategorys2020, defaultCategorySelect, extendLineSeries } from '@/api/data'
import { requestGoV2Wrap } from '@/api/index'
import Base from '@/utils/base'
import _ from 'lodash'
import comment from '@/components/comment'

export default {
  name: 'MAGSmallWorld2020',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      loading: false,
      pageName: `MAG 小世界网络`,
      citationSelect: 'linksin',
      citationOpt: ['linksin'],
      subjectTarget: defaultCategorySelect,
      yearSelect: 2015,
      quotaSelect: { text: '平均路径长度', value: 'avc' },
      yearRangeSelect: 0,
      yearRangeOpt: [0, 5, 10, 15, 20, 25, 30, 35, 40],
      nodeCountSelect: 10000,
      nodeCountOpt: [50, 60, 72, 86, 100, 120, 140, 160, 190, 220, 260, 310, 370, 440, 520, 620, 740, 880, 1000, 1200, 1400, 1600, 1900, 2200, 2600, 3100, 3700, 4400, 5200, 6200, 7400, 8800, 10000, 12000, 14000, 16000, 19000, 22000, 26000, 31000, 37000, 44000, 52000, 62000, 74000, 88000, 100000],
      quotaOpt: [
        {
          value: 'avc',
          text: '平均路径长度'
        },
        {
          value: 'cc',
          text: '集聚系数'
        },
        {
          value: 'ec',
          text: '联通子图边数'
        },
        {
          value: 'nc',
          text: '联通子图节点数'
        }
      ],
      yearOpt: [
        1950,
        1955,
        1960,
        1965,
        1970,
        1975,
        1980,
        1985,
        1990,
        1995,
        2000,
        2005,
        2010,
        2015,
        2020
      ],
      categoryOpt: MAGCoreCategorys2020,
      datacache: {},
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3']
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.getData()
  },

  methods: {

    getCurrentValue(obj) {
      if (this.quotaSelect.value === 'avc') {
        return obj.avc
      } else if (this.quotaSelect.value === 'cc') {
        return obj.cc
      } else if (this.quotaSelect.value === 'nc') {
        return obj.nc
      } else if (this.quotaSelect.value === 'ec') {
        return obj.ec
      }
    },

    getData: _.debounce(async function() {
      if (this.subjectTarget.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true

      const opt = {
        subjects: this.subjectTarget,
        year: this.yearSelect,
        topLimit: this.nodeCountSelect,
        yearRange: this.yearRangeSelect
      }

      try {
        const retdata = await requestGoV2Wrap('/apigo/v2/mag/small_world_undirected', 'POST', opt)
        console.log(retdata)

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==
        // 年度趋势
        let series = Object.entries(retdata.data.year).sort((x, y) => {
          return this.getCurrentValue(y[1].slice(-1)[0]) - this.getCurrentValue(x[1].slice(-1)[0])
        }).map(([key, value], index) => {
          // 按年份归位，防止有的年份缺失
          const dataArray = []
          value.forEach(element => {
            dataArray[this.yearOpt.indexOf(element.year)] = this.getCurrentValue(element)
          })
          return extendLineSeries({
            name: key,
            type: 'line',
            smooth: false,
            data: dataArray
          })
        })
        let _opt = extendEchartsOpts({
          title: {
            text: `排名前${this.nodeCountSelect}学科,组成的联通网络小世界的年度趋势`,
            left: 'center'
          },
          legend: {
            data: series.map(item => item.name)
          },
          xAxis: {
            // name: obj.xname,
            // type: obj.xtype,
            data: this.yearOpt,
            boundaryGap: false,
            max: 'dataMax'
          },
          yAxis: {
            name: this.quotaSelect.text,
            type: 'value'
          // max: yMax
          },
          series: series
        })
        this.myChartObjs[0].setOption(_opt, true)

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==
        // 按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势
        series = Object.entries(retdata.data.trend).sort((x, y) => {
          return this.getCurrentValue(y[1].slice(-1)[0]) - this.getCurrentValue(x[1].slice(-1)[0])
        }).map(([key, value], index) => {
          const dataArray = []
          value.forEach(element => {
            dataArray.push([element.limit, this.getCurrentValue(element)])
          })
          return extendLineSeries({
            name: key,
            type: 'line',
            smooth: false,
            data: dataArray
          })
        })
        _opt = extendEchartsOpts({
          title: {
            text: `按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势`,
            left: 'center'
          },
          legend: {
            data: series.map(item => item.name)
          },
          xAxis: {
            // name: obj.xname,
            // type: obj.xtype,
            type: 'value',
            boundaryGap: false,
            max: 'dataMax'
          },
          yAxis: {
            name: this.quotaSelect.text,
            type: 'value'
          // max: yMax
          },
          series: series
        })
        this.myChartObjs[1].setOption(_opt, true)

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==
        // 按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势
        series = Object.entries(retdata.data.trend).sort((x, y) => {
          return this.getCurrentValue(y[1].slice(-1)[0]) - this.getCurrentValue(x[1].slice(-1)[0])
        }).map(([key, value], index) => {
          const dataArray = []
          const dataSet = new Set()
          value.forEach(element => {
            if (dataSet.has(element.nc)) {
              return
            } else {
              dataSet.add(element.nc)
              dataArray.push([element.nc, this.getCurrentValue(element)])
            }
          })
          return extendLineSeries({
            name: key,
            type: 'line',
            smooth: false,
            data: dataArray
          })
        })
        _opt = extendEchartsOpts({
          title: {
            text: `头部实际联通的小世界网络 ${this.quotaSelect.text} 规模趋势`,
            left: 'center'
          },
          legend: {
            data: series.map(item => item.name)
          },
          xAxis: {
            // name: obj.xname,
            type: 'value',
            boundaryGap: false,
            max: 'dataMax'
          },
          yAxis: {
            name: this.quotaSelect.text,
            type: 'value'
          // max: yMax
          },
          series: series
        })
        this.myChartObjs[2].setOption(_opt, true)
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      this.loading = false
    }, 2000)

  }
}
</script>
