/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-10-28 17:35:06
 * @LastEditors: ider
 * @LastEditTime: 2021-11-12 15:33:28
 * @Description: 图表模板，自动化配置成图表，不用每个图表画一个Vue了
 */

import { requestWrap } from '@/api/index'
import { WIKI_TOP_CATEGORY, defaultCategorySelect, coreCategorys, magCategory, SELECT_MAG_DATA, MAGCoreCategorys2020, SELECT_MAG_DATA_V1, MAGCoreCategorys2020_V1, extendEchartsOpts, extendLineSeries } from '@/api/data'
import _ from 'lodash'

import wikipediaNetworkQuarter from '@/assets/data/wikipediaNetwork_Quarter.json'
import wikipediaDirectNetWorkXueShu from '@/assets/data/wikipediaDirectNetWorkXueShu.json'
import wikipediaDirectNetWorkXueShuLV3 from '@/assets/data/wikipediaDirectNetWorkXueShuLV3.json'

import wikipedia_struct_entropy_lv2 from '@/assets/data/wikipedia_struct_entropy_lv2.json'
import wikipedia_struct_entropy_lv3 from '@/assets/data/wikipedia_struct_entropy_lv3.json'

const SessionXData = []
for (const year of _.range(2007, 2022)) {
  for (const session of _.range(1, 5)) {
    if (year === 2021 && session === 2) {
      break
    }
    SessionXData.push(`${year}-S${session}`)
  }
}

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

function formatNum(value) {
  if (!value && value !== 0) return 0

  const str = value.toString()
  const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
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
      type: 'value',
      boundaryGap: false,
      min: 'dataMin'
    },
    yAxis: {
      name: ChartObj.yAxisName,
      type: 'value'
    },
    series: _.zip(retData.legend, retData.y).map(item => {
      console.log(_.zip(retData.x, item[1]))
      return extendLineSeries({
        name: item[0],
        type: 'line',
        smooth: false,
        data: _.zip(retData.x, item[1])
      })
    })
  })
  return _opt
}

const ALLMAGCoreCategorys2020 = MAGCoreCategorys2020.concat()
ALLMAGCoreCategorys2020.unshift({
  value: 'all',
  text: 'all，不按学科分类'
})

const ALL_SELECT_MAG_DATA = SELECT_MAG_DATA.concat()
ALL_SELECT_MAG_DATA.unshift('all')

export const ChartMap = {}

