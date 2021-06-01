<template lang="pug">
v-container(fluid)
    v-row
        v-col(cols="8")
            v-select(v-model="subject.select",:items="subject.opt",dense,
                small-chips,deletable-chips,multiple,label="相关学科",@change="getData")
        v-col(cols='2')
          v-select(v-model='dataType.select' :items='dataType.opt' dense label='类型' @change='getData')

    v-row(v-for="chartid of myChartIds",:key="chartid")
        v-col(col="12")
            v-card(class="mx-auto",outlined,:loading="loading",height="70vh")
                template(slot="progress")
                    v-progress-linear(height="25",v-model="knowledge",striped)
                        strong {{ Math.ceil(knowledge) }}%
                v-container(:id="chartid",fluid,fill-height,)
    v-row
      v-col
        comment(storagekey="Wikipedia_suject_article_count_Chart_2020_1")
</template>

<script>
import comment from '@/components/comment'
import Base from '@/utils/base'
import _ from 'lodash'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import subjectArticle from '@/assets/data/subject_article_count.json'

export default {
  name: 'Magbubbles',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wikipeida 学科单篇文章的的历年长度',
      myChartIds: ['wikiChart1'],
      loading: false,
      subject: {
        opt: Object.keys(subjectArticle.data),
        select: Object.keys(subjectArticle.data)
      },
      dataType: {
        opt: ['当前量', 'dx'],
        select: '当前量'
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: _.debounce(async function() {
      let seriesBasicData
      if (this.dataType.select === 'dx') {
        seriesBasicData = subjectArticle.dxdata
      } else {
        seriesBasicData = subjectArticle.data
      }
      const _opt = extendEchartsOpts({
        title: {
          text: 'wikipeida 学科单篇文章的的历年长度'
        },
        legend: {
          data: this.subject.select
        },
        xAxis: {
          name: '时间',
          type: 'category',
          boundaryGap: false,
          data: subjectArticle.xdata
        },
        yAxis: {
          name: 'Count',
          type: 'value'
        },
        series: Object.entries(seriesBasicData).filter((item) => this.subject.select.includes(item[0])).map(
          item => {
            return extendLineSeries({
              name: item[0],
              type: 'line',
              smooth: false,
              data: item[1]
            })
          }
        )
      })
      this.myChartObjs[0].setOption(_opt, true)
      this.loading = false
    }, 1000)
  }
}
</script>
