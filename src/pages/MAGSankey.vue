<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
          @change="getData"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="7">
        <v-slider
          v-model="year"
          :max="2019"
          :min="1900"
          dense
          hide-details
          hint="年份"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 3rem">年份</p>
            <v-text-field
              :value="year"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="year=$event"
            />
          </template>
        </v-slider>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          dense
          deletable-chips
          label="统计因子"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="versionSelect"
          :items="versionOpt"
          dense
          deletable-chips
          label="基础数据"
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
          height="75vh"
        >
          <v-container
            id="masChart1"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="MagSankey_Chart_2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Base from '@/utils/base'

// eslint-disable-next-line no-unused-vars
import { getYinguoData } from '@/api/index'
import comment from '@/components/comment'

import { defaultCategorySelect, coreCategorys } from '@/api/data'

export default {
  name: 'MagGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'Mag 学科因果关系桑基图',
      year: 2016,
      subjectRelevances: defaultCategorySelect.map(each => {
        if (each === 'Engineering disciplines') {
          each = 'Engineering'
        }
        return each
      }),
      loading: false,
      categorys: coreCategorys,
      methodSelect: 'linksout',
      methodOpt: ['article', 'linksin', 'linksout', { text: 'Import_and_export', value: 'Import_and_export' }],
      versionSelect: 'delete_noref_v2_distinct',
      versionOpt: [{ text: 'v2 全集,去重', value: 'v2' }, { text: 'v2 全集,不去重', value: 'v2_distinct' }, { text: 'v2 去 0,不去重', value: 'delete_noref_v2_distinct' }],

      myChartIds: ['masChart1']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      const linksArray = []
      const linksDict = []
      let nameArray = []

      // 贸易图
      for (const subject of this.subjectRelevances) {
        const opt = {
          strA: subject,
          strB: this.subjectRelevances
            .filter(item => {
              if (item === this.subjectTarget) {
                return false
              }
              return true
            })
            .join(','),
          db: 'mag',
          method: this.methodSelect,
          type: 0,
          from: this.year,
          to: this.year,
          version: this.versionSelect
        }
        const res = await getYinguoData(opt)
        for (const i in res.data.legend) {
          linksDict[res.data.legend[i]] = res.data.y[i][0]
        }
      }
      console.log(linksDict)
      for (const key in linksDict) {
        const [source, target] = key.split('-')
        linksArray.push({
          source, target: `${target} `, value: linksDict[key]
        })
        nameArray.push(source)
        nameArray.push(`${target} `)
      }
      nameArray = Array.from(new Set(nameArray))
      console.log(linksArray)
      const options = this.setOptions(nameArray.map(each => { return { name: each } }), linksArray)
      this.myChartObjs[0].setOption(options, true)

      this.loading = false
    },

    setOptions(data, links) {
      const _opt = {
        title: {
          text: `mag ${this.year} 学科因果关系图`
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
      return _opt
    }
  }

}
</script>
