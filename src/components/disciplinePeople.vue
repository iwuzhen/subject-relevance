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
          @change="getSubjectDegree"
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
          @change="getPeopleDegree"
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
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card
          class="mx-auto"
          outlined
          :loading="loading"
          height="45vh"
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
          height="45vh"
          id="subjectChart2"
        >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getDistanceByPeopleAndCats, getDistanceByPeoples } from "@/api/index";
import { peopleCategorys, extendEchartsOpts, lessCategorys } from "@/api/data";
export default {
  name: "wiki_人的相关度",
  data() {
    return {
      peopleSubjectSelect: "",
      targetSubjectSelect: "",
      targetPeopleSubjectSelect: "",
      methodSelect: "linksin",
      levelSelect: "1000",
      defaultPeopleSubjectOpt: peopleCategorys,
      subjectOpt: lessCategorys,
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
    myChart1: function() {
      return this.$echarts.init(document.getElementById("subjectChart1"));
    },
    myChart2: function() {
      return this.$echarts.init(document.getElementById("subjectChart2"));
    }
  },
  mounted() {
    window.onresize = () => {
      this.myChart1.resize();
      this.myChart2.resize();
    };
    this.$store.commit("changeCurentPath", this.$options.name);
  },
  methods: {
    async getSubjectDegree() {
      if (!this.peopleSubjectSelect || this.targetSubjectSelect.length === 0) {
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
        let retData = await getDistanceByPeopleAndCats(opt);
        if (retData.data) {
          chartData = retData.data;
        } else {
          this.$emit("emitMesage", "请求失败");
        }
      }
      let options = this.setOptions(chartData);
      this.myChart1.setOption(options, true);
      this.loading = false;
    },
    async getPeopleDegree() {
      if (
        !this.peopleSubjectSelect ||
        this.targetPeopleSubjectSelect.length === 0
      ) {
        return false;
      }
      let chartData;
      this.loading = true;

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
        let retData = await getDistanceByPeoples(opt);
        if (retData.data) {
          chartData = retData.data;
        } else {
          this.$emit("emitMesage", "请求失败");
        }
      }

      let options = this.setOptions(chartData);
      this.myChart2.setOption(options, true);
      this.loading = false;
    },
    async getData() {
      this.getSubjectDegree();
      this.getPeopleDegree();
    },

    setOptions(data) {
      let _opt = extendEchartsOpts({
        title: {
          text: data.title,
          left: "35%"
        },
        legend: {
          data: data.legend
        },
        xAxis: {
          name: "Year",
          type: "category",
          boundaryGap: false,
          data: data.x
        },
        yAxis: {
          name: "Correlation degree",
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
      });
      return _opt;
    }
  }
};
</script>