ChartMap['DisruptionByYearc'] = {
  ChName: '学科颠覆度年度分布',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_3,
  RequestFunc: async params => {
    params.db = 'mag'
    // 当年
    const data_a = await requestWrap(
      'mag/getNodeAndEdgeByYear',
      'post',
      params
    )
    // 截至年
    const data_b = await requestWrap(
      'mag/getNodeAndEdgeThatTime',
      'post',
      params
    )
    data_a.data.legend = data_a.data.legend.map(
      item => `${item}-当年`
    )
    data_b.data.legend = data_b.data.legend.map(
      item => `${item}-当时（包含过去）`
    )
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
    },
    {
      name: 'linksOutCount',
      default: 0,
      label: 'linksout 最小数量',
      show: true,
      cols: 2,
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]
    },
    {
      name: 'linksInCount',
      default: 0,
      label: 'linksin 最小数量',
      show: true,
      cols: 2,
      items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]
    },
    {
      name: 'filterD',
      default: 1,
      label: 'D 上限',
      show: true,
      cols: 2,
      items: [0.8, 0.85, 0.9, 0.95, 0.9999, 1]
    },
    {
      name: 'topLimit',
      default: 100,
      label: '固定点数上限（优先）',
      show: true,
      cols: 2,
      items: [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000,
        2000,
        3000,
        4000,
        5000,
        10000
      ]
    },
    {
      name: 'topPercent',
      default: 0,
      label: '固定百分比上限',
      show: true,
      cols: 2,
      items: [
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        64,
        70,
        75,
        80,
        85,
        90,
        95,
        100
      ]
    },
    {
      name: 'decimalLen',
      default: 5,
      label: '保留小数位',
      show: true,
      cols: 2,
      items: [5, 6, 7, 8, 9, 10]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'yearStart',
      rangeDefault: [1900, 2019],
      endName: 'yearEnd',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/MagArticlesTotalV3'] = {
  ChName: '统计学科论文数量',
  componentName: 'PageTemplate',
  HandleResponseFunc: (
    { retData_1, retData_2, retData_3, retData_4 },
    ChartObj
  ) => {
    console.log(retData_4)
    const _opt = extendEchartsOpts({
      title: [
        {
          left: 'center',
          gridIndex: 0,
          text: retData_2.data.title
        },
        {
          top: '25%',
          left: 'center',
          gridIndex: 1,
          text: 'mag2020 论文年差量'
        },
        {
          top: '50%',
          left: 'center',
          gridIndex: 1,
          text: retData_1.title
        },
        {
          top: '75%',
          left: 'center',
          gridIndex: 2,
          text: retData_3.title
        }
      ],
      legend: [
        {
          orient: 'vertical',
          top: '3%',
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
        },
        {
          orient: 'vertical',
          top: '28%',
          gridIndex: 0,
          data: retData_4.data.legend,
          type: 'scroll',
          left: '82%',
          right: 'left',
          // top: 'middle',
          textStyle: {
            fontSize: 13
          }
        }
      ],
      xAxis: [
        {
          gridIndex: 0,
          name: 'subject',
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: -75
          },
          data: retData_2.data.x
        },
        {
          name: ChartObj.xAxisName,
          type: 'category',
          gridIndex: 1,
          axisLabel: {
            interval: 0,
            rotate: -75
          },
          data: retData_4.data.x
        },
        {
          name: ChartObj.xAxisName,
          type: 'category',
          gridIndex: 2,
          axisLabel: {
            interval: 0,
            rotate: -25
          },
          data: Object.keys(retData_1.data)
        },
        {
          name: 'item',
          type: 'category',
          gridIndex: 3,
          axisLabel: {
            interval: 0,
            rotate: -25
          },
          data: Object.keys(retData_3.data)
        }
      ],
      yAxis: [
        {
          gridIndex: 0,
          name: ChartObj.yAxisName,
          type: 'value',
          nameTextStyle: { fontSize: 18 }
        },
        {
          gridIndex: 1,
          name: 'Count',
          type: 'value',
          nameTextStyle: { fontSize: 18 }
        },
        {
          gridIndex: 2,
          name: 'Count',
          type: 'value',
          nameTextStyle: { fontSize: 18 }
        },
        {
          gridIndex: 3,
          name: 'Count',
          type: 'value',
          nameTextStyle: { fontSize: 18 }
        }
      ],
      grid: [
        { top: '3%', bottom: '79%', right: '20%' },
        { top: '28%', bottom: '53%', right: '20%' },
        { top: '55%', bottom: '28%', right: '20%' },
        { top: '78%', bottom: '3%', right: '20%' }
      ],
      series: [
        {
          xAxisIndex: 2,
          yAxisIndex: 2,
          name: '数量',
          type: 'bar',
          data: Object.values(retData_1.data)
        },
        ..._.zip(retData_2.data.legend, retData_2.data.y).map(item => {
          return extendLineSeries({
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }),
        ..._.zip(retData_4.data.legend, retData_4.data.y).map(item => {
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
          xAxisIndex: 3,
          yAxisIndex: 3,
          name: '数量',
          type: 'bar',
          data: Object.values(retData_3.data)
        }
      ]
    })
    return _opt
  },
  RequestFunc: async params => {
    // 此处处理三个请求
    // 统计学科不按年分布
    let newParams = {
      doctype: 1,
      cats: params.cats,
      version: params.version,
      yeartype: 1
    }
    const retData_1 = await requestWrap(
      'wiki/getMasArticlesTotal_v3',
      'post',
      newParams
    )

    // 统计学科按年分布
    newParams = {
      doctype: 1,
      cats: params.cats,
      version: params.version,
      isLj: params.isLj,
      islog: params.islog,
      yeartype: 0,
      from: params.from,
      to: params.to
    }
    const retData_2 = await requestWrap(
      'wiki/getMasArticlesTotal_v3',
      'post',
      newParams
    )
    // 统计论文类型分布
    newParams = {
      doctype: 0,
      version: params.version,
      bltype: params.bltype
    }
    const retData_3 = await requestWrap(
      'wiki/getMasArticlesTotal_v3',
      'post',
      newParams
    )

    // 一阶差分
    newParams = {
      doctype: 1,
      addRate: 1, // API:getMasArticlesTotal_v3 增加参数:addRate=[0:原来的，1：获取增长率]
      cats: params.cats,
      version: params.version,
      yeartype: 0,
      from: params.from,
      to: params.to
    }
    const retData_4 = await requestWrap(
      'wiki/getMasArticlesTotal_v3',
      'post',
      newParams
    )

    return { retData_1, retData_2, retData_3, retData_4 }
  },
  Select: [
    {
      name: 'cats',
      default: SELECT_MAG_DATA_V1,
      multiple: true,
      show: true,
      label: '目标学科',
      cols: 8,
      items: MAGCoreCategorys2020_V1
    },
    {
      name: 'bltype',
      default: '1',
      show: true,
      label: '数值类型',
      cols: 1,
      items: [
        { text: '统计数值', value: '0' },
        { text: '统计比例', value: '1' }
      ]
    },
    {
      name: 'isLj',
      default: 0,
      show: true,
      label: '是否逐年',
      cols: 1,
      items: [
        { text: '逐年', value: 0 },
        { text: '累计', value: 1 }
      ]
    },
    {
      name: 'islog',
      default: 0,
      show: true,
      label: '是否log',
      cols: 1,
      items: [
        { text: '否', value: 0 },
        { text: '是', value: 1 }
      ]
    },
    {
      name: 'version',
      default: 'v3',
      label: '过滤条件',
      show: true,
      cols: 1,
      items: [
        { text: '论文(去Book 去Patent)', value: 'v3' },
        {
          text: '论文(去0 去Book 去Patent)',
          value: 'delete_noref_v3'
        },
        { text: '论文(只含Book)', value: 'book_all_v3' },
        { text: '论文=(只含Patent)', value: 'patent_all_v3' }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1955, 2020],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  chartHeight: '280vh',
  yAxisName: 'Count'
}

ChartMap['mag2020/TjYearByTopN_v3'] = {
  ChName: 'topN学科逐年分布',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_bar_2,
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/getTjYearByTopN_v3',
      'post',
      params
    )
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
    },
    {
      name: 'version',
      default: 'nopb_delete_noref_v3',
      label: '过滤条件',
      show: true,
      cols: 4,
      items: [
        {
          text: '论文(去0 去Book 去Patent)',
          value: 'nopb_delete_noref_v3'
        }
      ]
    },
    {
      name: 'N',
      default: 40000,
      label: '固定点数上限（优先）',
      show: true,
      cols: 2,
      items: [
        1000,
        2000,
        3000,
        4000,
        5000,
        6000,
        7000,
        8000,
        9000,
        10000,
        20000,
        30000,
        40000,
        50000
      ]
    },
    {
      name: 'type',
      default: 'zipf',
      label: '排名规则',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '按世界排名',
          value: 'zipf'
        },
        {
          text: '按小世界排名',
          value: 'innerzipf'
        }
      ]
    },
    {
      name: 'islog',
      default: 0,
      label: '是否取双对数',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '不取对数',
          value: 0
        },
        {
          text: '双对数',
          value: 1
        },
        {
          text: 'y轴单对数',
          value: 2
        }
      ]
    }
  ],
  Slider: [
    {
      name: 'year',
      Default: 2020,
      label: '数据截止',
      step: 1,
      cols: 10,
      max: 2020,
      min: 1900
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1980, 2020],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/NodeAndEdgeThatTimeByCats'] = {
  ChName: '各学科当时的点边统计',
  componentName: 'PageTemplate',
  chartHeight: '100vh',
  HandleResponseFunc: (responseData, ChartObj) => {
    console.log(responseData)
    const _opt = extendEchartsOpts({
      title: [
        {
          left: 'center',
          gridIndex: 0,
          text: responseData.edge.title
        },
        {
          top: '50%',
          left: 'center',
          gridIndex: 1,
          text: responseData.node.title
        }
      ],
      legend: {
        top: '6%',
        data: responseData.edge.legend
      },
      xAxis: [
        {
          gridIndex: 0,
          name: 'year',
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: -75
          },
          data: responseData.edge.x
        },
        {
          name: 'year',
          type: 'category',
          gridIndex: 1,
          axisLabel: {
            interval: 0,
            rotate: -75
          },
          data: responseData.node.x
        }
      ],
      yAxis: [
        {
          gridIndex: 0,
          name: 'Count',
          type: 'value',
          nameTextStyle: { fontSize: 18 },
          axisLine: {
            show: true
          }
        },
        {
          gridIndex: 1,
          name: 'Count',
          type: 'value',
          nameTextStyle: { fontSize: 18 },
          axisLine: {
            show: true
          }
        }
      ],
      grid: [
        { top: '10%', bottom: '58%', right: '20%' },
        { top: '58%', bottom: '5%', right: '20%' }
      ],
      series: [
        ...zip(responseData.edge.legend, responseData.edge.y).map(
          item => {
            return extendLineSeries({
              xAxisIndex: 0,
              yAxisIndex: 0,
              name: item[0],
              type: 'line',
              smooth: false,
              data: item[1]
            })
          }
        ),
        ...zip(responseData.node.legend, responseData.node.y).map(
          item => {
            return extendLineSeries({
              xAxisIndex: 1,
              yAxisIndex: 1,
              name: item[0],
              type: 'line',
              smooth: false,
              data: item[1]
            })
          }
        )
      ]
    })
    return _opt
  },
  RequestFunc: async params => {
    const data = await requestWrap(
      'mag/getNodeAndEdgeThatTimeByCats',
      'post',
      params
    )
    return data.data
  },
  Select: [
    {
      name: 'cats',
      default: SELECT_MAG_DATA,
      label: '目标学科',
      multiple: true,
      show: true,
      cols: 8,
      items: MAGCoreCategorys2020
    },
    {
      name: 'version',
      default: 'v3',
      label: '版本',
      show: true,
      cols: 2,
      items: [
        {
          text: '不去0',
          value: 'v3'
        }
      ]
    },
    {
      name: 'type',
      default: 'tjart_nopb',
      label: '引用条件',
      show: true,
      cols: 2,
      items: [
        {
          text: '论文(去Book 去Patent)',
          value: 'tjart_nopb'
        }
      ]
    },
    {
      name: 'db',
      default: 'mag',
      label: '数据库',
      show: false,
      cols: 2,
      items: [
        {
          text: 'mag',
          value: 'mag'
        }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1955, 2019],
      endName: 'to',
      label: '目标学科年份范围',
      cols: 12,
      max: 2020,
      min: 1945
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/tjhaslinksinByCats'] = {
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
        series: zip(responseData.data.legend, responseData.data.y).map(
          item => {
            return extendLineSeries({
              name: item[0],
              type: 'line',
              smooth: false,
              data: item[1]
            })
          }
        )
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
        series: extendLineSeries({
          type: 'bar',
          data: responseData.data.y
        })
      })
      return _opt
    }
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/tjhaslinksinByCats',
      'post',
      params
    )
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
    },
    {
      name: 'returnType',
      default: '1',
      label: '展示类型',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '数值',
          value: '0'
        },
        {
          text: '比例',
          value: '1'
        }
      ]
    },
    {
      name: 'yearType',
      default: '1',
      label: '是否按年',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '不按年',
          value: '0'
        },
        {
          text: '按年',
          value: '1'
        }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from_year',
      rangeDefault: [1955, 2020],
      endName: 'to_year',
      label: '目标学科年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Subject',
  yAxisName: 'Count'
}

