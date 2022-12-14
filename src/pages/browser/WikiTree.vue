<template lang="pug">
v-container(fluid)
  v-dialog(v-model='overlay' fullscreen hide-overlay transition='dialog-bottom-transition')
    v-card
      v-toolbar(dark color='primary')
        v-btn(icon dark @click='overlay = false')
          v-icon mdi-close
        v-toolbar-title 关闭对比面板
        v-spacer
          v-toolbar-items
            v-btn(dark text @click='overlay = false') Close
      v-col.diffbox
        div(v-html='prettyHtml')
  v-row
    v-col
      v-btn(color='primary' @click='checkNode') 对比选中的节点
    v-col
      v-btn(:color="showDouble ? 'light-green' : 'lime'" @click='showDouble = !showDouble') {{ showDouble ? "单排展示" : "双排对比" }}
    v-col
      v-autocomplete(v-model='searchString' label='搜索 category' :loading='isLoadingButton' clearable cache-items no-data-text='没有匹配值' :search-input.sync='search' :items='searchItems')
  v-row(justify='space-between')
    v-col(:cols='showDouble ? 6 : 12')
      v-card(hover flat)
        v-select(v-model='yearSelect1' :items='yearOptions' chips label='年份' @change='yearChange1')
        v-treeview(v-model='selection1' :items='treeItems1' :load-children='fetchChildren1' :open.sync='openTree1' selectable activatable dense color='warning' selection-type='leaf' open-on-click return-object transition)
          template(v-slot:label='{ item }')
            v-tooltip(top)
              template(v-slot:activator='{ on }')
                a(v-if='item.father' :href="'https://wikimili.com/en/' + item.name.replace(/ /g,'_')" target='blank' v-on='on')
                  strong(v-if='isCoreSunject(item.name)' style='color:orange')
                    | {{
                    | item.name
                    | }}
                  span(v-else) {{ item.name }}
                span(v-else v-on='on') {{ item.name }}
              span {{ en2zhdict[item.name]===undefined?'Loading...': en2zhdict[item.name] }}
          template(v-slot:append='{ item }')
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-chip(v-if="item.nodetype === 'article' && arithclBirth[item.name]!== ''" small color='success' outlined  v-on='on') {{ arithclBirth[item.name] }}
              span birthday
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-chip(v-if="item.nodetype === 'article'" color='orange' small  v-on='on') {{ linksinCount.left[item.name]===undefined?'Loading...': linksinCount.left[item.name] }}
              span linksin count
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-btn(text small color='primary' v-on='on')
                  v-icon mdi-wikipedia
              span  {{ paragraph[item.name] }}
    v-col(v-if='showDouble' cols='6')
      v-card(hover flat)
        v-select(v-model='yearSelect2' :items='yearOptions' chips label='年份' @change='yearChange2')
        v-treeview(v-model='selection2' :items='treeItems2' :load-children='fetchChildren2' selectable activatable :open.sync='openTree2' dense color='warning' selection-type='leaf' open-on-click return-object transition)
          template(v-slot:label='{ item }')
            v-tooltip(top)
              template(v-slot:activator='{ on }')
                a(v-if='item.father' :href="'https://wikimili.com/en/' + item.name.replace(/ /g,'_')" target='blank' v-on='on')
                  strong(v-if='isCoreSunject(item.name)' style='color:orange')
                    | {{
                    | item.name
                    | }}
                  span(v-else) {{ item.name }}
                span(v-else v-on='on') {{ item.name }}
              span {{ en2zhdict[item.name]===undefined?'Loading...': en2zhdict[item.name] }}
          template(v-slot:append='{ item }')
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-chip(v-if="item.nodetype === 'article' && arithclBirth[item.name]!== ''" small color='success' outlined  v-on='on') {{ arithclBirth[item.name] }}
              span birthday
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-chip(v-if="item.nodetype === 'article'" color='orange' small  v-on='on') {{ linksinCount.right[item.name]===undefined?'Loading...': linksinCount.right[item.name] }}
              span linksin count
            v-tooltip(v-if='item.father' top)
              template(v-slot:activator='{ on }')
                v-btn(text small color='primary' v-on='on')
                  v-icon mdi-wikipedia
              span  {{ paragraph[item.name] }}
</template>

