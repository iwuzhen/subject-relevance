<template>
  <v-main fluid>
    <v-row>
      <v-col>
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
        >
          <v-card-title>
            <aside>哑铃图，可以新增数据，修改数据权重，拖动调整顺序</aside>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="chartData"
              :loading="loading"
              item-key="id"
              :show-select="false"
              :disable-pagination="true"
              :hide-default-footer="true"
              class="page__table"
            >
              <template v-slot:body>
                <draggable
                  :list="chartData"
                  tag="tbody"
                >
                  <tr
                    v-for="(user, index) in chartData"
                    :key="index"
                  >
                    <td>
                      <v-icon
                        small
                        class="page__grab-icon"
                      >
                        mdi-arrow-all
                      </v-icon>
                    </td>
                    <td>
                      <v-text-field v-model="user.name" @input="testd3" />
                    </td>
                    <td>
                      <v-text-field v-model="user.value" :rules="[rules.number]" @input="testd3" /></td>
                    <td>      <v-icon
                      small
                      @click="deleteItem(user)"
                    >
                      mdi-delete
                    </v-icon></td>
                    <!-- <td>
              <v-icon
                small
                @click="editUser(user.id)"
              >
                mdi-pencil
              </v-icon>
            </td> -->
                  </tr>
                  <v-btn slot="footer" @click="AddRow">新增一行</v-btn>
                </draggable>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <v-col>
        <v-card
          id="d3svg"
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
        />
      </v-col>

      <v-spacer />
    </v-row>
  </v-main>
</template>

<script>
import * as d3 from 'd3'
import Chart from '@/utils/chart.js'
import Base from '@/utils/base'
import draggable from 'vuedraggable'

