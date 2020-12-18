<template>
  <v-container fluid>
    <v-row>
      <v-col cols="10">
        <v-select
          v-model="subjectTarget"
          :items="categorysOptions"
          dense
          small-chips
          deletable-chips
          clearable
          multiple
          label="目标学科"
          @change="getData"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="typeValue"
          :items="typeOptions"
          dense
          label="小世界类型"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-range-slider
          v-model="years"
          :max="2019"
          :min="1900"
          dense
          hide-details
          hint="年份范围"
          class="align-center"
          @change="getData"
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
      <v-col cols="10">
        <v-range-slider
          v-model="node"
          :max="100000"
          :min="1"
          dense
          hide-details
          hint="节点范围"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 100px">节点范围</p>
            <v-text-field
              :value="node[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(node, 0, $event)"
            />
          </template>
          <template v-slot:append>
            <v-text-field
              :value="node[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(node, 1, $event)"
            />
          </template>
        </v-range-slider>
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
import { getZipfAndInnerZipfTjData } from '@/api/index'
import { extendEchartsOpts, magCategory, extendLineSeries, defaultCategorySelect } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'MagInnerZipTj',
  extends: Base,
  data() {
    return {
      pageName: 'MAG v2幂律相关统计数据 ',
      typeValue: 'zipf',
      typeOptions: ['zipf', 'innerzipf'],
      subjectTarget: defaultCategorySelect,
      methodValue: 'linksin',
      years: [1900, 2018],
      node: [1, 10000],
      categorysOptions: magCategory,
      ctypeValue: 0,
      ctypeOptions: [{
        text: '文章数',
        value: 0
      }, {
        text: '引用数',
        value: 1
      }, {
        text: '平均引用数',
        value: 2
      }, {
        text: '当年的单篇最高引用数',
        value: 3
      }],
      loading: false,
      myChartIds: ['masChart1', 'masChart2', 'masChart3', 'masChart4']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {

    async getData() {
      this.loading = true
      for (const i in this.ctypeOptions) {
        const opt = {
          str: this.subjectTarget.join(','),
          type: this.typeValue,
          ctype: this.ctypeOptions[i].value,
          from: this.years[0],
          to: this.years[1],
          node_from: this.node[0],
          node_to: this.node[1]
        }

        getZipfAndInnerZipfTjData(opt)
          .then(res => {
            if (res.data) {
              console.log(res.data)
              const options = this.setOptions(res.data)
              this.myChartObjs[i].setOption(options, true)
              this.loading = false
            } else {
              this.loading = false
              this.$emit('emitMesage', '请求失败')
              return false
            }
          })
          .catch(rej => {
            this.loading = false
            this.$emit('emitMesage', `请求失败:${rej}`)
          })
      }
    },
    drawChart(data) {

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
          name: 'Count',
          type: 'value'
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
