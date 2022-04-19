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
      <v-col cols="7">
        <v-slider
          v-model="TopPercent"
          :max="100"
          :min="5"
          dense
          hide-details
          step="5"
          hint="top percent"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 6rem">top percent</p>
            <v-text-field
              :value="TopPercent"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="TopPercent=$event"
            />
          </template>
        </v-slider>
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
      <v-col>
        <comment storagekey="MagDisruption_graph_1" />
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
        <comment storagekey="MagDisruption_graph_2" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-slider
          v-model="ByYearTopPercent"
          :max="100"
          :min="5"
          dense
          hide-details
          step="5"
          hint="top percent"
          class="align-center"
          @change="getP7Graph"
        >
          <template v-slot:prepend>
            <p style="width: 6rem">top percent</p>
            <v-text-field
              :value="ByYearTopPercent"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="TopPercent=$event"
            />
          </template>
        </v-slider>
      </v-col>
      <v-col cols="7">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1945"
          dense
          hide-details
          hint="年份范围"
          class="align-center"
          @change="getP7Graph"
        >
          <template v-slot:prepend>
            <p style="width: 100px">年份范围</p>
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
            id="subjectChart7"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="MagDisruption_graph_5" />
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
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-container
            id="subjectChart4"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="MagDisruption_graph_3" />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="140vh"
        >
          <v-container
            id="subjectChart5"
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
          height="140vh"
        >
          <v-container
            id="subjectChart6"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="MagDisruption_graph_4" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import Disruption from '@/assets/data/disruption.json'
import { getMultipleStorage } from '@/api/index'
import _ from 'lodash'

