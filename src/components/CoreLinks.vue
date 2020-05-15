<!--
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-05-14 16:16:27
 * @LastEditors: ider
 * @LastEditTime: 2020-05-15 12:39:14
 * @Description: 
 -->

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="subjectTarget"
          :items="categorys"
          @change="getData"
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="subjectRelevances"
          :items="categorysOptions"
          @change="getData"
          small-chips
          multiple
          clear-icon
          deletable-chips
          label="相关学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="yearSelect"
          :items="yearOpt"
          @change="getData"
          label="年"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="pageCountSelect"
          :items="pageCountOpt"
          @change="getData"
          label="文章数"
        ></v-select>
      </v-col>
      <v-col cols="1">
        <v-select
          v-model="levelSelect"
          :items="levelOpt"
          @change="getData"
          label="层数"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="140vh"
          id="subjectChart"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getCoreLinksInDataByCats,
  getCoreLinksInData
  //   getDistanceCore
} from "@/api/index";
import { extendEchartsOpts, coreCategorys } from "@/api/data";
export default {
  name: "core_wiki类引用成分图",
  data() {
    return {
      subjectTarget: "",
      subjectRelevances: [],
      pageCountSelect: "3000",
      categorys: coreCategorys,
      levelSelect: 3,
      levelOpt: [3, 4],
      yearSelect: 2007,
      yearOpt: [
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
      pageCountOpt: [
        {
          value: "1000",
          text: "top 1000 文章"
        },
        {
          value: "2000",
          text: "top 2000 文章"
        },
        {
          value: "3000",
          text: "top 3000 文章"
        },
        {
          value: "4000",
          text: "top 4000 文章"
        },
        {
          value: "5000",
          text: "top 5000 文章"
        },
        {
          value: "6000",
          text: "top 6000 文章"
        },
        {
          value: "7000",
          text: "top 7000 文章"
        },
        {
          value: "8000",
          text: "top 8000 文章"
        },
        {
          value: "9000",
          text: "top 9000 文章"
        },
        {
          value: "10000",
          text: "top 10000 文章"
        }
      ],
      loading: false
    };
  },
  computed: {
    categorysOptions: function() {
      let subjectTarget = this.subjectTarget;
      return this.categorys.map(item => {
        let ret = {
          value: item,
          text: item
        };
        if (item == subjectTarget) ret["disabled"] = true;
        return ret;
      });
    },
    myChart: function() {
      return this.$echarts.init(document.getElementById("subjectChart"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  methods: {
    async getData() {
      if (!this.subjectTarget || this.subjectRelevances.length === 0) {
        return false;
      }
      this.loading = true;
      let opt1 = {
        strA: this.subjectTarget,
        strB: this.subjectRelevances
          .filter(item => {
            if (item == this.subjectTarget) {
              return false;
            }
            return true;
          })
          .join(","),
        year: this.yearSelect,
        N: this.pageCountSelect,
        level: this.levelSelect
      };
      let opt2 = {
        str: Array.from(
          new Set([...this.subjectRelevances, this.subjectTarget])
        ).join(","),
        year: this.yearSelect,
        N: this.pageCountSelect,
        level: this.levelSelect
      };
      try {
        //   饼图
        let resPie = await getCoreLinksInData(opt1);
        // sankey graph
        let resSankey = await getCoreLinksInDataByCats(opt2);
        let seriesPie = {
          type: "pie",
          radius: "55%",
          center: ["50%", "40%"],
          height: "50%",
          // bottom: "50%",
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(10, 11, 0, 0.5)"
            }
          },
          name: this.subjectTarget,
          data: []
        };
        for (let item of Object.entries(resPie.data.data.info)) {
          if (item[0] === "other") continue;
          seriesPie.data.push({
            value: item[1],
            name: item[0]
          });
        }
        console.log(seriesPie);

        let seriesSankey = {
          type: "sankey",
          layout: "none",
          top: "50%",
          focusNodeAdjacency: "allEdges",
          data: [
            ...Object.keys(resSankey.data.data).map(item => {
              return { name: item };
            }),
            ...Object.keys(resSankey.data.data).map(item => {
              return { name: ` ${item}` };
            })
          ],
          links: []
        };
        for (let item of Object.entries(resSankey.data.data)) {
          for (let target of Object.entries(item[1].info)) {
            seriesSankey.links.push({
              source: item[0],
              target: ` ${target[0]}`,
              value: target[1]
            });
          }
        }
        console.log(seriesSankey);

        let options = extendEchartsOpts({
          title: [
            {
              left: "45%",
              text: `${this.subjectTarget} 的相关学科占比`
            },
            {
              left: "40%",
              top: "45%",
              text: `选中学科间的 linker 分布`
            }
          ],

          tooltip: [
            {
              trigger: "item",
              //   formatter: "{a} <br/>{b} : {c} ({d}%)"
              triggerOn: "mousemove"
            }
            // {
            //   trigger: "item",
            //   triggerOn: "mousemove"
            // }
          ],
          legend: [
            {
              orient: "vertical",
              left: 20,
              top: "2%",
              data: seriesPie.data.map(item => {
                return item.name;
              })
            }
          ],
          series: [seriesPie, seriesSankey]
        });

        this.myChart.setOption(options, true);
        this.loading = false;
      } catch (error) {
        this.$emit("emitMesage", `请求失败:${error}`);
        throw error;
      }
    }
  }
};
</script>
