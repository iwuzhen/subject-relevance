/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-10-28 17:35:06
 * @LastEditors: ider
 * @LastEditTime: 2020-10-28 19:48:12
 * @Description: 图表模板，自动化配置成图表，不用每个图表画一个Vue了
 */

import { requestWrap } from '@/api/index'
import { magCategory, defaultCategorySelect } from '@/api/data'

export const ChartMap = {
  'AuthorsAndArticleInfoByYear': {
    ChName: '作者数逐年统计',
    componentName: 'PageTemplate',
    RequestFunc: async(params) => {
      return await requestWrap('mag/getMagAuthorsAndArticleInfo_year_v2', 'post', params)
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
    ChName: 'fos学科领域逐年统计',
    componentName: 'PageTemplate',
    RequestFunc: async(params) => {
      return await requestWrap('mag/getLinkTj_year_v2', 'post', params)
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
  }
}
