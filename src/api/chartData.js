/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-10-28 17:35:06
 * @LastEditors: ider
 * @LastEditTime: 2021-01-20 13:33:25
 * @Description: 图表模板，自动化配置成图表，不用每个图表画一个Vue了
 */

import { requestWrap } from '@/api/index'
import { coreCategorys, magCategory, SELECT_MAG_DATA, MAGCoreCategorys2020, defaultCategorySelect, extendEchartsOpts, extendLineSeries } from '@/api/data'
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

const setChartOption_bar_1 = ({ retData_1, retData_2, retData_3 }, ChartObj) => {
  const _opt = extendEchartsOpts({
    title: [{
      left: 'center',
      gridIndex: 0,
      text: retData_1.title
    }, {
      top: '30%',
      left: 'center',
      gridIndex: 1,
      text: retData_2.data.title
    }, {
      top: '65%',
      left: 'center',
      gridIndex: 2,
      text: retData_3.title
    }],
    legend: [
      {
        orient: 'vertical',
        top: '10%',
        // right: 0,
        // align: 'right',
        gridIndex: 0,
        data: retData_2.data.legend,
        type: 'scroll',
        left: '82%',
        right: 'left',
        // top: 'middle',
        textStyle: {
          fontSize: 13
        }
      }
    ],
    xAxis:
    [
      {
        gridIndex: 1,
        name: 'subject',
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: -25
        },
        data: Object.keys(retData_1.data)
      },
      {
        name: ChartObj.xAxisName,
        type: 'category', gridIndex: 0,
        axisLabel: {
          interval: 0,
          rotate: -75
        },
        data: retData_2.data.x
      },
      {
        name: 'item',
        type: 'category', gridIndex: 2,
        axisLabel: {
          interval: 0,
          rotate: -25
        },
        data: Object.keys(retData_3.data)
      }],
    yAxis:
    [
      {
        gridIndex: 1,
        name: ChartObj.yAxisName,
        type: 'value',
        nameTextStyle: { fontSize: 18 }
      },
      {
        gridIndex: 0,
        name: 'Count',
        type: 'value',
        nameTextStyle: { fontSize: 18 }
      },
      {
        gridIndex: 2,
        name: 'Count',
        type: 'value',
        nameTextStyle: { fontSize: 18 }
      }
    ],
    grid: [
      { top: '3%', bottom: '75%',
        right: '20%' },
      { top: '35%', bottom: '40%',
        right: '20%' },
      { top: '70%', bottom: '3%',
        right: '20%' }
    ],
    series: [{
      xAxisIndex: 0,
      yAxisIndex: 0,
      name: '数量',
      type: 'bar',
      data: Object.values(retData_1.data)
    }, ..._.zip(retData_2.data.legend, retData_2.data.y).map(item => {
      return extendLineSeries({
        xAxisIndex: 1,
        yAxisIndex: 1,
        name: item[0],
        type: 'line',
        smooth: false,
        data: item[1]
      })
    }),
    {
      xAxisIndex: 2,
      yAxisIndex: 2,
      name: '数量',
      type: 'bar',
      data: Object.values(retData_3.data)
    }]
  })
  return _opt
}

