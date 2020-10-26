<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          small-chips
          multiple
          deletable-chips
          clearable
          label="相关学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodValue"
          :items="methodOptions"
          label="条件"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="pageCountSelect"
          :items="pageCountOpt"
          label="文章数"
          @change="getData"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="levelSelect"
          :items="levelOpt"
          label="层数"
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
    <v-row>
      <v-col>
        <comment storagekey="disciplineCore_Chart_2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDistanceCore } from '@/api/index'
import { extendEchartsOpts, coreCategorys1, extendLineSeries, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'

coreCategorys1.push({
  text: 'Theoretical physics',
  value: 'Theoretical physics'
})

export default {
  name: 'CoreWiki',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: `Core Wiki 学科相关度 ${this.$route.query.version} `,
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect1,
      methodValue: 'linksin',
      pageCountSelect: '3000',
      categorys: coreCategorys1,
      methodOptions: ['linksin', 'linksout'],
      levelSelect: 3,
      levelOpt: [3],
      pageCountOpt: [
        {
          value: '1000',
          text: 'top 1000 文章'
        },
        {
          value: '2000',
          text: 'top 2000 文章'
        },
        {
          value: '3000',
          text: 'top 3000 文章'
        },
        {
          value: '3500',
          text: 'top 3500 文章'
        },
        {
          value: '4000',
          text: 'top 4000 文章'
        },
        {
          value: '5000',
          text: 'top 5000 文章'
        },
        {
          value: '6000',
          text: 'top 6000 文章'
        },
        {
          value: '7000',
          text: 'top 7000 文章'
        },
        {
          value: '8000',
          text: 'top 8000 文章'
        },
        {
          value: '9000',
          text: 'top 9000 文章'
        },
        {
          value: '10000',
          text: 'top 10000 文章'
        }
      ],
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  computed: {
    categorysOptions: function() {
      const subjectTarget = this.subjectTarget
      return this.categorys.map(item => {
        const ret = {
          value: item.value,
          text: item.text
        }
        if (item.value === subjectTarget) ret['disabled'] = true
        return ret
      })
    }
  },
  mounted() {
    if (this.$route.query.version === 'v1') {
      this.levelOpt = [3, 4]
    } else if (this.$route.query.version === 'v2') {
      this.levelOpt = [3]
    } else if (this.$route.query.version === 'v3') {
      this.levelOpt = [2, 3]
    } else if (this.$route.query.version === 'v4') {
      this.levelOpt = [2]
      this.levelSelect = 2
      this.methodValue = 'linksout'
    }
  },
  methods: {
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        return false
      }
      this.loading = true
      const subjectTarget = this.subjectTarget
      const opt = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item === subjectTarget) {
              return false
            }
            return true
          })
          .join(','),
        method: this.methodValue,
        level: this.pageCountSelect,
        levelType: this.levelSelect,
        btype: this.$route.query.version
      }
      getDistanceCore(opt)
        .then(res => {
          if (res.data) {
            this.drawChart(res.data)
          } else {
            this.loading = false
            // this.$emit("emitMesage", "请求失败");
            return false
          }
        })
        .catch(rej => {
          this.loading = false
          this.$emit('emitMesage', `请求失败:${rej}`)
        })
    },
    drawChart(data) {
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
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
          name: 'Semantic Distance',
          type: 'value',
          max: 1
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
      return _opt
    }
  }
}
</script>

