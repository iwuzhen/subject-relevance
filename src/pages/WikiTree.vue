<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-08-31 23:19:26
 * @Description: 
 -->
<template>
  <v-container fluid>
    <v-dialog
      v-model="overlay"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="overlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>关闭对比面板</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="overlay = false"
            >Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-col class="diffbox">
          <div v-html="prettyHtml" />
        </v-col>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          @click="checkNode"
        >对比选中的节点</v-btn>
      </v-col>
      <v-col>
        <v-btn
          :color="showDouble ? 'light-green' : 'lime'"
          @click="showDouble = !showDouble"
        >{{ showDouble ? "单排展示" : "双排对比" }}</v-btn>
      </v-col>
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
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col :cols="showDouble ? 6 : 12">
        <v-card
          hover
          flat
        >
          <v-select
            v-model="yearSelect1"
            :items="yearOptions"
            @change="yearChange1"
            chips
            label="年份"
          ></v-select>
          <v-treeview
            v-model="selection1"
            :items="treeItems1"
            :load-children="fetchChildren1"
            :open.sync="openTree1"
            selectable
            activatable
            dense
            color="warning"
            selection-type="leaf"
            open-on-click
            return-object
            transition
          >
            <template v-slot:label="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">     
              <a  v-on="on"
                v-if="item.father"
                :href="'https://en.wikipedia.org/wiki/' + item.name"
                target="blank"
              ><strong  
                  style="color:orange"
                  v-if="isCoreSunject(item.name)"
                >{{
                  item.name
                }}</strong><span v-else>{{ item.name }}</span></a>
              <span  v-on="on" v-else>{{ item.name }}</span>
                </template>
                <span>{{ en2zhdict[item.name]===undefined?'Loading...': en2zhdict[item.name]}}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-chip
                v-if="item.nodetype == 'article'"
                color="success"
                outlined
              >{{ arithclBirth[item.name] }}</v-chip>
              <v-tooltip
                top
                v-if="item.father"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    small
                    v-on="on"
                    color="primary"
                  >
                    <v-icon>mdi-wikipedia</v-icon>
                    摘要
                  </v-btn>
                </template>

                <span> {{ paragraph[item.name] }}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
      <v-col
        cols="6"
        v-if="showDouble"
      >
        <v-card
          hover
          flat
        >
          <v-select
            v-model="yearSelect2"
            :items="yearOptions"
            chips
            label="年份"
            @change="yearChange2"
          ></v-select>
          <v-treeview
            v-model="selection2"
            :items="treeItems2"
            :load-children="fetchChildren2"
            selectable
            activatable
            :open.sync="openTree2"
            dense
            color="warning"
            selection-type="leaf"
            open-on-click
            return-object
            transition
          >
            <template v-slot:label="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">     
              <a  v-on="on"
                v-if="item.father"
                :href="'https://en.wikipedia.org/wiki/' + item.name"
                target="blank"
              ><strong  
                  style="color:orange"
                  v-if="isCoreSunject(item.name)"
                >{{
                  item.name
                }}</strong><span v-else>{{ item.name }}</span></a>
              <span  v-on="on" v-else>{{ item.name }}</span>
                </template>
                <span>{{ en2zhdict[item.name]===undefined?'Loading...': en2zhdict[item.name]}}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-chip
                v-if="item.nodetype == 'article'"
                color="success"
                outlined
              >{{ arithclBirth[item.name] }}</v-chip>
              <v-tooltip
                top
                v-if="item.father"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    small
                    v-on="on"
                    color="primary"
                  >
                    <v-icon>mdi-wikipedia</v-icon>
                    摘要
                  </v-btn>
                </template>
                <span> {{ paragraph[item.name] }}</span>
              </v-tooltip>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getWikiPageTree,
  getWikiCategoryTree,
  getCacheSummary,
  getWikiBirthday
} from "@/api/index";
import * as Diff2Html from "diff2html";
import * as diff from "diff";
import { basiCategorys } from "@/api/data";
import { v4 as uuidv4 } from "uuid";
import Base from '@/utils/base'