const setChartOption_bar_2 = (retData, ChartObj) => {
  const _opt = extendEchartsOpts({
    title: {
      text: retData.title
    },
    legend: {
      data: retData.legend
    },
    xAxis: {
      name: ChartObj.xAxisName,
      type: 'category',
      boundaryGap: false,
      data: retData.x
    },
    yAxis: {
      name: ChartObj.yAxisName,
      type: 'value'
    },
    series: _.zip(retData.legend, retData.y).map(item => {
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

// const MAGCoreCategorys2020 = [
//   'Algebra', 'Anthropology', 'Applied mathematics',
//   'Applied physics', 'Artificial intelligence', 'Biological engineering',
//   'Biology', 'Chemical engineering',
//   'Chemistry', 'Civil engineering',
//   'Cognitive science', 'Computer engineering',
//   'Computer science', 'Deep learning',
//   'Discrete mathematics', 'Earth science', 'Economics',
//   'Electrical engineering', 'Engineering disciplines',
//   'Environmental engineering', 'Environmental science', 'Experimental physics',
//   'Genetic engineering', 'Genome editing',
//   'Geography', 'Geology', 'Geometry', 'History',
//   'Industrial engineering', 'Linguistics', 'Literature',
//   'Logic', 'Machine learning', 'Materials science',
//   'Mathematics', 'Mechanical engineering',
//   'Medicine', 'Neuroscience', 'Number theory', 'Operating system',
//   'Philosophy', 'Physics', 'Political science', 'Psychology',
//   'Quantum computing', 'Sociology', 'Theoretical computer science', 'Theoretical physics'
// ].sort().map(each => {
//   return {
//     text: each === 'Engineering disciplines' ? 'Engineering' : each,
//     value: each
//   }
// })

export const ChartMap = {
  'mag2019v2/AuthorsAndArticleInfoByYear': {
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
  'mag2019v2/LinkTjByYear': {
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
  'mag2019v2/FosTjByYearV2': {
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
  'mag2019v2/MagArticlesTotalV2': {
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
  'mag2019v1/MagArticlesTotal': {
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
  'mag2019v2/TjYearByTopN': {
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
  'mag2019v2/NodeAndEdgeByYear': {
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
        items: MAGCoreCategorys2020
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
  },

  'mag2020/MagArticlesTotalV3': {
    ChName: '统计学科论文数量',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_bar_1,
    RequestFunc: async(params) => {
      // 此处处理三个请求
      // 统计学科不按年分布
      let newParams = {
        doctype: 1,
        cats: params.cats,
        version: params.version,
        yeartype: 1
      }
      const retData_1 = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', newParams)

      // 统计学科按年分布
      newParams = {
        doctype: 1,
        cats: params.cats,
        version: params.version,
        yeartype: 0,
        from: params.from,
        to: params.to
      }
      const retData_2 = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', newParams)

      // 统计论文类型分布
      newParams = {
        doctype: 0,
        version: params.version,
        bltype: params.bltype
      }
      const retData_3 = await requestWrap('wiki/getMasArticlesTotal_v3', 'post', newParams)

      return { retData_1, retData_2, retData_3 }
    },
    Select: [
      {
        name: 'cats',
        default: SELECT_MAG_DATA,
        multiple: true,
        show: true,
        label: '目标学科',
        cols: 8,
        items: MAGCoreCategorys2020
      }, {
        name: 'bltype',
        default: '1',
        show: true,
        label: '数值类型',
        cols: 2,
        items: [{ text: '统计数值', value: '0' }, { text: '统计比例', value: '1' }]
      }, {
        name: 'version',
        default: 'v3',
        label: '过滤条件',
        show: true,
        cols: 2,
        items: [{ text: '论文(去Book 去Patent)', value: 'v3' }, { text: '论文(去0 去Book 去Patent)', value: 'delete_noref_v3' },
          { text: '论文(只含Book)', value: 'book_all_v3' }, { text: '论文=(只含Patent)', value: 'patent_all_v3' }]
      }
    ],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1955, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }],
    xAxisName: 'Year',
    chartHeight: '210vh',
    yAxisName: 'Count'
  },
  'mag2020/TjYearByTopN_v3': {
    ChName: 'topN学科逐年分布',
    componentName: 'PageTemplate',
    HandleResponseFunc: setChartOption_bar_2,
    RequestFunc: async(params) => {
      // 当年
      const data = await requestWrap('mag/getTjYearByTopN_v3', 'post', params)
      return data.data
    },
    Select: [
      {
        name: 'str',
        default: SELECT_MAG_DATA,
        label: '目标学科',
        multiple: true,
        show: true,
        cols: 8,
        items: MAGCoreCategorys2020
      }, {
        name: 'version',
        default: 'nopb_delete_noref_v3',
        label: '过滤条件',
        show: true,
        cols: 4,
        items: [{
          text: '论文(去0 去Book 去Patent)',
          value: 'nopb_delete_noref_v3'
        }]
      }, {
        name: 'N',
        default: 40000,
        label: '固定点数上限（优先）',
        show: true,
        cols: 2,
        items: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000]
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
      }],
    Slider: [{
      name: 'year',
      Default: 2020,
      label: '数据截止',
      step: 1,
      cols: 10,
      max: 2020,
      min: 1900
    }],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1980, 2020],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }],
    xAxisName: 'Year',
    yAxisName: 'Count'
  },
  // 'mag2020/linkscf': {
  //   ChName: '学科引用其他学科的逐年分布趋势',
  //   componentName: 'PageTemplate',
  //   HandleResponseFunc: ([responseData, yaisa], ChartObj) => {
  //     const _opt = extendEchartsOpts({
  //       title: {
  //         text: responseData.data.title
  //       },
  //       legend: {
  //         data: responseData.data.legend
  //       },
  //       xAxis: {
  //         name: ChartObj.xAxisName,
  //         type: 'category',
  //         boundaryGap: false,
  //         data: responseData.data.x
  //       },
  //       yAxis: {
  //         name: yaisa,
  //         type: 'value'
  //       },
  //       series: zip(responseData.data.legend, responseData.data.y).map(item => {
  //         return extendLineSeries({
  //           name: item[0],
  //           type: 'line',
  //           smooth: false,
  //           data: item[1]
  //         })
  //       })
  //     })
  //     return _opt
  //   },
  //   RequestFunc: async(params) => {
  //     if (params.yearA < params.to_yearB) {
  //       params.to_yearB = params.yearA
  //     }
  //     // 当年
  //     const data = await requestWrap('mag/maglinkscf', 'post', params)
  //     let yaisa = 'percent'
  //     if (params.returnType === '0') {
  //       yaisa = 'count'
  //     }
  //     return [data, yaisa]
  //   },
  //   Select: [{
  //     name: 'fz',
  //     default: '0',
  //     label: '模式',
  //     show: true,
  //     cols: 2,
  //     items: [{
  //       text: '当前学科对目标学科的引用情况',
  //       value: '0'
  //     }, {
  //       text: '目标学科对当前学科的引用情况',
  //       value: '1'
  //     }]
  //   },
  //   {
  //     name: 'catA',
  //     default: 'Biology',
  //     label: '当前学科',
  //     show: true,
  //     cols: 2,
  //     items: MAGCoreCategorys2020
  //   }, {
  //     name: 'catB',
  //     default: SELECT_MAG_DATA,
  //     label: '目标学科',
  //     multiple: true,
  //     show: true,
  //     cols: 8,
  //     items: MAGCoreCategorys2020
  //   }, {
  //     name: 'version',
  //     default: 'tjart_nopb_delete_noref_v3',
  //     label: '过滤条件',
  //     show: true,
  //     cols: 2,
  //     items: [{
  //       text: '文章 去0 去Book和Patent',
  //       value: 'tjart_nopb_delete_noref_v3'
  //     }]
  //   }, {
  //     name: 'type',
  //     default: 'linksout',
  //     label: '引用条件',
  //     show: true,
  //     cols: 2,
  //     items: [{
  //       text: 'linksout',
  //       value: 'linksout'
  //     }]
  //   }, {
  //     name: 'returnType',
  //     default: '1',
  //     label: '返回类型',
  //     multiple: false,
  //     cols: 2,
  //     items: [{
  //       text: '数值',
  //       value: '0'
  //     }, {
  //       text: '比例',
  //       value: '1'
  //     }]
  //   }],
  //   Slider: [{
  //     name: 'yearA',
  //     Default: 2017,
  //     label: '当前学科年份',
  //     step: 1,
  //     cols: 10,
  //     max: 2020,
  //     min: 1955
  //   }],
  //   RangeSlider: [{
  //     name: 'yearRange',
  //     startName: 'from_yearB',
  //     rangeDefault: [1980, 2020],
  //     endName: 'to_yearB',
  //     label: '目标学科年份范围',
  //     cols: 12,
  //     max: 2020,
  //     min: 1900
  //   }],
  //   xAxisName: 'Year',
  //   yAxisName: 'Count'
  // },
  'mag2020/tjhaslinksinByCats': {
    ChName: '统计学科被引用为0的情况',
    componentName: 'PageTemplate',
    HandleResponseFunc: ([responseData, yaisa], ChartObj) => {
      if (responseData.data.legend !== undefined) {
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
            name: yaisa,
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
      } else {
        const _opt = extendEchartsOpts({
          title: {
            text: responseData.data.title
          },
          xAxis: {
            name: ChartObj.xAxisName,
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: -25
            },
            data: responseData.data.x
          },
          yAxis: {
            name: yaisa,
            type: 'value'
          },
          series:
           extendLineSeries({
             type: 'bar',
             data: responseData.data.y
           })

        })
        return _opt
      }
    },
    RequestFunc: async(params) => {
      // 当年
      const data = await requestWrap('mag/tjhaslinksinByCats', 'post', params)
      let yaisa = 'percent'
      if (params.returnType === '0') {
        yaisa = 'count'
      }
      return [data, yaisa]
    },
    Select: [
      {
        name: 'cat',
        default: SELECT_MAG_DATA,
        label: '目标学科',
        multiple: true,
        show: true,
        cols: 8,
        items: MAGCoreCategorys2020
      }, {
        name: 'returnType',
        default: '1',
        label: '展示类型',
        multiple: false,
        cols: 2,
        items: [{
          text: '数值',
          value: '0'
        }, {
          text: '比例',
          value: '1'
        }]
      }, {
        name: 'yearType',
        default: '1',
        label: '是否按年',
        multiple: false,
        cols: 2,
        items: [{
          text: '不按年',
          value: '0'
        }, {
          text: '按年',
          value: '1'
        }]
      }],
    Slider: [],
    RangeSlider: [{
      name: 'yearRange',
      startName: 'from_year',
      rangeDefault: [1955, 2020],
      endName: 'to_year',
      label: '目标学科年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }],
    xAxisName: 'Subject',
    yAxisName: 'Count'
  }
}
