<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2021-07-21 17:51:59
 * @Description:
 -->
<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="searchString"
          label="搜索 category"
          disabled
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
          <v-treeview
            v-model="selection1"
            :items="treeItems1"
            :load-children="fetchChildren"
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
              <v-icon>
                {{ item.cLength }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getOriginCategories, getChildCategories } from '@/api/index'
import { nanoid } from 'nanoid'
import Base from '@/utils/base'

export default {
  name: 'MAGFos',
  extends: Base,
  data() {
    return {
      pageName: 'MAG Fos 层次浏览',
      selection1: [],
      treeItems1: [],
      overlay: false,
      isLoadingButton: false,
      searchItems: [],
      search: null,
      searchString: ''
    }
  },
  computed: {
  },
  watch: {
    searchString() {
      if (!this.searchString) {
        this.loadDefauleCategory()
      } else {
        this.treeItems1 = [
          {
            id: nanoid(),
            name: this.searchString,
            children: []
          }
        ]
      }
    },
    async search(val) {
      if (!val) return
      this.isLoadingButton = true

      const response = await getChildCategories({
        id: val
      })

      if (response.data.length === 0) {
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
    async loadDefauleCategory() {
      const data = await getOriginCategories()
      this.treeItems1 = data.data.map(item => {
        this.addTranslateChan(item.name)
        return {
          id: item.id,
          name: item.name,
          cLength: item.size,
          children: []
        }
      })
    },

    async getChildren(itemId) {
      //  本地缓存
      let categoryChildrens
      console.log(`扩展 tree,${itemId}`)
      await getChildCategories({
        id: itemId
      })
        .then(res => {
          if (res.data) {
            categoryChildrens = res.data.map(item => {
              this.addTranslateChan(item.name)
              return {
                id: item.id,
                name: item.name,
                leaf: true,
                cLength: item.size,
                children: item.size > 0 ? [] : null
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

      return categoryChildrens
    },

    async fetchChildren(treeitem) {
      const categoryChildrens = await this.getChildren(
        treeitem.id
      )
      treeitem.children.push(...categoryChildrens)
    }
  }
}
</script>
