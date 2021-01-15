<template lang="pug">
v-container(fluid)
  v-dialog(v-model='dialog' fullscreen hide-overlay transition='dialog-bottom-transition')
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='dialog = false')
          v-icon mdi-close
        v-toolbar-title 小世界网络统计
        v-spacer
        v-toolbar-items
          v-btn(dark text @click='dialog = false')
            | Close
      v-row.mt-5
        v-col(cols="2")
          v-select(v-model="subchartConfig.subject" :items="categoryOpt" small-chips dense label="小世界学科" @change="calSubChart")
        v-col(cols="3")
          v-select(v-model="yearSelect" :items="yearOpt" small-chips dense label="年份截至" @change="calSubChart")
        v-col(cols="2")
          v-select(v-model="yearRangeSelect" :items="yearRangeOpt" dense deletable-chips label="年份范围" @change="calSubChart")
        v-col(cols="2")
          v-select(v-model="subchartConfig.toplimit" :items="nodeCountOpt" dense label="网络节点数量" @change="calSubChart")

      v-row
        v-col.text-h5(col="8")
          | 平均最短距离
          v-chip {{subchartConfig.Avg_path}}
          | ，平均集聚系数
          v-chip {{subchartConfig.Clustering_coefficient}}
          | ，实际节点数量
          v-chip {{subchartConfig.Num_vertices}}
          | ，平均边数
          v-chip {{subchartConfig.Num_edges}}

      v-row(v-for="chartid of subChartIds" :key="chartid")
        v-col(col="12")
          v-card.mx-auto(outlined :loading="subloading" height="70vh")
            v-container(:id="chartid" fluid fill-height)
      v-row
        v-col
          comment(storagekey="Mag_small_world_2020_Browser_detail_Chart")
  v-row
    v-col(cols="7")
      v-select(v-model="subjectTarget" :items="categoryOpt" small-chips dense deletable-chips clearable multiple label="当前学科" @change="getData")
    v-col(cols="3")
      v-select(v-model="yearSelect" :items="yearOpt" small-chips dense deletable-chips label="年份截至" @change="getData")
    v-col(cols="2")
      v-select(v-model="yearRangeSelect" :items="yearRangeOpt" dense deletable-chips label="年份范围" @change="getData")
  v-row
    v-col(cols="2")
      v-select(v-model="quotaSelect" :items="quotaOpt" dense return-object label="小世界指标" @change="getData")
    v-col(cols="2")
      v-select(v-model="citationSelect" :items="citationOpt" dense disabled return-object label="引用关系" @change="getData")
    v-col(cols="2")
      v-select(v-model="nodeCountSelect" :items="nodeCountOpt" dense label="网络节点上限" @change="getData")
  v-row(v-for="chartid of myChartIds" :key="chartid")
    v-col(col="12")
      v-card.mx-auto(outlined :loading="loading" height="70vh")
        v-container(:id="chartid" fluid fill-height)
  v-row
    v-col
      comment(storagekey="Mag_small_world_2020_Browser_Chart")

</template>

<script>
import { extendEchartsOpts, MAGCoreCategorys2020, defaultCategorySelect, extendLineSeries } from '@/api/data'
import { requestGoV2Wrap } from '@/api/index'
import Base from '@/utils/base'
import _ from 'lodash'
import comment from '@/components/comment'

const coreCategory = MAGCoreCategorys2020.concat()
const defaultSelectCategory = defaultCategorySelect.concat()
coreCategory.push('MAG')
defaultSelectCategory.push('MAG')

