<template lang="pug">
  v-container(fluid :style="cssVars")
    v-row
      v-col(cols='4')
        v-select(@click="dialog.pid=0;dialog.stats=!dialog.stats" v-model='currentSubject.allSubject' :items='currentSubject.allSubject' chips multiple dense label='定点学科')
      v-col(cols='8')
        v-select(@click="dialog.pid=1;dialog.stats=!dialog.stats" v-model='targetSubject.allSubject' :items='targetSubject.allSubject' chips multiple dense label='目标学科')
      v-col(cols='2')
        v-select(v-model='methodValue' :items='methodOptions' dense label='条件' @change='changeSubject')
      v-col(cols='2')
        v-select(v-model='levelType.value' :items='levelType.option' dense label='层数' @change='getData')
      v-col(cols="5")
        v-slider(hint="距离过滤器" label="距离过滤器" max=1 min=0 step=0.01 thumb-label="always" v-model="linkFilter" @change='liteDraw')
      v-col(cols="7")
        v-slider(hint="展示年份" label="展示年份" max=2021 min=2007 step=1 thumb-label="always" v-model="selectYear" @change='liteDraw')
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
      v-col(col=12)
        span 一级学科标识
        v-chip(v-for="(value,key) in colorMap" :color="value") {{key}}
    v-row
      v-col(col='12')
        v-card.mx-auto(outlined :loading='loading' height='120vh')
          v-card-title
            | MAG {{selectYear}} linksin 测试 3D 引力图
          v-container#3dgraph(fluid fill-height)
    v-row
      v-col
        comment(storagekey='Mag_plant_graph_Chart_1')

    v-dialog(v-model="dialog.stats" )
      v-card
        v-card-title 学科以及二级学科选择器
          v-spacer
          div.v-btn--float
            v-btn(rounded color="secondary" @click="cleanSelect" large) 清空
            v-btn(rounded color="primary" @click="changeSubject" large) 提交

        v-container(fluid)
          v-row
            v-col(cols='4')
              v-list(dense)
                v-subheader 一级学科
                v-list-item-group(v-model="topSelect" multiple)
                  v-list-item(v-for="(item) in topSubject" @click="activeSubLevel(item)")
                    template( v-slot:default="{ active }")
                      v-list-item-action
                        v-checkbox(:input-value="active")
                      v-list-item-content
                        v-list-item-title {{item}}

            v-col(cols='4')
              v-list(dense)
                v-subheader 二级学科 {{subLevel.currentName}}

                v-list-item-group(v-if="subLevel.currentName != null" v-model="subLevel.selectAllStats[subLevel.currentName]")
                  v-list-item(@click="selectAllChange")
                    template(v-slot:default="{ active }")
                      v-list-item-action
                        v-checkbox(:input-value="active")
                      v-list-item-content
                        v-list-item-title 全选

                v-list-item-group(v-model="subLevel.select[subLevel.currentName]" multiple)
                  v-list-item(v-for="(item) in subLevel.subject[subLevel.currentName]")
                    template( v-slot:default="{ active }")
                      v-list-item-action
                        v-checkbox(:input-value="active")
                      v-list-item-content
                        v-list-item-title {{item}}
</template>

<script>
// 计算阈值
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'
import comment from '@/components/comment'
import _ from 'lodash'
import { basiCategorys, extendEchartsOpts, extendLineSeries } from '@/api/data'

const Graph = require('graphology')
import { connectedComponents } from 'graphology-components'

import { getDistanceCore, requestWrap } from '@/api/index'

const colorPool = ['#CCCCFF', '#99CC33', '#FF99CC', '#FFFFFF', '#339999', '#3399CC', '#CC6666', '#CCCC99', '#009966', '#CC0033',
  '#FFFFCC', '#9999CC', '#FFCCCC', '#FF6666', '#99CC66', '#FFFF00', '#99CC00', '#FF9900', '#0099CC', '#CC9933', '#CCFFFF', '#CCCC00', '#00FF00']

import { CSS2DObject, CSS2DRenderer } from '@/utils/three/CSS2DRenderer'

