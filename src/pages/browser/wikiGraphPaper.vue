<template lang="pug">
v-container(fluid  :style="cssVars")
  v-row
    v-col(cols='4')
      v-select(v-model='vertexSubjects' :items='subjectOpt' chips multiple deletable-chips clearable dense label='定点学科' @change='Draw')

    v-col(cols='8')
      v-select(v-model='subjectRelevances' :items='categorys' chips multiple deletable-chips clearable dense label='目标学科' @change='Draw')
    v-col(cols="7")
      v-slider(hint="展示年份" label="展示年份" max=2021 min=2007 step=1 thumb-label="always" v-model="selectYear" @change='liteDraw')
    v-col(cols='2')
      v-select(v-model='methodValue' :items='methodOpt' dense label='方向' @change='Draw')
    v-col(cols='2')
      v-select(v-model='btype' :items='btypeOpt' dense label='数据范围' @change='Draw')
    v-col(cols='2')
      v-select(v-model='level' :items='levelOpt' dense label='level' @change='Draw')
    v-col(cols='2')
      v-text-field(v-model='chartTitle' dense label='chartTitle' @change='Draw')
    v-col(cols="2")
      v-switch(v-model="showText" :label="`节点展示文字: ${showText.toString()}`"  @change='liteDraw')
    v-col(cols="2")
      v-switch(v-model="camera.status" :label="`Camera 自动环绕: ${showText.toString()}`"  @change='AutoCamera')
    v-col(cols="2")
      span  字体大小
      v-btn-toggle(dense)
        v-btn(@click="style.fontSize++") + 1
        v-btn(@click="style.fontSize--") - 1
    v-col(cols="2")
      span  字体top
      v-btn-toggle(dense)
        v-btn(@click="style.fontTop--") + 1
        v-btn(@click="style.fontTop++") - 1
    v-col(cols="2")
      span  字体left
      v-btn-toggle(dense)
        v-btn(@click="style.fontLeft--") + 1
        v-btn(@click="style.fontLeft++") - 1

    v-col(cols="5")
      v-slider(hint="距离过滤器" label="距离过滤器" max=1 min=0 step=0.01 thumb-label="always" v-model="linkFilter" @change='liteDraw')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='90vh')
        v-card-title
          | MAG {{selectYear}} linksin 测试 3D 引力图
        v-container#3dgraph(fluid fill-height)

  v-row
    article.mt-60(size="A4")
      v-card.mx-auto(outlined :loading='loading' height='14.2cm')
        v-container#subjectChart1(fluid fill-height)

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container#subjectChart2(fluid fill-height)
  v-row
    v-col
      comment(storagekey='wiki_graph_2021_Chart_1')

</template>

<script>
// 计算阈值
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'
import comment from '@/components/comment'
import _ from 'lodash'
import { WIKI_TOP_CATEGORY, extendEchartsOpts, extendLineSeries } from '@/api/data'

const Graph = require('graphology')
import { connectedComponents } from 'graphology-components'

import { getDistanceCore, requestWrap } from '@/api/index'
// import anime from 'animejs/lib/anime.es.js'
// import * as THREE from 'three'
// import SpriteText from 'three-spritetext'
import { CSS2DObject, CSS2DRenderer } from '@/utils/three/CSS2DRenderer'