export default {
  name: 'MagFunnel',
  components: {
    draggable
  },
  extends: Base,
  data() {
    return {
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        number: value => !isNaN(Number(value)) || '必须输入数值'
      },
      tableHeaders: [{ text: '', sortable: false }, { text: 'name', value: 'name' }, { text: 'value', value: 'value' }, { text: '操作' }],
      pageName: '学科幂律哑铃图',
      loading: false,
      myChartIds: ['subjectChart'],
      chartData: [
        { value: 130, name: 'Politics' },
        { value: 100, name: 'Sociology' },
        { value: 70, name: 'Biology' },
        { value: 60, name: 'engineering' },
        { value: 40, name: 'Chemistry' },
        { value: 60, name: 'Physics' },
        { value: 80, name: 'Mathematics' }
      ].map(each => {
        this.$set(each, 'valueEdit', false)
        this.$set(each, 'nameEdit', false)
        return each
      })
    }
  },
  computed: {
  },
  watch: {
    chartData() {
      this.testd3()
    }
  },
  mounted() {
    // this.getData();
    this.testd3()
  },
  methods: {
    configEdit(value, flag) {
      // flag=false
      this.$set(value, flag, false)
    },
    deleteItem(item) {
      const index = this.chartData.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.chartData.splice(index, 1)
    },
    AddRow() {
      // console.log(this.chartData)
      this.chartData.push({ name: 'name', value: 100 })
    },
    testd3() {
      // const data = [49, 71, 78, 25, 36, 92];
      // const svg = d3
      //   .select(this.$el)
      //   .append("svg")
      //   .attr("width", 800)
      //   .attr("height", 470)
      //   .append("g")
      //   .attr("transform", "translate(0, 10)");
      // const x = d3.scaleLinear().range([0, 630]);
      // const y = d3.scaleLinear().range([280, 0]);
      // d3.axisLeft().scale(x);
      // d3.axisTop().scale(y);
      // x.domain(d3.extent(data, (d, i) => i));
      // y.domain([0, d3.max(data, d => d)]);
      // const createPath = d3
      //   .line()
      //   .x((d, i) => x(i))
      //   .y(d => y(d));

      // svg.append("path").attr("d", createPath(data));

      // 锐角
      // let FunnelData = data.map((d, i, array) => {
      //   if (i !== array.length - 1) {
      //     d.nextVal = array[i + 1].value;
      //   } else {
      //     d.nextVal = 100;
      //   }
      //   return d;
      // });

      // 矩形
      const FunnelData = this.chartData.map((d, i, array) => {
        if (i !== array.length - 1) {
          d.nextVal = array[i].value
        } else {
          d.nextVal = array[i].value
        }
        return d
      })

      d3.select('#d3svg > div').remove()
      const chart = new Chart()
      const config = {
        margins: { top: 80, left: 80, bottom: 50, right: 80 },
        textColor: 'black',
        title: 'Funnel',
        animateDuration: 1000,
        trapezoidPadding: 3,
        hoverColor: 'white'
      }

      chart.margins(config.margins)
      chart.renderTrapezoid = function() {
        const trapezoids = chart
          .body()
          .append('g')
          .attr('class', 'traps')
          .attr('transform', 'translate(' + chart.getBodyWidth() / 2 + ',0)')
          .selectAll('.trap')
          .data(FunnelData)

        trapezoids
          .enter()
          .append('polygon')
          .attr('class', (d, i) => 'trap + trap-' + i)
          .merge(trapezoids)
          .attr('points', d =>
            getPoints(
              chart.scale(d.value),
              chart.scale(d.nextVal),
              trapezoidsHeight
            )
          )
          .attr(
            'transform',
            (d, i) =>
              'translate(0,' +
              i * (config.trapezoidPadding + trapezoidsHeight) +
              ')'
          )
          .attr('fill', (d, i) => chart._colors(i))

        trapezoids.exit().remove()

        // 计算梯形的点坐标
        function getPoints(topWidth, bottomWidth, height) {
          const points = []

          points.push(-topWidth / 2 + ',' + 0)
          points.push(topWidth / 2 + ',' + 0)

          console.log(topWidth, bottomWidth, height)
          if (bottomWidth === 0) {
            points.push(0 + ',' + height)
          } else {
            points.push(bottomWidth / 2 + ',' + height)
            points.push(-bottomWidth / 2 + ',' + height)
          }

          return points.join(' ')
        }
      }

      /* ----------------------------渲染文本标签------------------------  */
      chart.renderText = function() {
        const texts = d3
          .select('.traps')
          .selectAll('.label')
          .data(FunnelData)

        texts
          .enter()
          .append('text')
          .attr('class', 'label')
          .merge(texts)
          .text(d => d.name)
          .attr('text-anchor', 'middle')
          .attr('x', 0)
          .attr(
            'y',
            (d, i) =>
              i * (config.trapezoidPadding + trapezoidsHeight) +
              trapezoidsHeight / 2 + 5
          )
          .attr('stroke', config.textColor)

        texts.exit().remove()
      }

      /* ----------------------------渲染图标题------------------------  */
      chart.renderTitle = function() {
        chart
          .svg()
          .append('text')
          .classed('title', true)
          .attr('x', chart.width() / 2)
          .attr('y', 0)
          .attr('dy', '2em')
          .text(config.title)
          .attr('fill', config.textColor)
          .attr('text-anchor', 'middle')
          .attr('stroke', config.textColor)
      }

      /* ----------------------------绑定鼠标交互事件------------------------  */
      chart.addMouseOn = function() {
        d3.selectAll('.trap')
          .on('mouseover', function() {
            const e = d3.event

            d3.select(e.target).attr('fill', config.hoverColor)
          })
          .on('mouseleave', function(d, i) {
            const e = d3.event

            d3.select(e.target).attr('fill', chart._colors(i))
          })
      }

      const trapezoidsHeight =
        (chart.getBodyHeight() - config.trapezoidPadding * (this.chartData.length - 1)) /
        this.chartData.length
      /* ----------------------------尺度转换------------------------  */
      chart.scale = d3
        .scaleLinear()
        .domain([0, d3.max(this.chartData, d => d.value)])
        .range([0, chart.getBodyWidth() * 0.8])
      chart.box(
        d3
          .select('#d3svg')
          .append('div')
          .attr('class', 'box')
      )
      chart.render = function() {
        chart.renderTitle()

        chart.renderTrapezoid()

        chart.renderText()

        chart.addMouseOn()
      }

      chart.renderChart()
    },
    getData() {
      // 过滤节点
      this.drawGraph(this.myChart, 'Mag 幂律 哑铃图')
    },
    drawGraph(chart, title) {
      const options = this.setOptions(title)
      chart.setOption(options, true)
    },

    setOptions(title) {
      const data = [
        { value: 120, name: '政治' },
        { value: 100, name: '社会' },
        { value: 60, name: '生物&工程' },
        { value: 40, name: '化学' },
        { value: 80, name: '物理' },
        { value: 100, name: '数学' }
      ]
      const _opt = {
        title: {
          text: title
        },
        legend: [
          {
            data: data.map(each => each.name)
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },

        series: [
          {
            sort: 'none',
            name: '漏斗图',
            type: 'funnel',
            width: '50%',
            gap: 4,
            left: 'center',
            // height: "45%",
            // left: "5%",
            // top: "50%",
            data: data
          }
        ]
      }
      return _opt
    }
  }
}
</script>

<style lang="less">
svg {
  margin: 25px;
  path {
    fill: none;
    stroke: #76bf8a;
    stroke-width: 3px;
  }
}
</style>
