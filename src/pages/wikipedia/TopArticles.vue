<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-14 22:23:01
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 16:10:28
 * @Description:
 -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="currentSubjectSelect"
          :items="categoryOpt"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearsSelect"
          :items="yearsOpt"
          multiple
          label="year"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="tableSelect"
          :items="tableOpt"
          label="表格类型"
          @change="getData"
        />
      </v-col>
      <!-- <v-col align-self="center" cols="2">
        <v-btn
          color="light-blue lighten-2"
          dark
          small
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          参数
        </v-btn>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in gridData"
        :key="index"
        col="4"
      >
        <v-card>
          <v-card-title>{{ item.title }}</v-card-title>
          <v-data-table
            :headers="item.headers"
            :items="item.desserts"
            dense
            sort-desc
            class="elevation-1"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          参数说明
        </v-card-title>

        <v-card-text>
          <p />
        </v-card-text>

        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getTopArticles } from '@/api/index'
import { basiCategorys, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'WikiTop',
  extends: Base,
  data() {
    return {
      pageName: 'wiki 学科top文章展示',
      dialog: false,
      currentSubjectSelect: defaultCategorySelect,
      yearsSelect: [2020],
      tableSelect: '按学科组合',
      tableOpt: ['按年组合', '按学科组合'],
      yearsOpt: [
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
      categoryOpt: basiCategorys,
      loading: false,
      gridData: [],
      myChartIds: ['subjectChart']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (
        this.currentSubjectSelect.length === 0 ||
        this.yearsSelect.length === 0
      ) {
        return false
      }
      this.loading = true
      const opt = {
        cats: this.currentSubjectSelect.join(','),
        years: this.yearsSelect.join(',')
      }
      //   let data;
      const response = await getTopArticles(opt)
      if (response.data.data) {
        this.drawTable(response.data.data)
      } else {
        this.$emit('emitMesage', '请求失败')
      }
    },
    drawTable(data) {
      const ret_data = []
      if (this.tableSelect === '按年组合') {
        const headers = [
          {
            text: 'article name',
            align: 'start',
            sortable: false,
            value: 'name'
          },
          {
            text: 'links count',
            align: 'start',
            value: 'links'
          }
        ]
        // 组合 header
        for (const catename of this.currentSubjectSelect) {
          headers.push({
            text: `${catename} 排名`,
            align: 'center',
            value: catename,
            sort: (a, b) => {
              if (!a) {
                return 1
              } else if (!b) {
                return -1
              }
              return a - b
            }
          })
        }
        for (const year of this.yearsSelect) {
          const desserts = {}
          for (const catename of this.currentSubjectSelect) {
            const sortedItems = Object.entries(data[year][catename]).sort(
              (x, y) => {
                return Number(y[1]) - Number(x[1])
              }
            )
            const sortedNameArray = Object.entries(data[year][catename])
              .sort((x, y) => {
                return Number(y[1]) - Number(x[1])
              })
              .map(item => {
                return item[0]
              })
            for (const item of sortedItems) {
              if (!desserts[item[0]]) {
                desserts[item[0]] = {}
              }
              desserts[item[0]]['name'] = item[0]
              desserts[item[0]]['links'] = item[1]
              desserts[item[0]][catename] =
                sortedNameArray.indexOf(item[0]) + 1
            }
          }
          ret_data.push({
            title: `${year} 各学科文章`,
            headers: headers,
            desserts: Object.values(desserts)
          })
        }
      } else {
        // 年为表头
        const headers = [
          {
            text: 'article name',
            align: 'start',
            sortable: false,
            value: 'name'
          }
        ]
        // 组合 header

        for (const year of this.yearsSelect) {
          headers.push({
            text: `${year} count`,
            align: 'center',
            value: `y${year}`,
            sort: (a, b) => {
              if (!a) {
                return -1
              } else if (!b) {
                return 1
              }
              return a - b
            }
          })
        }
        for (let catename of this.currentSubjectSelect) {
          // 二次循环出
          // 补丁
          if (catename === 'Engineering disciplines') {
            catename = 'Engineering'
          }
          const desserts = {}
          for (const year of this.yearsSelect) {
            console.log(data, catename)
            const sortedItems = Object.entries(data[year][catename]).sort(
              (x, y) => {
                return Number(y[1]) - Number(x[1])
              }
            )
            for (const articleCount of sortedItems) {
              if (!desserts[articleCount[0]]) {
                desserts[articleCount[0]] = {}
              }
              desserts[articleCount[0]]['name'] = articleCount[0]
              desserts[articleCount[0]][`y${year}`] = articleCount[1]
            }
          }
          ret_data.push({
            title: `${catename} 各年文章`,
            headers: headers,
            desserts: Object.values(desserts)
          })
        }
      }

      this.gridData = ret_data
      this.loading = false
    }
  }
}
</script>
