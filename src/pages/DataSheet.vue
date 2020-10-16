<template>
  <v-container fluid>
    <v-row>
      <v-spacer />
      <v-col>
        <Sheet v-if="gflag1" title="学科亲密度" desc="通过 Google 距离得出的相关度关系" :storagekey="gridkey1" :data="gridData1" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>

    <v-row v-for="year in graphDepYears" :key="year">
      <v-spacer />
      <v-col>
        <SheetX v-if="graphDepSetting['flag_'+year]" :title="''+ year + '年贸易度依赖'" desc="通过 贸易度 距离得出的相关度关系。" :storagekey="'subjectDep_'+year" :data="graphDepSetting['gridData_'+year]" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>

  </v-container>
</template>

<script>
import { getStorage, createStorage } from '@/api/index'
import Base from '@/utils/base'

import Sheet from '@/components/Sheet'
import SheetX from '@/components/SheetX'

export default {
  name: 'DataSheel',
  components: {
    Sheet,
    SheetX
  },
  extends: Base,
  data() {
    return {
      pageName: '学科层次归纳',
      gridData1: [['']],
      gflag1: false,
      gridkey1: 'subjectLevel',
      graphDepYears: [1986, 1996, 2006, 2016],
      graphDepSetting: {}
      // gridData2: [['']],
      // gflag2: false,
      // gridkey2: 'subjectdepX2000',
      // gridData3: [['']],
      // gflag3: false,
      // gridkey3: 'subjectdepX2020'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(callback) {
      // 学科关系图
      let retData = await this.getStorageData(this.gridkey1)
      this.gridData1 = retData !== null ? retData : [['']]
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
    }
  }
}
</script>

