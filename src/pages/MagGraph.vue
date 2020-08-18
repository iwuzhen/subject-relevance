<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          @change="getData"
          chips
          multiple
          dense
          label="目标学科"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart1"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart2"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart3"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart4"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import edge_linksin_2016_echarts from "../assets/data/edge_linksin_2016_echarts.json";
import edge_linksout_2016_echarts from "../assets/data/edge_linksout_2016_echarts.json";
import edge_linksin_2017_echarts from "../assets/data/edge_linksin_2017_echarts.json";
import edge_linksout_2017_echarts from "../assets/data/edge_linksout_2017_echarts.json";
import node_2016 from "../assets/data/node_2016.json";
import node_2017 from "../assets/data/node_2017.json";

export default {
  name: "Mag_graph",
  data() {
    return {
      subjectRelevances: [
        "Physics",
        "Geology",
        "Mathematics",
        "Biology",
        "Medicine",
        "History"
      ],
      loading: false,
      categorys: node_2016.map(each => each.Label)
    };
  },
  computed: {
    myChart1: function() {
      return this.$echarts.init(document.getElementById("subjectChart1"));
    },
    myChart2: function() {
      return this.$echarts.init(document.getElementById("subjectChart2"));
    },
    myChart3: function() {
      return this.$echarts.init(document.getElementById("subjectChart3"));
    },
    myChart4: function() {
      return this.$echarts.init(document.getElementById("subjectChart4"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
    this.getData();
  },
  methods: {
    getData() {
      // 过滤节点
      this.drawGraph(
        node_2016,
        edge_linksin_2016_echarts,
        this.myChart1,
        "Mag 2016 linksin"
      );
      this.drawGraph(
        node_2016,
        edge_linksout_2016_echarts,
        this.myChart2,
        "Mag 2016 linksout"
      );
      this.drawGraph(
        node_2017,
        edge_linksin_2017_echarts,
        this.myChart3,
        "Mag 2017 linksin"
      );
      this.drawGraph(
        node_2017,
        edge_linksout_2017_echarts,
        this.myChart4,
        "Mag 2017 linksout"
      );
    },

    drawGraph(nodesJson, linlsJson, chart, title) {
      let nodes = [],
        links = [],
        nodeIds = [];
      for (let doc of nodesJson) {
        if (this.subjectRelevances.indexOf(doc.Label) >= 0) {
          nodes.push(doc);
          nodeIds.push(doc.Id);
        }
      }
      for (let doc of linlsJson) {
        if (
          nodeIds.indexOf(doc.Source) >= 0 ||
          nodeIds.indexOf(doc.Target) >= 0
        ) {
          links.push(doc);
        }
      }

      let options = this.setOptions(nodes, links, title);
      chart.setOption(options, true);
    },

    setOptions(nodes, links, title) {
      let sizeMax = Math.max(...nodes.map(each => Number(each.weight)));
      let sizeMin = Math.min(...nodes.map(each => Number(each.weight)));
      console.log(sizeMax, sizeMin);
      let graphLink = links.map(each => {
        return {
          source: each.Source,
          target: each.Target,
          value: Math.floor(Number(each.Weight) * 10000) / 10000
        };
      });
      // 点大小，最大 100，最小10
      let graphData = nodes.map((each, index) => {
        return {
          id: each.Id,
          name: each.Label,
          value: Number(each.weight),
          category: this.subjectRelevances.indexOf(each.Label),
          symbolSize:
            (20 * (Number(each.weight) - sizeMin)) / (sizeMax - sizeMin) + 5
        };
      });

      let _opt = {
        title: {
          text: title
        },
        legend: [
          {
            data: this.subjectRelevances
          }
        ],
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "Les Miserables",
            tooltip: { formatter: "{c0}" },
            type: "graph",
            layout: "force",
            zoom: 3,
            force: {
              edgeLength: [30, 180]
              // layoutAnimation: false,
            },
            draggable: true,
            data: graphData,
            links: graphLink,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
              color: null,
              borderColor: "#fff",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)"
            },
            label: {
              show: true,
              color: "#000",
              position: "inside",
              fontSize: 16
            },
            lineStyle: {
              opacity: 0.7,
              // color: 'source',
              curveness: 0
            },
            categories: this.subjectRelevances.map(each => {
              return { name: each };
            }),
            emphasis: {
              lineStyle: {
                width: 2
              }
            }
          }
        ]
      };
      return _opt;
    }
  }
};
</script>
