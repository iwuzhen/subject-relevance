<template lang="pug">
v-container(fluid :style="cssVars")
  v-row
    v-col(cols='4')
      v-select(v-model='vertexSubjects' :items='subjectOpt' chips multiple deletable-chips clearable dense label='定点学科' @change='Draw')

    v-col(cols='8')
      v-select(v-model='subjectRelevances' :items='categorys' chips multiple deletable-chips clearable dense label='目标学科' @change='Draw')
    v-col(cols="5")
      v-slider(hint="距离过滤器" label="距离过滤器" max=1 min=0 step=0.01 thumb-label="always" v-model="linkFilter" @change='liteDraw')
    v-col(cols="7")
      v-slider(hint="展示年份" label="展示年份" max=2020 min=1955 step=1 thumb-label="always" v-model="selectYear" @change='liteDraw')

    v-col(cols="4")
      v-select(v-model='version' :items='versionOpt' dense label='数据' @change='Draw')
    v-col(cols="2")
      v-select(v-model='method' :items='methodOpt' dense label='links' @change='Draw')
    v-col(cols="2")
      v-switch(v-model="showText" :label="`节点展示文字: ${showText.toString()}`"  @change='liteDraw')
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

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='90vh')
        v-card-title
          | MAG {{selectYear}} linksin 测试 3D 引力图
        v-container#3dgraph(fluid fill-height)

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container#subjectChart1(fluid fill-height)

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined :loading='loading' height='70vh')
        v-container#subjectChart2(fluid fill-height)
  v-row
    v-col
      comment(storagekey='Mag_graph_2020_Chart_1')

</template>

<script>
// 计算阈值
import { MAGCoreCategorys2020_V1, SELECT_MAG_DATA_V1 } from '@/api/data'
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'
import comment from '@/components/comment'
import _ from 'lodash'
import { extendEchartsOpts, extendLineSeries } from '@/api/data'

const Graph = require('graphology')
import { connectedComponents } from 'graphology-components'

import { getMasDatav2, requestWrap } from '@/api/index'
// import anime from 'animejs/lib/anime.es.js'
// import * as THREE from 'three'