const all_subject_data = [['Engineering disciplines', -0.3442484895001789], ['Medicine', -0.32031742808782326], ['Chemistry', -0.2901915798802886], ['Biology', -0.28343739257192563], ['Mathematics', -0.22101136639630437], ['Computer science', -0.19841437256428804], ['Physics', -0.19706696888006128], ['Materials science', -0.1760090997629796], ['Psychology', -0.1564162700447593], ['Neuroscience', -0.11829556687574033], ['Sociology', -0.11705077847570598], ['Artificial intelligence', -0.11561346170672761], ['Electrical engineering', -0.1148178368084955], ['Economics', -0.1118533396560675], ['Chemical engineering', -0.09710595974392938], ['Discrete mathematics', -0.0929787002801311], ['Environmental science', -0.08964060855227929], ['Theoretical computer science', -0.08786765159842216], ['Geology', -0.07934056191774995], ['Machine learning', -0.0755754348458528], ['Mechanical engineering', -0.07418761524430925], ['Geography', -0.07154609446101935], ['Political science', -0.06786383627415186], ['Computer engineering', -0.06219970696154213], ['Environmental engineering', -0.06075334922709353], ['Civil engineering', -0.05319386693924246], ['Earth science', -0.05252529288064279], ['Applied mathematics', -0.04801105335799575], ['Algebra', -0.04756704193445342], ['Biological engineering', -0.04696132963627269], ['Anthropology', -0.04668249050474774], ['Cognitive science', -0.0442475401647108], ['Applied physics', -0.040893139611822726], ['Theoretical physics', -0.0406948028208771], ['Linguistics', -0.03754258265338411], ['Geometry', -0.03549393526359173], ['History', -0.03515563165652671], ['Industrial engineering', -0.03048531925364342], ['Operating system', -0.02501928740160561], ['Genetic engineering', -0.0196518628756365], ['Philosophy', -0.01915371358338393], ['Literature', -0.018451094009862726], ['Number theory', -0.013744293109706011], ['Experimental physics', -0.011645890754196944], ['Quantum computing', -0.011512929273592518], ['Logic', -0.010142236048268362], ['Deep learning', -0.009599457936372369], ['Genome editing', -0.006543094393840373]]
export default {
  name: 'MagDisruption',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MAG 学科颠覆度',
      subjectTarget: ['Biology', 'Chemistry', 'Computer science',
        'Economics', 'Geography',
        'History', 'Literature', 'Materials science',
        'Mathematics', 'Medicine', 'Philosophy',
        'Physics'],
      // subjectTarget: ['Computer science', 'Medicine', 'Chemistry', 'Biology'].sort(),
      categorys: [],
      loading: false,
      TopPercent: 20,
      years: [1945, 2019],
      ByYearTopPercent: 10,
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4', 'subjectChart5', 'subjectChart6', 'subjectChart7']
    }
  },
  mounted() {
    const subject = all_subject_data.map(item => item[0])
    this.categorys = subject.sort()
    this.getData()
  },
  methods: {
    getP7Graph: _.debounce(async function() {
      // p7 颠覆度逐年图
      // 一次获取所有data
      let names = []
      let datasets = []
      const pargs = []
      const xaxis = []
      for (let i = this.years[0]; i <= this.years[1]; i += 1) {
        xaxis.push(i)
      }
      for (const name of this.subjectTarget) {
        names.push(name)
        pargs.push(`Disruption_page_by_year_${name}`)
      }
      const itemdata = await this.getStorageData(pargs)
      console.log(itemdata)
      datasets = itemdata.map(item => item.Data)

      // 提取对应百分比的数据
      const percentIndex = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].indexOf(this.ByYearTopPercent)
      const subjectData = datasets.map(item => {
        return item.filter(obj => { return this.years[0] <= obj.year && obj.year <= this.years[1] }).map(itemdata => {
          return itemdata.data[percentIndex]
        })
      })
      const fuseData = _.zip(names, subjectData)
      fuseData.sort((x, y) =>
        y[1][y[1].length - 1] - x[1][x[1].length - 1]
      )
      const tp = _.unzip(fuseData)
      names = tp[0]
      datasets = tp[1]

      console.log(fuseData)
      const opt = extendEchartsOpts({
        title: {
          text: `Top ${this.ByYearTopPercent}% Subject Disruption By year`
        },
        legend: {
          data: names
        },
        xAxis: {
          name: 'year',
          type: 'category',
          boundaryGap: false,
          data: xaxis
        },
        yAxis: {
          name: 'Average Disruption',
          type: 'value',
          max: 'dataMax'
        },
        series: fuseData.map((item, index) => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      this.myChartObjs[6].setOption(opt, true)
    }),
    getData: _.debounce(async function() {
      this.getP7Graph()
      this.loading = true
      const current_subject_data = all_subject_data.filter(item => this.subjectTarget.includes(item[0])).map(item => { return [item[0], item[1].toFixed(5)] })
      let opt = extendEchartsOpts({
        title: {
          text: '学科全集'
        },
        legend: {
          bottom: 10,
          orient: 'vertical',
          data: current_subject_data.map(item => item[0])
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          data: current_subject_data.map(item => item[0]),
          position: 'buttom',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: -55
          }
        },
        series: [{
          name: 'Sale',
          type: 'bar',
          data: current_subject_data.map(item => item[1])
        }]
      })
      this.myChartObjs[0].setOption(opt, true)

      // 图 2
      // 数组列表
      let xaxis = []
      for (let i = 5; i <= this.TopPercent; i += 5) {
        xaxis.push(i)
      }
      const legend = current_subject_data.map((item, index) => {
        return [Disruption.data[item[0]].y[xaxis.length - 1], item[0]]
      })
      legend.sort((a, b) => b[0] - a[0])
      // 生成 opt
      opt = extendEchartsOpts({
        title: {
          text: 'Subject Disruption Trend by Page'
        },
        legend: {
          data: legend.map(item => item[1])
        },
        xAxis: {
          name: 'Percent',
          type: 'category',
          boundaryGap: false,
          data: xaxis
        },
        yAxis: {
          name: 'Average Disruption',
          type: 'value',
          max: 1
        },
        series: current_subject_data.map((item, index) => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: Disruption.data[item[0]].y.slice(0, xaxis.length)
          })
        })
      })

      this.myChartObjs[1].setOption(opt, true)

      // p3 幂律图
      let names = []
      let datasets = []
      // x轴坐标
      xaxis = []
      for (let i = 1; i <= 100000; i++) {
        xaxis.push(Number(Math.log10(i)))
      }

      // 一次获取所有data
      let pargs = []
      for (const name of this.subjectTarget) {
        names.push(name)
        pargs.push(`Disruption_PowerLaw_${name}`)
      }
      let itemdata = await this.getStorageData(pargs)
      try {
        datasets = itemdata.map(item => item.Data)

        // lengde
        const fuseData = _.zip(names, datasets)
        fuseData.sort((x, y) => {
          try {
            return y[1][y[1].length - 1] - x[1][x[1].length - 1]
          } catch (error) {
            return -1
          }
        }

        )
        const tp = _.unzip(fuseData)
        names = tp[0]
        datasets = tp[1].map(item => Float32Array.from(item))
        // 加入 x 轴
        datasets.unshift(xaxis.slice(0, 100000))

        opt = extendEchartsOpts({
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
                return y.data[y.encode.y[0]] - x.data[x.encode.y[0]]
              })
              let showHtm = ` ${params[0].axisValueLabel}<br>`
              for (let i = 0; i < params.length; i++) {
                const _text = params[i].seriesName
                const _data = params[i].data[i + 1]
                if (_data === undefined) {
                  continue
                }
                const _marker = params[i].marker
                showHtm += `${_marker}${_text}：${_data}<br>`
              }
              return showHtm
            }
          },
          title: {
            text: 'Subject Disruption PowerLaw'
          },
          legend: {
            data: names
          },
          xAxis: {
            name: 'Rank log',
            type: 'value',
            boundaryGap: false
          // max: 'dataMax'
          },
          yAxis: {
            name: 'PowerLaw',
            type: 'value'
          // min: 'dataMin'
          },
          dataset: {
            source: datasets,
            sourceHeader: false
          },
          animation: false,
          series: names.map((name, index) => {
            return {
              name: name,
              type: 'scatter',
              smooth: false,
              symbolSize: 5,
              seriesLayoutBy: 'row',
              encode: {
                x: 0,
                y: index + 1
              },
              large: true
            }
          })
        })
        console.log(opt)
        this.myChartObjs[2].setOption(opt, true)
      } catch (error) {
        console.log(error)
      }

      // p4
      names = []
      datasets = []

      // x轴坐标
      xaxis = []
      for (let i = 1; i <= 100000; i++) {
        xaxis.push(Number(i))
      }

      // 一次获取所有data
      pargs = []
      for (const name of this.subjectTarget) {
        names.push(name)
        pargs.push(`Disruption_page_${name}`)
      }
      itemdata = await this.getStorageData(pargs)
      datasets = itemdata.map(item => item.Data)

      // lendge
      const fuseData = _.zip(names, datasets)
      fuseData.sort((x, y) =>
        y[1][y[1].length - 1] - x[1][x[1].length - 1]
      )
      const tp = _.unzip(fuseData)
      names = tp[0]
      datasets = tp[1]
      // 加入 x 轴
      datasets.unshift(xaxis.slice(0, 100000))

      opt = extendEchartsOpts({
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
              return y.data[y.encode.y[0]] - x.data[x.encode.y[0]]
            })
            let showHtm = ` ${params[0].axisValueLabel}<br>`
            for (let i = 0; i < params.length; i++) {
              const _text = params[i].seriesName
              const _data = params[i].data[i + 1]
              if (_data === undefined) {
                continue
              }
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        title: {
          text: 'Subject Disruption Page Rank'
        },
        legend: {
          data: names
        },
        xAxis: {
          name: 'Rank',
          type: 'value',
          boundaryGap: false
          // max: 'dataMax'
        },
        yAxis: {
          name: 'Disruption',
          type: 'value'
          // min: 'dataMin'
        },
        dataset: {
          source: datasets,
          sourceHeader: false
        },
        animation: false,
        series: names.map((name, index) => {
          return {
            name: name,
            type: 'scatter',
            smooth: false,
            symbolSize: 5,
            seriesLayoutBy: 'row',
            encode: {
              x: 0,
              y: index + 1
            },
            large: true
          }
        })

      })
      this.myChartObjs[3].setOption(opt, true)

      // 图5
      let links = []
      let data = [{ name: 'empty ' }]
      // 存储 node name
      for (const name of this.subjectTarget) {
        data.push({ name: `${name}` })
        for (const i in Disruption.subject) {
          if (Disruption.data[name].in[i] > 0.01) {
            links.push({
              source: name,
              target: `${Disruption.subject[i]} `,
              value: Disruption.data[name].in[i]
            })
          }
        }
      }
      for (const name of Object.keys(Disruption.data)) {
        data.push({ name: `${name} ` })
      }

      opt = {
        title: {
          text: `mag linksin ${this.TopPercent}% 引用分布`
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: {
          type: 'sankey',
          right: 150.0,
          focusNodeAdjacency: 'allEdges',
          data,
          links
        }
      }
      this.myChartObjs[4].setOption(opt, true)

      // P6
      links = []
      data = [{ name: 'empty ' }]
      // 存储 node name
      for (const name of this.subjectTarget) {
        data.push({ name: `${name}` })
        for (const i in Disruption.subject) {
          if (Disruption.data[name].out[i] > 0.01) {
            links.push({
              source: name,
              target: `${Disruption.subject[i]} `,
              value: Disruption.data[name].out[i]
            })
          }
        }
      }
      for (const name of Object.keys(Disruption.data)) {
        data.push({ name: `${name} ` })
      }

      opt = {
        title: {
          text: `mag linksout ${this.TopPercent}% 引用分布`
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: {
          type: 'sankey',
          right: 150.0,
          focusNodeAdjacency: 'allEdges',
          data,
          links
        }
      }
      this.myChartObjs[5].setOption(opt, true)
      this.loading = false
    }, 2000),

    async getStorageData(keys) {
      const opt = {
        paths: keys
      }
      const data = await getMultipleStorage(opt)
      return data.data
    }
  }
}
</script>
