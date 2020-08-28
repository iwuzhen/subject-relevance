<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-08-28 15:35:52
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
          disabled
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
        <v-card
          hover
          flat
        >
          <!-- <v-card-title>left</v-card-title> -->
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
                <span>{{ item.name }}</span>
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
import { getOriginCategories, getChildCategories } from "@/api/index";
import * as diff from "diff";
import { v4 as uuidv4 } from "uuid";
import Base from './Base'

export default {
  name: "MAG_Fos",
  extends: Base,
  data() {
    return {
      pageName: "MAG Fos 层次 Tree",
      selection1: [],
      treeItems1: [],
      overlay: false,
      isLoadingButton: false,
      searchItems: [],
      search: null,
      searchString: "",
      diffs: "",
    };
  },
  computed: {
  },
  mounted() {
    this.loadDefauleCategory();
  },
  watch: {
    searchString() {
      if (!this.searchString) {
        this.loadDefauleCategory();
      } else {
        this.treeItems1 = [
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

      let response = await getChildCategories({
        id: val
      });

      if (response.data.length == 0) {
        this.searchItems = [];
      } else {
        this.searchItems = [val];
      }
      this.isLoadingButton = false;
    }
  },
  methods: {
    async loadDefauleCategory() {
      let data = await getOriginCategories()
      this.treeItems1 = data.data.map(item => {
        return {
          id: item.id,
          name: item.name,
          cLength: item.size,
          children: []
        };
      });
    },
    checkNode() {
      let names1 = this.selection1.map(item => {
        return item.name;
      });
      names1 = names1.filter(item => {
        if (item.indexOf("子类") > -1) return false;
        return true;
      });
    },

    async getChildren(itemId) {
      //  本地缓存
      let categoryChildrens;
      console.log(`扩展 tree,${itemId}`);
      await getChildCategories({
        id: itemId
      })
        .then(res => {
          if (res.data) {
            categoryChildrens = res.data.map(item => {
              return {
                id: item.id,
                name: item.name,
                leaf: true,
                cLength: item.size,
                children: item.size > 0 ? [] : null
              };
            });
          } else {
            this.loading = false;
            this.$emit("emitMesage", "请求失败");
            return false;
          }
        })
        .catch(rej => {
          this.loading = false;
          this.$emit("emitMesage", `请求失败:${rej}`);
        });

      return categoryChildrens;
    },

    async fetchChildren(treeitem) {
      let categoryChildrens = await this.getChildren(
        treeitem.id
      );
      treeitem.children.push(...categoryChildrens);
    },
  }
};
</script>