ChartMap['mag2020/BanshuaiqiByYear'] = {
  ChName: '引用半衰期',
  componentName: 'PageTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/getBanshuaiqiByYear',
      'post',
      params
    )
    return data
  },
  Select: [
    {
      name: 'cats',
      default: SELECT_MAG_DATA_V1,
      label: '目标学科',
      multiple: true,
      show: true,
      cols: 8,
      items: MAGCoreCategorys2020_V1
    },
    {
      name: 'percent',
      default: 10,
      label: '百分比',
      multiple: false,
      cols: 2,
      items: _.range(10, 91, 10)
    },
    {
      name: 'version',
      default: 'delete_noref_v3',
      label: '数据',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '去0',
          value: 'delete_noref_v3'
        }
      ]
    },
    {
      name: 'type',
      default: 'tjart_nopb',
      label: '数据',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '论文(去Book，去Patent)',
          value: 'tjart_nopb'
        }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1955, 2020],
      endName: 'to',
      label: '目标学科年份范围',
      cols: 12,
      max: 2020,
      min: 1955
    }
  ],
  xAxisName: 'Year',
  yAxisName: '衰减期'
}

ChartMap['wikipedia/RefSelfRate'] = {
  ChName: 'wiki 自恋度',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'wiki/getWikiRefSelfRate',
      'post',
      params
    )
    return data
  },
  Select: [
    {
      name: 'str',
      default: [
        'Geology',
        'Geography',
        'Psychology',
        'Philosophy',
        'Mathematics',
        'Physics',
        'Biology',
        'Chemistry',
        'Sociology',
        'Economics',
        'Political science',
        'Linguistics',
        'Computer science',
        'Literature',
        'History'
      ],
      label: '目标学科',
      multiple: true,
      show: true,
      cols: 8,
      items: [
        'Geology',
        'Geography',
        'Psychology',
        'Philosophy',
        'Mathematics',
        'Physics',
        'Biology',
        'Chemistry',
        'Sociology',
        'Economics',
        'Political science',
        'Linguistics',
        'Computer science',
        'Literature',
        'History'
      ].sort()
    },
    {
      name: 'method',
      default: 'linksout',
      label: '链接方向',
      multiple: false,
      cols: 2,
      items: ['linksout', 'linksin']
    },
    {
      name: 'version',
      default: 'v5',
      label: '版本',
      multiple: false,
      cols: 3,
      items: [
        {
          text: 'v5 学术(排除文学历史)',
          value: 'v5_xueshu_noHistoryAndLiterature'
        },
        {
          text: 'v5 学术',
          value: 'v5_xueshu'
        },
        {
          text: 'v5',
          value: 'v5'
        }
      ]
    },
    {
      name: 'level',
      default: 3,
      label: 'level',
      multiple: false,
      cols: 2,
      items: [2, 3, 4],
      func: that => {
        that.options.version = 'v5'
        if (that.options.level === 2) {
          const v5Subject_lv2 = [
            'Geology',
            'Geography',
            'Psychology',
            'Philosophy',
            'Mathematics',
            'Physics',
            'Biology',
            'Chemistry',
            'Sociology',
            'Economics',
            'Political science',
            'Linguistics',
            'Computer science',
            'Literature',
            'History',
            'Materials science',
            'Engineering disciplines',
            'Environmental science',
            'Medicine',
            'Art',
            'Business'
          ].sort()
          that.options.str = v5Subject_lv2
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'version') {
              that.ChartObj.Select[i].items = [
                {
                  text: 'v5 学术',
                  value: 'v5_xueshu'
                },
                {
                  text: 'v5',
                  value: 'v5'
                }
              ]
            }
            if (that.ChartObj.Select[i].name === 'str') {
              that.ChartObj.Select[i].items = v5Subject_lv2
            }
          }
        } else {
          const v5Subject = [
            'Geology',
            'Geography',
            'Psychology',
            'Philosophy',
            'Mathematics',
            'Physics',
            'Biology',
            'Chemistry',
            'Sociology',
            'Economics',
            'Political science',
            'Linguistics',
            'Computer science',
            'Literature',
            'History',
            'Materials science',
            'Engineering disciplines',
            'Environmental science',
            'Medicine'
          ].sort()

          that.options.str = v5Subject
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'version') {
              that.ChartObj.Select[i].items = [
                {
                  text: 'v5 学术(排除文学历史)',
                  value: 'v5_xueshu_noHistoryAndLiterature'
                },
                {
                  text: 'v5 学术',
                  value: 'v5_xueshu'
                },
                {
                  text: 'v5',
                  value: 'v5'
                }
              ]
            }
            if (that.ChartObj.Select[i].name === 'str') {
              that.ChartObj.Select[i].items = v5Subject
            }
          }
        }
        console.log()
        that.getData()
      }
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: '自恋度'
}

