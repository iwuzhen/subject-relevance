<template>
  <v-container fluid>
    <v-row>
      <v-spacer />
      <v-col>
        <v-card :loading="NeLoading">
          <v-card-title>
          </v-card-title>
          <v-card-text>
            <Sheet v-if="NeStatus" title="网络特性" desc="通过 贸易度 距离得出的相关度关系。" :storagekey="gridkey2" :data="NeData2" @sheetSave="sheetSave" />
            </v-card-text>
        </v-card>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col>
        <comment storagekey="NetworkFeture_graph_1" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getStorage, createStorage } from '@/api/index'
import Base from '@/utils/base'
import Sheet from '@/components/Sheet'
// import SheetX from '@/components/SheetX'
import comment from '@/components/comment'

export default {
  name: 'DataSheel',
  components: {
    Sheet,
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: '网络特性图',
      gridkey2: 'networkFeture',
      NeStatus: false,
      NeLoading: false,
      NeData2: [['']]
    }
  },
  computed: {

  },
  mounted() {
    this.init()
  },
  methods: {
    async init(callback) {
      // 学科关系图
      this.NeLoading = true
      const retData = await this.getStorageData(this.gridkey2)
      this.NeData2 = retData
      this.NeStatus = true
      this.NeLoading = false
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

