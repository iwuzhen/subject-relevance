<template lang="pug">
v-container
  DefaultToc
  DefaultFabToTop
  // Sizes your content based upon application components
  v-main(style="padding:0")
    // Provides the application the proper gutter
    v-container(fluid="")
      v-row.light-blue.lighten-5.mb-4
        aside Tip: 30 天内新增的图表标记为橘色
      .mb-5(v-for="(subitems, h1name) in indexObject" :id="getMd5Id(h1name)" :key="h1name")
        h1.v-heading.text-h4.text-sm-h4.mb-4
          a.text-decoration-none.text-right.text-md-left(:href="'#'+getMd5Id(h1name)")  #
          |             {{ h1name }}
          // </a>
        .mb-5(v-for="(items, name) in subitems" :id="getMd5Id(h1name+name)" :key="getMd5Id(h1name+name)")
          h2.v-heading.text-h5.text-sm-h5.mb-4.mt-4
            a.text-decoration-none.text-right.text-md-left(:href="'#'+getMd5Id(h1name+name)")  #
            |               {{ name }}
          v-row
            v-divider
          v-row
            v-col(v-for="(item, index) in items" :key="index" cols="6" md="4" lg="3")
              v-hover(v-slot:default="{ hover }" close-delay="200")
                v-card.mx-auto(max-width="344" :elevation="hover ? 16 : 2" min-height="150" :to="item.to" :href="item.href" :class="(item.update!=null)&&(new Date().getTime()-new Date(item.update).getTime()<2497466968)?'orange':'white'")
                  v-card-title {{ item.title }}
                  v-card-subtitle(v-if="item.update!=null") {{ dayjs(item.update).locale('zh-cn').format('YYYY-MM-DD') }}
                  v-card-text {{ item.text }}
                  v-card-actions

</template>

<script>
import { sync } from 'vuex-pathify'
import DefaultToc from '@/layouts/default/Toc'
import DefaultFabToTop from '@/layouts/default/FabToTop'
import { get } from 'vuex-pathify'
import dayjs from 'dayjs'
import { wait } from '@/utils/helpers'

