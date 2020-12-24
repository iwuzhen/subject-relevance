<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="(item,index) in ChartObj.Select" :key="index" :cols="item.cols">
        <v-select
          v-if="item.show!==false"
          v-model="options[item.name]"
          :items="item.items"
          :multiple="item.multiple"
          :deletable-chips="item.multiple"
          :clearable="item.multiple"
          :dense="item.multiple"
          :chips="item.multiple"
          :label="item.label"

          @change="getData"
        />
      </v-col>
      <v-col v-for="(item,index) in ChartObj.Slider" :key="index+'slide'" :cols="item.cols">
        <v-slider
          v-model="options[item.name]"
          :max="item.max"
          :min="item.min"
          dense
          hide-details
          :step="item.step"
          :hint="item.label"
          thumb-label="always"
          thumb-size="32"
          :label="item.label"
          ticks
          class="align-center"
          @change="getData"
        />
      </v-col>
      <v-col v-for="(item,index) in ChartObj.RangeSlider" :key="index+'rangeslide'" :cols="item.cols">
        <v-range-slider
          v-model="options[item.name]"
          :max="item.max"
          :min="item.min"
          dense
          hide-details
          :hint="item.label"
          class="align-center"
          @change="getData"
        >
          <template v-slot:prepend>
            <p style="width: 100px">{{ item.label }}</p>
            <v-text-field
              :value="options[item.name][0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(options[item.name], 0, $event)"
            />
          </template>
          <template v-slot:append>
            <v-text-field
              :value="options[item.name][1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(options[item.name], 1, $event)"
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
          :height="chartHeight"
        >
          <v-container
            id="subjectChart"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <comment v-if="ChartObj.ChName" :storagekey="ChartObj.ChName + '_chart_1'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ChartMap } from '@/api/chartData'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

export default {
  name: 'Template',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'template',
      options: {},
      ChartObj: {},
      myChartIds: ['subjectChart'],
      loading: false,
      chartHeight: '70vh'
    }
  },
  mounted() {
    // 图表对象
    this.ChartObj = ChartMap[this.$route.path.replace('/', '')]
    this.pageName = this.ChartObj.ChName
    this.$store.set('pages/page_name', this.pageName)
    this.chartHeight = this.ChartObj.chartHeight ? this.ChartObj.chartHeight : '70vh'
    // 配置默认值
    for (const row of this.ChartObj.Select) {
      this.options[row.name] = row.default
    }
    for (const row of this.ChartObj.RangeSlider) {
      this.options[row.name] = row.rangeDefault
    }
    if (this.ChartObj.Slider !== undefined) {
      for (const row of this.ChartObj.Slider) {
        this.options[row.name] = row.Default
      }
    }
    this.getData()
  },
  methods: {
    getData: _.debounce(async function() {
      this.loading = true
      // 参数处理
      const opt = {}
      for (const row of this.ChartObj.Select) {
        if (!row.multiple) {
          opt[row.name] = this.options[row.name]
        } else {
          opt[row.name] = this.options[row.name].join(',')
        }
      }
      for (const row of this.ChartObj.RangeSlider) {
        opt[row.startName] = this.options[row.name][0]
        opt[row.endName] = this.options[row.name][1]
      }
      if (this.ChartObj.Slider !== undefined) {
        for (const row of this.ChartObj.Slider) {
          opt[row.name] = this.options[row.name]
        }
      }

      const data = await this.ChartObj.RequestFunc(opt)
      if (data !== undefined) {
        const options = this.ChartObj.HandleResponseFunc(data, this.ChartObj)
        this.myChartObjs[0].setOption(options, true)
      } else {
        this.$emit('emitMesage', '请求失败')
      }

      this.loading = false
    }, 500)
  }
}
</script>
