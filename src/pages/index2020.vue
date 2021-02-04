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
        'Route': {
          'Route': [
            {
              title: '活跃数据',
              text: '回到活跃数据',
              to: '/'
            }
          ]
        },
        'MAG-2019-v2(非简介分类)': {
          '学科相关度': [
            {
              title: 'MAG 因果关系-贸易比例',
              text: ' MAG 因果关系-贸易比例',
              to: '/mag2019v2/MagTrade',
              update: '2020-09-24T09:43:03.429Z'
            },
            {
              title: 'MAG google 距离(当时距离)',
              text: 'MAG 学科相关度, 当时的距离',
              to: '/mag2019v2/MagGoogleDistanceV2',
              update: '2020-11-30T09:43:03.429Z'
            },
            {
              title: 'MAG google距离中间数据',
              text: 'MAG google距离中间数据',
              to: '/mag2019v2/GoogleDistance'
            }
          ],

          '统计数据': [
            {
              title: 'MAG文章数',
              text: '',
              to: '/mag2019v2/MagArticlesTotalV2'
            },
            {
              title: 'MAG 作者数逐年统计',
              text: '',
              to: '/mag2019v2/AuthorsAndArticleInfoByYear',
              update: '2020-10-28T09:43:03.429Z'
            },
            {
              title: 'MAG topN学科逐年分布',
              text: 'MAG topN学科逐年分布',
              to: '/mag2019v2/TjYearByTopN',
              update: '2020-11-04T09:43:03.429Z'
            }
          ]
        },
        'MAG-2019-v1': {
          '统计数据': [
            {
              title: 'MAG 作者文章数',
              text: 'MAG 作者文章数 统计',
              to: '/mag2019v1/MagAAAInfo'
            },
            {
              title: 'MAG 文章数',
              text: 'MAG 文章数查询',
              to: '/mag2019v1/MagArticlesTotal'
            },
            {
              title: 'MAG topN 学科自恋度',
              text: 'MAG topN 学科自恋度',
              to: '/mag2019v1/MagTopNRefSelfRate',
              update: '2020-11-03T09:43:03.429Z'
            },
            {
              title: 'MAG 学科逐年引用分布',
              text: 'MAG 学科逐年引用分布',
              to: '/mag2019v1/MagCompositionByYear'
            },
            {
              title: 'MAG 学科引用年份热力图',
              text:
                '单一学科 linksOut / linksIn 的年份分布',
              to: '/mag2019v1/MagRefDist'
            }
          ],
          '幂律': [
            {
              title: 'MAG 世界幂律',
              text: 'MAG 世界幂律',
              to: '/mag2019v1/MagZipf'
            },
            {
              title: 'MAG 小世界幂律',
              text: 'MAG 小世界幂律',
              to: '/mag2019v1/MagInnerZipf'
            }
          ],
          '学科相关度': [
            {
              title: 'MAG 学科相关度',
              text: 'MAG 中各学科的逐年相关度',
              to: '/mag2019v1/MagGoogleDistance'
            }
          ],
          '小世界': [
            {
              title: 'MAG 小世界 v2',
              text:
                'MAG 逐年趋势:后一年包含前一年的所有范围。  规模趋势:按照排名增大的网络折线图和按照实际规模增大的网络折线图。(此版本各年份分别计算排名计算)',
              to: { path: '/mag2019v1/MagDirectNet', query: { version: 'v2' }}
            },
            {
              title: 'MAG 小世界 v3',
              text:
                'MAG 逐年趋势:可以选择5，10，15，20年的范围内的学科内论文，计算出的小世界。 ',
              to: { path: '/mag2019v1/MagDirectNetV3', query: { version: 'v3' }}
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
