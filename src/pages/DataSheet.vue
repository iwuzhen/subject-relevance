<template>
  <v-container fluid>
    <v-row>
      <v-spacer />
      <v-col>
        <Sheet v-if="gflag1" title="学科亲密度" desc="通过 Google 距离得出的相关度关系" :storagekey="gridkey1" :data="gridData1" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>

    <v-row>
      <v-spacer />
      <v-col>
        <Sheet v-if="gflag2" title="2000年贸易度依赖" desc="通过 贸易度 距离得出的相关度关系" :storagekey="gridkey2" :data="gridData2" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>

    <v-row>
      <v-spacer />
      <v-col>
        <Sheet v-if="gflag3" title="2020年贸易度依赖" desc="通过 贸易度 距离得出的相关度关系" :storagekey="gridkey3" :data="gridData3" @sheetSave="sheetSave" /></v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
import { getStorage, createStorage } from '@/api/index'
import Base from '@/utils/base'

import Sheet from '@/components/Sheet'

export default {
  name: 'DataSheel',
  components: {
    Sheet
  },
  extends: Base,
  data() {
    return {
      pageName: '学科层次归纳',
      gridData1: [['']],
      gflag1: false,
      gridkey1: 'subjectLevel',
      gridData2: [['']],
      gflag2: false,
      gridkey2: 'subjectdep2000',
      gridData3: [['']],
      gflag3: false,
      gridkey3: 'subjectdep2020'

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

      retData = await this.getStorageData(this.gridkey2)
      this.gridData2 = retData !== null ? retData : [['']]
      this.gflag2 = true

      retData = await this.getStorageData(this.gridkey3)
      this.gridData3 = retData !== null ? retData : [['']]
      this.gflag3 = true
    },
    async getStorageData(key) {
      const opt = {
        path: key
      }
      const data = await getStorage(opt)
      return data.data.Data
    },
    async sheetSave(arg) {
      console.log(arg)
      const opt = {
        path: arg[0],
        data: arg[1]
      }
      await createStorage(opt)
    }
  }
}
</script>

