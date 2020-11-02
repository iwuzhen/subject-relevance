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
          id="subjectChart"
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
import { extendEchartsOpts } from '@/api/data'
import Base from '@/utils/base'
const all_subject_data = [['Engineering disciplines', -0.3442484895001789], ['Medicine', -0.32031742808782326], ['Chemistry', -0.2901915798802886], ['Biology', -0.28343739257192563], ['Mathematics', -0.22101136639630437], ['Computer science', -0.19841437256428804], ['Physics', -0.19706696888006128], ['Materials science', -0.1760090997629796], ['Psychology', -0.1564162700447593], ['Neuroscience', -0.11829556687574033], ['Sociology', -0.11705077847570598], ['Artificial intelligence', -0.11561346170672761], ['Electrical engineering', -0.1148178368084955], ['Economics', -0.1118533396560675], ['Chemical engineering', -0.09710595974392938], ['Discrete mathematics', -0.0929787002801311], ['Environmental science', -0.08964060855227929], ['Theoretical computer science', -0.08786765159842216], ['Geology', -0.07934056191774995], ['Machine learning', -0.0755754348458528], ['Mechanical engineering', -0.07418761524430925], ['Geography', -0.07154609446101935], ['Political science', -0.06786383627415186], ['Computer engineering', -0.06219970696154213], ['Environmental engineering', -0.06075334922709353], ['Civil engineering', -0.05319386693924246], ['Earth science', -0.05252529288064279], ['Applied mathematics', -0.04801105335799575], ['Algebra', -0.04756704193445342], ['Biological engineering', -0.04696132963627269], ['Anthropology', -0.04668249050474774], ['Cognitive science', -0.0442475401647108], ['Applied physics', -0.040893139611822726], ['Theoretical physics', -0.0406948028208771], ['Linguistics', -0.03754258265338411], ['Geometry', -0.03549393526359173], ['History', -0.03515563165652671], ['Industrial engineering', -0.03048531925364342], ['Operating system', -0.02501928740160561], ['Genetic engineering', -0.0196518628756365], ['Philosophy', -0.01915371358338393], ['Literature', -0.018451094009862726], ['Number theory', -0.013744293109706011], ['Experimental physics', -0.011645890754196944], ['Quantum computing', -0.011512929273592518], ['Logic', -0.010142236048268362], ['Deep learning', -0.009599457936372369], ['Genome editing', -0.006543094393840373]]
export default {
  name: 'MagDisruption',
  extends: Base,
  data() {
    return {
      pageName: 'MAG 学科颠覆度',
      subjectTarget: [],
      categorys: '',
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  mounted() {
    const subject = all_subject_data.map(item => item[0])
    this.categorys = subject
    this.subjectTarget = subject
    this.getData()
  },
  methods: {
    async getData() {
      const current_subject_data = all_subject_data.filter(item => this.subjectTarget.includes(item[0])).map(item => { return [item[0], item[1].toFixed(5)] })
      const opt = extendEchartsOpts({
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
      console.log(opt)
      this.myChartObjs[0].setOption(opt, true)
    }

  }
}
</script>
