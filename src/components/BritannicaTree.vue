<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-04-22 16:27:43
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
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="overlay = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>关闭对比面板</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="overlay = false">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-col class="diffbox"><div v-html="prettyHtml"/></v-col>
      </v-card>
    </v-dialog>
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
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col>
        <v-card hover flat>
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
            transition
          >
            <template v-slot:label="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ item.name }}</span>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-icon v-if="item.length">
                {{ item.length }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card></v-col
      >
      <!-- <v-col cols="6">
        <v-card hover flat>
          <v-card-title>right</v-card-title
          ><v-treeview
            v-model="selection2"
            :items="treeItems2"
            :load-children="fetchChildren2"
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
                  <span v-on="on">{{ item.name }}</span>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>
            <template v-slot:append="{ item }">
              <v-icon v-if="item.length">
                {{ item.length }}
              </v-icon>
            </template>
          </v-treeview></v-card
        ></v-col
      > -->
    </v-row>
  </v-container>
</template>

<script>
import { getBritannicaTree } from "@/api/index";
import * as Diff2Html from "diff2html";
import * as diff from "diff";
import * as localforage from "localforage";

import { v4 as uuidv4 } from "uuid";

export default {
  name: "Britannica_Tree_大英百科全书",
  data() {
    return {
      store: localforage.createInstance({
        name: "BritanTree",
        version: 1,
        storeName: "BritanTree", // Should be alphanumeric, with underscores.
        description: "store tree"
      }),
      treeLength: {},
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
      basiccategorys: ["Britannica"]
    };
  },
  computed: {
    prettyHtml() {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "side-by-side"
      });
    },
    baseRegion: function() {
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
    this.$store.commit("changeCurentPath", this.$options.name);
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

      let response = await getBritannicaTree({
        categoryTitle: Buffer.from(val).toString("base64")
      });

      if (response.data.childList.length == 0) {
        this.searchItems = [];
      } else {
        this.searchItems = [val];
      }
      this.isLoadingButton = false;
    }
  },
  methods: {
    loadDefauleCategory() {
      this.treeItems1 = this.basiccategorys.map(item => {
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
    reset() {},
    checkNode() {
      let names1 = this.selection1.map(item => {
        return item.name;
      });
      names1 = names1.filter(item => {
        if (item.indexOf("子类") > -1) return false;
        return true;
      });
      let names2 = this.selection2.map(item => {
        return item.name;
      });
      names2 = names2.filter(item => {
        if (item.indexOf("子类") > -1) return false;
        return true;
      });
      var DiffString = diff.createTwoFilesPatch(
        "left",
        "right",
        names1.join("\n"),
        names2.join("\n")
      );
      this.diffs = DiffString;
      this.overlay = !this.overlay;
    },

    async getChildren(name) {
      //  本地缓存
      let categoryLength, categoryChildrens;
      let categoryKey = `Cat${name}`;
      console.log(`扩展 tree,${name}`);
      let store = this.store;
      await store
        .getItem(categoryKey)
        .then(async function(value) {
          // 当离线仓库中的值被载入时，此处代码运行
          let data;
          if (!value) {
            let response = await getBritannicaTree({
              categoryTitle: Buffer.from(name).toString("base64")
            });
            data = response.data;
            if (!data) {
              this.$emit("emitMesage", `请求失败`);
            }
            await store.setItem(categoryKey, data);
          } else {
            data = value;
          }
          categoryLength = data.childList.length;
          categoryChildrens = data.childList.map(item => {
            return {
              id: uuidv4(),
              name: item,
              leaf: true,
              children: []
            };
          });
        })
        .catch(function(err) {
          console.log(err);
        });
      return [categoryLength, categoryChildrens];
    },

    async _fetchChildren(treeitem) {
      let [categoryLength, categoryChildrens] = await this.getChildren(
        treeitem.name
      );
      this.treeLength[treeitem.name] = categoryLength;
      let self = this;
      for (let i in categoryChildrens) {
        let [cl] = await self.getChildren(categoryChildrens[i].name);
        categoryChildrens[i]["length"] = cl;
        if (cl == 0) {
          delete categoryChildrens[i].children;
        }
      }
      treeitem.children.push(...categoryChildrens);
    },
    async fetchChildren1(treeitem) {
      return await this._fetchChildren(treeitem);
    },
    async fetchChildren2(treeitem) {
      return await this._fetchChildren(treeitem);
    }
  }
};
</script>