ChartMap[ 'wikipedia/ArticlesTotalByCoreNew_v5'] = {
  ChName: 'core_v5文章数links统计',
  componentName: 'PageTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'wiki/getArticlesTotalByCoreNew_v5',
      'post',
      params
    )
    console.log(data)
    return data
  },
  Select: [
    {
      name: 'subjects',
      default: [
        'Geology',
        'Geography',
        'Psychology',
        'Philosophy',
        'Mathematics',
        'Physics',
        'Biology',
        'Chemistry',
        'Sociology',
        'Economics',
        'Political science',
        'Linguistics',
        'Computer science',
        'Literature',
        'History',
        'Materials science',
        'Engineering disciplines',
        'Environmental science',
        'Medicine',
        'Art',
        'Business'
      ].sort(),
      label: '目标学科',
      multiple: true,
      show: true,
      cols: 8,
      items: [
        'Geology',
        'Geography',
        'Psychology',
        'Philosophy',
        'Mathematics',
        'Physics',
        'Biology',
        'Chemistry',
        'Sociology',
        'Economics',
        'Political science',
        'Linguistics',
        'Computer science',
        'Literature',
        'History',
        'Materials science',
        'Engineering disciplines',
        'Environmental science',
        'Medicine',
        'Art',
        'Business'
      ].sort()
    },
    {
      name: 'level',
      default: 3,
      label: '层数',
      multiple: false,
      cols: 2,
      items: _.range(1, 5, 1)
    },
    {
      name: 'type',
      default: 'arts',
      label: '数据',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '文章数',
          value: 'arts'
        },
        {
          text: 'linksin数量',
          value: 'linksin'
        },
        {
          text: 'linksout数量',
          value: 'linksout'
        }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/topNLinksinByYear'] = {
  ChName: '各学科引用最高的文章的逐年引用情况',
  componentName: 'PageTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/topNLinksinByYear',
      'post',
      params
    )
    return data
  },
  Select: [
    {
      name: 'cat',
      default: 'Physics',
      label: '目标学科',
      multiple: false,
      show: true,
      cols: 3,
      items: MAGCoreCategorys2020_V1
    },
    {
      name: 'N',
      default: 3,
      label: '每个学科的文章按linksin排名取topN',
      multiple: false,
      cols: 4,
      items: _.range(1, 101, 1)
    }
  ],
  Slider: [],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1995, 2020],
      endName: 'to',
      label: '目标学科年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap[ 'wikipedia/WikiAndMagCountByYear'] = {
  ChName: 'wiki总文章和边数按年趋势',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
    const _opt = extendEchartsOpts({
      title: {
        text: responseData.data.title
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
      series: extendLineSeries({
        name: 'line',
        type: 'line',
        smooth: false,
        data: responseData.data.y
      })
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'wiki/getWikiAndMagCountByYear',
      'post',
      params
    )
    console.log(data)
    return data
  },
  Select: [
    {
      name: 'db',
      default: 'wiki',
      label: '数据库',
      multiple: false,
      show: true,
      cols: 3,
      items: [
        'wiki',
        'mag',
        { text: 'wiki 两层学术圈', value: 'xueshu_lv2' },
        { text: 'wiki 三层学术圈', value: 'xueshu_lv3' }
      ],
      func: that => {
        if (['xueshu_lv2', 'xueshu_lv3'].includes(that.options.db)) {
          that.options.type = 'node'
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'type') {
              that.ChartObj.Select[i].items = ['node', 'node_dx']
            }
          }
        } else if (that.options.db === 'mag') {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'type') {
              that.ChartObj.Select[i].items = [
                'node',
                'edge',
                { text: '边数/点数', value: 'avg' },
                'node_dx',
                'edge_dx',
                'fos_dx',
                'fos'
              ]
            }
          }
        } else {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'type') {
              that.ChartObj.Select[i].items = [
                'node',
                'edge',
                { text: '边数/点数', value: 'avg' },
                'node_dx',
                'edge_dx',
                'category',
                'category_dx'
              ]
            }
          }
        }
        that.getData()
      }
    },
    {
      name: 'type',
      default: 'node',
      label: '数据维度',
      multiple: false,
      show: true,
      cols: 3,
      items: [
        'node',
        'edge',
        { text: '边数/点数', value: 'avg' },
        'node_dx',
        'edge_dx',
        'category',
        'category_dx'
      ]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/MAG_ZldByTopN_every5000'] = {
  ChName: 'MAG 学科topN 每隔5000的自恋度',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: _.zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/getZldByTopN_every5000',
      'post',
      params
    )
    console.log(data)
    return data
  },
  Select: [
    {
      name: 'cat',
      default: [
        'History',
        'Geology',
        'Economics',
        'Geography',
        'Chemistry',
        'Philosophy',
        'Sociology',
        'Materials science',
        'Mathematics',
        'Biology',
        'Computer science',
        'Political science',
        'Engineering disciplines',
        'Psychology',
        'Environmental science',
        'Business',
        'Physics',
        'Medicine',
        'Art'
      ],
      label: '目标学科',
      multiple: true,
      show: true,
      cols: 8,
      items: [
        'History',
        'Geology',
        'Economics',
        'Geography',
        'Chemistry',
        'Philosophy',
        'Sociology',
        'Materials science',
        'Mathematics',
        'Biology',
        'Computer science',
        'Political science',
        'Engineering disciplines',
        'Psychology',
        'Environmental science',
        'Business',
        'Physics',
        'Medicine',
        'Art'
      ]
    },
    {
      name: 'type',
      default: 'delete_noref_v3_nopb',
      label: '数据维度',
      multiple: false,
      show: true,
      cols: 4,
      items: [
        {
          text: 'v3 去0 去patent和book',
          value: 'delete_noref_v3_nopb'
        }
      ]
    },
    {
      name: 'method',
      default: 'linksout',
      label: '边的方向',
      multiple: false,
      show: true,
      cols: 3,
      items: ['linksout']
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/MAG_PreCountByYear'] = {
  ChName: 'MAG N年之后的文章所引用的文章的逐年趋势',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
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
      series: _.zip(responseData.data.legend, responseData.data.y).map(
        item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        }
      )
    })
    return _opt
  },
  RequestFunc: async params => {
    // 当年
    const data = await requestWrap(
      'mag/getPreCountByYear',
      'post',
      params
    )
    console.log(data)
    return data
  },
  Select: [
    {
      name: 'year',
      default: 2000,
      label: 'year',
      multiple: false,
      show: true,
      cols: 4,
      items: [2000, 2003, 2005, 2008, 2010, 2012, 2013, 2015, 2018]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['wikipedia-build/ArticlesTotal'] = {
  ChName: 'wiki总文章和边数按年趋势',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (responseData, ChartObj) => {
    if (responseData.type === 1) {
      // 单图
      const _opt = extendEchartsOpts({
        title: {
          text: 'Article Count'
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          },
          axisPointer: {
            type: 'cross',
            animation: true,
            label: {
              backgroundColor: '#505765'
            }
          },
          formatter: function(params) {
            params.sort((x, y) => {
              if (y.data === undefined) {
                return -1
              }
              return y.data[1] - x.data[1]
            })
            let showHtm = ` ${params[0].data[0]}<br>`
            for (let i = 0; i < params.length; i++) {
              if (params[i].data === undefined) {
                continue
              }
              const _text = params[i].seriesName
              const _data = formatNum(params[i].data[1])
              const _marker = params[i].marker
              showHtm += `${_marker}${_text}：${_data}<br>`
            }
            return showHtm
          }
        },
        xAxis: {
          name: ChartObj.xAxisName,
          type: 'value',
          boundaryGap: false,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          name: ChartObj.yAxisName,
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          }
        },
        series: Object.entries(responseData.data).map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: Object.entries(item[1])
          })
        })
      })
      return _opt
    } else {
      // 按季度

      const keys = Object.keys(responseData.data[0])
      const newData = {}
      for (const name of keys) {
        newData[name] = []
        const tmpData = []
        for (const i in responseData.data) {
          // 翻转 数组
          tmpData.push(
            _.reverse(Object.values(responseData.data[i][name]))
          )
        }
        while (tmpData[0].length > 0) {
          for (const i in tmpData) {
            if (tmpData[i].length > 0) {
              newData[name].push(tmpData[i].pop())
            }
          }
        }
      }
      const _opt = extendEchartsOpts({
        title: {
          text: 'Article Count'
        },
        xAxis: {
          name: ChartObj.xAxisName,
          type: 'category',
          boundaryGap: false,
          data: SessionXData
        },
        yAxis: {
          name: ChartObj.yAxisName,
          type: 'value',
          axisLabel: {
            formatter: value => formatNum(value)
          }
        },
        series: Object.entries(newData).map(item => {
          return extendLineSeries({
            name: item[0],
            type: 'line',
            smooth: false,
            data: item[1]
          })
        })
      })
      console.log(_opt)
      return _opt
    }
  },
  RequestFunc: async params => {
    params.type = 0
    const handleData = {}
    if (params.version === 'v5_newDB_xueshu_new_noLiterature') {
      handleData.type = 2
      handleData.data = []
      for (const month of [3, 6, 9, 12]) {
        params.month = month
        const data = await requestWrap(
          'wiki/getArticlesTotalByCoreNew_v',
          'post',
          params
        )
        handleData.data.push(data)
      }
      return handleData
    } else {
      // 当年
      const data = await requestWrap(
        'wiki/getArticlesTotalByCoreNew_v',
        'post',
        params
      )
      handleData.type = 1
      handleData.data = data
      return handleData
    }
  },
  Select: [
    {
      name: 'subjects',
      default: WIKI_TOP_CATEGORY.concat(),
      label: '学科',
      multiple: true,
      show: true,
      cols: 8,
      items: WIKI_TOP_CATEGORY
    },
    {
      name: 'level',
      default: 2,
      label: 'level',
      multiple: false,
      show: true,
      cols: 2,
      items: [2, 3]
    },
    {
      name: 'version',
      default: 'v5_newDB_xueshu_new_noLiterature',
      label: '数据范围',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { text: 'v5', value: 'v5_newDB' },
        { text: 'v5 学术圈', value: 'v5_newDB_xueshu' },
        {
          text: 'v5 学术圈排除文学',
          value: 'v5_newDB_xueshu_new_noLiterature'
        }
      ]
      // func: that => {
      //   if (
      //     that.options.version !== 'v5_newDB_xueshu_new_noLiterature'
      //   ) {
      //     for (const i in that.ChartObj.Select) {
      //       if (that.ChartObj.Select[i].name === 'month') {
      //         that.ChartObj.Select[i].show = false
      //       }
      //     }
      //   } else {
      //     for (const i in that.ChartObj.Select) {
      //       if (that.ChartObj.Select[i].name === 'month') {
      //         that.ChartObj.Select[i].show = true
      //       }
      //     }
      //   }
      // }
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['wikipedia-build/smallworld'] = {
  ChName: 'wiki 学科小世界',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: ([responseData, vName, xData], ChartObj) => {
    const _opt = extendEchartsOpts({
      title: {
        text: '小世界属性'
      },
      xAxis: {
        name: ChartObj.xAxisName,
        type: 'category',
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        name: vName,
        type: 'value',
        axisLabel: {
          formatter: value => formatNum(value)
        },
        min: function(value) {
          return Math.floor(value.min * 10) / 10
        }
      },
      series: responseData.map(item => {
        return extendLineSeries({
          name: item[0],
          type: 'line',
          smooth: false,
          data: item[1]
        })
      })
    })
    return _opt
  },
  RequestFunc: async params => {
    console.log(wikipediaDirectNetWorkXueShuLV3)

    const xData = []
    for (const year of _.range(2007, 2022, 1)) {
      for (const q of [1, 2, 3, 4]) {
        if (year === 2021 && q > 1) {
          continue
        }
        xData.push(`${year}Q${q}`)
      }
    }
    let vName = '平均最短距离'
    if (params.type === 1) {
      vName = '集聚系数'
    } else if (params.type === 2) {
      vName = '联通文章数'
    } else if (params.type === 3) {
      vName = '文章数'
    } else if (params.type === 4) {
      vName = '联通文章数/文章数'
    }

    let networkData
    const filter_data = []
    if (params.source === 0) {
      const base10000ln = Math.log(10000)
      const base10000lnln = Math.log(10000) / Math.log(Math.log(10000))
      networkData = wikipediaNetworkQuarter
      for (const item of Object.entries(networkData)) {
        if (params.subjects.includes(item[0])) {
          if (params.type <= 3) {
            filter_data.push([
              item[0],
              item[1].map(value => value[params.type])
            ])
          } else if (params.type === 4) {
            filter_data.push([
              item[0],
              item[1].map(value => value[2] / value[3])
            ])
          } else if (params.type === 5) {
            filter_data.push([
              item[0],
              item[1].map(value => value[0] / (Math.log(value[3]) / base10000ln))
            ])
          } else if (params.type === 6) {
            filter_data.push([
              item[0],
              item[1].map(value => value[0] / (Math.log(value[3]) / Math.log(Math.log(value[3])) / base10000lnln))
            ])
          }
        }
      }
    } else {
      // 先过滤学科
      params.subjects += ',xueshu'
      if (params.source === 1) {
        networkData = wikipediaDirectNetWorkXueShu
      }
      if (params.source === 2) {
        networkData = wikipediaDirectNetWorkXueShuLV3
      }
      for (const item of Object.entries(networkData)) {
        if (params.subjects.includes(item[0])) {
          if (params.type === 0) {
            filter_data.push([
              item[0],
              item[1].map(value => value[0])
            ])
          } else if (params.type === 2) {
            filter_data.push([
              item[0],
              item[1].map(value => value[1])
            ])
          } else if (params.type === 3) {
            filter_data.push([
              item[0],
              item[1].map(value => value[2])
            ])
          } else if (params.type === 4) {
            filter_data.push([
              item[0],
              item[1].map(value => value[1] / value[2])
            ])
          }
        }
      }
    }

    filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))

    return [filter_data, vName, xData]
  },
  Select: [
    {
      name: 'subjects',
      default: [
        'Biology',
        'Chemistry',
        'Computer science',
        'Engineering disciplines',
        'Environmental science',
        'Materials science',
        'Mathematics',
        'Medicine',
        'Philosophy',
        'Physics',
        'Political science',
        'Psychology',
        'Sociology'
      ],
      label: '学科',
      multiple: true,
      show: true,
      cols: 8,
      items: [
        'Biology',
        'Business',
        'Chemistry',
        'Computer science',
        'Economics',
        'Engineering disciplines',
        'Environmental science',
        'Geography',
        'Geology',
        'History',
        'Linguistics',
        'Literature',
        'Materials science',
        'Mathematics',
        'Medicine',
        'Philosophy',
        'Physics',
        'Political science',
        'Psychology',
        'Sociology'
      ]
    },
    {
      name: 'type',
      default: 0,
      label: '数据维度',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { text: '平均最短距离', value: 0 },
        { text: '联通文章数', value: 2 },
        { text: '文章数', value: 3 },
        { text: '联通文章数/文章数', value: 4 }
      ]
    },
    {
      name: 'source',
      default: 1,
      label: '数据',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { text: '学科网络 level-2', value: 0 },
        { text: '学术圈网络 level-2', value: 1 },
        { text: '学术圈网络 level-3', value: 2 }
      ],
      func: that => {
        if (that.options.source === 0) {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'type') {
              that.ChartObj.Select[i].items = [
                { text: '平均最短距离', value: 0 },
                { text: 'ln - 平均最短距离', value: 5 },
                { text: '巴拉巴西 - 平均最短距离', value: 6 },
                { text: '集聚系数', value: 1 },
                { text: '联通文章数', value: 2 },
                { text: '文章数', value: 3 },
                { text: '联通文章数/文章数', value: 4 }
              ]
            }
          }
        } else if ([1, 2].indexOf(that.options.source) > 0) {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'type') {
              that.ChartObj.Select[i].items = [
                { text: '平均最短距离', value: 0 },
                { text: '联通文章数', value: 2 },
                { text: '文章数', value: 3 },
                { text: '联通文章数/文章数', value: 4 }
              ]
            }
          }
        }
        that.getData()
      }
    },
    {
      name: 'isDirect',
      default: true,
      label: '网络方向',
      multiple: false,
      show: false,
      cols: 2,
      items: [
        { text: '无向', value: false },
        { text: '有向', value: true }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2020/AuthorsAndArticleInfoByYear'] = {
  ChName: '作者数逐年统计',
  componentName: 'PageTemplate',
  RequestFunc: async params => {
    return await requestWrap(
      'mag/getMagAuthorsAndArticleInfo_year_v2',
      'post',
      params
    )
  },
  HandleResponseFunc: setChartOption_1,
  Select: [
    {
      name: 'str',
      default: ALL_SELECT_MAG_DATA,
      multiple: true,
      label: '目标学科',
      cols: 4,
      items: ALLMAGCoreCategorys2020
    },
    {
      name: 'returnType',
      default: 0,
      multiple: false,
      label: '过滤器',
      cols: 2,
      items: [
        {
          text: '逐年作者数(去重)',
          value: 0
        },
        {
          text: '逐年作者数(不去重)',
          value: 1
        },
        {
          text: '逐年文章数(去掉无作者的)',
          value: 2
        },
        {
          text: '逐年作者数(去重)/文章数-不靠谱',
          value: 3
        },
        {
          text: '逐年作者数(不去重)/文章数',
          value: 4
        }
      ]
    },
    {
      name: 'queryType',
      default: 0,
      label: '数据集',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '全集',
          value: 0
        },
        {
          text: '去除引用为0的数据',
          value: 1
        }
      ]
    },
    {
      name: 'yearType',
      default: -1,
      label: '作者数筛选',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '不筛选',
          value: -1
        },
        {
          text: '作者数在100内的论文',
          value: 0
        },
        {
          text: '作者数超过100的论文',
          value: 1
        }
      ]
    },
    {
      name: 'isdx',
      default: 0,
      label: '是否取增量',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '原值',
          value: 0
        },
        {
          text: 'dx 增量',
          value: 1
        }
      ]
    },
    {
      name: 'version',
      default: 'v3_tjart_nopb',
      label: '版本',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '论文(去Book，去Patent)',
          value: 'v3_tjart_nopb'
        },
        {
          text: '论文(去Patent)',
          value: 'v3_tjart_only_noPatent'
        }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2019v2/AuthorsAndArticleInfoByYear'] = {
  ChName: '作者数逐年统计',
  componentName: 'PageTemplate',
  RequestFunc: async params => {
    return await requestWrap(
      'mag/getMagAuthorsAndArticleInfo_year_v2',
      'post',
      params
    )
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
    },
    {
      name: 'returnType',
      default: 0,
      multiple: false,
      label: '过滤器',
      cols: 2,
      items: [
        {
          text: '逐年作者数(去重)',
          value: 0
        },
        {
          text: '逐年作者数(不去重)',
          value: 1
        },
        {
          text: '逐年文章数(去掉无作者的)',
          value: 2
        },
        {
          text: '逐年作者数(去重)/文章数-不靠谱',
          value: 3
        },
        {
          text: '逐年作者数(不去重)/文章数',
          value: 4
        }
      ]
    },
    {
      name: 'queryType',
      default: 0,
      label: '数据集',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '全集',
          value: 0
        },
        {
          text: '去除引用为0的数据',
          value: 1
        }
      ]
    },
    {
      name: 'yearType',
      default: -1,
      label: '作者数筛选',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '不筛选',
          value: -1
        },
        {
          text: '作者数在100内的论文',
          value: 0
        },
        {
          text: '作者数超过100的论文',
          value: 1
        }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2019v2/LinkTjByYear'] = {
  ChName: '引用关系逐年统计',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_1,
  RequestFunc: async params => {
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
    },
    {
      name: 'method',
      default: 'linksin',
      multiple: false,
      label: '引用方式',
      cols: 2,
      items: ['linksin', 'linksout']
    },
    {
      name: 'version',
      default: 'v2',
      label: '数据集',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '全集',
          value: 'v2'
        },
        {
          text: '去掉引用为0的数据',
          value: 'delete_noref_v2'
        }
      ]
    },
    {
      name: 'authorType',
      default: 0,
      label: '作者数筛选',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '不筛选',
          value: 0
        },
        {
          text: '作者数超过100的论文',
          value: 1
        }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2019v2/FosTjByYearV2'] = {
  ChName: 'fos学科领域逐年分布',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_1,
  RequestFunc: async params => {
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
    },
    {
      name: 'version',
      default: 'v2',
      label: '数据集',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '全集',
          value: 'v2'
        },
        {
          text: '去掉引用为0的数据',
          value: 'delete_noref_v2'
        }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2019v2/MagArticlesTotalV2'] = {
  ChName: 'MAG 文章数 v2',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_2,
  RequestFunc: async params => {
    return await requestWrap(
      'wiki/getMasArticlesTotal_v2',
      'post',
      params
    )
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
}

