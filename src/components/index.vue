<template>
  <v-container>
    <v-navigation-drawer right fixed app>
      <v-list dense nav>
        <v-list-item two-line> </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="obj in hrefArray" :key="obj.name">
          <a @click="scrollMeTo(obj.href)"
            ><v-list-item-title v-text="obj.name"></v-list-item-title
          ></a>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <div>
          <div
            v-for="(subitems, h1name) in indexObject"
            :key="h1name"
            class="mb-5"
          >
            <v-row>
              <a :ref="h1name"
                ><h1>{{ h1name }}</h1></a
              >
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>

            <div v-for="(items, name) in subitems" :key="name" class="mb-5">
              <v-row
                ><a :ref="name"
                  ><h3>{{ name }}</h3></a
                >
              </v-row>
              <v-row>
                <v-divider></v-divider>
              </v-row>
              <v-row>
                <v-col
                  cols="6"
                  md="4"
                  lg="3"
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
          </div>
        </div>
      </v-container>
    </v-main>
  </v-container>
</template>

<script>
export default {
  name: "index",
  mounted() {
    this.$store.commit("changeCurentPath", null);
  },
  data() {
    return {
      indexObject: {
        MAG: {
          "MAG- 统计数据": [
            {
              title: "MAG 作者文章数",
              text: "MAG 作者文章数 统计",
              to: "/MagAAAInfo"
            },
            {
              title: "MAG 文章数",
              text: "MAG 文章数查询",
              to: "/MasArticlesTotal"
            },
            {
              title: "MAG 学科自恋度",
              text: "MAG 学科自恋度",
              to: "/MagRefSelfRate"
            }
          ],
          "MAG- 幂律": [
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
          "MAG- 学科相关度": [
            {
              title: "MAG学科相关度",
              text: "MAG 中各学科的逐年相关度",
              to: "/masline"
            }
          ],
          "MAG- 小世界": [
            // {
            //   title: "MAG 小世界 v1",
            //   text:
            //     "MAG 逐年趋势:后一年包含前一年的所有范围。  规模趋势:按照排名增大的网络折线图和按照实际规模增大的网络折线图.(此版本只是用2020排名计算)",
            //   to: { path: "MagDirectNet", query: { version: "v1" } }
            // },
            {
              title: "MAG 小世界 v2",
              text:
                "MAG 逐年趋势:后一年包含前一年的所有范围。  规模趋势:按照排名增大的网络折线图和按照实际规模增大的网络折线图。(此版本各年份分别计算排名计算)",
              to: { path: "MagDirectNet", query: { version: "v2" } }
            },
            {
              title: "MAG 小世界 v3",
              text:
                "MAG 逐年趋势:可以选择5，10，15，20年的范围内的学科内论文，计算出的小世界。 ",
              to: { path: "MagDirectNetV3", query: { version: "v3" } }
            }
          ]
        },
        Wikipedia: {
          "Wikipedia- 统计数据": [
            {
              title: "Tree Viewer",
              text: "WIKI 分类文章层次浏览",
              to: "/WikiTree"
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
              title: "WIKI 文章数",
              text: "WIKI 文章数查询",
              to: "/ArticlesTotal"
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
          "Wikipedia- Core 学科相关度": [
            {
              title: "WIKI Core V1",
              text: "各 Core 学科的逐年相关度",
              to: { path: "DisciplineCore", query: { version: "v1" } }
            },
            {
              title: "WIKI Core V2",
              text: "各 Core V2 学科的逐年相关度",
              to: { path: "DisciplineCore", query: { version: "v2" } }
            },
            {
              title: "WIKI Core V3",
              text: "各 Core V3 学科的逐年相关度",
              to: { path: "DisciplineCore", query: { version: "v3" } }
            }
          ],
          "Wikipedia- Core 幂律": [
            {
              title: "Core V1 Zipf 幂律斜率",
              text: "Core 逐年幂律图，及其斜率曲线",
              to: { path: "CoreZipfByNodes", query: { version: "v1" } }
            },
            {
              title: "Core V2 Zipf 幂律斜率",
              text: "Core V2 逐年幂律图，及其斜率曲线",
              to: { path: "CoreZipfByNodes", query: { version: "v2" } }
            },
            {
              title: "Core V3 Zipf 幂律斜率",
              text: "Core V3 逐年幂律图，及其斜率曲线",
              to: { path: "CoreZipfByNodes", query: { version: "v3" } }
            }
          ],
          "Wikipedia- Core 文章数": [
            {
              title: "Core WIKI 文章数 v1",
              text:
                "有core类只计算core类，无core类只计算非core类，都取N层，未添加黑名单",
              to: "/CoreArticlesTotal"
            },
            {
              title: "Core WIKI 文章数 v1 Plus",
              text:
                "有core类只计算core类，无core类只计算非core类，都取N层，添加黑名单(Sociology,Biology,Economics)",
              to: "/CoreArticlesTotalV1_plus"
            },
            {
              title: "Core WIKI 文章数 v2",
              text:
                "5月22日方法论，core类和非core类，都取N层，添加黑名单(Sociology,Biology,Economics)",
              to: "/CoreArticlesTotalV2"
            },
            {
              title: "Core WIKI 文章数 v3",
              text:
                "儿童节方法论，core类计算N+1层，非core类计算N层，添加黑名单(Sociology,Biology,Economics)",
              to: "/CoreArticlesTotalNew_v3"
            }
          ],
          "Wikipedia- Core 小世界": [
            {
              title: "规模趋势",
              text: "小世界 Core V2 规模趋势",
              to: "/CoreSWUndirectLimit"
            },
            {
              title: "逐年趋势",
              text: "小世界 Core V2 逐年趋势",
              to: "/CoreSMUndirected"
            }
          ],
          "Wikipedia- 学科相关度": [
            {
              title: "People in WIKI",
              text: "人和人，学科的相关度",
              to: "/disciplinePeople"
            },
            {
              title: "WIKI 学科逐年相关度",
              text: "各学科的逐年相关度",
              to: "/discipline"
            },
            {
              title: "小世界有向图",
              text: "小世界有向网络学科间趋势",
              to: "/SmallWorldDirected"
            },
            {
              title: "Core_V2_小世界有向图",
              text: "Core_V2_小世界有向网络学科间趋势",
              to: "/SmallWorldDirectedCoreV2"
            },
            {
              title: "Cognitive science 相关度",
              text: "Cognitive science 和其他学科的逐年相关度",
              to: "/SubDiscipline"
            }
          ],
          "Wikipedia- 幂率": [
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
          "Wikipedia- 小世界": [
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
        },
        大英百科全书: {
          "大英百科全书- 统计数据": [
            {
              title: "Britannica Tree",
              text: "大英百科全书分类层次浏览",
              to: "/BritannicaTree"
            }
          ]
        }
      }
    };
  },
  methods: {
    scrollMeTo(refName) {
      console.log(this.$refs[refName]);
      var element = this.$refs[refName][0];
      var top = element.offsetTop;
      window.scrollTo(0, top);
    }
  },
  computed: {
    hrefArray: function() {
      let retArray = [];
      for (let key in this.indexObject) {
        for (let skey in this.indexObject[key]) {
          retArray.push({
            name: skey,
            href: `${skey}`
          });
        }
      }
      return retArray;
    }
  }
};
</script>

<style lang="less"></style>
