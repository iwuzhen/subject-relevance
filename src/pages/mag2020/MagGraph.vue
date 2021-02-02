<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='4')
      v-select(v-model='vertexSubjects' :items='subjectOpt' chips='' multiple='' deletable-chips='' clearable='' dense='' label='定点学科' @change='Draw')

    v-col(cols='8')
      v-select(v-model='subjectRelevances' :items='categorys' chips='' multiple='' deletable-chips='' clearable='' dense='' label='目标学科' @change='Draw')
    v-col(cols="5")
      v-slider(hint="距离过滤器" label="距离过滤器" max=1 min=0 step=0.01 thumb-label="always" v-model="linkFilter" @change='liteDraw')
    v-col(cols="7")
      v-slider(hint="展示年份" label="展示年份" max=2020 min=1955 step=1 thumb-label="always" v-model="selectYear" @change='liteDraw')
    v-col(cols="2")
      v-switch(v-model="showText" :label="`节点展示文字: ${showText.toString()}`"  @change='liteDraw')
    v-col(cols="2")
      v-switch(v-model="camera.status" :label="`Camera 自动环绕: ${showText.toString()}`"  @change='AutoCamera')
  v-row
    .loop
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='90vh')
        v-card-title
          | MAG {{selectYear}} linksin 测试 3D 引力图
        v-container#3d-graph(fluid='' fill-height='')

  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart1(fluid='' fill-height='')
  v-row
    v-col
      comment(storagekey='Mag_graph_2020_Chart_1')

</template>

<script>
// 计算阈值
import { MAGCoreCategorys2020, SELECT_MAG_DATA } from '@/api/data'
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'
import comment from '@/components/comment'
import _ from 'lodash'

import { getMasDatav2, requestWrap } from '@/api/index'
import anime from 'animejs/lib/anime.es.js'
// import * as THREE from 'three'
import SpriteText from 'three-spritetext'

const currentSubbjectOpt = MAGCoreCategorys2020.concat([{
  text: 'Business',
  value: 'Business'
}, {
  text: 'Art',
  value: 'Art'
}]).sort((a, b) => a.text.localeCompare(b.text))

export default {
  name: 'MagGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'Mag 相关度引力图测试',
      vertexSubjects: ['Biology', 'Physics', 'Mathematics', 'Political science'],
      subjectOpt: currentSubbjectOpt,
      subjectRelevances: SELECT_MAG_DATA.concat(['Business', 'Art', 'Materials science', 'Geology', 'Geography']).sort(),
      BasicData: {},
      GraphData: {},
      showText: false,
      camera: {
        status: false,
        intPid: 0
      },
      categorys: currentSubbjectOpt,
      myChartIds: ['subjectChart1'],
      loading: false,
      linkFilter: 0.75,
      ct: 0,
      selectYear: 2020,
      Graph: null,
      camerAngle: 0
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
          method: 'linksin',
          from: 1955,
          to: 2020,
          qs: -1,
          version: 'delete_noref_v3_node'
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
      } else if (this.vertexSubjects.length === 4) {
        vertuxArray.push({ fx: 100, fy: 100, fz: -50 }, { fx: 0, fy: 100, fz: 50 }, { fx: 100, fy: 0, fz: 100 }, { fx: 0, fy: 0, fz: -50 })
      }

      return {
        nodes: nodes.map(each => {
          if (this.vertexSubjects.includes(each.label)) {
            const { fx, fy, fz } = vertuxArray.pop()
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: (5 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5,
              fx,
              fy,
              fz
            })
          } else {
            return Object.assign(each, {
              id: each.id,
              name: each.label,
              value: (5 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5
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

    draw3DForceGraph(gData) {
      const elem = document.getElementById('3d-graph')
      const height = Math.floor(window.innerHeight * 0.9)
      const width = Math.floor(window.innerWidth) - 60
      const Graph = ForceGraph3D()(elem).width(width).height(height)
        .graphData(gData)
        .nodeResolution(30)
        .nodeVal('value')
        .nodeLabel('name')
        .nodeAutoColorBy('name')
        .d3Force('center', null)
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
        }).nodeThreeObjectExtend(true)
      Graph
        .d3Force('link')
        .strength(link => { return link.value })
      this.Graph = Graph
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
      console.log(links)
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
          const sprite = new SpriteText(node.name)
          sprite.material.depthWrite = false // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = node.value + 3
          // sprite.position.x = 0
          sprite.position.y = 10
          return sprite
          // const canvas = document.createElement('canvas')
          // const context = canvas.getContext('2d')
          // // add image, text etc
          // context.fillText('dada', 10, 10)

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
      anime({
        targets: '.loop',
        direction: 'alternate',
        translateX: 250, // -> '250px'
        rotate: 540, // -> '540deg'
        duration: 3000,
        loop: true
      })
      window.graph = this.Graph
      window.nodes = nodes
      this.loading = false
    }, 2500),

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
          const sprite = new SpriteText(node.name)
          sprite.material.depthWrite = false // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = node.value + 3
          // sprite.position.x = 0
          sprite.position.y = 10
          return sprite
          // const canvas = document.createElement('canvas')
          // const context = canvas.getContext('2d')
          // // add image, text etc
          // context.fillText('dada', 10, 10)

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
      anime({
        targets: '.loop',
        direction: 'alternate',
        translateX: 250, // -> '250px'
        rotate: 540, // -> '540deg'
        duration: 3000,
        loop: true
      })
      window.graph = this.Graph
      window.nodes = nodes
      this.loading = false
    }, 2500),

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

      this.myChartObjs[0].setOption(_opt, true)
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
</style>