ChartMap['mag2019v1/MagArticlesTotal'] = {
  ChName: 'MAG 文章数',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_2,
  RequestFunc: async params => {
    return await requestWrap(
      'wiki/getMasArticlesTotal',
      'post',
      params
    )
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
}

ChartMap['mag2019v2/TjYearByTopN'] = {
  ChName: 'mag topN学科逐年分布',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_1,
  RequestFunc: async params => {
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
    },
    {
      name: 'type',
      default: 'zipf',
      label: '排名规则',
      multiple: false,
      cols: 2,
      items: [
        {
          text: '按世界排名',
          value: 'zipf'
        },
        {
          text: '按小世界排名',
          value: 'innerzipf'
        }
      ]
    },
    {
      name: 'N',
      default: 20000,
      label: 'TopN',
      multiple: false,
      cols: 2,
      items: [10000, 20000, 30000, 40000, 50000]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1945, 2018],
      endName: 'to',
      label: '年份范围',
      cols: 8,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['mag2019v2/NodeAndEdgeByYear'] = {
  ChName: 'mag 历年点边数据统计',
  componentName: 'PageTemplate',
  HandleResponseFunc: setChartOption_3,
  RequestFunc: async params => {
    params.db = 'mag'
    // 当年
    const data_a = await requestWrap(
      'mag/getNodeAndEdgeByYear',
      'post',
      params
    )
    // 截至年
    const data_b = await requestWrap(
      'mag/getNodeAndEdgeThatTime',
      'post',
      params
    )
    data_a.data.legend = data_a.data.legend.map(
      item => `${item}-当年`
    )
    data_b.data.legend = data_b.data.legend.map(
      item => `${item}-当时（包含过去）`
    )
    return [data_a.data, data_b.data]
  },
  Select: [
    {
      name: 'version',
      default: 'delete_noref_v2',
      label: '当时（包含过去）数据集',
      show: true,
      cols: 2,
      items: [
        { text: '去0', value: 'delete_noref_v2' },
        { text: '全集', value: 'v2' }
      ]
    }
  ],
  RangeSlider: [
    {
      name: 'yearRange',
      startName: 'from',
      rangeDefault: [1900, 2019],
      endName: 'to',
      label: '年份范围',
      cols: 12,
      max: 2020,
      min: 1900
    }
  ],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['wikipedia-build/WikiNiHe'] = {
  ChName: 'wiki 拟合数据',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (data, ChartObj) => {
    const lines = _.zip(data.legend, _.zip.apply(_, data.y))
    console.log(lines)
    lines.sort((x, y) => y[1].slice(-1) - x[1].slice(-1))
    const _opt = extendEchartsOpts({
      title: {
        text: data.title
      },
      xAxis: {
        name: ChartObj.xAxisName,
        type: 'category',
        boundaryGap: false,
        data: data.x
      },
      yAxis: {
        name: '',
        type: 'value',
        axisLabel: {
          formatter: value => formatNum(value)
        },
        min: function(value) {
          return Math.floor(value.min * 10) / 10
        }
      },
      series: lines.map(item => {
        return extendLineSeries({
          name: item[0],
          type: 'line',
          smooth: false,
          data: item[1]
        })
      })
    })
    if (data.remark) {
      const text = data.remark.replaceAll(/\\n/g, '\n')
      const graphic = [
        {
          type: 'text',
          z: 100,
          left: '15%',
          top: '15%',
          style: {
            fill: '#333',
            width: 400,
            overflow: 'break',
            text: text,
            font: '18px/2 "Microsoft YaHei", sans-serif'
          }
        }
      ]
      _opt['graphic'] = graphic
    }
    return _opt
  },
  RequestFunc: async params => {
    // params.db = 'mag'
    const new_params = Object.assign({}, params)
    if (new_params.type !== 2) {
      delete (new_params.level)
    }
    // 当年
    const data = await requestWrap(
      'wiki/getWikiNiHe',
      'post',
      new_params
    )
    console.log(data)
    return data.data
  },
  Select: [
    {
      name: 'type',
      default: 3,
      label: '数据库',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { text: 'wiki近期', value: 0 },
        { text: 'wiki早期', value: 1 },
        { text: 'wiki学术圈(8cat)', value: 2 },
        { text: 'wiki总数据', value: 3 }
      ],
      func: that => {
        console.log('that.options.type', that.options.type)

        if (that.options.type === 2) {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'level') {
              that.ChartObj.Select[i].show = true
            }
          }
        } else {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'level') {
              that.ChartObj.Select[i].show = false
            }
          }
        }
        if (that.options.type === 1) {
          that.options.index = 1
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'index') {
              that.ChartObj.Select[i].items = [
                { value: 0, text: '文章数' },
                { value: 1, text: '边数' },
                { value: 2, text: '边数除文章' },
                { value: 3, text: '类' },
                { value: 5, text: '平均文章长度' }
              ]
            }
          }
        } else {
          for (const i in that.ChartObj.Select) {
            if (that.ChartObj.Select[i].name === 'index') {
              that.ChartObj.Select[i].items = [
                { value: 0, text: '文章数' },
                { value: 1, text: '边数' },
                { value: 2, text: '边数除文章' },
                { value: 3, text: '类' },
                { value: 4, text: '总字数' },
                { value: 5, text: '平均文章长度' },
                { value: 6, text: '编辑次数' },
                { value: 7, text: '平均文章编辑次数' },
                { value: 8, text: '作者数' },
                { value: 9, text: '作者数除以文章书' },
                { value: 10, text: '平均作者编辑次数' },
                { value: 11, text: '边数除以总字数' }
              ]
            }
          }
        }
        that.getData()
      }
    },
    {
      name: 'index',
      default: 1,
      label: '数据维度',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { value: 0, text: '文章数' },
        { value: 1, text: '边数' },
        { value: 2, text: '边数除文章' },
        { value: 3, text: '类' },
        { value: 4, text: '总字数' },
        { value: 5, text: '平均文章长度' },
        { value: 6, text: '编辑次数' },
        { value: 7, text: '平均文章编辑次数' },
        { value: 8, text: '作者数' },
        { value: 9, text: '作者数除以文章数' },
        { value: 10, text: '平均作者编辑次数' },
        { value: 11, text: '边数除以总字数' }
      ]
    },
    {
      name: 'level',
      default: 2,
      label: 'level',
      multiple: false,
      show: false,
      cols: 2,
      items: [
        2, 3
      ]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['wikipedia-build/WikiFilter'] = {
  ChName: 'wiki 拟合数据',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: (data, ChartObj) => {
    const _opt = extendEchartsOpts({
      title: {
        text: data.title
      },
      xAxis: {
        name: ChartObj.xAxisName,
        type: 'category',
        boundaryGap: false,
        data: data.x
      },
      yAxis: {
        name: '',
        type: 'value',
        axisLabel: {
          formatter: value => formatNum(value)
        },
        min: function(value) {
          return Math.floor(value.min * 10) / 10
        }
      },
      series: extendLineSeries({
        name: '文章数年度分布',
        type: 'line',
        smooth: false,
        data: data.y

      })
    })
    return _opt
  },
  RequestFunc: async params => {
    // params.db = 'mag'
    const new_params = Object.assign({}, params)

    // 当年
    const data = await requestWrap(
      'wiki/getDfd',
      'post',
      new_params
    )
    console.log(data)
    return data.data
  },
  Select: [
    {
      name: 'cats',
      default: ['Geology', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
        'Chemistry', 'Sociology', 'Linguistics', 'Computer science',
        'Materials science', 'Engineering disciplines', 'Environmental science'],
      label: '学科',
      multiple: true,
      show: true,
      cols: 10,
      items: WIKI_TOP_CATEGORY
    },
    {
      name: 'type',
      default: 0,
      label: '是否多次引用',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        {
          text: '是',
          value: 1
        },
        {
          text: '不是',
          value: 0
        }
      ]
    }
  ],
  Slider: [
    {
      name: 'dfd_yz',
      Default: 0,
      label: '颠覆度保留阈值',
      step: 0.01,
      cols: 10,
      max: 1,
      min: -1
    },
    {
      name: 'linksin',
      Default: 0,
      label: 'linksin 保留阈值',
      step: 1,
      cols: 6,
      max: 2000,
      min: 0
    },
    {
      name: 'level',
      Default: 4,
      label: 'level',
      step: 1,
      cols: 6,
      max: 7,
      min: 0
    }
  ],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

ChartMap['wikipedia-build/entropy'] = {
  ChName: 'wiki 结构熵',
  componentName: 'PageDynamicSelectTemplate',
  HandleResponseFunc: ([responseData, vName, xData], ChartObj) => {
    const _opt = extendEchartsOpts({
      title: {
        text: '标准结构熵'
      },
      xAxis: {
        name: ChartObj.xAxisName,
        type: 'category',
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        name: vName,
        type: 'value',
        axisLabel: {
          formatter: value => formatNum(value)
        },
        min: function(value) {
          return Math.floor(value.min * 10) / 10
        }
      },
      series: responseData.map(item => {
        return extendLineSeries({
          name: item[0],
          type: 'line',
          smooth: false,
          data: item[1]
        })
      })
    })
    return _opt
  },
  RequestFunc: async params => {
    // console.log(wikipeida_direct_xueshu_lv2)
    let networkData
    switch (params.model) {
      case 0:
        networkData = wikipedia_struct_entropy_lv2
        break
      case 1:
        networkData = wikipedia_struct_entropy_lv3
        break
      default:
        break
    }
    networkData['wikipedia'] = {
      all: [0.747, 0.751, 0.75, 0.751, 0.751, 0.751, 0.754, 0.751, 0.76, 0.762, 0.764, 0.766, 0.767, 0.766, 0.767, 0.767, 0.769, 0.774, 0.782, 0.783, 0.784, 0.785, 0.793, 0.793, 0.794, 0.794, 0.795, 0.795, 0.796, 0.797, 0.797, 0.796, 0.798, 0.798, 0.798, 0.795, 0.799, 0.799, 0.799, 0.799, 0.8, 0.8, 0.801, 0.801, 0.801, 0.801, 0.802, 0.802, 0.803, 0.803, 0.804, 0.804, 0.804, 0.805, 0.805, 0.806, 0.806, 0.806, 0.807, 0.807, 0.808, 0.778, 0.778, 0.778, 0.778, 0.778, 0.778],
      in: [0.562, 0.574, 0.566, 0.567, 0.567, 0.568, 0.572, 0.567, 0.585, 0.589, 0.592, 0.595, 0.597, 0.595, 0.595, 0.595, 0.598, 0.61, 0.626, 0.628, 0.63, 0.632, 0.651, 0.652, 0.652, 0.653, 0.654, 0.655, 0.657, 0.658, 0.659, 0.667, 0.661, 0.661, 0.662, 0.679, 0.663, 0.664, 0.664, 0.664, 0.665, 0.666, 0.667, 0.667, 0.668, 0.669, 0.67, 0.671, 0.672, 0.673, 0.674, 0.675, 0.676, 0.677, 0.678, 0.679, 0.679, 0.68, 0.681, 0.682, 0.683, 0.701, 0.702, 0.702, 0.703, 0.704, 0.704],
      out: [0.89, 0.888, 0.892, 0.893, 0.894, 0.894, 0.894, 0.893, 0.897, 0.897, 0.898, 0.899, 0.899, 0.9, 0.901, 0.901, 0.901, 0.902, 0.902, 0.902, 0.902, 0.902, 0.9, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.901, 0.9, 0.901, 0.9, 0.9, 0.898, 0.9, 0.9, 0.901, 0.901, 0.901, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.899, 0.899, 0.899, 0.899, 0.899, 0.898, 0.898, 0.898, 0.898, 0.898, 0.886, 0.886, 0.886, 0.886, 0.886, 0.886]
    }
    console.log(networkData)
    const xData = []
    for (const year of _.range(2004, 2022, 1)) {
      for (const q of [1, 2, 3, 4]) {
        if (year === 2021 && q > 3) {
          continue
        }
        if (year === 2004 && q <= 3) {
          continue
        }
        xData.push(`${year}Q${q}`)
      }
    }
    const vName = ''

    const filter_data = []
    for (const item of Object.entries(networkData)) {
      if (params.subjects.indexOf(item[0]) < 0) {
        continue
      }
      // console.log(item)
      if (params.type === 0) {
        // 点数
        filter_data.push([
          item[0],
          item[1]['in']
        ])
      } else if (params.type === 1) {
        // 文章数
        filter_data.push([
          item[0],
          item[1]['out']
        ])
      } else if (params.type === 2) {
        // ln(N)/ln(k)
        filter_data.push([
          item[0],
          item[1]['all']
        ])
      }
    }
    console.log(filter_data)
    filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))
    return [filter_data, vName, xData]
  },
  Select: [
    {
      name: 'subjects',
      default: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
        'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology'],
      label: '学科',
      multiple: true,
      show: true,
      cols: 8,
      items: ['wikipedia', 'xueshu', 'Biology', 'Chemistry', 'Computer science', 'Engineering disciplines', 'Environmental science', 'Geology',
        'Materials science', 'Mathematics', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology']
    },
    {
      name: 'type',
      default: 2,
      label: '数据维度',
      multiple: false,
      show: true,
      cols: 2,
      items: [
        { text: 'linksin', value: 0 },
        { text: 'linksout', value: 1 },
        { text: '无向网络', value: 2 }
      ]
    },
    {
      name: 'model',
      default: 0,
      label: '有向网络模型',
      multiple: false,
      show: true,
      cols: 3,
      items: [
        { text: '精简学术圈-lv2', value: 0 },
        { text: '精简学术圈-lv3', value: 1 }
      ]
    }
  ],
  Slider: [],
  RangeSlider: [],
  xAxisName: 'Year',
  yAxisName: 'Count'
}