// import * as THREE from '@/utils/three/three.module.js'
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
      pageName: 'Mag 相关度引力图测试',
      vertexSubjects: ['Biology', 'Physics', 'Mathematics', 'Sociology'],
      subjectOpt: MAGCoreCategorys2020_V1,
      subjectRelevances: SELECT_MAG_DATA_V1,
      version: 'delete_noref_v3_node',
      versionOpt: [{
        value: 'delete_noref_v3_node',
        text: '文章的距离，去0，去Book和去Patent，按点'
      }, {
        value: 'tjbook_only_noPatent_delete_noref_v3_node',
        text: '书的距离，去0，去Patent，按点'
      }],
      method: 'linksin',
      methodOpt: ['linksin', 'linksout'],
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
      categorys: MAGCoreCategorys2020_V1,
      myChartIds: ['subjectChart1', 'subjectChart2'],
      loading: false,
      linkFilter: 0.5,
      ct: 0,
      selectYear: 2020,
      Graph: null,
      camerAngle: 0,
      twoDRenderer: null,
      WIDTH: 0,
      HEIGHT: 0

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
        // 学科大小
        const opt = {
          doctype: 1,
          cats: allData.join(','),
          version: 'v3',
          yeartype: 0,
          from: 1955,
          to: 2020
        }
        if (this.version === 'tjbook_only_noPatent_delete_noref_v3_node') {
          opt.version = 'book_all_v3'
        }
        const ret = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', opt)
        for (const index in ret.data.y) {
          allNodesMap[ret.data.legend[index]] = {
            id: Number(index),
            label: ret.data.legend[index],
            weight: ret.data.y[index]
          }
        }
      } catch (error) {
        console.log(error)
      }
      let linkId = 0
      while (allData.length > 1) {
        let strA = allData.pop()
        const opt = {
          strA,
          strB: allData.join(','),
          method: this.method,
          from: 1955,
          to: 2020,
          qs: -1,
          version: this.version
        }
        if (this.version === 'tjbook_only_noPatent_delete_noref_v3_node') {
          if (['Art', 'Business'].indexOf(opt.strA) > -1) {
            continue
          }
          opt.strB = allData.filter(item => ['Art', 'Business'].indexOf(item) === -1).join(',')
        }
        const ret = await getMasDatav2(opt)
        if (strA === 'Engineering disciplines') {
          strA = 'Engineering'
        }
        const souceId = allNodesMap[strA].id
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
      const sizeMax = Math.pow(
        Math.max(..._.flattenDeep(nodes.map(each => each.weight[yindex]))), 1 / 3
      )
      const sizeMin = Math.pow(
        Math.min(..._.flattenDeep(nodes.map(each => each.weight[yindex]))), 1 / 3
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
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: ((5 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5),
              fx,
              fy,
              fz
            })
          } else {
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: ((5 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5)
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
      const Graph = ForceGraph3D()(elem).width(width).height(height)
        .graphData(gData)
        .nodeResolution(20)
        .nodeVal('value')
        .nodeLabel('name')
        .nodeRelSize(4)
        .nodeAutoColorBy('name')
        .d3Force('center', null)
        .zoomToFit(0, 50, node => true)
        // .cameraPosition({ x: 0, y: 0, z: 100 })
        // eslint-disable-next-line no-return-assign
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .linkWidth(link => {
          return link.value
        })
        .linkOpacity(0.6)
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
        .nodeThreeObjectExtend(true)
      Graph
        .d3Force('link')
        .strength(link => { return link.value })
      this.Graph = Graph

      // const grid = new THREE.GridHelper(1000, 50, 0x64FE00, 0x0C291F) // 网格辅助，大小，行距，中心线颜色，网格线条颜色
      // this.Graph.scene().add(grid)

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
      this.GraphData = this.parseGraphData(nodes, links, this.selectYear - 1955)

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
          // const sprite = new SpriteText(node.name)
          // sprite.material.depthWrite = false // make sprite background transparent
          // sprite.color = node.color
          // sprite.textHeight = node.value + 3
          // // sprite.position.x = 0
          // sprite.position.y = 10
          // return sprite

          return this.createLabel(node)
        })
        // this.Graph.d3Force('charge').strength(-120)
      } else {
        this.Graph.nodeThreeObject('null')
      }
      this.twoDRenderer.render(this.Graph.scene(), this.Graph.camera())
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
      this.GraphData = this.parseGraphData(this.GraphData.nodes, links, this.selectYear - 1955)
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
          // const sprite = new SpriteText(node.name)
          // sprite.material.depthWrite = false // make sprite background transparent
          // sprite.color = node.color
          // sprite.textHeight = node.value + 3
          // // sprite.position.x = 0
          // sprite.position.y = 10
          // return sprite
          // return
          return this.createLabel(node)
          // return this.createAttackLabel(node)
          // const canvas = document.createElement('canvas')
          // const context = canvas.getContext('2d')
          // // add image, text etc
          // context.fillText(node.name, 10, 10)

          // const texture = new THREE.Texture(context.canvas)
          // texture.needsUpdate = true
          // const material = new THREE.SpriteMaterial({ map: texture })
          // const sprite = new THREE.Sprite(material)
          // sprite.scale.set(32, 32, 1)
          // return sprite
        })
        // this.Graph.d3Force('charge').strength(-120)
      } else {
        this.Graph.nodeThreeObject('null')
      }

      window.graph = this.Graph
      window.nodes = nodes
      this.twoDRenderer.render(this.Graph.scene(), this.Graph.camera())
      this.loading = false
    }, 2500),

    drawTable(nodes, links, maxcompents = 8) {
      const retData = []
      for (let year = 2020; year >= 1955; year--) {
        const tmpData = []
        const weightId = year - 1955
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
          tmpRow[0] = 2020 - j
          return tmpRow
        })
      })
      // console.log(retDataT)

      const _opt = extendEchartsOpts({
        title: {
          text: '年度阈值图'
        },
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
          data: _.range(1, maxcompents + 1, 1).map(item => String(item))
        },
        xAxis: {
          name: 'Year',
          type: 'value',
          min: 'dataMin',
          boundaryGap: false
        },
        yAxis: {
          name: 'knowledge distance',
          type: 'value'
        },
        series: _.zip(_.range(maxcompents, 0, -1), retDataT).map(item => {
          return extendLineSeries({
            name: String(item[0]),
            type: 'line',
            smooth: false,
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
          symbolSize: node.value * 10

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
</style>
