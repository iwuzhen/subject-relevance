<template lang="pug">
v-container(fluid)
  v-row
    v-col(cols='6')
      v-select(@click="dialog.pid=0;dialog.stats=!dialog.stats" v-model='currentSubject.allSubject' :items='currentSubject.allSubject' dense multiple small-chips deletable-chips label='目标学科,最多5个')
    v-col(cols='6')
      v-select(@click="dialog.pid=1;dialog.stats=!dialog.stats"  v-model='targetSubject.allSubject' :items='targetSubject.allSubject' dense small-chips deletable-chips clearable multiple label='相关学科')

    v-col(cols='7')
      v-range-slider.align-center(v-model='years' :max='2020' :min='1955' dense hide-details hint='年份范围' @change='getData')
        template(v-slot:prepend)
          p(style='width: 100px') 年份范围
          v-text-field.mt-0.pt-0(:value='years[0]' hide-details single-line type='number' style='width: 60px' @change='$set(years, 0, $event)')
        template(v-slot:append)
          v-text-field.mt-0.pt-0(:value='years[1]' hide-details single-line type='number' style='width: 60px' @change='$set(years, 1, $event)')
    v-col(cols='2')
      v-select(v-model='methodValue' :items='methodOptions' dense label='条件' @change='getData' disabled)
  v-row(v-for="chartid of myChartIds" :key="chartid")
    v-col(col='12')
      v-card(outlined :loading='loading[chartid]' height='70vh')
        v-container(:id="chartid" fluid fill-height)
  v-row
    v-col
      comment(storagekey='GooglePlantDistance_graph_1')

  v-dialog(v-model="dialog.stats" )
    v-card
      v-card-title 学科以及二级学科选择器
        v-spacer
        v-btn(rounded color="primary" @click="cleanSelect") 清空
        v-btn(rounded color="primary" @click="changeSubject") 提交

      v-container(fluid)
        v-row
          v-col(cols='4')
            v-list(dense)
              v-subheader 一级学科
              v-list-item-group(v-model="topSelect" multiple)
                v-list-item(v-for="(item) in topSubject" @click="activeSubLevel(item.id,item.name)")
                  template( v-slot:default="{ active }")
                    v-list-item-action
                      v-checkbox(:input-value="active")
                    v-list-item-content
                      v-list-item-title {{item.name}}

          v-col(cols='4')
            v-list(dense)
              v-subheader 二级学科 {{subLevel.currentName}}

              v-list-item-group(v-if="subLevel.currentName != null" v-model="subLevel.selectAllStats[subLevel.currentName]")
                v-list-item(@click="selectAllChange")
                  template(v-slot:default="{ active }")
                    v-list-item-action
                      v-checkbox(:input-value="active")
                    v-list-item-content
                      v-list-item-title 全选

              v-list-item-group(v-model="subLevel.select[subLevel.currentName]" multiple)
                v-list-item(v-for="(item) in subLevel.subject[subLevel.currentName]")
                  template( v-slot:default="{ active }")
                    v-list-item-action
                      v-checkbox(:input-value="active")
                    v-list-item-content
                      v-list-item-title {{item.name}}

</template>

<script>
import { getOriginCategories, getChildCategories, getMasDatav2 } from '@/api/index'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'
import Base from '@/utils/base'
import comment from '@/components/comment'
import _ from 'lodash'