export default {
  name: "Tree_Viewer",
  extends: Base,
  data() {
    return {
      pageName:"wikipedia 分类树",
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
      searchString: "",
      diffs: "",
      yearSelect1: 2019,
      yearSelect2: 2020,
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
        2020
      ],
      basiCategorys: basiCategorys,
      arithclBirth: {}
    };
  },
  computed: {
    basiccategorys() {
      let ba = ["Contents"];
      ba.push(...this.basiCategorys.map(each => each.value));
      ba.push(...["Geography", "Geology"])
      return ba;
    },
    prettyHtml() {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "side-by-side"
      });
    },
    yearOptions: function () {
      let _data = this.wikiYearOptions.map(item => {
        return {
          value: item,
          text: item
        };
      });
      return _data;
    },
    baseRegion: function () {
      let _data = this.categorys.map(item => {
        return {
          name: item
        };
      });
      return _data;
    }
  },
  mounted() {
    this.reset();
    this.loadDefauleCategory();
  },
  watch: {
    searchString() {
      if (!this.searchString) {
        this.loadDefauleCategory();
        // this.categorys = this.basiccategorys;
      } else {
        this.treeItems1 = [
          {
            id: uuidv4(),
            name: this.searchString,
            children: []
          }
        ];
        this.treeItems2 = [
          {
            id: uuidv4(),
            name: this.searchString,
            children: []
          }
        ];
      }
    },
    async search(val) {
      if (!val) return;
      this.isLoadingButton = true;
      let _wikiDB = String(this.yearSelect1).slice(2, 4);

      let response = await getWikiCategoryTree({
        categoryTitle: Buffer.from(val).toString("base64"),
        db: `WIKI${_wikiDB}`
      });

      if (response.childList.length == 0 && response.parentList.length == 0) {
        this.searchItems = [];
      } else {
        this.searchItems = [val];
      }
      this.isLoadingButton = false;
    }
  },
  methods: {
    isCoreSunject(name) {
      let keyMatch = [
        "Subfields of",
        "Areas of",
        "Fields of",
        "Branches of",
        "Subdivisions of",
        "by field",
        "by fields",
        "of field",
        "by specialty",
        "by topic"
      ];
      for (let key of keyMatch) {
        if (name.indexOf(key) > -1) {
          return true;
        }
      }
      return false;
    },
    loadDefauleCategory() {
      this.treeItems1 = this.basiccategorys.map(item => {
         this.addTranslateChan(item)
        return {
          id: uuidv4(),
          name: item,
          children: []
        };
      });
      this.treeItems2 = this.basiccategorys.map(item => {
        return {
          id: uuidv4(),
          name: item,
          children: []
        };
      });
    },
    yearChange1() {
      this.treeItems1 = this.basiccategorys.map(item => {
        return {
          id: uuidv4(),
          name: item,
          children: []
        };
      });
    },
    yearChange2() {
      this.treeItems2 = this.basiccategorys.map(item => {
        return {
          id: uuidv4(),
          name: item,
          children: []
        };
      });
    },
    reset() { },
    checkNode() {
      let names1 = this.selection1.map(item => {
        return item.name;
      });
      names1 = names1.filter(item => {
        if (
          item.indexOf("文章") > -1 ||
          item.indexOf("子类") > -1 ||
          item.indexOf("父类") > -1
        )
          return false;
        return true;
      });
      let names2 = this.selection2.map(item => {
        return item.name;
      });
      names2 = names2.filter(item => {
        if (
          item.indexOf("文章") > -1 ||
          item.indexOf("子类") > -1 ||
          item.indexOf("父类") > -1
        )
          return false;
        return true;
      });
      var DiffString = diff.createTwoFilesPatch(
        this.yearSelect1,
        this.yearSelect2,
        names1.join("\n"),
        names2.join("\n")
      );
      this.diffs = DiffString;
      this.overlay = !this.overlay;
    },

    async getParagraph(name) {
      let opt = { title: name };
      let ret = await getCacheSummary(opt);
      this.$set(this.paragraph,name,ret == null?"failed!!!":ret.extract)
    },

    async _fectch_article_birth(articleArray) {
      let queryArray = [];
      for (let title of articleArray) {
        if (!this.arithclBirth[title]) {
          queryArray.push(title);
        }
      }
      let ret = await getWikiBirthday(queryArray);
      for (let key in ret) {
        this.arithclBirth[key] = ret[key];
      }
      console.log(ret);
    },

    async _fetchChildren(treeitem, _wikiDB) {
      if (
        treeitem.name.indexOf("文章") > -1 ||
        treeitem.name.indexOf("子类") > -1 ||
        treeitem.name.indexOf("父类") > -1
      ) {
        console.log("cat");
      } else {
        let articleLength, articleChildrens, categoryChildrens, categoryParents;
        console.log("扩展 tree");
        try {
          let data = await getWikiPageTree({
            categoryTitle: Buffer.from(treeitem.name).toString("base64"),
            db: `WIKI${_wikiDB}`
          });
          articleLength = data.childList.length;
          await this._fectch_article_birth(data.childList);
          articleChildrens = data.childList.map(item => {
            this.getParagraph(item);
            this.addTranslateChan(item)
            return {
              id: uuidv4(),
              father: "page",
              name: item,
              leaf: true,
              nodetype: "article"
            };
          });

          data = await getWikiCategoryTree({
            categoryTitle: Buffer.from(treeitem.name).toString("base64"),
            db: `WIKI${_wikiDB}`
          });
          categoryChildrens = data.childList.map(item => {
            this.addTranslateChan(item)
            return {
              id: uuidv4(),
              name: item,
              leaf: true,
              children: [],
              nodetype: "category"
            };
          });

          categoryParents = data.parentList.map(item => {
            return {
              id: uuidv4(),
              name: item,
              leaf: true,
              children: [],
              nodetype: "category"
            };
          });
        
          treeitem.children.push({
            id: uuidv4(),
            name: `文章 ${articleLength}`,
            children: articleChildrens,
            file: "article",
            nodetype: "type"
          });
          treeitem.children.push({
            id: uuidv4(),
            name: `子类 ${data.childList.length}`,
            children: categoryChildrens,
            file: "category",
            nodetype: "type"
          });
          treeitem.children.push({
            id: uuidv4(),
            name: `父类 ${data.parentList.length}`,
            children: categoryParents,
            file: "category",
            nodetype: "type"
          });
        } catch (error) {
          this.$emit("e ge", `请求失败,${error}`);

          throw error;
        }
      }
    },
    async fetchChildren1(treeitem) {
      let _wikiDB = String(this.yearSelect1).slice(2, 4);
      await this._fetchChildren(treeitem, _wikiDB);
      if (
        treeitem.children.length > 1 &&
        treeitem.children[1].name.indexOf("子类") > -1
      )
        this.openTree1.push(treeitem.children[1]);
    },
    async fetchChildren2(treeitem) {
      let _wikiDB = String(this.yearSelect2).slice(2, 4);
      await this._fetchChildren(treeitem, _wikiDB);
      if (
        treeitem.children.length > 1 &&
        treeitem.children[1].name.indexOf("子类") > -1
      )
        this.openTree2.push(treeitem.children[1]);
    }
  }
};
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
</style>
