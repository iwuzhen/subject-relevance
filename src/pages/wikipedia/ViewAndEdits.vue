<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-select
          v-model="subjectTarget"
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
      <v-col cols="2">
        <v-select
          v-model="dataType"
          :items="dataTypeOptions"
          label="数据类型"
          @change="getData"
        />
      </v-col>

      <v-col cols="2">
        <v-select
          v-model="subjectLevel"
          :items="levelOptions"
          label="level"
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
import { getViewAndEdits } from '@/api/index'
import { basiCategorys, extendEchartsOpts, defaultCategorySelect, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'

export default {
  name: 'Ve',
  extends: Base,
  data() {
    return {
      pageName: '访问量和编辑量',
      subjectTarget: defaultCategorySelect,
      subjectLevel: 0,
      categorys: basiCategorys,
      levelOptions: [
        {
          value: 0,
          text: '0'
        },
        {
          value: 1,
          text: '1'
        },
        {
          value: 2,
          text: '2'
        },
        {
          value: '1000',
          text: 'top 1000'
        }
      ],
      dataType: 0,
      dataTypeOptions: [
        {
          value: 0,
          text: '访问量'
        },
        {
          value: 1,
          text: '编辑量'
        }
      ],
      loading: false,
      myChartIds: ['subjectChart']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      if (
        this.subjectTarget.length < 1 ||
        this.dataType.length < 1 ||
        this.subjectLevel.length < 1
      ) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true
      const opt = {
        str: this.subjectTarget.join(','),
        type: this.dataType,
        level: this.subjectLevel
      }
      getViewAndEdits(opt)
        .then(res => {
          if (res.data.data) {
            this.drawChart(res.data.data)
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
    },
    drawChart(data) {
      const options = this.setOptions(data)
      this.myChartObjs[0].setOption(options, true)
      this.loading = false
    },
    setOptions(data) {
      let ymax = Math.max(...[].concat(...data.y))
      const digit = Math.floor(ymax).toString().length
      ymax = Math.ceil(ymax / 10 ** (digit - 2)) * 10 ** (digit - 2)
      const _opt = extendEchartsOpts({
        title: {
          text: data.title
        },
        legend: {
          data: data.legend
        },
        xAxis: {
          name: 'Date',
          type: 'category',
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          name: 'Count',
          type: 'value',
          max: ymax
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

<style lang="less" scoped></style>