<script>
import {
  getWikiPageTree,
  getWikiCategoryTree,
  getWikiCategoryLinksinTree,
  getCacheSummary,
  getWikiBirthday
} from '@/api/index'
import * as Diff2Html from 'diff2html'
import * as diff from 'diff'
import { basiCategorys } from '@/api/data'
import { nanoid } from 'nanoid'
import Base from '@/utils/base'

export default {
  name: 'TreeViewer',
  extends: Base,
  data() {
    return {
      pageName: 'wikipedia 分类树',
      paragraph: {},
      showDouble: true,
      openTree2: [],
      openTree1: [],
      selection1: [],
      selection2: [],
      treeItems1: [],
      treeItems2: [],
      overlay: false,
      isLoadingButton: false,
      searchItems: [],
      search: null,
      searchString: '',
      diffs: '',
      yearSelect1: 2019,
      yearSelect2: 2021,
      wikiYearOptions: [
        2007,
        2008,
        2009,
        2011,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021
      ],
      basiCategorys: basiCategorys,
      arithclBirth: {},
      linksinCount: {
        left: {},
        right: {}
      }
    }
  },
  computed: {
    basiccategorys() {
      const ba = ['Contents']
      ba.push(...this.basiCategorys.map(each => each.value))
      ba.push(...['Geography', 'Geology'])
      return ba
    },
    prettyHtml() {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: 'lines',
        outputFormat: 'side-by-side'
      })
    },
    yearOptions: function() {
      const _data = this.wikiYearOptions.map(item => {
        return {
          value: item,
          text: item
        }
      })
      return _data
    },
    baseRegion: function() {
      const _data = this.categorys.map(item => {
        return {
          name: item
        }
      })
      return _data
    }
  },
  watch: {
    searchString() {
      if (!this.searchString) {
        this.loadDefauleCategory()
        // this.categorys = this.basiccategorys;
      } else {
        this.treeItems1 = [
          {
            id: nanoid(),
            name: this.searchString,
            children: []
          }
        ]
        this.treeItems2 = [
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
      const _wikiDB = String(this.yearSelect1).slice(2, 4)

      const response = await getWikiCategoryTree({
        categoryTitle: Buffer.from(val).toString('base64'),
        db: `WIKI${_wikiDB}`
      })

      if (response.childList.length === 0 && response.parentList.length === 0) {
        this.searchItems = []
      } else {
        this.searchItems = [val]
      }
      this.isLoadingButton = false
    }
  },
  mounted() {
    this.reset()
    this.loadDefauleCategory()
  },
  methods: {
    isCoreSunject(name) {
      const keyMatch = [
        'Subfields of',
        'Areas of',
        'Fields of',
        'Branches of',
        'Subdivisions of',
        'by field',
        'by fields',
        'of field',
        'by specialty',
        'by topic'
      ]
      for (const key of keyMatch) {
        if (name.indexOf(key) > -1) {
          return true
        }
      }
      return false
    },
    loadDefauleCategory() {
      this.treeItems1 = this.basiccategorys.map(item => {
        this.addTranslateChan(item)
        return {
          id: nanoid(),
          name: item,
          children: []
        }
      })
      this.treeItems2 = this.basiccategorys.map(item => {
        return {
          id: nanoid(),
          name: item,
          children: []
        }
      })
    },
    yearChange1() {
      this.linksinCount.left = {}
      this.treeItems1 = this.basiccategorys.map(item => {
        return {
          id: nanoid(),
          name: item,
          children: []
        }
      })
    },
    yearChange2() {
      this.linksinCount.right = {}
      this.treeItems2 = this.basiccategorys.map(item => {
        return {
          id: nanoid(),
          name: item,
          children: []
        }
      })
    },
    reset() { },
    checkNode() {
      let names1 = this.selection1.map(item => {
        return item.name
      })
      names1 = names1.filter(item => {
        if (
          item.indexOf('文章') > -1 ||
          item.indexOf('子类') > -1 ||
          item.indexOf('父类') > -1
        ) { return false }
        return true
      })
      let names2 = this.selection2.map(item => {
        return item.name
      })
      names2 = names2.filter(item => {
        if (
          item.indexOf('文章') > -1 ||
          item.indexOf('子类') > -1 ||
          item.indexOf('父类') > -1
        ) { return false }
        return true
      })
      var DiffString = diff.createTwoFilesPatch(
        this.yearSelect1,
        this.yearSelect2,
        names1.join('\n'),
        names2.join('\n')
      )
      this.diffs = DiffString
      this.overlay = !this.overlay
    },
    // 更新 links 数量信息
    async updateLinksin(name, db, position) {
      const ret = await getWikiCategoryLinksinTree({
        query: Buffer.from(name).toString('base64'),
        type: 'CATEGORY',
        db: `WIKI${db}`
      })
      this.$set(this.linksinCount, position, Object.assign(this.linksinCount[position], ret.data))
      console.log(this.linksinCount)
    },

    async getParagraph(name) {
      const opt = { title: name }
      const ret = await getCacheSummary(opt)
      this.$set(this.paragraph, name, ret == null ? 'failed!!!' : ret.extract)
    },

    async _fectch_article_birth(articleArray) {
      const queryArray = []
      for (const title of articleArray) {
        if (!this.arithclBirth[title]) {
          queryArray.push(title)
        }
      }
      const ret = await getWikiBirthday(queryArray)
      for (const key in ret) {
        // this.arithclBirth[key] = ret[key]
        this.$set(this.arithclBirth, key, ret[key])
      }
    },

    async _fetchChildren(treeitem, _wikiDB) {
      if (
        treeitem.name.indexOf('文章') > -1 ||
        treeitem.name.indexOf('子类') > -1 ||
        treeitem.name.indexOf('父类') > -1
      ) {
        console.log('cat')
      } else {
        let articleLength, articleChildrens, categoryChildrens, categoryParents
        console.log('扩展 tree')
        try {
          let data = await getWikiPageTree({
            categoryTitle: Buffer.from(treeitem.name).toString('base64'),
            db: `WIKI${_wikiDB}`
          })
          articleLength = data.childList.length
          this._fectch_article_birth(data.childList)
          articleChildrens = data.childList.map(item => {
            setTimeout(() => { this.getParagraph(item) }, 1000)
            this.addTranslateChan(item)
            return {
              id: nanoid(),
              father: 'page',
              name: item,
              leaf: true,
              nodetype: 'article'
            }
          })
          data = await getWikiCategoryTree({
            categoryTitle: Buffer.from(treeitem.name).toString('base64'),
            db: `WIKI${_wikiDB}`
          })
          categoryChildrens = data.childList.map(item => {
            this.addTranslateChan(item)
            return {
              id: nanoid(),
              name: item,
              leaf: true,
              children: [],
              nodetype: 'category'
            }
          })

          categoryParents = data.parentList.map(item => {
            return {
              id: nanoid(),
              name: item,
              leaf: true,
              children: [],
              nodetype: 'category'
            }
          })

          treeitem.children.push({
            id: nanoid(),
            name: `文章 ${articleLength}`,
            children: articleChildrens,
            file: 'article',
            nodetype: 'type'
          })
          treeitem.children.push({
            id: nanoid(),
            name: `子类 ${data.childList.length}`,
            children: categoryChildrens,
            file: 'category',
            nodetype: 'type'
          })
          treeitem.children.push({
            id: nanoid(),
            name: `父类 ${data.parentList.length}`,
            children: categoryParents,
            file: 'category',
            nodetype: 'type'
          })
        } catch (error) {
          this.$emit('emitMesage', `请求失败,${error}`)
          throw error
        }
      }
    },
    async fetchChildren1(treeitem) {
      const _wikiDB = String(this.yearSelect1).slice(2, 4)

      this.updateLinksin(treeitem.name, _wikiDB, 'left')
      await this._fetchChildren(treeitem, _wikiDB)
      if (
        treeitem.children.length > 1 &&
        treeitem.children[1].name.indexOf('子类') > -1
      ) { this.openTree1.push(treeitem.children[1]) }
    },
    async fetchChildren2(treeitem) {
      const _wikiDB = String(this.yearSelect2).slice(2, 4)

      this.updateLinksin(treeitem.name, _wikiDB, 'right')
      await this._fetchChildren(treeitem, _wikiDB)
      if (
        treeitem.children.length > 1 &&
        treeitem.children[1].name.indexOf('子类') > -1
      ) { this.openTree2.push(treeitem.children[1]) }
    }
  }
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
</style>
