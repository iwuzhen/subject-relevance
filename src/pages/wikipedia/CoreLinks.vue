<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-05-14 16:16:27
 * @LastEditors: ider
 * @LastEditTime: 2020-12-17 17:53:28
 * @Description:
 -->

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
          v-model="yearSelect"
          :items="yearOpt"
          label="年"
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
  </v-container>
</template>

<script>
import {
  getCoreLinksInDataByCats,
  getCoreLinksInData
  //   getDistanceCore
} from '@/api/index'
import { extendEchartsOpts, coreCategorys1, defaultCategorySelect1 } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'CoreWikiRefDetail',
  extends: Base,
  data() {
    return {
      pageName: 'core_wiki类引用成分图',
      subjectTarget: '',
      subjectRelevances: defaultCategorySelect1,
      pageCountSelect: '3000',
      categorys: coreCategorys1,
      levelSelect: 3,
      levelOpt: [3, 4],
      yearSelect: 2007,
      yearOpt: [
        2007,
        2008,
        2009,
        2010,
        2011,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020
      ],
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
      myChartIds: ['subjectChart1', 'subjectChart2']
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
  mounted() { },
  methods: {
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        return false
      }
      this.loading = true
      const opt1 = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item === this.subjectTarget) {
              return false
            }
            return true
          })
          .join(','),
        year: this.yearSelect,
        N: this.pageCountSelect,
        level: this.levelSelect
      }
      const opt2 = {
        str: Array.from(
          new Set([...this.subjectRelevances, this.subjectTarget])
        ).join(','),
        year: this.yearSelect,
        N: this.pageCountSelect,
        level: this.levelSelect
      }
      try {
        //   饼图
        const resPie = await getCoreLinksInData(opt1)
        // sankey graph
        const resSankey = await getCoreLinksInDataByCats(opt2)
        const seriesPie = {
          type: 'pie',
          top: '5%',
          radius: '55%',
          center: ['50%', '60%'],
          // bottom: "50%",
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(10, 11, 0, 0.5)'
            }
          },
          name: this.subjectTarget,
          data: []
        }
        for (const item of Object.entries(resPie.data.data.info)) {
          if (item[0] === 'other') continue
          seriesPie.data.push({
            value: item[1],
            name: item[0]
          })
        }
        console.log(seriesPie)

        const seriesSankey = {
          top: '10%',
          type: 'sankey',
          layout: 'none',
          focusNodeAdjacency: 'allEdges',
          data: [
            ...Object.keys(resSankey.data.data).map(item => {
              return { name: item }
            }),
            ...Object.keys(resSankey.data.data).map(item => {
              return { name: ` ${item}` }
            })
          ],
          links: []
        }
        for (const item of Object.entries(resSankey.data.data)) {
          for (const target of Object.entries(item[1].info)) {
            seriesSankey.links.push({
              source: item[0],
              target: ` ${target[0]}`,
              value: target[1]
            })
          }
        }
        console.log(seriesSankey)

        const options1 = extendEchartsOpts({
          title: {
            left: 'center',
            text: `${this.subjectTarget} 的相关学科占比`
          },
          tooltip: [
            {
              trigger: 'item',
              //   formatter: "{a} <br/>{b} : {c} ({d}%)"
              triggerOn: 'mousemove'
            }
          ],
          legend: {
            orient: 'vertical',
            left: 20,
            top: '2%',
            data: seriesPie.data.map(item => {
              return item.name
            })
          },
          series: seriesPie
        })

        const options2 = extendEchartsOpts({
          title: {
            left: 'center',
            text: `选中学科间的 linker 分布`
          },
          tooltip: [
            {
              trigger: 'item',
              //   formatter: "{a} <br/>{b} : {c} ({d}%)"
              triggerOn: 'mousemove'
            }
          ],
          series: seriesSankey
        })
        this.myChartObjs[0].setOption(options1, true)
        this.myChartObjs[1].setOption(options2, true)
        this.loading = false
      } catch (error) {
        this.$emit('emitMesage', `请求失败:${error}`)
        throw error
      }
    }
  }
}
</script>
