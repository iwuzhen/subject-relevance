/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-10-28 17:35:06
 * @LastEditors: ider
 * @LastEditTime: 2020-11-05 10:44:07
 * @Description: 图表模板，自动化配置成图表，不用每个图表画一个Vue了
 */

import { requestWrap } from '@/api/index'
import { coreCategorys, magCategory, defaultCategorySelect, extendEchartsOpts, extendLineSeries } from '@/api/data'

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
    xAxisName: 'Count',
    yAxisName: 'Year'

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
        name: 'yearType',
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
    xAxisName: 'Count',
    yAxisName: 'Year'
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
    xAxisName: 'Count',
    yAxisName: 'Year'
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
    xAxisName: 'Count',
    yAxisName: 'Year'
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
    xAxisName: 'Count',
    yAxisName: 'Year'
  },
  'TjYearByTopN': {
    ChName: 'fos学科领域逐年分布',
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
        cols: 10,
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
      }
    ],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [2000, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2019,
      min: 1900
    }],
    xAxisName: 'Count',
    yAxisName: 'Year'
  }
}
