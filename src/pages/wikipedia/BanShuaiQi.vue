<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-14 22:23:01
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 12:31:56
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
          v-model="levelSelect"
          :items="levelOpt"
          label="level"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          label="year"
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
      <v-col col="12">
        <v-subheader>最大值 20 年，代表没有半衰期</v-subheader>
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-container
            id="subjectChart"
            fluid
            fill-height
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
import { getBanshuaiqi } from '@/api/index'
import Base from '@/utils/base'
import { basiCategorys, defaultCategorySelect } from '@/api/data'

export default {
  name: 'WikiBanshuaiqi',
  extends: Base,
  data() {
    return {
      pageName: 'wiki 子类半衰期',
      dialog: false,
      currentSubjectSelect: defaultCategorySelect,
      levelSelect: '2',
      levelOpt: ['1', '2'],
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
      categoryOpt: basiCategorys,
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (this.currentSubjectSelect.length === 0) {
        return false
      }
      this.loading = true
      const opt = {
        cats: this.currentSubjectSelect.join(','),
        level: this.levelSelect,
        year: this.yearSelect
      }
      //   let data;
      const response = await getBanshuaiqi(opt)
      if (response.data.data) {
        this.drawChart(response.data.data)
      } else {
        this.$emit('emitMesage', `请求失败`)
      }
    },
    drawChart(data) {
      const options = this.setOptions(data)
      console.log(options)
      console.log('draw')
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      const pieData = {}
      for (const year of data.y) {
        if (!pieData[`${year}年`]) {
          pieData[`${year}年`] = 1
        } else {
          pieData[`${year}年`] = pieData[`${year}年`] + 1
        }
      }
      console.log(pieData)
      const _opt = {
        tooltip: {},
        title: [
          {
            text: '衰减学科分布',
            left: '35%',
            textAlign: 'center'
          },
          {
            text: '衰减年份分布',
            left: '80%',
            textAlign: 'center'
          }
        ],
        grid: [
          {
            top: 50,
            width: '70%',
            bottom: '45%',
            left: 10,
            containLabel: true
          }
        ],
        xAxis: [
          {
            type: 'value',
            name: '衰减需要的年数',
            max: Math.max(...data.y) + 1,
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '学科',
            type: 'category',
            data: data.x,
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'bar',
            stack: 'chart',
            z: 3,
            label: {
              normal: {
                position: 'right',
                show: true
              }
            },
            data: data.y
          },
          {
            type: 'pie',
            radius: [0, '30%'],
            center: ['80%', '25%'],
            data: Object.keys(pieData).map(function(key) {
              return {
                name: key,
                value: pieData[key]
              }
            })
          }
        ]
      }
      return _opt
    }
  }
}
</script>
