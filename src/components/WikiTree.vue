<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 11:55:19
 * @LastEditors: ider
 * @LastEditTime: 2020-04-09 14:34:19
 * @Description: 
 -->
<template>
  <div>
    <div v-html="prettyHtml" />
    <div class="page-discipline">
      <div class="selectbox">
        <div class="selectitem">
          <el-button type="primary" class="selectitem" @click="checkNode"
            >对比选中的节点</el-button
          >
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <div class="selectitem">
          <span class="title">年份</span>
          <el-select
            v-model="yearSelect1"
            class="selectsubjectmiddle"
            placeholder="请选择"
            @change="changeYear(1)"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-tree
          v-if="openPanel1"
          :props="props"
          :load="loadNode1"
          show-checkbox
          accordion
          lazy
          node-key="id"
          ref="tree1"
        >
        </el-tree>
      </div>
      <div>
        <div class="selectitem">
          <span class="title">年份</span>
          <el-select
            v-model="yearSelect2"
            class="selectsubjectmiddle"
            placeholder="请选择"
            @change="changeYear(2)"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-tree
          v-if="openPanel2"
          :props="props"
          :load="loadNode2"
          show-checkbox
          accordion
          lazy
          node-key="id"
          ref="tree2"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { getWikiPageTree, getWikiCategoryTree } from "@/api/index";
import * as Diff2Html from "diff2html";
import * as diff from "diff";

export default {
  name: "WikiTree",
  data() {
    return {
      diffs: "",
      openPanel1: true,
      openPanel2: true,
      yearSelect1: 2020,
      yearSelect2: 2019,
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
    prettyHtml() {
      return Diff2Html.html(this.diffs, {
        drawFileList: true,
        matching: "lines",
        outputFormat: "side-by-side"
      });
    },
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
    checkNode() {
      let names1 = this.$refs.tree1.getCheckedNodes().map(item => {
        return item.name;
      });
      names1 = names1.filter(item => {
        if (item.indexOf("文章") > -1 || item.indexOf("子类") > -1)
          return false;
        return true;
      });
      let names2 = this.$refs.tree2.getCheckedNodes().map(item => {
        return item.name;
      });
      names2 = names2.filter(item => {
        if (item.indexOf("文章") > -1 || item.indexOf("子类") > -1)
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
    },

    changeYear(flag) {
      if (flag === 1) {
        this.openPanel1 = false;
        setTimeout(() => {
          this.openPanel1 = true;
        }, 10);
      } else {
        this.openPanel2 = false;
        setTimeout(() => {
          this.openPanel2 = true;
        }, 10);
      }
    },
    async _loadNode(node, resolve, _wikiDB) {
      if (node.level === 0) {
        return resolve(this.baseRegion);
      }

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
    },
    async loadNode1(node, resolve) {
      let _wikiDB = String(this.yearSelect1).slice(2, 4);
      return await this._loadNode(node, resolve, _wikiDB);
    },
    async loadNode2(node, resolve) {
      let _wikiDB = String(this.yearSelect2).slice(2, 4);
      return await this._loadNode(node, resolve, _wikiDB);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/common.less");
.wrapper {
  display: grid;
  // grid-template-columns: 1fr 1fr;
  grid-template-columns: repeat(2, 1fr);

  gap: 1rem;
  div {
    background: #eee;
    // padding: 1rem;
  }
  div:nth-child(odd) {
    background: #ddd;
  }
}
</style>