export default {
  name: 'WikiPlantGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'Wikipedia 相关度引力图',
      vertexSubjects: ['Biology', 'Physics', 'Mathematics', 'Political science'],
      BasicData: {},
      GraphData: {},
      levelType: {
        value: 2,
        option: [2, 3]
      },
      methodValue: 'linksin',
      methodOptions: ['linksin', 'linksout'],
      showText: false,
      camera: {
        status: false,
        intPid: 0
      },
      style: {
        fontSize: 18,
        fontTop: -10,
        fontLeft: -10
      },
      myChartIds: ['subjectChart1'],
      loading: false,
      linkFilter: 0.5,
      ct: 0,
      selectYear: 2020,
      Graph: null,
      camerAngle: 0,
      twoDRenderer: null,
      WIDTH: 0,
      HEIGHT: 0,

      dialog: {
        stats: false,
        pid: 0
      },
      topSelect: [],
      topSubject: basiCategorys,
      subLevel: {
        currentName: null,
        subject: {},
        select: {},
        selectAllStats: {}
      },
      currentSubject: {
        topSubject: [],
        allSubject: []
      },
      targetSubject: {
        topSubject: [],
        allSubject: []
      },
      subjectSizeDict: {}, // 学科大小
      colorMap: {},
      leveTree: {}
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
    this.initLevel()
    setTimeout(() => { this.activeSubLevel('Biology') }, 1000)
  },
  methods: {
    initLevel() {
      const opt = {
        'year': '2021'
      }
      requestWrap('wiki/getWikiLevel1CatTree', 'POST', opt).then(response => {
        console.log(response.data)
        this.leveTree = response.data
        this.topSubject = Object.keys(response.data).sort()
      })
    },
    // 将学科更新到表格
    changeSubject() {
      this.dialog.stats = false
      const topSelect = []
      const allSelect = []
      // 遍历一级学科
      for (const id of this.topSelect) {
        topSelect.push(this.topSubject[id])
        allSelect.push(this.topSubject[id])
      }
      // 遍历 二级学科
      for (const key of Object.keys(this.subLevel.select)) {
        for (const id of this.subLevel.select[key]) {
          // 只选择的二级学科
          if (topSelect.indexOf(key) === -1) {
            topSelect.push(key)
          }
          allSelect.push(this.subLevel.subject[key][id])
        }
      }

      if (this.dialog.pid === 0) {
        // 当前学科
        this.currentSubject.topSubject = topSelect
        this.currentSubject.allSubject = allSelect.slice(0, 5)
      } else {
        // 目标学科
        this.targetSubject.topSubject = topSelect
        this.targetSubject.allSubject = Array.from(new Set(allSelect))
      }
      // this.getData()

      this.Draw()
      // this.cleanSelect()
    },
    // 初始化原始值
    cleanSelect() {
      this.topSelect = []
      this.subLevel.select = {}
      this.subLevel.selectAllStats = {}
      this.activeSubLevel('Biology')
    },
    // 全选控制器
    selectAllChange() {
      const currentName = this.subLevel.currentName
      if (this.subLevel.selectAllStats[currentName] === 0) {
        // 全不选
        this.subLevel.select[currentName] = []
      } else {
        // 全选
        this.subLevel.select[currentName] = _.range(0, this.subLevel.subject[currentName].length, 1)
      }
    },
    // 激活二级学科菜单
    activeSubLevel(subjectValue) {
      this.selectAllStats = 1
      this.subLevel.currentName = subjectValue
      this.subLevel.subject[subjectValue] = this.leveTree[subjectValue]
    },
    async getData() {
      const opt = {
        method: this.methodValue,
        catlevel: 1,
        // level: 1,
        levelType: this.levelType.value,
        level: -1,
        btype: 'v5_xueshu_node_level1'
      }

      // 整合所有数据，这里有交叉学科，所以会有重复

      const allSunjectSet = new Set(this.currentSubject.allSubject.concat(this.targetSubject.allSubject))
      const deqLine = new Set()
      const allLine = []
      const currentYear = `${this.selectYear}`

      for (const currentTopSubject of this.currentSubject.topSubject) {
        for (const targetTopSubject of this.targetSubject.topSubject) {
          opt.strA = currentTopSubject
          opt.strB = targetTopSubject
          const response = await getDistanceCore(opt)
          for (const item of response.data) {
            if (allSunjectSet.has(item.catA) && allSunjectSet.has(item.catB) && currentYear === item.year) {
              const deqkey = item.catA + '_' + item.catB
              if (!deqLine.has(deqkey)) {
                allLine.push(item)
                deqLine.add(deqkey)
              }
            }
          }
        }
      }
      // 获得学科大小
      const allSubjectSet = new Set(this.currentSubject.topSubject.concat(this.currentSubject.allSubject).concat(this.targetSubject.topSubject).concat(this.targetSubject.allSubject))
      try {
        // 学科大小
        const opt = {
          level: 2,
          subjects: Array.from(allSubjectSet).join(','),
          version: 'v5_xueshu_level1',
          type: 0
        }
        const response = await requestWrap('wiki/getArticlesTotalByCoreNew_v', 'post', opt)
        console.log(response)
        this.subjectSizeDict = response
      } catch (error) {
        console.log(error)
      }

      console.log(this.subjectSizeDict)

      // console.log(allLine)
      const nodeArray = Array.from(allSunjectSet)
      const fObj = this.getSubjectFather()
      console.log(fObj)
      const colorPoolCopy = colorPool.concat()
      this.colorMap = {}
      const nodes = nodeArray.map((name, index) => {
        const fname = Array.from(fObj[name]).join('+')
        if (this.colorMap[fname] === undefined) {
          this.colorMap[fname] = colorPoolCopy.pop()
        }
        return {
          id: index,
          name: name,
          fname: fname,
          color: this.colorMap[fname]
        }
      })
      const links = allLine.map(item => {
        return {
          source: nodeArray.indexOf(item.catA),
          target: nodeArray.indexOf(item.catB),
          value: Number(item.distance)
        }
      })
      return { nodes: nodes, links: links }
    },
    // 生成学科父类对象
    getSubjectFather() {
      const retObj = {}
      console.log('this.subLevel.subject', this.subLevel.subject)
      for (const key in this.subLevel.subject) {
        console.log(key)
        retObj[key] = new Set([key])
        for (const item of this.subLevel.subject[key]) {
          if (retObj[item] === undefined) {
            retObj[item] = new Set()
          }
          retObj[item].add(key)
        }
      }
      console.log(retObj)
      return retObj
    },
    parseGraphData(nodes, links) {
      console.log(this.subjectSizeDict)
      const sizeMax = Math.pow(
        Math.max(..._.flattenDeep(nodes.map(item => this.subjectSizeDict?.[item]?.[String(this.selectYear) ?? 1]))), 1 / 3
      )
      const sizeMin = Math.pow(
        Math.min(..._.flattenDeep(nodes.map(item => this.subjectSizeDict?.[item]?.[String(this.selectYear)] ?? 1))), 1 / 3
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
          console.log('each', each)
          if (this.vertexSubjects.includes(each.name)) {
            const { fx, fy, fz } = vertuxArray.pop()
            return Object.assign(each, {
              id: each.id,
              name: each.name,
              fname: each.fname,
              value: ((5 * (Math.pow(Number(this.subjectSizeDict[each]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5),
              fx,
              fy,
              fz
            })
          } else {
            return Object.assign(each, {
              id: each.id,
              name: each.name,
              value: ((5 * (Math.pow(Number(this.subjectSizeDict[each]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.5)
            })
          }
        }),
        links: links
          .map(each => ({
            source: each.source,
            target: each.target,
            value: each.value
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

      const height = Math.floor(window.innerHeight * 1.2)
      const width = Math.floor(window.innerWidth) - 60
      const Graph = ForceGraph3D()(elem).width(width).height(height)
        .graphData(gData)
        .nodeResolution(5)
        .nodeVal('value')
        .nodeLabel('name')
        .nodeRelSize(4)
        .nodeAutoColorBy('fname')
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
      if (this.currentSubject.allSubject.length === 0 || this.targetSubject.allSubject.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true
      let { nodes, links } = await this.getData()
      // this.drawTable(nodes, links)
      this.GraphData = this.parseGraphData(nodes, links)

      links = this.GraphData.links.filter(x => x.value <= this.linkFilter)
      nodes = this.GraphData.nodes
      // this.echartDraw(nodes, links.concat())
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
      if (this.currentSubject.allSubject.length === 0 || this.targetSubject.allSubject.length === 0) {
        // this.$message.error("请选择完整");
        return false
      }
      this.loading = true
      let { links } = await this.getData()
      this.GraphData = this.parseGraphData(this.GraphData.nodes, links)
      links = this.GraphData.links.filter(x => x.value <= this.linkFilter)
      const nodes = this.GraphData.nodes

      console.log(nodes, links)
      // this.echartDraw(nodes, links.concat())
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
    // 变化阈值图
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

.v-btn--float {
    right: 20px;
    position: fixed;
    margin: 20px 40px 16px 16px;
    button {
      margin: 0 10px;
    }
}
</style>

