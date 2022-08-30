<template lang="pug">
v-container
  DefaultToc
  DefaultFabToTop
  // Sizes your content based upon application components
  v-main(style="padding:0")
    // Provides the application the proper gutter
    v-container(fluid="")
      v-row
        h1.v-heading.text-h4.text-sm-h4.mb-4 demo
        iframe#v2frame(src="https://wiki.nikepai.com/v2")
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
            },
            {
              title: 'Paper',
              text: '论文图',
              to: '/browser/Paper'
            },
            {
              title: 'MagGraphPaper',
              text: 'MagGraph论文图',
              to: '/browser/MagGraphPaper'
            },
            {
              title: 'MagGraphPaper 2022',
              text: 'MagGraph论文图',
              to: '/browser/MagGraphPaper_20220409'
            },
            {
              title: 'wikiGraphPaper',
              text: 'wikiGraph论文图',
              to: '/browser/wikiGraphPaper'
            },
            {
              title: '数据规模统计-石墨 excel',
              text: '专利，论文，编辑次数等等，稍后更新',
              href: 'https://shimo.im/sheets/gQgrvYXtRyYRv9qr/MODOC/',
              update: '2021-06-31T09:43:03.429Z'
            }
          ],
          'Explorer': [
            {
              title: 'wikipedia 演化',
              text: '维基百科的演化 腾讯文档',
              href: 'https://docs.qq.com/sheet/DWGNHVmVyZUVaR1JS',
              update: '2022-12-31T09:43:03.429Z'
            },
            {
              title: '网络特性归纳',
              text: '',
              to: '/explorer/NetworkFeture',
              update: '2022-12-31T09:43:03.429Z'
            },
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
              text: '学科间幂律层次关系，可自主调节关系',
              to: '/explorer/MagFunnel'
            }
          ]
        },
        WM: {
          status: [
            // {
            //   title: 'WM google 距离',
            //   text: 'WM google 距离',
            //   to: '/wm/WMGoogleDistance_2020_V3',
            //   update: '2022-12-14T09:43:03.429Z'
            // },
            {
              title: 'WM 点边趋势',
              text: 'WM 点边趋势',
              to: '/wm/nodeEdgeCountByYear',
              update: '2022-12-14T09:43:03.429Z'
            },
            {
              title: 'WM 作者统计',
              text: 'WM 作者统计',
              to: '/wm/AuthorsAndArticleInfoByYear',
              update: '2022-12-14T09:43:03.429Z'
            },
            {
              title: 'WM 度分布',
              text: 'WM 度分布',
              to: '/wm/dbfwm2020',
              update: '2022-12-14T09:43:03.429Z'
            }
          ]
        },
        'Entropy': {
          '熵': [{
            title: 'MAG 分学科 熵',
            text: '保护结构熵和度分布熵',
            to: '/mag2020/MAGSubjectEntropy',
            update: '2022-12-14T09:43:03.429Z'
          },
          {
            title: 'MAG 结构熵',
            text: '结构熵(节点重要性)',
            to: '/mag2020/entropy',
            update: '2022-12-14T09:43:03.429Z'
          },
          {
            title: 'MAG 度分布熵',
            text: '网络熵(度序列分布)',
            to: '/mag2020/networkEntropy',
            update: '2022-12-14T09:43:03.429Z'
          }, {
            title: 'wikipedia 结构熵',
            text: 'wikipedia 结构熵(节点重要性),网络密度',
            to: '/wikipedia-build/wikipediaEntropy',
            update: '2022-12-02T16:43:03.429Z'
          }, {
            title: 'wikipedia 度分布熵',
            text: 'wikipedia 网络熵(度序列分布)',
            to: '/wikipedia-build/wikipediaNetworkEntropy',
            update: '2022-12-02T16:43:03.429Z'
          }]
        },
        'MAG-2020': {
          '统计数据': [{
            title: 'MAG 统计学科数据',
            text: '',
            to: '/mag2020/MagArticlesTotalV3',
            update: '2021-03-12T09:43:03.429Z'
          }, {
            title: 'MAG 度分布',
            text: '包含 3 个图表',
            to: '/mag2020/DbfMAG2020',
            update: '2022-02-12T09:43:03.429Z'
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
          }, {
            title: 'MAG 颠覆度年度分布',
            text: '',
            to: '/mag2020/DisruptionTrendByYear',
            update: '2021-06-30T09:43:03.429Z'
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
            title: 'MAG 3D 二级学科 引力图',
            text: '',
            to: '/mag2020/MagPlantGraph',
            update: '2021-03-09T09:43:03.429Z'
          },
          {
            title: 'MAG 引用半衰期',
            text: '引用半衰期',
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
          },
          {
            title: 'MAG 学科引用最高的文章',
            text: '各学科引用最高的文章的逐年引用情况',
            to: '/mag2020/topNLinksinByYear',
            update: '2021-03-19T09:43:03.429Z'
          },
          {
            title: 'MAG 小世界有向距离',
            text: 'mag 小世界有向距离',
            to: '/mag2020/MagDirectedDistance',
            update: '2021-04-24T09:43:03.429Z'
          },
          {
            title: 'MAG 学科topN 每隔5000的自恋度',
            text: 'MAG 学科topN 每隔5000的自恋度',
            to: '/mag2020/MAG_ZldByTopN_every5000',
            update: '2021-05-18T09:43:03.429Z'
          },
          {
            title: 'MAG N年之后的文章所引用的文章的逐年趋势',
            text: 'MAG N年之后的文章所引用的文章的逐年趋势',
            to: '/mag2020/MAG_PreCountByYear',
            update: '2021-06-05T09:43:03.429Z'
          },
          {
            title: 'MAG 各学科linksout的论文的平均寿命',
            text: '各学科linksout的论文的平均寿命',
            to: '/mag2020/LinksoutAvgAge',
            update: '2022-06-05T09:43:03.429Z'
          }],
          '学科相关度等': [
            {
              title: '2020 学科相关度',
              text: '2020 学科相关度',
              to: '/mag2020/MagGoogleDistance_2020_V3',
              update: '2020-12-14T09:43:03.429Z'
            }, {
              title: '2020 二级学科相关度',
              text: '二级学科相关度',
              to: '/mag2020/MagPlantDistance',
              update: '2021-03-09T09:43:03.429Z'
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
        'Wikipedia-历史重建': {
          '统计数据': [
            {
              title: 'wiki Google 中间距离',
              text: 'wiki Google 中间距离',
              to: { path: '/wikipedia-build/WikiGoogleDistance' },
              update: '2022-11-18T09:43:03.429Z'
            },
            {
              title: 'wiki 引用 MAG论文的滞后趋势',
              text: 'wiki引用1995-2015年MAG论文的滞后趋势',
              to: '/wikipedia-build/WikiRefTjData',
              update: '2022-06-30T09:43:03.429Z'
            },
            {
              title: 'wiki 文章数',
              text: 'wiki 文章数查询',
              to: '/wikipedia-build/ArticlesTotal',
              update: '2021-06-30T09:43:03.429Z'
            },
            {
              title: 'wiki Core V5',
              text: '各 Core V5 学科的逐年相关度',
              to: { path: '/wikipedia/DisciplineCore', query: { version: 'v5_new' }},
              update: '2021-06-30T09:43:03.429Z'
            },
            {
              title: 'wiki 3D 引力图',
              text: '',
              to: '/wikipedia-build/wikiGraph',
              update: '2021-07-05T16:43:03.429Z'
            },
            {
              title: 'wiki 小世界',
              text: 'wiki 小世界网络',
              to: '/wikipedia-build/smallworld_20211107',
              update: '2021-11-07T16:43:03.429Z'
            },
            {
              title: 'wiki 拟合数据',
              text: 'wiki 拟合数据',
              to: '/wikipedia-build/WikiNiHe',
              update: '2021-10-27T16:43:03.429Z'
            },
            {
              title: 'wiki 引用论文数过滤器',
              text: 'wiki 引用论文数过滤器',
              to: '/wikipedia-build/WikiFilter',
              update: '2021-11-27T16:43:03.429Z'
            },
            {
              title: 'wiki幂律',
              text: 'wiki幂律',
              to: '/wikipedia-build/CoreZipfByNodes_wiki',
              update: '2021-11-27T16:43:03.429Z'
            },
            // {
            //   title: 'wiki结构熵',
            //   text: 'wiki结构熵',
            //   to: '/wikipedia-build/entropy',
            //   update: '2022-12-02T16:43:03.429Z'
            // },
            {
              title: 'wiki幂律度分布',
              text: 'wiki 幂律度分布',
              to: '/wikipedia-build/DegreeDistribution',
              update: '2022-02-06T16:43:03.429Z'
            },
            {
              title: 'People in wiki',
              text: '人和人，学科的相关度',
              to: '/wikipedia-build/disciplinePeople',
              update: '2021-12-25T09:43:03.429Z'
            },
            {
              title: 'article length',
              text: 'wikipedai 文章长度',
              to: '/wikipedia-build/articleLength',
              update: '2022-08-08T09:43:03.429Z'
            },
            {
              title: '各学科总字数等一些规律',
              text: 'wikipedai 各学科的总字数和linksout的一些规律',
              to: '/wikipedia-build/Xueke_words_linksout',
              update: '2022-09-25T09:43:03.429Z'
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
            },
            {
              title: 'wiki 总文章和边数按年趋势',
              text: 'wiki总文章和边数按年趋势',
              to: '/wikipedia/WikiAndMagCountByYear',
              update: '2021-04-26T16:43:03.429Z'
            },
            {
              title: 'core_v5文章数links统计',
              text: 'core_v5文章数links统计',
              to: '/wikipedia/ArticlesTotalByCoreNew_v5',
              update: '2021-03-16T09:43:03.429Z'
            },
            {
              title: '学科单篇文章的的历年长度',
              text: '学科单篇文章的的历年长度',
              to: '/wikipedia/SubjectArticleCount',
              update: '2021-06-02T09:43:03.429Z'
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
    for (const item of retArray.slice(0, 5)) {
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
#v2frame {
  height: 400px;
  width: 100%;
}
</style>