// ChartMap['wikipedia-build/smallworld_20211103'] = {
//   ChName: 'wiki 学科小世界',
//   componentName: 'PageDynamicSelectTemplate',
//   HandleResponseFunc: ([responseData, vName, xData], ChartObj) => {
//     const _opt = extendEchartsOpts({
//       title: {
//         text: '小世界属性'
//       },
//       xAxis: {
//         name: ChartObj.xAxisName,
//         type: 'category',
//         boundaryGap: false,
//         data: xData
//       },
//       yAxis: {
//         name: vName,
//         type: 'value',
//         axisLabel: {
//           formatter: value => formatNum(value)
//         },
//         min: function(value) {
//           return Math.floor(value.min * 10) / 10
//         }
//       },
//       series: responseData.map(item => {
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
//   RequestFunc: async params => {
//     // console.log(wikipeida_direct_xueshu_lv2)
//     const getmiddle = (dataList) => {
//       let sum = 0
//       for (const i in dataList) {
//         sum += dataList[i]
//       }
//       sum = sum / 2
//       let sum_cache = 0
//       for (const i in dataList) {
//         sum_cache += dataList[i]
//         if (sum_cache > sum) {
//           return i
//         }
//       }
//       return null
//     }
//     let networkData
//     switch (params.model) {
//       case 0:
//         networkData = wikipeida_direct_xueshu_lv2
//         break
//       case 1:
//         networkData = wikipeida_direct_xueshu_lv3
//         break
//       case 2:
//         networkData = wikipeida_direct_subject_lv2
//         break
//       case 3:
//         networkData = wikipeida_direct_subject_lv3
//         break
//       case 6:
//         networkData = wikipeida_direct_subject_lv2_connect
//         break
//       case 7:
//         networkData = wikipeida_direct_subject_lv3_connect
//         break
//       default:
//         break
//     }
//     const xData = []
//     for (const year of _.range(2004, 2022, 1)) {
//       for (const q of [1, 2, 3, 4]) {
//         if (year === 2021 && q > 1) {
//           continue
//         }
//         if (year === 2004 && q < 2) {
//           continue
//         }
//         xData.push(`${year}Q${q}`)
//       }
//     }
//     const vName = ''

