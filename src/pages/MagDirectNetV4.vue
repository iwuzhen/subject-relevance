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
          multiple
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
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-container
            id="subjectChart3"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { extendEchartsOpts, magCategory, defaultCategorySelect, extendLineSeries } from '@/api/data'
import { getMagUndirectNet } from '@/api/index'
const Limiter = require('async-limiter')
import Base from '@/utils/base'

export default {
  name: 'MAGSmallWorlV4',
  extends: Base,
  data() {
    return {
      loading: false,
      pageName: `MAG 小世界网络 ${this.$route.query.version}`,
      citationSelect: 'linksin',
      citationOpt: ['linksout', 'linksin'],
      subjectTarget: defaultCategorySelect,
      yearSelect: [2015],
      quotaSelect: { text: '平均路径长度', value: 'shortest path length' },
      yearRangeSelect: 0,
      yearRangeOpt: [0, 5, 10, 15, 20, 25, 30, 35, 40],
      nodeCountSelect: 10000,
      nodeCountOpt: [],
      quotaOpt: [
        {
          value: 'shortest path length',
          text: '平均路径长度'
        },
        {
          value: 'clustering coefficient',
          text: '集聚系数'
        },
        {
          value: 'Number of edge',
          text: '联通子图边数'
        },
        {
          value: 'Number of vertices',
          text: '联通子图节点数'
        }
      ],
      yearOpt: [
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
      categoryOpt: magCategory,
      datacache: {},
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3']
    }
  },
  computed: {
  },
  watch: {
    subjectTarget: async function(newValue, oldValue) {
      this.loading = true
      const diffArray = newValue.filter(item => !oldValue.includes(item))
      if (diffArray.length > 0) {
        this.asyncLimier.push(async cb => {
          console.log('asyc')
          for (const year of this.yearSelect) {
            await this.getOneDate(diffArray[0], year)
          }
          console.log('aover')
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
    this.nodeCountOpt = []
    for (let i = 1000; i <= 100000; i += 1000) {
      this.nodeCountOpt.push(i)
    }
    this.asyncLimier = new Limiter({ concurrency: 1 })
    this.getData()
  },

  methods: {
    // 单次请求缓存
    async getOneDate(subject, year) {
      const opt = {
        name: subject,
        year: year,
        toplimit: this.nodeCountSelect,
        version: this.$route.query.version,
        citation: this.citationSelect,
        yearrange: this.yearRangeSelect
      }
      try {
        if (this.datacache[JSON.stringify(opt)]) {
          return this.datacache[JSON.stringify(opt)]
        }
        const ret = await getMagUndirectNet(opt)
        this.datacache[JSON.stringify(opt)] = ret
        return ret
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${subject} ${error}`)
      }
    },

    async getData() {
      if (this.subjectTarget.length === 0 || this.yearSelect.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true

      // 数据初始化
      const tmp_dict_year = {}
      const tmp_dict_top = {}
      const tmp_dict_node = {}

      // 年度趋势
      for (let x of this.subjectTarget) {
        const repdata = await this.getOneDate(x, this.yearSelect[0])
        if (!repdata) {
          continue
        }

        if (x === 'Engineering disciplines') {
          x = 'Engineering'
        }
        const _id = `${x}`
        tmp_dict_year[_id] = {
          data: []
        }

        for (const year of this.yearOpt) {
          tmp_dict_year[_id].data.push([
            year,
            repdata.by_year[this.quotaSelect.value][String(year)]
          ])
        }
      }
      let ret_seriest = []
      for (const _id in tmp_dict_year) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: 'line',
            symbolSize: 5,
            large: true,
            data: tmp_dict_year[_id].data.sort((x, y) => {
              return x[0] - y[0]
            }),
            smooth: false
          })
        )
      }
      let data = {
        series: ret_seriest,
        title: `排名前${this.nodeCountSelect}学科,组成的联通网络小世界的${this.quotaSelect.text}年度趋势`
      }
      this.myChartObjs[0].setOption(this.setOptions(data), true)

      // 规模趋势
      for (let x of this.subjectTarget) {
        for (const y of this.yearSelect) {
          const repdata = await this.getOneDate(x, y)
          if (!repdata) {
            continue
          }
          if (x === 'Engineering disciplines') {
            x = 'Engineering'
          }
          const _id = `${y}_${x}`
          tmp_dict_top[_id] = {
            data: []
          }

          for (const nodeCount of this.nodeCountOpt) {
            tmp_dict_top[_id].data.push([
              nodeCount,
              repdata.by_limit[this.quotaSelect.value][String(nodeCount)]
            ])
          }
        }
      }
      ret_seriest = []
      for (const _id in tmp_dict_top) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: 'line',
            symbolSize: 5,
            large: true,
            data: tmp_dict_top[_id].data.sort((x, y) => {
              return x[0] - y[0]
            }),
            smooth: false
          })
        )
      }
      data = {
        series: ret_seriest,
        title: `按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势`
      }
      const chartOpt1 = this.setOptions(data, {
        xname: '节点规模数',
        xtype: 'value',
        subtext: '学科内排名前 X 的组成的小世界网络'
      })
      this.myChartObjs[1].setOption(chartOpt1, true)

      // 实际规模趋势
      for (let x of this.subjectTarget) {
        for (const y of this.yearSelect) {
          const repdata = await this.getOneDate(x, y)
          if (!repdata) {
            continue
          }
          if (x === 'Engineering disciplines') {
            x = 'Engineering'
          }
          const _id = `${y}_${x}`
          tmp_dict_node[_id] = {
            data: []
          }

          for (const nodeCount in repdata.by_node[this.quotaSelect.value]) {
            tmp_dict_node[_id].data.push([
              Number(nodeCount),
              repdata.by_node[this.quotaSelect.value][nodeCount]
            ])
          }
        }
      }
      ret_seriest = []
      for (const _id in tmp_dict_node) {
        ret_seriest.push(
          extendLineSeries({
            name: _id,
            type: 'line',
            symbolSize: 5,
            large: true,
            data: tmp_dict_node[_id].data.sort((x, y) => {
              return x[0] - y[0]
            }),
            smooth: false
          })
        )
      }
      data = {
        series: ret_seriest,
        title: `头部实际联通的小世界网络 ${this.quotaSelect.text} 规模趋势`
      }
      const chartOpt2 = this.setOptions(data, {
        xname: '节点规模数',
        xtype: 'value',
        subtext: '学科内头部排名组成的联通节点数为 X 的小世界网络'
      })
      this.myChartObjs[2].setOption(chartOpt2, true)

      this.loading = false
    },

    setOptions(data, obj = { xname: 'Year', xtype: 'category', subtext: '' }) {
      // 排序
      data.series.sort((x, y) => {
        if (x.data.slice(-1).length === 0 || !x.data.slice(-1)[0][1]) {
          return -1
        }
        if (y.data.slice(-1).length === 0 || !y.data.slice(-1)[0][1]) {
          return 1
        }
        return y.data.slice(-1)[0][1] - x.data.slice(-1)[0][1]
      })

      // // 获取 y 轴的最大最小值
      // var yMax = null;
      // for (let series_t of data.series) {
      //   let gradientList = [];
      //   for (let row of series_t.data) {
      //     gradientList.push(row[1]);
      //   }
      //   let tmp = (Math.floor(Math.max(...gradientList) * 10) + 1) / 10;
      //   if (yMax === null) yMax = tmp;
      //   else if (yMax < tmp) yMax = tmp;
      // }

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
              if (!x.data[1]) {
                return 1
              }
              if (!y.data[1]) {
                return -1
              }
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].name}<br>`
            for (let i = 0; i < params.length; i++) {
              const _text = params[i].seriesName
              const _data = params[i].data
              const _marker = params[i].marker
              if (_data[1] !== undefined) {
                showHtm += `${_marker}${_data[1]}, ${_text} <br>`
              }
            }
            return showHtm
          }
        },
        title: {
          text: data.title,
          left: 'center',
          subtext: obj.subtext
        },
        legend: {
          data: data.series.map(item => {
            return item.name
          })
        },
        xAxis: {
          name: obj.xname,
          type: obj.xtype,
          boundaryGap: false,
          max: 'dataMax'
        },
        yAxis: {
          name: this.quotaSelect.text,
          type: 'value'
          // max: yMax
        },
        series: data.series
      })
      return _opt
    }
  }
}
</script>
