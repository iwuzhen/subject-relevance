<template>
  <v-main fluid>
    <v-row>
      <v-col col="12">
        <v-card
          v-if="false"
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="d3svg"
        >
        </v-card>
      </v-col>

      <v-spacer></v-spacer>
    </v-row>
  </v-main>
</template>

<script>
import * as d3 from "d3";
import Chart from "@/utils/chart.js";
import Base from '@/utils/base'

let data = [
  { value: 130, name: "政治" },
  { value: 100, name: "社会" },
  { value: 70, name: "生物&工程" },
  { value: 40, name: "化学" },
  { value: 60, name: "物理" },
  { value: 80, name: "数学" }
];

export default {
  name: "Mag_funnel",
  extends: Base,
  data() {
    return {
      pageName: "学科幂律哑铃图",
      loading: false,
      myChartIds: ["subjectChart"]
    };
  },
  computed: {
  },
  mounted() {
    // this.getData();
    this.testd3();
  },
  methods: {
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

      let FunnelData = data.map((d, i, array) => {
        if (i !== array.length - 1) {
          d.nextVal = array[i + 1].value;
        } else {
          d.nextVal = 100;
        }
        return d;
      });

      console.log(FunnelData);

      const chart = new Chart();
      const config = {
        margins: { top: 80, left: 80, bottom: 50, right: 80 },
        textColor: "black",
        title: "哑铃图",
        animateDuration: 1000,
        trapezoidPadding: 3,
        hoverColor: "white"
      };

      chart.margins(config.margins);
      chart.renderTrapezoid = function () {
        let trapezoids = chart
          .body()
          .append("g")
          .attr("class", "traps")
          .attr("transform", "translate(" + chart.getBodyWidth() / 2 + ",0)")
          .selectAll(".trap")
          .data(FunnelData);

        trapezoids
          .enter()
          .append("polygon")
          .attr("class", (d, i) => "trap + trap-" + i)
          .merge(trapezoids)
          .attr("points", d =>
            getPoints(
              chart.scale(d.value),
              chart.scale(d.nextVal),
              trapezoidsHeight
            )
          )
          .attr(
            "transform",
            (d, i) =>
              "translate(0," +
              i * (config.trapezoidPadding + trapezoidsHeight) +
              ")"
          )
          .attr("fill", (d, i) => chart._colors(i));

        trapezoids.exit().remove();

        //计算梯形的点坐标
        function getPoints(topWidth, bottomWidth, height) {
          const points = [];

          points.push(-topWidth / 2 + "," + 0);
          points.push(topWidth / 2 + "," + 0);

          console.log(topWidth, bottomWidth, height);
          if (bottomWidth === 0) {
            points.push(0 + "," + height);
          } else {
            points.push(bottomWidth / 2 + "," + height);
            points.push(-bottomWidth / 2 + "," + height);
          }

          return points.join(" ");
        }
      };

      /* ----------------------------渲染文本标签------------------------  */
      chart.renderText = function () {
        let texts = d3
          .select(".traps")
          .selectAll(".label")
          .data(FunnelData);

        texts
          .enter()
          .append("text")
          .attr("class", "label")
          .merge(texts)
          .text(d => d.name)
          .attr("text-anchor", "middle")
          .attr("x", 0)
          .attr(
            "y",
            (d, i) =>
              i * (config.trapezoidPadding + trapezoidsHeight) +
              trapezoidsHeight / 2
          )
          .attr("stroke", config.textColor);

        texts.exit().remove();
      };

      /* ----------------------------渲染图标题------------------------  */
      chart.renderTitle = function () {
        chart
          .svg()
          .append("text")
          .classed("title", true)
          .attr("x", chart.width() / 2)
          .attr("y", 0)
          .attr("dy", "2em")
          .text(config.title)
          .attr("fill", config.textColor)
          .attr("text-anchor", "middle")
          .attr("stroke", config.textColor);
      };

      /* ----------------------------绑定鼠标交互事件------------------------  */
      chart.addMouseOn = function () {
        d3.selectAll(".trap")
          .on("mouseover", function () {
            const e = d3.event;

            d3.select(e.target).attr("fill", config.hoverColor);
          })
          .on("mouseleave", function (d, i) {
            const e = d3.event;

            d3.select(e.target).attr("fill", chart._colors(i));
          });
      };

      const trapezoidsHeight =
        (chart.getBodyHeight() - config.trapezoidPadding * (data.length - 1)) /
        data.length;
      /* ----------------------------尺度转换------------------------  */
      chart.scale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, chart.getBodyWidth() * 0.8]);
      chart.box(
        d3
          .select("#d3svg")
          .append("div")
          .attr("class", "box")
      );
      chart.render = function () {
        chart.renderTitle();

        chart.renderTrapezoid();

        chart.renderText();

        chart.addMouseOn();
      };

      chart.renderChart();
    },
    getData() {
      // 过滤节点
      this.drawGraph(this.myChart, "Mag 幂律 哑铃图");
    },
    drawGraph(chart, title) {
      let options = this.setOptions(title);
      chart.setOption(options, true);
    },

    setOptions(title) {
      let data = [
        { value: 120, name: "政治" },
        { value: 100, name: "社会" },
        { value: 60, name: "生物&工程" },
        { value: 40, name: "化学" },
        { value: 80, name: "物理" },
        { value: 100, name: "数学" }
      ];
      let _opt = {
        title: {
          text: title
        },
        legend: [
          {
            data: data.map(each => each.name)
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%"
        },

        series: [
          {
            sort: "none",
            name: "漏斗图",
            type: "funnel",
            width: "50%",
            gap: 4,
            left: "center",
            // height: "45%",
            // left: "5%",
            // top: "50%",
            data: data
          }
        ]
      };
      return _opt;
    }
  }
};
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
