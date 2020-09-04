
import _ from 'lodash'
import { getTranslate } from '@/api/index'

export default {
  name: 'Base',
  data() {
    return {
      pageName: '', // 页面名称
      myChartIds: [], // 图全部放在这里初始化
      unTranslateWords: new Set(), // 未翻译的单词
      en2zhdict: {} // 翻译完成的词典
    }
  },
  mounted() {
    this.$store.commit('changeCurentPath', this.pageName)
    window.onresize = _.debounce(() => {
      this.myChartObjs.forEach(element => {
        element.resize()
      })
    }, 500)
  },
  methods: {
    translate: _.debounce(async function() {
      console.log('translate')
      // eslint-disable-next-line eqeqeq
      const utw = Array.from(this.unTranslateWords).filter(rst => this.en2zhdict[rst] == undefined)
      this.unTranslateWords = new Set()
      const ret = await getTranslate(utw)
      for (const [key, value] of _.zip(utw, ret)) {
        this.$set(this.en2zhdict, key, value)
      }
    }, 500),

    // 激活翻译函数
    addTranslateChan(rst) {
      this.unTranslateWords.add(rst)
      this.translate()
    }

  },
  computed: {
    //  图的对象集合
    myChartObjs: function() {
      return this.myChartIds.map(each => this.$echarts.init(document.getElementById(each)))
    }
  }
}