export default {
  name: 'MAGSmallWorld2020',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      subchartConfig: {
        toplimit: 50,
        subject: '',
        Avg_path: 0,
        Clustering_coefficient: 0,
        Num_edges: 0,
        Num_vertices: 0
      },
      loading: false,
      subloading: false,
      dialog: false,
      pageName: `MAG 小世界网络`,
      citationSelect: 'linksin',
      citationOpt: ['linksin'],
      subjectTarget: defaultSelectCategory,
      yearSelect: 2015,
      quotaSelect: { text: '平均路径长度', value: 'avc' },
      yearRangeSelect: 0,
      yearRangeOpt: [0, 5, 10, 15, 20, 25, 30, 35, 40],
      nodeCountSelect: 10000,
      nodeCountOpt: [50, 60, 72, 86, 100, 120, 140, 160, 190, 220, 260, 310, 370, 440, 520, 620, 740, 880, 1000, 1200, 1400, 1600, 1900, 2200, 2600, 3100, 3700, 4400, 5200, 6200, 7400, 8800, 10000, 12000, 14000, 16000, 19000, 22000, 26000, 31000, 37000, 44000, 52000, 62000, 74000, 88000, 100000, 120000, 140000, 160000, 190000],
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
      categoryOpt: coreCategory,
      datacache: {},
      myChartIds: ['subjectChart0'],
      subChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4', 'subjectChart5', 'subjectChart6', 'subjectChart7']
    }
  },
  computed: {
    //  图的对象集合
    subChartObjs: function() {
      return this.subChartIds.map(each => this.$echarts.init(document.getElementById(each)))
    }
  },
  watch: {
  },
  mounted() {
    this.getData()
    const that = this
    this.myChartObjs[0].on('click', 'series.line', function(params) {
      that.dialog = !that.dialog
      that.ClickAndDraw(params)
    })
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
        // 按照头部排名的小世界网络 ${this.quotaSelect.text} 规模趋势
        const series = Object.entries(retdata.data.trend).sort((x, y) => {
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
        if (this.quotaSelect.value === 'avc') {
        //  添加 mark line
          series.push({
            type: 'line',
            name: '万维网平均路径长度',
            data: this.nodeCountOpt.map(xv => {
              return [xv, 0.35 + 0.89 * Math.log(xv)]
            })
          })
        }
        const _opt = extendEchartsOpts({
          title: {
            text: `MAG 小世界网络 ${this.quotaSelect.text} 规模趋势`,
            subtext: '点击图中节点获取该网络统计',
            left: 'center'
          },
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
            formatter: argv => {
              let html = ''
              html += `${argv.seriesName}:  ` + '点击获取该网络数据统计<br>'
              html += `节点数：${argv.data[0]},值：${argv.data[1]}<br>`
              return html
            }
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
        this.myChartObjs[0].setOption(_opt, true)
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
      }

      this.loading = false
    }, 2000),
    ClickAndDraw(arg) {
      const topLimit = arg.value[0]
      const subject = arg.seriesName
      if (subject === 'Engineering') {
        this.subchartConfig.subject = 'Engineering disciplines'
      } else {
        this.subchartConfig.subject = subject
      }

      this.subchartConfig.toplimit = topLimit
      this.calSubChart()
    },
    async calSubChart() {
      let subject = this.subchartConfig.subject
      if (subject === 'Engineering') {
        subject = 'Engineering disciplines'
      }
      try {
        this.subloading = true
        const opt = {
          subject,
          year: this.yearSelect,
          topLimit: this.subchartConfig.toplimit,
          yearRange: this.yearRangeSelect
        }
        const retdata = await requestGoV2Wrap('/apigo/v2/mag/small_world_undirected/detail', 'POST', opt)
        console.log(retdata.data)
        if (retdata.code !== 200) {
          this.$emit('emitMesage', `没有数据`)
          return
        }
        // 节点情况赋值
        this.subchartConfig.Clustering_coefficient = retdata.data.example.Clustering_coefficient
        this.subchartConfig.Avg_path = retdata.data.example.Avg_path
        this.subchartConfig.Num_edges = retdata.data.example.Num_edges
        this.subchartConfig.Num_vertices = retdata.data.example.Num_vertices
        const subtitle = `${this.subchartConfig.subject}, 节点数：${this.subchartConfig.toplimit}, 年份：${this.yearSelect}, Range:${this.yearRangeSelect}`
        let chartOpt = this.setOptBar(retdata.data.graphin, subtitle, 'graph linksin 分布')
        this.subChartObjs[1].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.graphout, subtitle, 'graph linksout 分布')
        this.subChartObjs[2].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.ac, subtitle, '作者数分布')
        this.subChartObjs[6].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.year, subtitle, '年份分布')
        this.subChartObjs[0].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.subject, subtitle, '学科分布')
        this.subChartObjs[3].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.out, subtitle, 'linksout 数量分布')
        this.subChartObjs[4].setOption(chartOpt, true)
        chartOpt = this.setOptBar(retdata.data.in, subtitle, 'linksin 分布')
        this.subChartObjs[5].setOption(chartOpt, true)
      } catch (error) {
        console.log(error)
      } finally {
        this.subloading = false
      }
    },
    setOptBar(data, subtitle, title) {
      const items = Object.entries(Object.values(data)[0]).sort((a, b) => a[0].localeCompare(b[0], 'zh-CN', { numeric: true }))
      // _.sortBy(users, function(o) { return o.user; });
      const _opt = extendEchartsOpts({
        title: {
          text: title,
          subtext: subtitle
        },
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
          formatter: argv => {
            const html = `${argv[0].name}<br>count：${argv[0].value}<br>`
            return html
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: -45
          },
          data: items.map(item => item[0])
        },
        yAxis: {
          name: 'count',
          type: 'value'
        },
        series:
           extendLineSeries({
             type: 'bar',
             data: items.map(item => item[1])
           })

      })
      return _opt
    }
  }
}
</script>
