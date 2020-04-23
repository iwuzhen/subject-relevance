<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-14 22:23:01
 * @LastEditors: ider
 * @LastEditTime: 2020-04-22 22:06:54
 * @Description: 
 -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="5">
        <v-select
          v-model="currentSubjectSelect"
          :items="categoryOpt"
          @change="getData"
          chips
          multiple
          dense
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearsSelect"
          :items="yearsOpt"
          @change="getData"
          multiple
          label="year"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="tableSelect"
          :items="tableOpt"
          @change="getData"
          label="表格类型"
        ></v-select>
      </v-col>
      <!-- <v-col align-self="center" cols="2">
        <v-btn
          color="light-blue lighten-2"
          dark
          small
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          参数
        </v-btn>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col col="2" v-for="item in gridData" :key="item">
        <v-card>
          <v-card-title>{{ item.title }}</v-card-title>
          <v-data-table
            :headers="item.headers"
            :items="item.desserts"
            dense
            sort-desc
            class="elevation-1"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          参数说明
        </v-card-title>

        <v-card-text>
          <p></p>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getTopArticles } from "@/api/index";
import { basiCategorys } from "@/api/data";
export default {
  name: "wiki学科top文章展示",
  data() {
    return {
      dialog: false,
      currentSubjectSelect: [],
      yearsSelect: [],
      tableSelect: "按学科组合",
      tableOpt: ["按年组合", "按学科组合"],
      yearsOpt: [
        2007,
        2008,
        2009,
        2010,
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
      categoryOpt: basiCategorys,
      loading: false,
      gridData: []
    };
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  computed: {
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  methods: {
    async getData() {
      if (
        this.currentSubjectSelect.length === 0 ||
        this.yearsSelect.length === 0
      ) {
        return false;
      }
      this.loading = true;
      let opt = {
        cats: this.currentSubjectSelect.join(","),
        years: this.yearsSelect.join(",")
      };
      //   let data;
      let response = await getTopArticles(opt);
      if (response.data.data) {
        this.drawTable(response.data.data);
      } else {
        this.$emit("emitMesage", "请求失败");
      }
    },
    drawTable(data) {
      let ret_data = [];
      if (this.tableSelect == "按年组合") {
        let headers = [
          {
            text: "article name",
            align: "start",
            sortable: false,
            value: "name"
          },
          {
            text: "links count",
            align: "start",
            value: "links"
          }
        ];
        // 组合 header
        for (let catename of this.currentSubjectSelect) {
          headers.push({
            text: `${catename} 排名`,
            align: "center",
            value: catename,
            sort: (a, b) => {
              if (!a) {
                return 1;
              } else if (!b) {
                return -1;
              }
              return a - b;
            }
          });
        }
        for (let year of this.yearsSelect) {
          let desserts = {};
          for (let catename of this.currentSubjectSelect) {
            let sortedItems = Object.entries(data[year][catename]).sort(
              (x, y) => {
                return Number(y[1]) - Number(x[1]);
              }
            );
            let sortedNameArray = Object.entries(data[year][catename])
              .sort((x, y) => {
                return Number(y[1]) - Number(x[1]);
              })
              .map(item => {
                return item[0];
              });
            for (let item of sortedItems) {
              if (!desserts[item[0]]) {
                desserts[item[0]] = {};
              }
              desserts[item[0]]["name"] = item[0];
              desserts[item[0]]["links"] = item[1];
              desserts[item[0]][catename] =
                sortedNameArray.indexOf(item[0]) + 1;
            }
          }
          ret_data.push({
            title: `${year} 各学科文章`,
            headers: headers,
            desserts: Object.values(desserts)
          });
        }
      } else {
        // 年为表头
        let headers = [
          {
            text: "article name",
            align: "start",
            sortable: false,
            value: "name"
          }
        ];
        // 组合 header

        for (let year of this.yearsSelect) {
          headers.push({
            text: `${year} count`,
            align: "center",
            value: `y${year}`,
            sort: (a, b) => {
              if (!a) {
                return -1;
              } else if (!b) {
                return 1;
              }
              return a - b;
            }
          });
        }
        for (let catename of this.currentSubjectSelect) {
          // 二次循环出

          let desserts = {};
          for (let year of this.yearsSelect) {
            let sortedItems = Object.entries(data[year][catename]).sort(
              (x, y) => {
                return Number(y[1]) - Number(x[1]);
              }
            );
            for (let articleCount of sortedItems) {
              if (!desserts[articleCount[0]]) {
                desserts[articleCount[0]] = {};
              }
              desserts[articleCount[0]]["name"] = articleCount[0];
              desserts[articleCount[0]][`y${year}`] = articleCount[1];
            }
          }
          ret_data.push({
            title: `${catename} 各年文章`,
            headers: headers,
            desserts: Object.values(desserts)
          });
        }
      }

      console.log(ret_data);
      this.gridData = ret_data;
      console.log(this.gridData);
      this.loading = false;
    }
  }
};
</script>
