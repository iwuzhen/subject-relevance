/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-10-28 17:35:06
 * @LastEditors: ider
 * @LastEditTime: 2020-12-03 16:35:20
 * @Description: 图表模板，自动化配置成图表，不用每个图表画一个Vue了
 */

import { requestWrap } from '@/api/index'
import { coreCategorys, magCategory, defaultCategorySelect, extendEchartsOpts, extendLineSeries } from '@/api/data'
import _ from 'lodash'

const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]))

const setChartOption_1 = (responseData, ChartObj) => {
  const _opt = extendEchartsOpts({
    title: {
      text: responseData.data.title
    },
    legend: {
      data: responseData.data.legend
    },
    xAxis: {
      name: ChartObj.xAxisName,
      type: 'category',
      boundaryGap: false,
      data: responseData.data.x
    },
    yAxis: {
      name: ChartObj.yAxisName,
      type: 'value'
    },
    series: zip(responseData.data.legend, responseData.data.y).map(item => {
      return extendLineSeries({
        name: item[0],
        type: 'line',
        smooth: false,
        data: item[1]
      })
    })
  })
  return _opt
}

const setChartOption_2 = (responseData, ChartObj) => {
  const years = Object.keys(Object.values(responseData)[0])
  const _opt = extendEchartsOpts({
    title: {
      text: '学科 article 数量'
    },
    legend: {
      data: Object.keys(responseData)
    },
    xAxis: {
      name: ChartObj.xAxisName,
      type: 'category',
      boundaryGap: false,
      data: years
    },
    yAxis: {
      name: ChartObj.yAxisName,
      type: 'value'
    },
    series: Object.entries(responseData).map(item => {
      return extendLineSeries({
        name: item[0],
        type: 'line',
        smooth: false,
        data: Object.values(item[1])
      })
    })
  })
  return _opt
}

// 合并2张图表，数据一起展示
const setChartOption_3 = (doubleResponseData, ChartObj) => {
  const [responseData_1, responseData_2] = doubleResponseData

  const fuseData = _.zip([...responseData_1.legend, ...responseData_2.legend], [...responseData_1.y, ...responseData_2.y])
  fuseData.sort((x, y) =>
    y[1][y[1].length - 1] - x[1][x[1].length - 1]
  )
  const [legend, ys] = _.unzip(fuseData)

  const _opt = extendEchartsOpts({
    title: {
      text: 'MAG 当年和当时（包含过去）的 edge,node 分布'
    },
    legend: {
      data: legend
    },
    xAxis: {
      name: ChartObj.xAxisName,
      type: 'category',
      boundaryGap: false,
      data: responseData_1.x
    },
    yAxis: {
      name: ChartObj.yAxisName,
      type: 'value'
    },
    series: _.zip(legend, ys).map(item => {
      return extendLineSeries({
        name: item[0],
        type: 'line',
        smooth: false,
        data: item[1]
      })
    })
  })
  return _opt
}

const MAG_ALL_SUBJECT = [
  'Algebra', 'Anthropology', 'Applied mathematics',
  'Applied physics', 'Artificial intelligence', 'Biological engineering',
  'Biology', 'Chemical engineering',
  'Chemistry', 'Civil engineering',
  'Cognitive science', 'Computer engineering',
  'Computer science', 'Deep learning',
  'Discrete mathematics', 'Earth science', 'Economics',
  'Electrical engineering', 'Engineering disciplines',
  'Environmental engineering', 'Environmental science', 'Experimental physics',
  'Genetic engineering', 'Genome editing',
  'Geography', 'Geology', 'Geometry', 'History',
  'Industrial engineering', 'Linguistics', 'Literature',
  'Logic', 'Machine learning', 'Materials science',
  'Mathematics', 'Mechanical engineering',
  'Medicine', 'Neuroscience', 'Number theory', 'Operating system',
  'Philosophy', 'Physics', 'Political science', 'Psychology',
  'Quantum computing', 'Sociology', 'Theoretical computer science', 'Theoretical physics'
]
const SELECT_MAG_DATA = ['Biology', 'Chemistry', 'Computer science',
  'Economics', 'Geography', 'History', 'Literature', 'Materials science',
  'Mathematics', 'Medicine', 'Philosophy', 'Physics']