export default {
  name: 'MagGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'wikipedia 相关度引力图',
      vertexSubjects: ['Biology', 'Physics', 'Mathematics', 'Political science'],
      subjectOpt: WIKI_TOP_CATEGORY,
      subjectRelevances: WIKI_TOP_CATEGORY,
      methodValue: 'linksin',
      methodOpt: ['linksin', 'linksout'],
      btype: 'v5_xueshu_node_newDB',
      chartTitle: 'Wikipedia',
      btypeOpt: [
        {
          text: 'v5',
          value: 'v5_node_newDB'
        },
        {
          text: 'v5 学术圈',
          value: 'v5_xueshu_node_newDB'
        }],
      level: 3,
      levelOpt: [2, 3],
      BasicData: {},
      GraphData: {},
      showText: true,
      camera: {
        status: false,
        intPid: 0
      },

      style: {
        fontSize: 18,
        fontTop: -10,
        fontLeft: -10
      },
      categorys: WIKI_TOP_CATEGORY,
      myChartIds: ['subjectChart1', 'subjectChart2'],
      loading: false,
      linkFilter: 0.75,
      ct: 0,
      selectYear: 2021,
      Graph: null,
      camerAngle: 0,
      repYearRange: null
    }
  },
  computed: {
    cssVars() {
      return {
        /* variables you want to pass to css */
        '--fontSize': `${this.style.fontSize}px`,
        '--fontTop': `${this.style.fontTop}px`,
        '--fontLeft': `${this.style.fontLeft}px`
      }
    }
  },
  mounted() {
    // this.getData()
    this.Draw()
  },
  methods: {
    async getData() {
      const allNodesMap = {}
      const allNodeLinks = []
      const allData = Array.from(new Set(this.subjectRelevances.concat(this.vertexSubjects)))

      try {
        let count_version = 'v5_newDB'
        if (this.btype === 'v5_xueshu_node_newDB') {
          count_version = 'v5_newDB_xueshu'
        }
        // 学科大小
        const opt = {
          subjects: allData.join(','),
          version: count_version,
          type: 0,
          level: this.level
        }
        // if (['v5_xueshu_noHistoryAndLiterature_node', 'v5_xueshu_node'].includes(this.btype)) {
        //   opt.level = this.level
        // }
        const ret = await requestWrap('wiki/getArticlesTotalByCoreNew_v', 'post', opt)
        // 将数据拼接成结构体
        const dataMap = ret

        allData.forEach((item, index) => {
          if (item === 'Engineering disciplines') {
            item = 'Engineering'
          }
          allNodesMap[item] = {
            id: index,
            label: item,
            weight: dataMap[item]
          }
        })
      } catch (error) {
        console.log(error)
      }
      let linkId = 0
      while (allData.length > 1) {
        let strA = allData.pop()
        const opt = {
          strA,
          strB: allData.join(','),
          method: this.methodValue,
          level: -1,
          levelType: this.level,
          btype: this.btype,
          catlevel: 0
        }

        const ret = await getDistanceCore(opt)
        if (strA === 'Engineering disciplines') {
          strA = 'Engineering'
        }
        if (this.repYearRange === null) {
          this.repYearRange = ret.data.x
        }

        const souceId = allNodesMap[strA].id
        // console.log(ret.data)
        for (const index in ret.data.legend) {
          allNodeLinks.push({
            source: souceId,
            target: allNodesMap[ret.data.legend[index]].id,
            id: linkId,
            weight: ret.data.y[index]
          })
          linkId += 1
        }
      }
      return { nodes: Object.values(allNodesMap), links: allNodeLinks }
    },

    parseGraphData(nodes, links, yindex) {
      const year = this.repYearRange[yindex]
      console.log(nodes, year)
      const sizeMax = Math.pow(
        Math.max(..._.flattenDeep(nodes.map(each => each.weight[year]))), 1 / 3
      )
      const sizeMin = Math.pow(
        Math.min(..._.flattenDeep(nodes.map(each => each.weight[year]))), 1 / 3
      )
      console.log(sizeMax, sizeMin)

      const vertuxArray = []
      if (this.vertexSubjects.length <= 3) {
        vertuxArray.push({ fx: 100, fy: 0, fz: 0 }, { fx: 0, fy: 100, fz: 0 }, { fx: 0, fy: 0, fz: 100 })
      } else if (this.vertexSubjects.length >= 4) {
        vertuxArray.push({ fx: 100, fy: 100, fz: -150 }, { fx: 120, fy: 100, fz: -50 }, { fx: 100, fy: 50, fz: -50 }, { fx: 100, fy: 100, fz: -50 }, { fx: 0, fy: 100, fz: 50 }, { fx: 100, fy: 0, fz: 100 }, { fx: 0, fy: 0, fz: -50 })
      }

      return {
        nodes: nodes.map(each => {
          if (this.vertexSubjects.includes(each.label)) {
            const { fx, fy, fz } = vertuxArray.pop()
            console.log(each.weight[year], sizeMin, sizeMax)
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: (5 * (Math.pow(Number(each.weight[year]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5,
              fx,
              fy,
              fz
            })
          } else {
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: (5 * (Math.pow(Number(each.weight[year]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5

            })
          }
        }),
        links: links
          .map(each => ({
            source: each.source,
            target: each.target,
            value: Number(each.weight[yindex])
          }))
      }
    },
    render2D() {
      console.log('render2D')
      const elem = document.getElementById('3dgraph')
      this.twoDRenderer = new CSS2DRenderer()
      this.twoDRenderer.setSize(elem.clientWidth, elem.clientHeight)
      this.twoDRenderer.domElement.style.position = 'absolute'
      this.twoDRenderer.domElement.style.pointerEvents = 'none'
      elem.appendChild(this.twoDRenderer.domElement)
    },

    randerCssLabel() {
      requestAnimationFrame(this.randerCssLabel)
      this.twoDRenderer.render(this.Graph.scene(), this.Graph.camera())
    },
    draw3DForceGraph(gData) {
      const elem = document.getElementById('3dgraph')
      const height = Math.floor(window.innerHeight * 0.9)
      const width = Math.floor(window.innerWidth) - 60
      const Graph = ForceGraph3D()(elem).width(width).height(height).backgroundColor('#fff')
        .graphData(gData)
        .nodeResolution(30)
        .nodeVal('value')
        .nodeLabel('name')
        .nodeAutoColorBy('name')
        .d3Force('center', null)
        .zoomToFit(100, 100, node => true)
        .linkWidth(link => {
          return link.value
        })
        .linkOpacity(0.6)
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
        }).nodeThreeObjectExtend(true)
      Graph
        .d3Force('link')
        .strength(link => { return link.value })
      this.Graph = Graph

      // 初始化 2d css label
      this.render2D()
      this.randerCssLabel()
    },

    AutoCamera() {
      const distance = 400
      const that = this
      if (this.camera.status === true) {
        this.camera.intPid = setInterval(() => {
          this.Graph.cameraPosition({
            x: distance * Math.sin(that.camerAngle),
            z: distance * Math.cos(that.camerAngle)
          })
          that.camerAngle += Math.PI / 300
        }, 10)
      } else {
        clearInterval(this.camera.intPid)
      }
    },

    Draw: _.debounce(async function() {
      this.loading = true
      let { nodes, links } = await this.getData()
      // console.log(links)
      this.drawTable(nodes, links)
      this.GraphData = this.parseGraphData(nodes, links, this.repYearRange.indexOf(String(this.selectYear)))

      links = this.GraphData.links.filter(x => x.value <= this.linkFilter)
      nodes = this.GraphData.nodes
      this.echartDraw(nodes, links.concat())
      if (this.Graph === null) {
        this.draw3DForceGraph({ nodes, links })
      } else {
        this.Graph.graphData({ nodes, links }).d3ReheatSimulation()
      }
      if (this.showText === true) {
        this.Graph.nodeThreeObject(node => {
          return this.createLabel(node)
        })
        // this.Graph.d3Force('charge').strength(-120)
      } else {
        this.Graph.nodeThreeObject('null')
      }

      this.loading = false
    }, 2500),

    createLabel(node) {
      const labelDiv = document.createElement('div')
      // labelDiv.id = node.name
      labelDiv.style.color = node.color
      labelDiv.textContent = node.name
      labelDiv.className = 'label'
      // labelDiv.textContent = '大大的'
      const label = new CSS2DObject(labelDiv)
      // label.position.set(0, Math.floor(node.value), 0)
      // label.position.multiplyScalar(75)
      // label.scale.multiplyScalar(25)
      // label.position.copy(node.position)
      // this.Graph.scene().add(label)
      // this.root.add(label)
      // this.Graph.scene().add(new THREE.Mesh(

      return label
    },
    liteDraw: _.debounce(async function() {
      this.loading = true
      let { links } = await this.getData()
      this.GraphData = this.parseGraphData(this.GraphData.nodes, links, this.repYearRange.indexOf(String(this.selectYear)))
      links = this.GraphData.links.filter(x => x.value <= this.linkFilter)
      const nodes = this.GraphData.nodes
      this.echartDraw(nodes, links.concat())
      if (this.Graph === null) {
        this.draw3DForceGraph({ nodes, links })
      } else {
        this.Graph.graphData({ nodes, links }).d3ReheatSimulation()
      }
      if (this.showText === true) {
        this.Graph.nodeThreeObject(node => {
          return this.createLabel(node)
        })
        // this.Graph.d3Force('charge').strength(-120)
      } else {
        this.Graph.nodeThreeObject('null')
      }

      window.graph = this.Graph
      window.nodes = nodes
      this.loading = false
    }, 2500),

    drawTable(nodes, links, maxcompents = 8) {
      const retData = []
      for (let year = 2021; year >= 2007; year--) {
        const tmpData = []
        const weightId = year - 2007
        links = links.sort((x, y) => x.weight[weightId] - y.weight[weightId])
        const graph = new Graph()
        for (const { id } of nodes) {
          graph.addNode(id)
        }
        let tmpLength = nodes.length
        for (const obj of links) {
          graph.addEdge(obj.source, obj.target)
          const components = connectedComponents(graph)
          if (components.length < tmpLength && maxcompents >= components.length) {
            tmpData.push([components.length, obj.weight[ weightId]])
            tmpLength = components.length
          }
        }
        retData.push(tmpData)
      }
      // 转置矩阵
      const retDataT = retData[0].map(function(col, i) {
        return retData.map(function(row, j) {
          const tmpRow = row[i]
          tmpRow[0] = 2021 - j
          return tmpRow
        })
      })
      console.log(retDataT)

      const _opt = extendEchartsOpts({
        title: [
          {
            text: this.chartTitle,
            left: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20
            }
          },
          {
            text: 'Number of clusters',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal'
            },
            left: '82%',
            top: '23%'
          }
        ],
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          },
          axisPointer: {
            type: 'cross',
            animation: true,
            label: {
              backgroundColor: '#505765'
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              if (!x.data[1]) {
                return 1
              }
              if (!y.data[1]) {
                return -1
              }
              return y.data[1] - x.data[1]
            })
            // console.log(params)
            let showHtm = ` ${params[0].axisValue}<br>`
            for (let i = 0; i < params.length; i++) {
              const _text = params[i].seriesName
              const _data = params[i].data
              const _marker = params[i].marker
              if (_data[1] !== undefined) {
                showHtm += `${_marker}${_text}, ${_data[1]}  <br>`
              }
            }
            return showHtm
          }
        },
        legend: {
          data: _.range(1, maxcompents + 1, 1).map(item => String(item)),
          right: 'left',
          left: '80%',
          textStyle: {
            fontSize: 18,
            color: '#000'
          },
          formatter: function(name) {
            return name
          }
        },
        xAxis: {
          name: 'Year',
          type: 'value',
          min: 'dataMin',
          max: 2021,
          boundaryGap: false,
          nameTextStyle: {
            color: '#000',
            align: 'center',
            fontSize: 18,
            verticalAlign: 'bottom'
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            fontSize: 16,
            color: '#000',
            formatter: value => {
              return value
            }
          },
          nameLocation: 'middle',
          nameGap: 50
        },
        yAxis: {
          name: 'Knowledge Distance',
          type: 'value',
          min: 0.3,
          max: 0.8,
          minorSplitLine: {
            fontSize: 18
          },
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
            align: 'center',
            // fontWeight: 'bolder',
            fontSize: 18,
            color: '#000'
          },
          splitLine: {
            show: false
          },
          interval: 0.1,
          axisLabel: {
            show: true,
            color: '#000',
            fontSize: 16
          }
        },
        grid: {
          left: '5%',
          right: '20%',
          bottom: '8%',
          containLabel: true
        },
        series: _.zip(_.range(maxcompents, 0, -1), retDataT).map(item => {
          return extendLineSeries({
            name: String(item[0]),
            type: 'line',
            smooth: false,
            symbol: 'none',
            symbolSize: 0,
            data: item[1]
          })
        })
      })
      // console.log(_opt)
      this.myChartObjs[0].setOption(_opt, true)
    },
    echartDraw(nodes, links) {
      const nodemap = {}
      const graphData = nodes.map(node => {
        nodemap[node.id] = node.name

        return {
          name: node.name,
          category: node.name,
          fixed: false,
          value: node.value,
          symbolSize: node.value * 3

        }
      })
      const graphLink = links.map(link => {
        return {
          source: nodemap[link.source],
          target: nodemap[link.target],
          value: link.value
        }
      })
      const _opt = {
        title: {
          text: '2D 力引导图'
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
            label: {
              show: true,
              color: '#000',
              position: 'top',
              fontSize: 16
            },
            lineStyle: {
              opacity: 0.7,
              curveness: 0
            },
            categories: Array.from(new Set(this.subjectRelevances.concat(this.vertexSubjects))).map(each => {
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

      this.myChartObjs[1].setOption(_opt, true)
    }
  }
}
</script>

<style lang="scss">

.loop {
  width:20px;
  height:20px;
  background-color: red;
}

.label {
  text-shadow: -1px 1px 1px rgb(0,0,0);
  margin: var(--fontTop) 0 0 var(--fontLeft);
  font-size: var(--fontSize);
}

article[size="A4"] {
  background: white;
  width: 21cm;
  height: 29.7cm;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
</style>
