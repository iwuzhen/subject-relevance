<template lang="pug">
v-container(fluid='')
  v-row
    v-col(cols='4')
      v-select(v-model='vertexSubjects' :items='subjectOpt' chips='' multiple='' deletable-chips='' clearable='' dense='' label='定点学科' @change='Draw')

    v-col(cols='12')
      v-select(v-model='subjectRelevances' :items='categorys' chips='' multiple='' deletable-chips='' clearable='' dense='' label='目标学科' @change='Draw')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-card-title
          | MAG 2016 linksin 测试 3D 引力图
        v-container#3d-graph(fluid='' fill-height='')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart1(fluid='' fill-height='')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart2(fluid='' fill-height='')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart3(fluid='' fill-height='')
  v-row
    v-col(col='12')
      v-card.mx-auto(outlined='' :loading='loading' height='70vh')
        v-container#subjectChart4(fluid='' fill-height='')
  v-row
    v-col
      comment(storagekey='Mag_graph_2019v2_Chart_1')

</template>

<script>
import { MAGCoreCategorys2020, SELECT_MAG_DATA } from '@/api/data'
import Base from '@/utils/base'
import ForceGraph3D from '3d-force-graph'
import comment from '@/components/comment'
import _ from 'lodash'

import { getMasDatav2, requestWrap } from '@/api/index'
// import anime from 'animejs/lib/anime.es.js'

// import { defaultCategorySelect } from '@/api/data'

export default {
  name: 'MagGraph',
  components: {
    comment
  },
  extends: Base,
  data() {
    return {
      pageName: 'Mag 相关度引力图',
      vertexSubjects: ['Biology', 'Physics', 'Mathematics', 'Political science'],
      subjectOpt: MAGCoreCategorys2020,
      subjectRelevances: SELECT_MAG_DATA,

      categorys: MAGCoreCategorys2020,
      myChartIds: ['subjectChart1', 'subjectChart2', 'subjectChart3', 'subjectChart4'],
      loading: false
    }
  },
  mounted() {
    this.getData()
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
        const strA = allData.pop()
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
    async draw3DForceGraph(nodes, links, yindex) {
      const sizeMax = Math.pow(
        Math.max(...nodes.map(each => _.flattenDeep(each.weight))), 1 / 3
      )
      const sizeMin = Math.pow(
        Math.min(...nodes.map(each => _.flattenDeep(each.weight))), 1 / 3
      )

      const vertuxArray = []
      if (this.vertexSubjects.length <= 3) {
        vertuxArray.push({ fx: 100, fy: 0, fz: 0 }, { fx: 0, fy: 100, fz: 0 }, { fx: 0, fy: 0, fz: 100 })
      } else if (this.vertexSubjects.length === 4) {
        vertuxArray.push({ fx: 100, fy: 100, fz: 0 }, { fx: 0, fy: 100, fz: 100 }, { fx: 100, fy: 0, fz: 100 }, { fx: 0, fy: 0, fz: 0 })
      }

      const gData = {
        nodes: nodes.map(each => {
          if (this.vertexSubjects.includes(each.label)) {
            const { fx, fy, fz } = vertuxArray.pop()

            return {
              id: each.id,
              name: each.label,
              value: (2 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.05,
              fx,
              fy,
              fz
            }
          } else {
            return {
              id: each.id,
              name: each.label,
              value: (2 * (Math.pow(Number(each.weight[yindex]), 1 / 3) - sizeMin)) / (sizeMax - sizeMin) + 0.05
            }
          }
        }),
        links: links
          .map(each => ({
            source: each.source,
            target: each.target,
            value: Number(each.weight[yindex])
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
        })
      Graph
        .d3Force('link')
        .strength(link => { return link.value })
    },
    async Draw() {
      const { nodes, links } = await this.getData()
      this.draw3DForceGraph(nodes, links, 1)
      // var dd = {
      //   'lambda': 0
      // }
      // var animation = anime({
      //   targets: dd,
      //   lambda: 1,
      //   easing: 'easeInOutCubic',
      //   duration: 750,
      //   autoplay: false,
      //   update: function() {
      //     // update node positions: note we use fx, fy and fz, not dx, dy and dz!
      //     nodes.forEach((d, i) => {
      //       d.fx = (1 - dd.lambda) * start[i].x + dd.lambda * end[i].x
      //       d.fy = (1 - dd.lambda) * start[i].y + dd.lambda * end[i].y
      //       d.fz = (1 - dd.lambda) * start[i].z + dd.lambda * end[i].z
      //     })
      //   }
      // })
    }

  }
}
</script>