export default {
  name: 'GoogleDistance',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'MAG 二级学科距离',
      typeValue: 1,
      methodValue: 'linksin',
      years: [2007, 2020],
      methodOptions: ['linksin'],
      loading: {
        masChart0: false,
        masChart1: false,
        masChart2: false,
        masChart3: false,
        masChart4: false
      },
      myChartIds: ['masChart1'],
      count: 0,
      dialog: {
        stats: false,
        pid: 0
      },
      topSelect: [],
      topSubject: [],
      subLevel: {
        currentName: null,
        subject: {},
        select: {},
        selectAllStats: {}
      },
      currentSubject: {
        topSubject: [],
        allSubject: []
      },
      targetSubject: {
        topSubject: [],
        allSubject: []
      }
    }
  },
  computed: {
  },
  mounted() {
    // todo 异常未处理
    getOriginCategories().then(data => {
      this.topSubject = data.data.map(item => {
        // 首字母外小写
        item.name = item.name.charAt(0) + item.name.slice(1).toLowerCase()
        return item
      })
      this.activeSubLevel(142362112, 'Art')
    })
  },
  methods: {
    // 将学科更新到表格
    changeSubject() {
      this.dialog.stats = false
      const topSelect = []
      const allSelect = []
      // 遍历一级学科
      for (const id of this.topSelect) {
        topSelect.push(this.topSubject[id].name)
        allSelect.push(this.topSubject[id].name)
      }
      // 遍历 二级学科
      for (const key of Object.keys(this.subLevel.select)) {
        for (const id of this.subLevel.select[key]) {
          // 只选择的二级学科
          if (topSelect.indexOf(key) === -1) {
            topSelect.push(key)
          }
          allSelect.push(this.subLevel.subject[key][id].name)
        }
      }

      if (this.dialog.pid === 0) {
        // 当前学科
        this.currentSubject.topSubject = topSelect
        this.currentSubject.allSubject = allSelect.slice(0, 5)
      } else {
        // 目标学科
        this.targetSubject.topSubject = topSelect
        this.targetSubject.allSubject = allSelect
      }
      this.getData()
    },
    // 初始化原始值
    cleanSelect() {
      this.topSelect = []
      this.subLevel = {
        currentName: null,
        subject: {},
        select: {},
        selectAllStats: {}
      }
      this.activeSubLevel(142362112, 'Art')
    },
    // 全选控制器
    selectAllChange() {
      const currentName = this.subLevel.currentName
      if (this.subLevel.selectAllStats[currentName] === 0) {
        // 全不选
        this.subLevel.select[currentName] = []
      } else {
        // 全选
        this.subLevel.select[currentName] = _.range(0, this.subLevel.subject[currentName].length, 1)
      }
    },
    // 激活二级学科菜单
    activeSubLevel(subjectID, subjectName) {
      getChildCategories({
        id: subjectID
      }).then(data => {
        this.selectAllStats = 1
        this.subLevel.currentName = subjectName
        this.subLevel.subject[subjectName] = data.data.map(item => {
        // 首字母外小写
          item.name = item.name.charAt(0) + item.name.slice(1).toLowerCase()
          return item
        })
      })
    },

    async getData() {
      if (this.currentSubject.allSubject.length === 0 || this.targetSubject.allSubject.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }

      // 生成数量合适的图表
      const myChartIds = []
      for (let i = 0; i < this.currentSubject.allSubject.length; i++) {
        myChartIds.push(`masChart${i}`)
        this.loading[`masChart${i}`] = true
      }
      console.log(this.loading)
      this.myChartIds = myChartIds

      const opt = {
        version: 'delete_noref_v3_node',
        method: this.methodValue,
        dbtype: 'mag',
        from: this.years[0],
        to: this.years[1],
        // level: 1,
        qs: -1,
        bf: -1
      }

      let chartIndex = 0
      for (let currentTopSubject of this.currentSubject.allSubject) {
        if (currentTopSubject === 'Engineering') {
          currentTopSubject = 'Engineering disciplines'
        }
        opt.strA = currentTopSubject
        opt.strB = this.targetSubject.allSubject.map(item => {
          if (item === 'Engineering') {
            return 'Engineering disciplines'
          }
          return item
        }).filter(item => {
          if (item === currentTopSubject) {
            return false
          }
          return true
        }).join(',')
        const response = await getMasDatav2(opt)
        const options = this.setOptions(response.data)
        this.myChartObjs[chartIndex].setOption(options, true)
        this.loading[`masChart${chartIndex}`] = false
        chartIndex += 1
      }

      return
      // 更新数据
      // const allData = []
      // for (const currentTopSubject of this.currentSubject.topSubject) {
      //   for (const targetTopSubject of this.targetSubject.topSubject) {
      //     opt.strA = currentTopSubject
      //     opt.strB = targetTopSubject
      //     const response = await getMasDatav2(opt)
      //     allData.push(...response.data)
      //   }
      // }
      // // 整理数据,按年份排布
      // let chartIndex = 0
      // for (const currentSubject of this.currentSubject.allSubject) {
      //   const series = []
      //   const legend = []
      //   for (const targetSubject of this.targetSubject.allSubject) {
      //     const line = []
      //     const yearSet = new Set()
      //     for (const item of allData) {
      //       if (currentSubject === item.catA && targetSubject === item.catB) {
      //         if (!yearSet.has(item.year)) {
      //           line.push([Number(item.year), item.distance])
      //           yearSet.add(item.year)
      //         }
      //       }
      //     }
      //     legend.push(targetSubject)
      //     // todo line 未排序,依赖服务器返回数据的顺序
      //     series.push(line)
      //   }
      //   const options = this.setOptions(currentSubject, legend, series)
      //   console.log(options)
      //   this.myChartObjs[chartIndex].setOption(options, true)
      //   this.loading[`masChart${chartIndex}`] = false
      //   chartIndex += 1
      // }
      // console.log(allData)
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
          name: 'knowledge distance',
          type: 'value'
        },
        series: _.zip(data.legend, data.y).map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      return _opt
    }
  }
}
</script>
