<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="peopleSubjectSelect"
          :items="defaultPeopleSubjectOpt"
          @change="getData"
          label="当前人的学科"
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="targetSubjectSelect"
          :items="subjectOpt"
          @change="getData"
          chips
          multiple
          dense
          clearable
          label="目标学科"
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="targetPeopleSubjectSelect"
          :items="peopleSubjectOpt"
          @change="getData"
          chips
          multiple
          dense
          clearable
          label="目标人的学科"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="methodSelect"
          :items="methodOpt"
          @change="getData"
          dense
          label="条件"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="levelSelect"
          :items="levelOpt"
          @change="getData"
          dense
          label="level"
        ></v-select>
      </v-col>
      <!-- <v-col align-self="center" cols="2">
        <v-btn
          color="light-blue lighten-2"
          dark
          small
          @click.stop="dialog = true"
        >
          <v-icon>mdi-help-circle</v-icon>
          参数
        </v-btn>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="70vh"
          id="subjectChart"
        >
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          参数说明
        </v-card-title>

        <v-card-text>
          <p>
            <b>目标学科</b>： <br />wikipedia 中的学科。<br />
            <b>参数</b>：
            <br />小世界网络指标有两个指标，平均路径长度，集聚系数。<br />
            网络总点数，网络连接边数。<br />
            <b>数据源</b>： <br />按 wikipedia category 计算出的前
            2000,2500,3000个节点的组成的网络。<br />
            按 google 距离计算出的前 2000,2500,3000个节点的组成的网络。<br />
            Wikipedia 全部的 2 层类下的文章组成的网络。<br />
            Wikipedia 全部的 3 层类下的文章组成的网络。<br />
            Mas 学科下的论文的组成的网络。
          </p>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getDistanceByPeopleAndCats, getDistanceByPeoples } from "@/api/index";
export default {
  name: "wiki_人的相关度",
  data() {
    return {
      peopleSubjectSelect: "",
      targetSubjectSelect: "",
      targetPeopleSubjectSelect: "",
      methodSelect: "linksin",
      levelSelect: "1000",
      defaultPeopleSubjectOpt: [
        "Anthropology",
        "Artificial intelligence",
        "Biology",
        "Chemical engineering",
        "Chemistry",
        "Civil engineering",
        "Cognitive science",
        "Computer science",
        "Economics",
        "Electrical engineering",
        "Environmental engineering",
        "History",
        "Industrial engineering",
        "Linguistics",
        "logic",
        "Machine learning",
        "Mathematics",
        "Mechanical engineering",
        "Neuroscience",
        "Philosophy",
        "Physics",
        "Political science",
        "Psychology",
        "Sociology"
      ],
      subjectOpt: [
        "Logic",
        "Philosophy",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Sociology",
        "Economics",
        "Medicine",
        "Political science",
        "Psychology",
        "Linguistics",
        "History",
        "Computer science",
        "Artificial intelligence",
        "Engineering disciplines",
        "Chemical engineering",
        "Civil engineering",
        "Electrical engineering",
        "Mechanical engineering",
        "Biological engineering",
        "Computer engineering",
        "Industrial engineering",
        "Environmental engineering"
      ],
      methodOpt: ["linksin"],
      levelOpt: [
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
        }
      ],
      dialog: false,
      loading: false
    };
  },
  computed: {
    peopleSubjectOpt: function() {
      let peopleSubjectSelect = this.peopleSubjectSelect;
      return this.defaultPeopleSubjectOpt.map(item => {
        let ret = {
          value: item,
          text: item
        };
        if (item == peopleSubjectSelect) ret["disabled"] = true;

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
      if (
        !this.peopleSubjectSelect ||
        (this.targetSubjectSelect.length === 0 &&
          this.targetPeopleSubjectSelect.length === 0)
      ) {
        return false;
      }
      let chartData;
      this.loading = true;
      if (this.targetSubjectSelect.length > 0) {
        let opt = {
          strA: this.peopleSubjectSelect,
          strB: this.targetSubjectSelect.join(","),
          method: this.methodSelect,
          level: this.levelSelect
        };
        let response = await getDistanceByPeopleAndCats(opt);
        if (response.data.data) {
          chartData = response.data.data;
        } else {
          this.$emit("emitMesage", "请求失败");
        }
      }
      if (this.targetPeopleSubjectSelect.length > 0) {
        let peopleSubjectSelect = this.peopleSubjectSelect;
        let opt = {
          strA: this.peopleSubjectSelect,
          strB: this.targetPeopleSubjectSelect
            .filter(item => {
              if (item == peopleSubjectSelect) {
                return false;
              }
              return true;
            })
            .join(","),
          method: this.methodSelect,
          level: this.levelSelect
        };
        let response = await getDistanceByPeoples(opt);
        if (response.data.data) {
          if (!chartData) {
            chartData = response.data.data;
          } else {
            chartData.legend.push(
              ...response.data.data.legend.map(item => {
                return item + "(人)";
              })
            );
            chartData.y.push(...response.data.data.y);
          }
        } else {
          this.$emit("emitMesage", "请求失败");
        }
      }

      this.drawChart(chartData);
      this.loading = false;
    },
    drawChart(data) {
      let options = this.setOptions(data);
      this.myChart.setOption(options, true);
      this.loading = false;
    },
    setOptions(data) {
      let _opt = {
        title: {
          text: data.title,
          left: "10%"
        },
        tooltip: {
          trigger: "axis",
          textStyle: {
            align: "left"
          },
          axisPointer: {
            type: "cross",
            animation: true,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              return y.data - x.data;
            });
            let showHtm = ` ${params[0].name}<br>`;
            for (let i = 0; i < params.length; i++) {
              let _text = params[i].seriesName;
              let _data = params[i].data.toFixed(6);
              let _marker = params[i].marker;
              showHtm += `${_marker}${_text}：${_data}<br>`;
            }
            return showHtm;
          }
        },
        legend: {
          data: data.legend,
          right: "3%",
          orient: "vertical",
          top: "35%",
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: "8%",
          right: "20%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          right: "20%",
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          type: "value",
          max: 1
        },
        series: data.y.map((item, index) => {
          return {
            name: data.legend[index],
            type: "line",
            smooth: false,
            data: item
          };
        })
      };
      return _opt;
    },
    subjectChange() {
      this.subjectRelevances = [];
    },
    selectChange() {
      this.getData();
    }
  }
};
</script>