export default {
  name: 'Index',
  components: {
    DefaultToc,
    DefaultFabToTop
  },
  data() {
    return {
      indexObject: {
        'Structure': {
          '归档数据': [
            {
              title: '归档数据',
              text: '历史数据的集合',
              to: '/index2020'
            }
          ],
          'Browser': [
            {
              title: 'wikipedia',
              text: 'wikipedia 分类文章层次浏览,可以对比树之间的节点差异',
              to: '/browser/WikiTree'
            },
            {
              title: 'Britannica',
              text: '大英百科全书分类层次浏览',
              to: '/browser/BritannicaTree'
            },
            {
              title: 'MAG Fos',
              text: 'Mag Fos 层次浏览',
              to: '/browser/MagFosTree'
            }
          ],
          'Explorer': [
            {
              title: 'MAG 学科依赖层次',
              text: '学科依赖层次等 3 个表格，比引力图层次鲜明',
              to: '/explorer/DataSheet',
              update: '2020-12-31T09:43:03.429Z'
            },
            {
              title: 'Wikipedia 文章间距离计算',
              text: '学科文章间距离计算, 手动输入文章名，进行计算',
              to: '/explorer/PageDistance',
              update: '2020-11-19T09:43:03.429Z'
            },
            {
              title: 'MAG 哑铃图',
              text: '学科间幂率层次关系，可自主调节关系',
              to: '/explorer/MagFunnel'
            }
          ]
        },
        'MAG-2020': {
          '统计数据': [{
            title: 'MAG 统计学科数据',
            text: '包含 3 个图表',
            to: '/mag2020/MagArticlesTotalV3',
            update: '2020-12-15T09:43:03.429Z'
          }, {
            title: 'MAG 学科引用其他学科的逐年分布趋势',
            text: '学科引用其他学科的逐年分布趋势',
            to: '/mag2020/linkscf',
            update: '2021-01-11T09:43:03.429Z'
          }, {
            title: 'MAG 统计学科被引用为0的情况',
            text: '',
            to: '/mag2020/tjhaslinksinByCats',
            update: '2021-01-11T09:43:03.429Z'
          },
          {
            title: 'MAG 因果关系-贸易比例',
            text: ' MAG 因果关系-贸易比例',
            to: '/mag2020/MagTrade',
            update: '2021-01-12T09:43:03.429Z'
          }, {
            title: 'MAG 作者数逐年统计',
            text: '',
            to: '/mag2020/AuthorsAndArticleInfoByYear',
            update: '2021-01-20T09:43:03.429Z'
          },
          {
            title: '各学科当时的点边统计',
            text: '',
            to: '/mag2020/NodeAndEdgeThatTimeByCats',
            update: '2021-01-26T09:43:03.429Z'
          },
          {
            title: 'MAG 3D 引力图',
            text: '',
            to: '/mag2020/MagGraph',
            update: '2021-01-22T09:43:03.429Z'
          },
          {
            title: 'MAG 半衰期，新鲜度',
            text: '',
            to: '/mag2020/BanshuaiqiByYear',
            update: '2021-02-02T09:43:03.429Z'
          },
          {
            title: 'MAG google距离中间数据',
            text: 'MAG google距离中间数据',
            to: '/mag2020/GoogleDistance',
            update: '2021-02-02T09:43:03.429Z'
          },
          {
            title: 'MAG 学科自恋度',
            text: 'MAG 学科自恋度',
            to: '/mag-lts/MagRefSelfRate',
            update: '2021-02-04T09:43:03.429Z'
          }
          ],
          '学科相关度等': [
            {
              title: '2020 学科相关度',
              text: '2020 学科相关度',
              to: '/mag2020/MagGoogleDistance_2020_V3',
              update: '2020-12-14T09:43:03.429Z'
            }, {
              title: '2020 学科引力泡泡图',
              text: '2020 学科引力泡泡图',
              to: '/mag2020/BubbleDistance',
              update: '2021-01-06T09:43:03.429Z'
            }, {
              title: 'MAG 幂律及其随时间变化趋势',
              text: '包含 3 个图表',
              to: '/mag2020/ZipfAndInnerzipfByYearv3',
              update: '2020-12-16T09:43:03.429Z'
            }, {
              title: 'MAG topN学科逐年分布',
              text: '包含 1 个图表',
              to: '/mag2020/TjYearByTopN_v3',
              update: '2021-01-20T09:43:03.429Z'
            }, {
              title: 'MAG 小世界网络独立统计',
              text: '点击图表中的单个节点，即可分析该网络的多个维度信息',
              to: '/mag2020/MagDirectNetBrowser',
              update: '2021-01-15T09:43:03.429Z'
            }, {
              title: 'MAG 学科内小世界',
              text: '包含 1 个图表,数据需要更新',
              to: '/mag2020/MagDirectNet',
              update: '2020-12-24T09:43:03.429Z'
            }, {
              title: 'MAG 学科颠覆度',
              text: '数据已更新',
              to: '/mag2020/DisruptionByYear2020',
              update: '2020-12-30T09:43:03.429Z'
            }
          ]
        },
        'MAG-2019-v2(非简介分类)': {
          'Graph': [
            {
              title: 'MagGraph',
              text:
                '展示MAG多个不同学科之间的大小和距离关系，用 2d 和 3d 引力图展示',
              to: '/mag2019v2/MagGraph'
            },
            {
              title: 'MAG 学科桑基图',
              text: 'MAG 学科桑基图',
              to: '/mag2019v2/MagSankey',
              update: '2020-10-26T09:43:03.429Z'
            }
          ],
          '学科相关度': [
            {
              title: 'MAG topN因果关系-贸易比例',
              text: 'MAG topN因果关系-贸易比例',
              to: '/mag2019v2/MagTopTrade',
              update: '2020-11-03T09:43:03.429Z'
            }
          ],

          '统计数据': [
            {
              title: 'MAG level1层和父类的交集比例',
              text: 'MAG level1层和父类的交集比例 柱状图',
              to: '/mag2019v2/MagBlLevel'
            },
            {
              title: 'MAG 作者文章数',
              text: 'MAG 作者文章数 V2',
              to: '/mag2019v2/MagAAAInfoV2'
            },
            {
              title: 'MAG 学科引用年份热力图',
              text: '单一学科 linksOut / linksIn 的年份分布',
              to: '/mag2019v2/MagRefDistV2'
            },
            {
              title: 'MAG 引用关系逐年统计',
              text: '',
              to: '/mag2019v2/LinkTjByYear',
              update: '2020-11-30T20:43:03.429Z'
            },
            {
              title: 'MAG fos学科领域逐年分布',
              text: '',
              to: '/mag2019v2/FosTjByYearV2',
              update: '2020-10-29T09:43:03.429Z'
            },
            {
              title: 'MAG 学科文章交集分布',
              text: '',
              to: '/mag2019v2/MagJJByCat',
              update: '2020-10-29T09:43:03.429Z'
            },
            {
              title: 'MAG 历年的点边数据统计',
              text: 'MAG 历年的点边数据统计',
              to: '/mag2019v2/NodeAndEdgeByYear',
              update: '2020-12-01T09:43:03.429Z'
            }

          ],
          '幂率': [
            {
              title: 'MAG 幂率相关统计数据',
              text: 'MAG v2幂律相关统计数据',
              to: '/mag2019v2/MagInnerZipTj'
            },
            {
              title: 'MAG 小世界幂率',
              text: 'MAG 小世界幂率',
              to: '/mag2019v2/MagInnerZipfV2'
            },

            {
              title: 'MAG 世界幂率',
              text: 'MAG 世界幂率',
              to: '/mag2019v2/MagZipfV2'
            }
          ],
          '小世界': [
            {
              title: 'MAG 小世界 v4',
              text: '重新筛选后计算得到的 MAG 小世界',
              to: { path: '/mag2019v2/MagDirectNetV4', query: { version: 'v4' }}
            }
          ],
          '颠覆度': [
            {
              title: 'MAG 学科颠覆度',
              text: 'MAG  颠覆度学科计算法，文章计算平均法，学科 top 分布，按年学科 top 分布等。 ',
              to: '/mag2019v2/MagDisruption',
              update: '2020-11-27T16:43:03.429Z'
            },
            {
              title: 'MAG 学科颠覆度年度分布',
              text: 'MAG 颠覆度 年度分布，可以调节多种条件进行过滤 ',
              to: '/mag2019v2/DisruptionByYear',
              update: '2020-12-03T16:43:03.429Z'
            }
          ]
        },
        Wikipedia: {
          '统计数据': [
            {
              title: 'wiki 子类半衰期',
              text: '2007年的N层子类，经过x年，其子类有一半改变了',
              to: '/wikipedia/BanShuaiQi'
            },
            {
              title: 'wiki top500文章',
              text: '各学科top500文章展示,数值表示该篇文章的ArticleLinksin',
              to: '/wikipedia/TopArticles'
            },
            {
              title: '访问量&编辑量',
              text: 'wiki 访问量&编辑量',
              to: '/wikipedia/ViewAndEdits'
            },
            {
              title: 'wiki 文章数',
              text: 'wiki 文章数查询',
              to: '/wikipedia/ArticlesTotal'
            },
            {
              title: 'wiki 类引用详情',
              text: 'wiki Core 类之间类引用详情',
              to: '/wikipedia/CoreLinks'
            },
            {
              title: 'wiki 分类层次',
              text: 'wiki 分类层次查询',
              href: 'http://wikidb.knogen.com:10080/wikidb_web/first.jsp'
            },
            {
              title: 'wiki 贸易度',
              text: 'wiki Core 类之间类引用详情',
              to: '/wikipedia/WikiTrade',
              update: '2021-02-03T16:43:03.429Z'
            },
            {
              title: 'wiki 自恋度',
              text: '',
              to: '/wikipedia/RefSelfRate',
              update: '2021-02-05T16:43:03.429Z'
            },
            {
              title: 'wiki 3D 引力图',
              text: '',
              to: '/wikipedia/wikiGraph',
              update: '2021-02-05T16:43:03.429Z'
            }

          ],
          'Core-学科相关度': [
            {
              title: 'wiki Core V1',
              text: '各 Core 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v1' }}
            },
            {
              title: 'wiki Core V2',
              text: '各 Core V2 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v2' }}
            },
            {
              title: 'wiki Core V3',
              text: '各 Core V3 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v3' }}
            },
            {
              title: 'wiki Core V4',
              text: '各 Core V4 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v4' }},
              update: '2020-10-26T09:43:03.429Z'
            },
            {
              title: 'wiki Core V5',
              text: '各 Core V5 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v5' }},
              update: '2020-11-11T09:43:03.429Z'
            },
            {
              title: 'wiki Core 基准线',
              text: '各 Core 学科的基准学科相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'article' }},
              update: '2020-11-17T09:43:03.429Z'
            },
            {
              title: 'wiki Google 中间距离',
              text: 'wiki Google 中间距离',
              to: { path: '/wikipedia/WikiGoogleDistance' },
              update: '2020-11-18T09:43:03.429Z'
            }
          ],
          'Core-幂律': [
            {
              title: 'wiki Core V1 Zipf 幂律斜率',
              text: 'wiki Core 逐年幂律图，及其斜率曲线',
              to: { path: '/wikipedia/CoreZipfByNodes', query: { version: 'v1' }}
            },
            {
              title: 'wiki Core V2 Zipf 幂律斜率',
              text: 'wiki Core V2 逐年幂律图，及其斜率曲线',
              to: { path: '/wikipedia/CoreZipfByNodes', query: { version: 'v2' }}
            },
            {
              title: 'wiki Core V3 Zipf 幂律斜率',
              text: 'wiki Core V3 逐年幂律图，及其斜率曲线',
              to: { path: '/wikipedia/CoreZipfByNodes', query: { version: 'v3' }}
            }
          ],
          'Core-文章数': [
            {
              title: 'Core wiki 文章数 v1',
              text:
                '有core类只计算core类，无core类只计算非core类，都取N层，未添加黑名单',
              to: '/wikipedia/CoreArticlesTotal'
            },
            {
              title: 'Core wiki 文章数 v1 Plus',
              text:
                '有core类只计算core类，无core类只计算非core类，都取N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/wikipedia/CoreArticlesTotalV1_plus'
            },
            {
              title: 'Core wiki 文章数 v2',
              text:
                '5月22日方法论，core类和非core类，都取N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/wikipedia/CoreArticlesTotalV2'
            },
            {
              title: 'Core wiki 文章数 v3',
              text:
                '儿童节方法论，core类计算N+1层，非core类计算N层，添加黑名单(Sociology,Biology,Economics)',
              to: '/wikipedia/CoreArticlesTotalNew_v3'
            }
          ],
          'Core-小世界': [
            {
              title: 'wiki 小世界规模趋势',
              text: '小世界 Core V2 规模趋势',
              to: '/wikipedia/CoreSWUndirectLimit'
            },
            {
              title: 'wiki 小世界逐年趋势',
              text: '小世界 Core V2 逐年趋势',
              to: '/wikipedia/CoreSMUndirected'
            }
          ],
          '学科相关度': [
            {
              title: 'People in wiki',
              text: '人和人，学科的相关度',
              to: '/wikipedia/disciplinePeople'
            },
            {
              title: 'wiki 学科逐年相关度',
              text: '各学科的逐年相关度',
              to: '/wikipedia/discipline'
            },
            {
              title: 'wiki 小世界有向图',
              text: '小世界有向网络学科间趋势',
              to: '/wikipedia/SmallWorldDirected'
            },
            {
              title: 'Core wiki V2 小世界有向图',
              text: 'Core_V2_小世界有向网络学科间趋势',
              to: '/wikipedia/SmallWorldDirectedCoreV2'
            },
            {
              title: 'Cognitive science 相关度',
              text: 'Cognitive science 和其他学科的逐年相关度',
              to: '/wikipedia/SubDiscipline'
            }
          ],
          '幂率': [
            {
              title: 'wiki Zipf 幂律(世界)斜率 (人)',
              text: 'people 计算出的世界逐年幂律图',
              to: '/wikipedia/PeopleZipfByNodes'
            },
            {
              title: 'wiki Zipf 幂律(小世界) (人)',
              text: 'people 计算出的小世界逐年幂律图',
              to: '/wikipedia/PeopleInnerZipfByNodes'
            },
            {
              title: 'wiki Zipf 幂律(世界)',
              text: '逐年幂律图',
              to: '/wikipedia/powerlaw'
            },
            {
              title: 'wiki Zipf 幂律(小世界)斜率',
              text: '逐年幂律图，及其斜率曲线',
              to: '/wikipedia/ZipfByNodes'
            },
            {
              title: 'wiki 幂律度分布',
              text: '幂律度分布',
              to: '/wikipedia/DegreeDistribution'
            },
            {
              title: 'wiki PageRank 幂律',
              text: 'PageRank幂律',
              to: '/wikipedia/powerLawPageRank'
            }
          ],
          '小世界': [
            {
              title: 'wiki 小世界规模趋势',
              text: '小世界',
              to: '/wikipedia/SmallWorldUndirectedLimit'
            },
            {
              title: 'wiki 小世界逐年趋势',
              text: '小世界',
              to: '/wikipedia/SmallWorldUndirected'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...get('route', [
      'hash',
      'path'
    ]),

    // 最近更新的图表，用作消息条提示
    scrolling: sync('pages/scrolling')
  },
  async mounted() {
    // toc
    this.$store.set('pages/page_name', '')
    // 最近更新的内容提醒
    let retArray = []
    for (const key in this.indexObject) {
      for (const skey in this.indexObject[key]) {
        for (const item of this.indexObject[key][skey]) {
          if ((item.update != null) && (new Date().getTime() - new Date(item.update).getTime() < 2497466968)) {
            retArray.push(item)
          }
        }
      }
    }
    retArray.sort((a, b) => { return new Date(b.update).getTime() - new Date(a.update).getTime() })
    for (const item of retArray.slice(0, 3)) {
      this.$notify({
        group: 'foo',
        duration: 3000,
        title: `<a href="${item.to}" style="color: green;">${item.title} </a>`,
        type: 'blue lighten-5',
        text: '<span class="red--text">' + item.text + '<br> 更新：' + dayjs().from(dayjs(item.update)) + '</span>'
      })
    }

    // 配置 toc
    retArray = []
    for (const key in this.indexObject) {
      retArray.push({
        text: key,
        to: `#${this.getMd5Id(key)}`,
        badgeCount: 0,
        level: 1
      })
      for (const skey in this.indexObject[key]) {
        let badgeCount = 0
        for (const item of this.indexObject[key][skey]) {
          if ((item.update != null) && (new Date().getTime() - new Date(item.update).getTime() < 2497466968)) {
            badgeCount += 1
          }
        }
        retArray.push({
          text: skey,
          to: `#${this.getMd5Id(key + skey)}`,
          badgeCount: badgeCount,
          level: 3
        })
      }
    }
    this.$store.set('pages/toc', retArray)

    // 初始滑动
    if (!this.hash) return
    await wait(1000)
    this.scrolling = true
    try {
      await this.$vuetify.goTo(this.hash)
    } catch (e) {
      console.log(e)
    }

    this.scrolling = false
  },
  methods: {
    getMd5Id(name) {
      return 'f' + this.$md5(name).slice(0, 5)
    }
  }
}
</script>

<style lang="less">
.v-heading{
  display: inline-block;
  position: relative;
  a {
    bottom: 0;
    display: inline-block;
    left: 0;
    margin: 0 -.7em;
    position: absolute;
    right: 0;
    top: 0;
  }
  a:not(:hover):not(:focus) {
    opacity: 0;
}
}
</style>
