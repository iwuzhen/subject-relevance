<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="peopleSubjectSelect"
          :items="defaultPeopleSubjectOpt"
          @change="getData"
          label="当前人"
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-select
          v-model="targetSubjectSelect"
          :items="subjectOpt"
          @change="targetSubjectChange"
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
          @change="targetPeopleSubjectChange"
          chips
          multiple
          dense
          clearable
          label="目标人"
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
      targetSubjectSelect: [],
      targetPeopleSubjectSelect: [],
      methodSelect: "linksin",
      levelSelect: "1000",
      defaultPeopleSubjectOpt: peopleCategorys.map(item => {
        return {
          value: item[0],
          text: item[1]
        };
      }),
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
    unionCategory: function() {
      let peopleCategoryValues = new Set(
        peopleCategorys.map(item => {
          return item[0];
        })
      );
      return new Set(this.subjectOpt.filter(x => peopleCategoryValues.has(x)));
    },
    peopleSubjectOpt: function() {
      let peopleSubjectSelect = this.peopleSubjectSelect;
      return peopleCategorys.map(item => {
        let ret = {
          value: item[0],
          text: item[1]
        };
        if (item[0] == peopleSubjectSelect) ret["disabled"] = true;
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
    async targetSubjectChange() {
      // 学科和人关联
      let newTargetPeopleSubjectSelect = new Set();
      for (let subject of this.targetSubjectSelect) {
        if (this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject);
        }
      }
      for (let subject of this.targetPeopleSubjectSelect) {
        if (!this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject);
        }
      }
      this.targetPeopleSubjectSelect = Array.from(newTargetPeopleSubjectSelect);
      this.getData();
    },
    async targetPeopleSubjectChange() {
      let newTargetPeopleSubjectSelect = new Set();
      for (let subject of this.targetPeopleSubjectSelect) {
        if (this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject);
        }
      }
      for (let subject of this.targetSubjectSelect) {
        if (!this.unionCategory.has(subject)) {
          newTargetPeopleSubjectSelect.add(subject);
        }
      }
      this.targetSubjectSelect = Array.from(newTargetPeopleSubjectSelect);
      this.getData();
    },
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
