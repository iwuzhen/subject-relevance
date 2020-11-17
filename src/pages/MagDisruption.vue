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
          id="subjectChart1"
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
            id="subjectChart4"
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
            id="subjectChart5"
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
import Disruption from '../assets/data/disruption.json'
import { getStorage } from '@/api/index'
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
      subjectTarget: ['Literature', 'Geometry', 'Philosophy', 'Linguistics', 'Anthropology', 'History', 'Geography', 'Sociology', 'Neuroscience', 'Geology', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Materials science', 'Computer science', 'Chemistry', 'Biology', 'Medicine'].sort(),
      // subjectTarget: ['Computer science', 'Chemistry', 'Biology', 'Medicine'].sort(),
      categorys: [],
      loading: false,
      TopPercent: 20,
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4', 'subjectChart5']
    }
  },
  mounted() {
    const subject = all_subject_data.map(item => item[0])
    this.categorys = subject.sort()
    this.getData()
  },
  methods: {
    getData: _.debounce(async function() {
      console.log('start')
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
      console.log(opt)

      this.myChartObjs[1].setOption(opt, true)

      // p3 幂律图
      const MAGDisruptionPowerLaw = {}
      for (const name of this.subjectTarget) {
        MAGDisruptionPowerLaw[name] = await this.getStorageData(`Disruption_PowerLow_${name}`)
      }
      xaxis = []
      for (let i = 1; i <= 100000; i++) {
        xaxis.push(Number(Math.log10(i).toFixed(4)))
      }
      opt = extendEchartsOpts({
        title: {
          text: 'Subject Disruption PowerLow'
        },
        legend: {
          data: this.subjectTarget
        },
        xAxis: {
          name: 'Percent',
          type: 'value',
          boundaryGap: false,
          max: 'dataMax'
        },
        yAxis: {
          name: 'PowerLow',
          type: 'value',
          min: 'dataMin'
        },
        animation: false,
        series: this.subjectTarget.map(name => {
          const nodes = []
          const tmp_node = MAGDisruptionPowerLaw[name].map((item, index) => {
            return [xaxis[index], item]
          })
          // 过滤，先后差值小于 0.00001, 且 step 小于 5 的
          let lastIndex = 0; let lastValue = 0
          for (const index in tmp_node) {
            if (lastIndex === 0) {
              lastIndex = index
              lastValue = tmp_node[index]
            } else if (index > 100 && index - lastIndex < 50 && lastValue[1] - tmp_node[index][1] < 0.01) {
              continue
            } else {
              lastIndex = index
              lastValue = tmp_node[index]
            }
            nodes.push(tmp_node[index])
          }
          console.log(tmp_node.length, nodes.length)
          return extendLineSeries({
            name: name,
            type: 'line',
            smooth: false,
            data: nodes,
            symbolSize: 5,
            large: true
          })
        })
      })
      this.myChartObjs[2].setOption(opt, true)

      // 图4
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
      this.myChartObjs[3].setOption(opt, true)

      // P5
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
      this.myChartObjs[4].setOption(opt, true)
    }, 2000),
    async getStorageData(key) {
      const opt = {
        path: key
      }
      const data = await getStorage(opt)
      return data.data.Data
    }
  }
}
</script>