//     const filter_data = []
//     for (const item of Object.entries(networkData)) {
//       // console.log(item)
//       if (params.type === 0) {
//         // 点数
//         filter_data.push([
//           item[0],
//           item[1]['gs']
//         ])
//       } else if (params.type === 2) {
//         // 文章数
//         filter_data.push([
//           item[0],
//           item[1]['ss']
//         ])
//       } else if (params.type === 7) {
//         // ln(N)/ln(k)
//         filter_data.push([
//           item[0],
//           item[1]['ct'].map((e, index) => {
//             if (e.length > 2 && e[1] !== item[1]['gs'][index] && item[1]['gs'][index] > 0) {
//               return (Math.log(item[1]['gs'][index]) / Math.log(e[1] / item[1]['gs'][index])).toFixed(4)
//             } else {
//               return null
//             }
//           })
//         ])
//       } else if (params.type === 6) {
//         // 距离最大数
//         filter_data.push([
//           item[0],
//           item[1]['ct'].map(e => { if (e.length > 0) return e.length - 1 })
//         ])
//       } else if (params.type === 5) {
//         // 距离中位数
//         filter_data.push([
//           item[0],
//           item[1]['ct'].map(e => getmiddle(e))
//         ])
//       } else if (params.type === 4) {
//         // 平均最短距离
//         filter_data.push([
//           item[0],
//           item[1]['ad']
//         ])
//       } else if (params.type === 3) {
//         // 平均度
//         filter_data.push([
//           item[0],
//           item[1]['ct'].map((e, index) => {
//             if (e.length > 2) return e[1] / item[1]['gs'][index]
//             else { return null }
//           })
//         ])
//       } else if (params.type === 1) {
//         // 边数
//         filter_data.push([
//           item[0],
//           item[1]['ct'].map(e => {
//             if (e.length > 2) return e[1]
//             else { return null }
//           })
//         ])
//       }
//     }
//     console.log(filter_data)
//     filter_data.sort((a, b) => b[1].slice(-1) - a[1].slice(-1))
//     return [filter_data, vName, xData]
//   },
//   Select: [
//     {
//       name: 'type',
//       default: 0,
//       label: '数据维度',
//       multiple: false,
//       show: true,
//       cols: 2,
//       items: [
//         { text: '点数', value: 0 },
//         { text: '边数', value: 1 },
//         { text: '文章数', value: 2 },
//         { text: '平均度', value: 3 },
//         { text: '平均最短距离', value: 4 },
//         { text: '距离中位数', value: 5 },
//         { text: '距离最大数', value: 6 },
//         { text: 'ln(N)/ln(k)', value: 7 }
//       ]
//     },
//     {
//       name: 'model',
//       default: 0,
//       label: '有向网络模型',
//       multiple: false,
//       show: true,
//       cols: 3,
//       items: [
//         { text: '学术圈-调和网络-lv2', value: 0 },
//         { text: '学术圈-调和网络-lv3', value: 1 },
//         { text: '单学科-调和网络-lv2', value: 2 },
//         { text: '单学科-调和网络-lv3', value: 3 },
//         { text: '学术圈-联通网络-lv2', value: 4 },
//         { text: '学术圈-联通网络-lv3', value: 5 },
//         { text: '单学科-联通网络-lv2', value: 6 },
//         { text: '单学科-联通网络-lv3', value: 7 }
//       ]
//     }
//   ],
//   Slider: [],
//   RangeSlider: [],
//   xAxisName: 'Year',
//   yAxisName: 'Count'
// }
