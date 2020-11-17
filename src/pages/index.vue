<template>
  <v-container>
    <v-navigation-drawer
      right
      fixed
      app
    >
      <v-list
        dense
        nav
      >
        <v-list-item two-line />
        <v-divider />
        <v-list-item
          v-for="obj in hrefArray"
          :key="obj.name"
        >
          <a @click="scrollMeTo(obj.href)">
            <v-list-item-title v-if="obj.badgeCount>0">
              <v-badge
                color="orange"
                :content="obj.badgeCount"
                inline
              >
                {{ obj.name }}
              </v-badge>
            </v-list-item-title>
            <v-list-item-title v-else v-html="obj.name" />
          </a>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main style="padding:0">
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row class="light-blue lighten-5">
          <aside>30 天内新增的图表标记为橘色</aside>
        </v-row>
        <div
          v-for="(subitems, h1name) in indexObject"
          :key="h1name"
          class="mb-5"
        >
          <v-row>
            <a :ref="h1name">
              <h1>{{ h1name }}</h1>
            </a>
          </v-row>
          <v-row>
            <v-divider />
          </v-row>

          <div
            v-for="(items, name) in subitems"
            :key="name"
            class="mb-5"
          >
            <v-row><a :ref="name">
              <h3>{{ name }}</h3>
            </a>
            </v-row>
            <v-row>
              <v-divider />
            </v-row>
            <v-row>
              <v-col
                v-for="(item, index) in items"
                :key="index"
                cols="6"
                md="4"
                lg="3"
              >
                <v-hover
                  v-slot:default="{ hover }"
                  close-delay="200"
                >
                  <v-card
                    class="mx-auto"
                    max-width="344"
                    :elevation="hover ? 16 : 2"
                    min-height="150"
                    :to="item.to"
                    :href="item.href"
                    :class="(item.update!=null)&&(new Date().getTime()-new Date(item.update).getTime()<2497466968)?'orange':'white'"
                  >
                    <v-card-title>{{ item.title }}</v-card-title>
                    <v-card-subtitle v-if="item.update!=null">{{ new Date(item.update).toDateString() }}</v-card-subtitle>
                    <v-card-text>{{ item.text }}</v-card-text>
                    <v-card-actions />
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </div>
        </div>

      </v-container>
    </v-main>
  </v-container>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      indexObject: {
        'Structure': {
          'Tree  View': [
            {
              title: 'Tree Viewer',
              text: 'WIKI 分类文章层次浏览',
              to: '/WikiTree'
            },
            {
              title: 'Britannica Tree',
              text: '大英百科全书分类层次浏览',
              to: '/BritannicaTree'
            },
            {
              title: 'Mag Fos Tree',
              text: 'Mag Fos 层次 tree',
              to: '/MagFosTree'
            }
          ],
          '学科层次归纳': [
            {
              title: '学科依赖层次',
              text: '学科依赖层次等 3 个表格，比引力图层次鲜明',
              to: '/DataSheet',
              update: '2020-10-14T09:43:03.429Z'
            }
          ]
        },
        'MAG v2 (非简介分类)': {
          'MAG v2- Graph': [
            {
              title: 'MagGraph',
              text:
                '学科间引用关系引力，学科大小来自学科文章数。边的长度代表相关度。力引导布局相关的配置项，力引导布局是模拟弹簧电荷模型在每两个节点之间添加一个斥力，每条边的两个节点之间添加一个引力，每次迭代节点会在各个斥力和引力的作用下移动位置，多次迭代后节点会静止在一个受力平衡的位置，达到整个模型的能量最小化。',
              to: '/MagGraph'
            },
            {
              title: 'Mag 哑铃图',
              text: '学科间幂律关系（v1）',
              to: '/MagFunnel'
            },
            {
              title: 'MAG 学科桑基图',
              text: 'MAG 学科桑基图',
              to: '/MAGSankey',
              update: '2020-10-26T09:43:03.429Z'
            }
          ],
          'MAG v2- 学科相关度': [
            {
              title: '因果关系-贸易比例',
              text: ' mag 因果关系-贸易比例',
              to: '/MagTrade',
              update: '2020-09-24T09:43:03.429Z'
            }, {
              title: 'topN因果关系-贸易比例',
              text: 'mag topN因果关系-贸易比例',
              to: '/MagTopTrade',
              update: '2020-11-03T09:43:03.429Z'
            },
            {
              title: 'MAG google 距离',
              text: 'Mag 学科相关度',
              to: '/MasDistanceV2'
            },
            {
              title: 'google距离中间数据',
              text: 'google距离中间数据',
              to: '/GoogleDistance'
            }
          ],

          'MAG v2- 统计数据': [
            {
              title: 'MAG level1层和父类的交集比例',
              text: 'MAG level1层和父类的交集比例 柱状图',
              to: '/MAGBLLevel'
            }, {
              title: 'MAG文章数',
              text: '',
              to: '/MasArticlesTotalV2'
            },
            {
              title: 'MAG 作者文章数',
              text: 'MAG 作者文章数 V2',
              to: '/MagAAAInfoV2'
            },
            {
              title: 'MAG 学科引用年份热力图',
              text:
                '参数说明：不限制学科网络规模，就是统计学科内所有的文章，linksin 或 linsout 的文章年份数量。 限制学科规模数为 10 万，每一年按照 linksout 或 linksin 数量排序 10 万名内的文章，其linksin 或 linsout 的文章年份数量',
              to: '/MAGRefDistV2'
            },
            {
              title: '作者数逐年统计',
              text: '',
              to: '/AuthorsAndArticleInfoByYear',
              update: '2020-10-28T09:43:03.429Z'
            },
            {
              title: '引用关系逐年统计',
              text: '',
              to: '/LinkTjByYear',
              update: '2020-10-28T09:43:03.429Z'
            },
            {
              title: 'fos学科领域逐年分布',
              text: '',
              to: '/FosTjByYearV2',
              update: '2020-10-29T09:43:03.429Z'
            },
            {
              title: '学科文章交集分布',
              text: '',
              to: '/MagJJByCat',
              update: '2020-10-29T09:43:03.429Z'
            },
            {
              title: 'Mag 学科颠覆度',
              text: '',
              to: '/MagDisruption',
              update: '2020-11-02T09:43:03.429Z'
            },
            {
              title: 'topN学科逐年分布',
              text: 'Mag topN学科逐年分布',
              to: '/TjYearByTopN',
              update: '2020-11-04T09:43:03.429Z'
            }

          ],
          'MAG v2- 幂率': [
            {
              title: '幂率相关统计数据',
              text: 'mag v2幂律相关统计数据',
              to: '/MAGInnerZipTj'
            },
            {
              title: 'MAG 小世界幂率',
              text: '',
              to: '/MagInnerZipfV2'
            },

            {
              title: 'MAG 世界幂率',
              text: '',
              to: '/MagZipfV2'
            }
          ],
          'MAG v2- 小世界': [
            {
              title: 'MAG 小世界 v4',
              text: '重新筛选后计算得到的 MAG 小世界',
              to: { path: 'MagDirectNetV4', query: { version: 'v4' }}
            }
          ]
        },
        MAG: {
          'MAG- 统计数据': [
            {
              title: '作者文章数',
              text: 'MAG 作者文章数 统计',
              to: '/MagAAAInfo'
            },
            {
              title: '文章数',
              text: 'MAG 文章数查询',
              to: '/MasArticlesTotal'
            },
            {
              title: '学科自恋度',
              text: 'MAG 学科自恋度',
              to: '/MagRefSelfRate'
            },
            {
              title: 'topN 学科自恋度',
              text: 'mag topN 学科自恋度',
              to: '/MagTopNRefSelfRate',
              update: '2020-11-03T09:43:03.429Z'
            },
            {
              title: '学科逐年引用分布',
              text: 'MAG 学科逐年引用分布',
              to: '/MasCompositionByYear'
            },
            {
              title: '学科引用年份热力图',
              text:
                '参数说明：不限制学科网络规模，就是统计学科内所有的文章，linksin 或 linsout 的文章年份数量。 限制学科规模数为 10 万，每一年按照 linksout 或 linksin 数量排序 10 万名内的文章，其linksin 或 linsout 的文章年份数量',
              to: '/MAGRefDist'
            }
          ],
          'MAG- 幂律': [
            {
              title: 'MAG 幂律',
              text: 'MAG 幂律',
              to: '/MagZipf'
            },
            {
              title: 'MAG 小世界幂律',
              text: 'MAG 小世界幂律',
              to: '/MagInnerZipf'
            }
          ],
          'MAG- 学科相关度': [
            {
              title: 'MAG学科相关度',
              text: 'MAG 中各学科的逐年相关度',
              to: '/masline'
            }
          ],
          'MAG- 小世界': [
            // {
            //   title: "MAG 小世界 v1",
            //   text:
            //     "MAG 逐年趋势:后一年包含前一年的所有范围。  规模趋势:按照排名增大的网络折线图和按照实际规模增大的网络折线图.(此版本只是用2020排名计算)",
            //   to: { path: "MagDirectNet", query: { version: "v1" } }
            // },
            {
              title: 'MAG 小世界 v2',
              text:
                'MAG 逐年趋势:后一年包含前一年的所有范围。  规模趋势:按照排名增大的网络折线图和按照实际规模增大的网络折线图。(此版本各年份分别计算排名计算)',
              to: { path: 'MagDirectNet', query: { version: 'v2' }}
            },
            {
              title: 'MAG 小世界 v3',
              text:
                'MAG 逐年趋势:可以选择5，10，15，20年的范围内的学科内论文，计算出的小世界。 ',
              to: { path: 'MagDirectNetV3', query: { version: 'v3' }}
            }
          ]
        },
        Wikipedia: {
          'Wikipedia- 统计数据': [
            {
              title: 'wiki子类半衰期',
              text: '2007年的N层子类，经过x年，其子类有一半改变了',
              to: '/BanShuaiQi'
            },
            {
              title: 'wiki top500文章',
              text: '各学科top500文章展示,数值表示该篇文章的ArticleLinksin',
              to: '/TopArticles'
            },
            {
              title: '访问量&编辑量',
              text: 'WIKI 访问量&编辑量',
              to: '/viewandedits'
            },
            {
              title: 'WIKI 文章数',
              text: 'WIKI 文章数查询',
              to: '/ArticlesTotal'
            },
            {
              title: 'Wiki 类引用详情',
              text: 'Wiki Core 类之间类引用详情',
              to: '/CoreLinks'
            },
            {
              title: 'WIKI 分类层次',
              text: 'WIKI 分类层次查询',
              href: 'http://wikidb.knogen.com:10080/wikidb_web/first.jsp'
            }
          ],
          'Wikipedia- Core 学科相关度': [
            {
              title: 'WIKI Core V1',
              text: '各 Core 学科的逐年相关度',
              to: { path: 'DisciplineCore', query: { version: 'v1' }}
            },
            {
              title: 'WIKI Core V2',
              text: '各 Core V2 学科的逐年相关度',
              to: { path: 'DisciplineCore', query: { version: 'v2' }}
            },
            {
              title: 'WIKI Core V3',
              text: '各 Core V3 学科的逐年相关度',
              to: { path: 'DisciplineCore', query: { version: 'v3' }}
            },
            {
              title: 'WIKI Core V4',
              text: '各 Core V4 学科的逐年相关度',
              to: { path: 'DisciplineCore', query: { version: 'v4' }},
              update: '2020-10-26T09:43:03.429Z'
            },
            {
              title: 'WIKI Core V5',
              text: '各 Core V5 学科的逐年相关度',
              to: { path: 'DisciplineCore', query: { version: 'v5' }},
              update: '2020-11-11T09:43:03.429Z'
            },
            {
              title: 'WIKI Core 基准线',
              text: '各 Core 学科的基准学科相关度',
              to: { path: 'DisciplineCore', query: { version: 'article' }},
              update: '2020-11-17T09:43:03.429Z'
            },
            {
              title: 'WIKI Google 中间距离',
              text: 'WIKI Google 中间距离',
              to: { path: 'WikiGoogleDistance' },
              update: '2020-09-16T09:43:03.429Z'
            }
          ],
          'Wikipedia- Core 幂律': [
            {
              title: 'Core V1 Zipf 幂律斜率',
              text: 'Core 逐年幂律图，及其斜率曲线',
              to: { path: 'CoreZipfByNodes', query: { version: 'v1' }}
            },
            {
              title: 'Core V2 Zipf 幂律斜率',
              text: 'Core V2 逐年幂律图，及其斜率曲线',
              to: { path: 'CoreZipfByNodes', query: { version: 'v2' }}
            },
            {
              title: 'Core V3 Zipf 幂律斜率',
              text: 'Core V3 逐年幂律图，及其斜率曲线',
              to: { path: 'CoreZipfByNodes', query: { version: 'v3' }}
            }
          ],
          'Wikipedia- Core 文章数': [
            {
              title: 'Core WIKI 文章数 v1',
              text:
                '有core类只计算core类，无core类只计算非core类，都取N层，未添加黑名单',
              to: '/CoreArticlesTotal'
            },
            {
              title: 'Core WIKI 文章数 v1 Plus',
              text:
                '有core类只计算core类，无core类只计算非core类，都取N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/CoreArticlesTotalV1_plus'
            },
            {
              title: 'Core WIKI 文章数 v2',
              text:
                '5月22日方法论，core类和非core类，都取N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/CoreArticlesTotalV2'
            },
            {
              title: 'Core WIKI 文章数 v3',
              text:
                '儿童节方法论，core类计算N+1层，非core类计算N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/CoreArticlesTotalNew_v3'
            }
          ],
          'Wikipedia- Core 小世界': [
            {
              title: '规模趋势',
              text: '小世界 Core V2 规模趋势',
              to: '/CoreSWUndirectLimit'
            },
            {
              title: '逐年趋势',
              text: '小世界 Core V2 逐年趋势',
              to: '/CoreSMUndirected'
            }
          ],
          'Wikipedia- 学科相关度': [
            {
              title: 'People in WIKI',
              text: '人和人，学科的相关度',
              to: '/disciplinePeople'
            },
            {
              title: 'WIKI 学科逐年相关度',
              text: '各学科的逐年相关度',
              to: '/discipline'
            },
            {
              title: '小世界有向图',
              text: '小世界有向网络学科间趋势',
              to: '/SmallWorldDirected'
            },
            {
              title: 'Core_V2_小世界有向图',
              text: 'Core_V2_小世界有向网络学科间趋势',
              to: '/SmallWorldDirectedCoreV2'
            },
            {
              title: 'Cognitive science 相关度',
              text: 'Cognitive science 和其他学科的逐年相关度',
              to: '/SubDiscipline'
            }
          ],
          'Wikipedia- 幂率': [
            {
              title: 'Zipf 幂律(世界)斜率 (人)',
              text: 'people 计算出的世界逐年幂律图',
              to: '/PeopleZipfByNodes'
            },
            {
              title: 'Zipf 幂律(小世界) (人)',
              text: 'people 计算出的小世界逐年幂律图',
              to: '/PeopleInnerZipfByNodes'
            },
            {
              title: 'Zipf 幂律(世界)',
              text: '逐年幂律图',
              to: '/powerlaw'
            },
            {
              title: 'Zipf 幂律(小世界)斜率',
              text: '逐年幂律图，及其斜率曲线',
              to: '/ZipfByNodes'
            },
            {
              title: '幂律度分布',
              text: '幂律度分布',
              to: '/DegreeDistribution'
            },
            {
              title: 'PageRank幂律',
              text: 'PageRank幂律',
              to: '/powerLawPageRank'
            }
          ],
          'Wikipedia- 小世界': [
            {
              title: '规模趋势',
              text: '小世界',
              to: '/SmallWorldUndirectedLimit'
            },
            {
              title: '逐年趋势',
              text: '小世界',
              to: '/SmallWorldUndirected'
            }
          ]
        }
      }
    }
  },
  computed: {
    hrefArray: function() {
      const retArray = []
      for (const key in this.indexObject) {
        for (const skey in this.indexObject[key]) {
          let badgeCount = 0
          for (const item of this.indexObject[key][skey]) {
            if ((item.update != null) && (new Date().getTime() - new Date(item.update).getTime() < 2497466968)) {
              badgeCount += 1
            }
          }
          retArray.push({
            name: skey,
            href: `${skey}`,
            badgeCount: badgeCount
          })
        }
      }
      return retArray
    }
  },
  mounted() {
    this.$store.commit('changeCurentPath', null)
  },
  methods: {
    scrollMeTo(refName) {
      console.log(this.$refs[refName])
      var element = this.$refs[refName][0]
      var top = element.offsetTop
      window.scrollTo(0, top)
    }
  }
}
</script>

<style lang="less"></style>
