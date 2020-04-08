<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-04-08 19:22:20
 * @Description: 
 -->
<template>
  <div>
    <div class="page-discipline">
      <div class="selectbox">
        <div class="selectitem">
          <span class="title">年份</span>
          <el-select
            v-model="yearSelect1"
            class="selectsubjectmiddle"
            placeholder="请选择"
            @change="changeYear"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="selectitem">
          <el-button type="primary" class="selectitem" @click="changeYear"
            >确定</el-button
          >
        </div>
      </div>
    </div>
    <el-tree
      v-if="openPanel"
      :props="props"
      :load="loadNode"
      accordion
      lazy
      node-key="id"
      ref="tree"
    >
    </el-tree>
  </div>
</template>

<script>
import { getWikiPageTree, getWikiCategoryTree } from "@/api/index";
export default {
  name: "WikiTree",
  data() {
    return {
      openPanel: true,
      treeData: [],
      yearSelect1: 2020,
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
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      categorys: [
        "Literature",
        "Psychology",
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Political science",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering disciplines",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering",
        "Cognitive science",
        "Machine learning",
        "Blockchains",
        "Deep learning",
        "Theoretical computer science",
        "Quantum computing",
        "Genetic engineering",
        "Genome editing",
        "Anthropology",
        "Neuroscience"
      ]
    };
  },
  computed: {
    yearOptions: function() {
      let _data = this.wikiYearOptions.map(item => {
        return {
          value: item,
          label: item
        };
      });
      return _data;
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
  methods: {
    changeYear() {
      // console.log(this.$refs.tree);
      // for (let item of this.$refs.tree.root.childNodes) {
      //   console.log(item.data);
      //   let node = this.$refs.tree.getNode(item.data);
      //   console.log(node);
      //   // node.loaded = false;
      //   // node.expand();
      // }
      this.openPanel = false;
      setTimeout(() => {
        this.openPanel = true;
      }, 10);
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.baseRegion);
      }

      let _wikiDB = String(this.yearSelect1).slice(2, 4);
      if (node.label.indexOf("文章") > -1) {
        let response = await getWikiPageTree({
          categoryTitle: Buffer.from(node.parent.label).toString("base64"),
          db: `WIKI${_wikiDB}`
        });
        if (response.data) {
          let _data = response.data.childList.map(item => {
            return {
              name: item,
              leaf: true
            };
          });
          return resolve(_data);
        } else {
          this.$message.error("请求失败");
        }
      } else if (node.label.indexOf("子类") > -1) {
        // TODO
        let response = await getWikiCategoryTree({
          categoryTitle: Buffer.from(node.parent.label).toString("base64"),
          db: `WIKI${_wikiDB}`
        });
        if (response.data) {
          let _data = response.data.childList.map(item => {
            return {
              name: item
            };
          });
          return resolve(_data);
        }
      } else {
        // carticle
        let articleLength, categoryLength;

        let response = await getWikiPageTree({
          categoryTitle: Buffer.from(node.label).toString("base64"),
          db: `WIKI${_wikiDB}`
        });
        if (response.data) {
          articleLength = response.data.childList.length;
        } else {
          this.$message.error("请求失败");
        }

        response = await getWikiCategoryTree({
          categoryTitle: Buffer.from(node.label).toString("base64"),
          db: `WIKI${_wikiDB}`
        });
        if (response.data) {
          categoryLength = response.data.childList.length;
        }

        resolve([
          {
            name: `文章 ${articleLength}`
          },
          {
            name: `子类 ${categoryLength}`
          }
        ]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
</style>