export const ChartMap = {
  'AuthorsAndArticleInfoByYear': {
    ChName: '作者数逐年统计',
    componentName: 'PageTemplate',
    RequestFunc: async(params) => {
      return await requestWrap('mag/getMagAuthorsAndArticleInfo_year_v2', 'post', params)
    },
    HandleResponseFunc: setChartOption_1,
    Select: [
      {
        name: 'str',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 6,
        items: magCategory
      }, {
        name: 'returnType',
        default: 0,
        multiple: false,
        label: '过滤器',
        cols: 2,
        items: [{
          text: '逐年作者数(去重)',
          value: 0
        }, {
          text: '逐年作者数(不去重)',
          value: 1
        }, {
          text: '逐年文章数(去掉无作者的)',
          value: 2
        }, {
          text: '逐年作者数(去重)/文章数-不靠谱',
          value: 3
        }, {
          text: '逐年作者数(不去重)/文章数',
          value: 4
        }]
      }, {
        name: 'queryType',
        default: 0,
        label: '数据集',
        multiple: false,
        cols: 2,
        items: [{
          text: '全集',
          value: 0
        }, {
          text: '去除引用为0的数据',
          value: 1
        }]
      }, {
        name: 'yearType',
        default: -1,
        label: '作者数筛选',
        multiple: false,
        cols: 2,
        items: [{
          text: '不筛选',
          value: -1
        }, {
          text: '作者数在100内的论文',
          value: 0
        }, {
          text: '作者数超过100的论文',
          value: 1
        }]
      }
    ],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'

  },
  'LinkTjByYear': {
    ChName: '引用关系逐年统计',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_1,
    RequestFunc: async(params) => {
      return await requestWrap('mag/getLinkTj_year_v2', 'post', params)
    },
    Select: [
      {
        name: 'str',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 6,
        items: magCategory
      }, {
        name: 'method',
        default: 'linksin',
        multiple: false,
        label: '引用方式',
        cols: 2,
        items: ['linksin', 'linksout']
      }, {
        name: 'version',
        default: 'v2',
        label: '数据集',
        multiple: false,
        cols: 2,
        items: [{
          text: '全集',
          value: 'v2'
        }, {
          text: '去掉引用为0的数据',
          value: 'delete_noref_v2'
        }]
      }, {
        name: 'authorType',
        default: 0,
        label: '作者数筛选',
        multiple: false,
        cols: 2,
        items: [{
          text: '不筛选',
          value: 0
        }, {
          text: '作者数超过100的论文',
          value: 1
        }]
      }
    ],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'FosTjByYearV2': {
    ChName: 'fos学科领域逐年分布',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_1,
    RequestFunc: async(params) => {
      return await requestWrap('mag/getFosTj_year_v2', 'post', params)
    },
    Select: [
      {
        name: 'str',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 10,
        items: magCategory
      }, {
        name: 'version',
        default: 'v2',
        label: '数据集',
        multiple: false,
        cols: 2,
        items: [{
          text: '全集',
          value: 'v2'
        }, {
          text: '去掉引用为0的数据',
          value: 'delete_noref_v2'
        }]
      }
    ],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'MasArticlesTotalV2': {
    ChName: 'MAG 文章数 v2',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_2,
    RequestFunc: async(params) => {
      return await requestWrap('wiki/getMasArticlesTotal_v2', 'post', params)
    },
    Select: [
      {
        name: 'subjects',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 12,
        items: coreCategorys
      }
    ],
    RangeSlider: [],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'MasArticlesTotal': {
    ChName: 'MAG 文章数',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_2,
    RequestFunc: async(params) => {
      return await requestWrap('wiki/getMasArticlesTotal', 'post', params)
    },
    Select: [
      {
        name: 'subjects',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 12,
        items: coreCategorys
      }
    ],
    RangeSlider: [],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'TjYearByTopN': {
    ChName: 'mag topN学科逐年分布',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_1,
    RequestFunc: async(params) => {
      return await requestWrap('mag/getTjYearByTopN', 'post', params)
    },
    Select: [
      {
        name: 'str',
        default: defaultCategorySelect,
        multiple: true,
        label: '目标学科',
        cols: 8,
        items: magCategory
      }, {
        name: 'type',
        default: 'zipf',
        label: '排名规则',
        multiple: false,
        cols: 2,
        items: [{
          text: '按世界排名',
          value: 'zipf'
        }, {
          text: '按小世界排名',
          value: 'innerzipf'
        }]
      }, {
        name: 'N',
        default: 20000,
        label: 'TopN',
        multiple: false,
        cols: 2,
        items: [10000, 20000, 30000, 40000, 50000]
      }],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'NodeAndEdgeByYear': {
    ChName: 'mag 历年点边数据统计',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_3,
    RequestFunc: async(params) => {
      params.db = 'mag'
      // 当年
      const data_a = await requestWrap('mag/getNodeAndEdgeByYear', 'post', params)
      // 截至年
      const data_b = await requestWrap('mag/getNodeAndEdgeThatTime', 'post', params)
      data_a.data.legend = data_a.data.legend.map(item => `${item}-当年`)
      data_b.data.legend = data_b.data.legend.map(item => `${item}-当时（包含过去）`)
      return [data_a.data, data_b.data]
    },
    Select: [
      {
        name: 'version',
        default: 'delete_noref_v2',
        label: '当时（包含过去）数据集',
        show: true,
        cols: 2,
        items: [{ text: '去0', value: 'delete_noref_v2' }, { text: '全集', value: 'v2' }]
      }],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1900, 2019],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  'DisruptionByYearc': {
    ChName: '学科颠覆度年度分布',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_3,
    RequestFunc: async(params) => {
      params.db = 'mag'
      // 当年
      const data_a = await requestWrap('mag/getNodeAndEdgeByYear', 'post', params)
      // 截至年
      const data_b = await requestWrap('mag/getNodeAndEdgeThatTime', 'post', params)
      data_a.data.legend = data_a.data.legend.map(item => `${item}-当年`)
      data_b.data.legend = data_b.data.legend.map(item => `${item}-当时（包含过去）`)
      return [data_a.data, data_b.data]
    },
    Select: [
      {
        name: 'subjects',
        default: SELECT_MAG_DATA,
        label: '目标学科',
        multiple: true,
        show: true,
        cols: 12,
        items: MAG_ALL_SUBJECT
      }, {
        name: 'linksOutCount',
        default: 0,
        label: 'linksout 最小数量',
        show: true,
        cols: 2,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]
      }, {
        name: 'linksInCount',
        default: 0,
        label: 'linksin 最小数量',
        show: true,
        cols: 2,
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]
      }, {
        name: 'filterD',
        default: 1,
        label: 'D 上限',
        show: true,
        cols: 2,
        items: [0.8, 0.85, 0.9, 0.95, 0.9999, 1]
      }, {
        name: 'topLimit',
        default: 100,
        label: '固定点数上限（优先）',
        show: true,
        cols: 2,
        items: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 10000]
      }, {
        name: 'topPercent',
        default: 0,
        label: '固定百分比上限',
        show: true,
        cols: 2,
        items: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 64, 70, 75, 80, 85, 90, 95, 100]
      }, {
        name: 'decimalLen',
        default: 5,
        label: '保留小数位',
        show: true,
        cols: 2,
        items: [5, 6, 7, 8, 9, 10]
      }],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'yearStart',
      rangeDefault: [1900, 2019],
      endName: 'yearEnd',
      label: '年份范围',
      cols: 12,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  }
}
