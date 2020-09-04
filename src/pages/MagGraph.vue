<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="subjectRelevances"
          :items="categorys"
          chips
          multiple
          deletable-chips
          clearable
          dense
          label="目标学科"
          @change="getData"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        >
          <v-card-title>
            MAG 2016 linksin 测试 3D 引力图
          </v-card-title>
          <v-container
            id="3d-graph"
            fluid
            fill-height
          />
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
        >
          <v-container
            id="subjectChart1"
            fluid
            fill-height
          />
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
        >
          <v-container
            id="subjectChart2"
            fluid
            fill-height
          />
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
        >
          <v-container
            id="subjectChart3"
            fluid
            fill-height
          />
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
        >
          <v-container
            id="subjectChart4"
            fluid
            fill-height
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import edge_linksin_2016_echarts from '../assets/data/edge_linksin_2016_v2.json'
import edge_linksout_2016_echarts from '../assets/data/edge_linksout_2016_v2.json'
import edge_linksin_2017_echarts from '../assets/data/edge_linksin_2017_v2.json'
import edge_linksout_2017_echarts from '../assets/data/edge_linksout_2017_v2.json'
import node_2016 from '../assets/data/node_2016_v2.json'
import node_2017 from '../assets/data/node_2017_v2.json'
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'

import { defaultCategorySelect } from '@/api/data'

export default {
  name: 'MagGraph',
  extends: Base,
  data() {
    return {
      pageName: 'Mag 相关度引力图',
      subjectRelevances: defaultCategorySelect.map(each => {
        if (each === 'Engineering disciplines') {
          each = 'Engineering'
        }
        return each
      }),
      loading: false,
      categorys: node_2016.map(each => each.Label).sort().map(each => {
        return {
          text: each === 'Engineering disciplines' ? 'Engineering' : each,
          value: each
        }
      }),
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4']
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    draw3DForceGraph() {
      const nodes = []
      const links = []
      const nodeIds = []
      for (const doc of node_2016) {
        if (this.subjectRelevances.indexOf(doc.Label) >= 0) {
          nodes.push(doc)
          nodeIds.push(doc.Id)
        }
      }
      for (const doc of edge_linksin_2016_echarts) {
        if (
          nodeIds.indexOf(doc.Source) >= 0 &&
          nodeIds.indexOf(doc.Target) >= 0
        ) {
          links.push(doc)
        }
      }

      const sizeMax = Math.pow(
        Math.max(...nodes.map(each => Number(each.weight))), 1 / 3
      )
      const sizeMin = Math.pow(
        Math.min(...nodes.map(each => Number(each.weight))), 1 / 3
      )

      const gData = {
        nodes: nodes.map(each => ({ id: each.Id, name: each.Label,
          value: (2 * (Math.pow(Number(each.weight), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.05

        })),
        links: links
          .map(each => ({
            source: each.Source,
            target: each.Target,
            value: Number(each.Weight)
          }))
      }

      console.log(gData)
      const elem = document.getElementById('3d-graph')
      const Graph = ForceGraph3D()(elem).width(1500).height(700)
        .graphData(gData)
        .nodeResolution(30)
        .nodeVal('value')
        .nodeLabel('name')
        .nodeAutoColorBy('name')
        .zoomToFit(100, 100, node => true)
        // eslint-disable-next-line no-return-assign
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeClick(node => {
          // Aim at node from outside it
          const distance = 40
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
          Graph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          )
        })
      Graph
        .d3Force('link')
        .strength(link => { return link.value })
    },
    getData() {
      this.draw3DForceGraph()
      // 过滤节点
      this.drawGraph(
        node_2016,
        edge_linksin_2016_echarts,
        this.myChartObjs[0],
        'Mag 2016 linksin'
      )
      this.drawGraph(
        node_2016,
        edge_linksout_2016_echarts,
        this.myChartObjs[1],
        'Mag 2016 linksout'
      )
      this.drawGraph(
        node_2017,
        edge_linksin_2017_echarts,
        this.myChartObjs[2],
        'Mag 2017 linksin'
      )
      this.drawGraph(
        node_2017,
        edge_linksout_2017_echarts,
        this.myChartObjs[3],
        'Mag 2017 linksout'
      )
    },

    drawGraph(nodesJson, linlsJson, chart, title) {
      const nodes = []
      const links = []
      const nodeIds = []
      for (const doc of nodesJson) {
        if (this.subjectRelevances.indexOf(doc.Label) >= 0) {
          nodes.push(doc)
          nodeIds.push(doc.Id)
        }
      }
      for (const doc of linlsJson) {
        if (
          nodeIds.indexOf(doc.Source) >= 0 &&
          nodeIds.indexOf(doc.Target) >= 0
        ) {
          links.push(doc)
        }
      }

      const options = this.setOptions(nodes, links, title)
      chart.setOption(options, true)
    },

    setOptions(nodes, links, title) {
      const sizeMax = Math.sqrt(
        Math.max(...nodes.map(each => Number(each.weight)))
      )
      const sizeMin = Math.sqrt(
        Math.min(...nodes.map(each => Number(each.weight)))
      )
      console.log(sizeMax, sizeMin)
      const graphLink = links.map(each => {
        return {
          source: each.Source,
          target: each.Target,
          value: Math.floor((Number(each.Weight)) * 10000) / 10000
        }
      })
      // 点大小，最大 100，最小10
      const graphData = nodes.map((each, index) => {
        return {
          id: each.Id,
          name: each.Label,
          value: Number(each.weight),
          category: this.subjectRelevances.indexOf(each.Label),
          symbolSize:
            (20 * (Math.sqrt(Number(each.weight)) - sizeMin)) /
            (sizeMax - sizeMin) +
            5
        }
      })

      const _opt = {
        title: {
          text: title
        },
        legend: [
          {
            left: '15%',
            data: this.subjectRelevances
          }
        ],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Les Miserables',
            tooltip: { formatter: '{c0}' },
            type: 'graph',
            layout: 'force',
            zoom: 2.5,
            force: {
              edgeLength: [20, 200]
              // layoutAnimation: false,
            },
            draggable: true,
            data: graphData,
            links: graphLink,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
              color: null,
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
              show: true,
              color: '#000',
              position: 'inside',
              fontSize: 16
            },
            lineStyle: {
              opacity: 0.7,
              // color: 'source',
              curveness: 0
            },
            categories: this.subjectRelevances.map(each => {
              return { name: each }
            }),
            emphasis: {
              lineStyle: {
                width: 2
              }
            }
          }
        ]
      }
      return _opt
    }
  }
}
</script>
