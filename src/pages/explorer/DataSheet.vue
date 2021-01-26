<template>
  <v-container fluid>
    <!-- <v-row>
      <v-spacer />
      <v-col>
        <Sheet v-if="gflag1" title="学科亲密度" desc="通过 Google 距离得出的相关度关系" :storagekey="gridkey1" :data="gridData1" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row> -->

    <v-row>
      <v-spacer />
      <v-col>
        <v-card :loading="NeLoading">
          <v-card-title>
            <v-select
              v-model="NeYearSelect"
              :items="NeYearOpt"
              deletable-chips
              clearable
              label="学科亲密度年份选择"
              @change="donamicNeData"
            />
          </v-card-title>

          <v-card-text>
            <Sheet v-if="NeStatus" title="学科亲密度" desc="通过 Google 距离得出的相关度关系" :storagekey="gridkey1" :data="NeData" @sheetSave="sheetSave" />
          </v-card-text>
        </v-card>

      </v-col>
      <v-spacer />
    </v-row>

    <v-row>
      <v-spacer />
      <v-col>
        <v-card :loading="DepDataDynamicLoading">
          <v-card-title>
            <v-select
              v-model="yearSelect"
              :items="yearsOpt"
              deletable-chips
              clearable
              label="贸易度依赖年份选择"
              @change="donamicData"
            />
          </v-card-title>

          <v-card-text>
            <SheetX v-if="DepDataDynamicStatus" :title="''+ yearSelect + '年贸易度依赖'" desc="通过 贸易度 距离得出的相关度关系。" :storagekey="'subjectDep_'+yearSelect" :data="DepDataDynamic" @sheetSave="sheetSave" />
          </v-card-text>
        </v-card>

      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-col />
      <v-spacer />
    </v-row>

    <v-row v-for="year in graphDepYears" :key="year">
      <v-spacer />
      <v-col>
        <SheetX v-if="graphDepSetting['flag_'+year]" :title="''+ year + '年贸易度依赖'" desc="通过 贸易度 距离得出的相关度关系。" :storagekey="'subjectDep_'+year" :data="graphDepSetting['gridData_'+year]" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="DataSheet_graph_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getStorage, createStorage, getYinguoData, getMasDatav2 } from '@/api/index'
import Base from '@/utils/base'

import Sheet from '@/components/Sheet'
import SheetX from '@/components/SheetX'
import comment from '@/components/comment'
import _ from 'lodash'

async function calYearDepData(year) {
  const SubjectsB = ['Biology', 'Chemistry', 'Physics', 'Engineering disciplines', 'Mathematics', 'Psychology', 'Computer science', 'Economics', 'Sociology', 'Political science', 'Philosophy']
  const Subjects = ['Biology', 'Chemistry', 'Physics', 'Engineering', 'Mathematics', 'Psychology', 'Computer science', 'Economics', 'Sociology', 'Political science', 'Philosophy']
  const opt = {
    'db': 'mag',
    'from': year,
    'method': 'linksout',
    'strA': 'Physics',
    'strB': SubjectsB.join(','),
    'to': year,
    'type': 1
  }
  const retList = []
  for (const subject of Subjects) {
    if (subject === 'Engineering') {
      opt.strA = 'Engineering disciplines'
    } else {
      opt.strA = subject
    }
    const ret = await getYinguoData(opt)
    const retDict = { subject: subject }

    // eslint-disable-next-line prefer-const
    for (let [val, key] of _.zip(ret.data.y, ret.data.legend)) {
      key = key.replace(`${subject}-`, '')
      if (val[0] > 0) { retDict[key] = val[0] }
    }
    retList.push(retDict)
  }
  retList.sort((a, b) => { return Object.keys(b).length - Object.keys(a).length })
  // 标准输出
  const retData = []
  Subjects.unshift('subject')
  retData.push(Subjects)
  for (const datarow of retList) {
    const row = []
    for (const key of Subjects) {
      row.push(datarow[key])
    }
    retData.push(row)
  }
  return retData
}

async function calMagData(year) {
  const retArray = [['', 'Family (<0.5)', 'Neighbor (0.5~0.7)', 'Stranger (0.7~0.9)', 'Alien (>0.9)']]
  const Subjects = [
    'Philosophy', 'Political science', 'Sociology', 'Economics', 'Biology', 'Psychology',
    'Engineering disciplines', 'Chemistry', 'Physics', 'Mathematics', 'Computer science'
  ]
  for (let subject of Subjects) {
    const opt = {
      strA: subject,
      strB: Subjects
        .filter(item => {
          if (item === subject) {
            return false
          }
          return true
        })
        .join(','),
      method: 'linksin',
      from: year,
      to: year,
      qs: -1,
      version: 'delete_noref_v3_node'
    }
    try {
      const ret = await getMasDatav2(opt)
      const aa = []; const ba = []; const ca = []; const da = []
      for (const i in ret.data.y) {
        if (ret.data.y[i][0] > 0.9) {
          aa.push(ret.data.legend[i])
        } else if (ret.data.y[i][0] >= 0.7) {
          ba.push(ret.data.legend[i])
        } else if (ret.data.y[i][0] >= 0.5) {
          ca.push(ret.data.legend[i])
        } else {
          da.push(ret.data.legend[i])
        }
      }
      if (subject === 'Engineering disciplines') {
        subject = 'Engineering'
      }
      retArray.push([subject, da.join('\n'), ca.join('\n'), ba.join('\n'), aa.join('\n')])
    } catch (error) {
      console.log(error)
    }
  }
  console.log(retArray)
  return retArray
}

export default {
  name: 'DataSheel',
  components: {
    Sheet,
    SheetX,
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '学科层次归纳',
      gridData1: [['']],
      gflag1: false,
      gridkey1: 'subjectLevel',
      graphDepYears: [1986, 1996, 2006, 2016],
      graphDepSetting: {},
      yearSelect: [],
      DepDataDynamic: [['']],
      DepDataDynamicStatus: false,
      DepDataDynamicLoading: false,
      NeStatus: false,
      NeLoading: false,
      NeData: [['']],
      NeYearSelect: 2020,
      NeYearOpt: _.range(2020, 1950, -1)
    }
  },
  computed: {
    yearsOpt: function() {
      const ret = []
      for (let i = 1945; i <= 2020; i++) {
        ret.push(i)
      }
      return ret
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(callback) {
      // 学科亲密图
      this.donamicNeData()
      // 学科关系图
      let retData = await this.getStorageData(this.gridkey1)
      this.gridData1 = retData !== null ? retData : [['']]
      console.log(this.gridData1)
      this.gflag1 = true
      for (const year of this.graphDepYears) {
        retData = await this.getStorageData('subjectDep_' + year)
        this.$set(this.graphDepSetting, 'gridData_' + year, retData !== null ? retData : [['']])
        this.$set(this.graphDepSetting, 'flag_' + year, true)
      }
    },
    async getStorageData(key) {
      const opt = {
        path: key
      }
      const data = await getStorage(opt)
      return data.data.Data
    },
    async sheetSave(arg) {
      const opt = {
        path: arg[0],
        data: arg[1]
      }
      await createStorage(opt)
    },
    async donamicData() {
      this.DepDataDynamicLoading = true
      this.DepDataDynamicStatus = false
      this.DepDataDynamic = await calYearDepData(this.yearSelect)
      this.DepDataDynamicStatus = true
      this.DepDataDynamicLoading = false
    },

    async donamicNeData() {
      this.NeLoading = true
      this.NeStatus = false
      this.NeData = await calMagData(this.NeYearSelect)
      this.NeStatus = true
      this.NeLoading = false
    }
  }
}
</script>

