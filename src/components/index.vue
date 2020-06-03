<template>
  <v-container>
    <div v-for="(items, name) in indexObject" :key="name" class="mb-5">
      <v-row>
        <h1>{{ name }}</h1>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          md="3"
          lg="2"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-hover v-slot:default="{ hover }" close-delay="200">
            <v-card
              class="mx-auto"
              max-width="344"
              :elevation="hover ? 16 : 2"
              min-height="150"
              :to="item.to"
              :href="item.href"
              ><v-card-title>{{ item.title }}</v-card-title
              ><v-card-text>{{ item.text }}</v-card-text
              ><v-card-actions></v-card-actions
            ></v-card>
          </v-hover>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.commit("changeCurentPath", null);
  },
  data() {
    return {
      indexObject: {
        统计数据: [
          {
            title: "Tree Viewer",
            text: "WIKI 分类文章层次浏览",
            to: "/WikiTree"
          },
          {
            title: "Britannica Tree",
            text: "大英百科全书分类层次浏览",
            to: "/BritannicaTree"
          },
          {
            title: "wiki子类半衰期",
            text: "2007年的N层子类，经过x年，其子类有一半改变了",
            to: "/BanShuaiQi"
          },
          {
            title: "wiki top500文章",
            text: "各学科top500文章展示,数值表示该篇文章的ArticleLinksin",
            to: "/TopArticles"
          },
          {
            title: "访问量&编辑量",
            text: "WIKI 访问量&编辑量",
            to: "/viewandedits"
          },
          {
            title: "Core WIKI 文章数",
            text: "Core WIKI 文章数查询",
            to: "/CoreArticlesTotal"
          },
          {
            title: "Core WIKI 文章数 v2",
            text: "5月22日方法论，Core WIKI 文章数查询",
            to: "/CoreArticlesTotalV2"
          },
          {
            title: "Core WIKI 文章数 v3",
            text: "儿童节方法论，Core WIKI 文章数查询",
            to: "/CoreArticlesTotalNew_v3"
          },
          {
            title: "WIKI 文章数",
            text: "WIKI 文章数查询",
            to: "/ArticlesTotal"
          },
          {
            title: "MAG 文章数",
            text: "MAG 文章数查询",
            to: "/MasArticlesTotal"
          },
          {
            title: "Wiki 类引用详情",
            text: "Wiki Core 类之间类引用详情",
            to: "/CoreLinks"
          },
          {
            title: "WIKI 分类层次",
            text: "WIKI 分类层次查询",
            href: "http://wikidb.lambdax.cn:10080/wikidb_web/first.jsp"
          }
        ],
        "Core 学科相关度": [
          {
            title: "WIKI Core",
            text: "各 Core 学科的逐年相关度",
            to: "/DisciplineCore"
          }
        ],
        学科相关度: [
          {
            title: "People in WIKI",
            text: "人和人，学科的相关度",
            to: "/disciplinePeople"
          },
          {
            title: "WIKI",
            text: "各学科的逐年相关度",
            to: "/discipline"
          },
          { title: "MAG", text: "MAG 中各学科的逐年相关度", to: "/masline" },
          {
            title: "小世界有向图",
            text: "小世界有向网络学科间趋势",
            to: "/SmallWorldDirected"
          },
          {
            title: "WIKI 单学科",
            text: "Cognitive science 和其他学科的逐年相关度",
            to: "/SubDiscipline"
          }
        ],
        "Core 幂律": [
          {
            title: "Core Zipf 幂律斜率",
            text: "Core 逐年幂律图，及其斜率曲线",
            to: "/CoreZipfByNodes"
          },
          {
            title: "MAG 幂律",
            text: "MAG 幂律",
            to: "/MagZipf"
          },
          {
            title: "MAG 小世界幂律",
            text: "MAG 小世界幂律",
            to: "/MagInnerZipf"
          }
        ],
        幂率: [
          {
            title: "Zipf 幂律(世界)斜率 (人)",
            text: "people 计算出的世界逐年幂律图",
            to: "/PeopleZipfByNodes"
          },
          {
            title: "Zipf 幂律(小世界) (人)",
            text: "people 计算出的小世界逐年幂律图",
            to: "/PeopleInnerZipfByNodes"
          },
          {
            title: "Zipf 幂律(世界)",
            text: "逐年幂律图",
            to: "/powerlaw"
          },
          {
            title: "Zipf 幂律(小世界)斜率",
            text: "逐年幂律图，及其斜率曲线",
            to: "/ZipfByNodes"
          },
          {
            title: "幂律度分布",
            text: "幂律度分布",
            to: "/DegreeDistribution"
          },
          {
            title: "PageRank幂律",
            text: "PageRank幂律",
            to: "/powerLawPageRank"
          }
        ],
        "Core 小世界": [
          {
            title: "规模趋势",
            text: "小世界 Core 规模趋势",
            to: "/CoreSWUndirectLimit"
          },
          {
            title: "逐年趋势",
            text: "小世界 Core 逐年趋势",
            to: "/CoreSMUndirected"
          }
        ],
        小世界: [
          {
            title: "规模趋势",
            text: "小世界",
            to: "/SmallWorldUndirectedLimit"
          },
          {
            title: "逐年趋势",
            text: "小世界",
            to: "/SmallWorldUndirected"
          }
        ]
      }
    };
  }
};
</script>

<style lang="less"></style>
