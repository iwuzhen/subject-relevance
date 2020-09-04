<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-09-04 12:33:09
 * @Description:
 -->
<template>
  <v-container fluid>
    <v-row>
      <!-- <v-col>
        <v-btn color="primary" @click="checkNode">对比选中的节点</v-btn>
      </v-col> -->
      <v-col>
        <v-autocomplete
          v-model="searchString"
          label="搜索 category"
          :loading="isLoadingButton"
          clearable
          cache-items
          no-data-text="没有匹配值"
          :search-input.sync="search"
          :items="searchItems"
        />
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col>
        <v-card
          hover
          flat
        >
          <!-- <v-card-title>left</v-card-title> -->
          <v-treeview
            v-model="selection1"
            :items="treeItems1"
            :load-children="fetchChildren1"
            selectable
            activatable
            dense
            color="warning"
            selection-type="leaf"
            open-on-click
            return-object
            open-all
            transition
          >
            <template v-slot:label="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ item.name }}</span>
                </template>
                <span>{{ en2zhdict[item.name]===undefined?'Loading...': en2zhdict[item.name] }}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-icon v-if="item.length">
                {{ item.length }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getBritannicaTree } from '@/api/index'
import { v4 as uuidv4 } from 'uuid'
import Base from '@/utils/base'

export default {
  name: 'BritannicaTree',
  extends: Base,
  data() {
    return {
      pageName: 'Britannica Tree 大英百科全书分类层次浏览',
      treeLength: {},
      selection1: [],
      treeItems1: [],
      overlay: false,
      isLoadingButton: false,
      searchItems: [],
      search: null,
      searchString: '',
      diffs: '',
      basiccategorys: ['Britannica']
    }
  },
  computed: {
  },
  watch: {
    searchString() {
      if (!this.searchString) {
        this.loadDefauleCategory()
        // this.categorys = this.basiccategorys;
      } else {
        this.treeItems1 = [
          {
            id: uuidv4(),
            name: this.searchString,
            children: []
          }
        ]
      }
    },
    async search(val) {
      if (!val) return
      this.isLoadingButton = true

      const response = await getBritannicaTree({
        categoryTitle: Buffer.from(val).toString('base64')
      })

      if (response.data.childList.length === 0) {
        this.searchItems = []
      } else {
        this.searchItems = [val]
      }
      this.isLoadingButton = false
    }
  },
  mounted() {
    this.loadDefauleCategory()
  },
  methods: {
    loadDefauleCategory() {
      this.treeItems1 = this.basiccategorys.map(item => {
        this.addTranslateChan(item)
        return {
          id: uuidv4(),
          name: item,
          children: []
        }
      })
    },

    async getChildren(name) {
      //  本地缓存
      let categoryLength, categoryChildrens
      console.log(`扩展 tree,${name}`)
      await getBritannicaTree({
        categoryTitle: Buffer.from(name).toString('base64')
      })
        .then(res => {
          if (res.data) {
            categoryLength = res.data.childList.length
            categoryChildrens = res.data.childList.map(item => {
              this.addTranslateChan(item)
              return {
                id: uuidv4(),
                name: item,
                leaf: true,
                children: []
              }
            })
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

      return [categoryLength, categoryChildrens]
    },

    async _fetchChildren(treeitem) {
      const [categoryLength, categoryChildrens] = await this.getChildren(
        treeitem.name
      )
      this.treeLength[treeitem.name] = categoryLength
      const self = this
      for (const i in categoryChildrens) {
        const [cl] = await self.getChildren(categoryChildrens[i].name)
        categoryChildrens[i]['length'] = cl
        if (cl === 0) {
          delete categoryChildrens[i].children
        }
      }
      treeitem.children.push(...categoryChildrens)
    },
    async fetchChildren1(treeitem) {
      return await this._fetchChildren(treeitem)
    }
  }
}
</script>
