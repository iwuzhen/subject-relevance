/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-23 15:47:50
 * @LastEditors: ider
 * @LastEditTime: 2021-04-01 19:02:44
 * @Description:
 */

export const magCategory = [
  'Anthropology',
  'Artificial intelligence',
  'Biological engineering',
  'Biology', 'Theoretical physics', 'Applied physics', 'Experimental physics',
  'Number theory', 'Algebra', 'Geometry', 'Applied mathematics', 'Operating system',
  'Blockchains',
  'Chemical engineering',
  'Chemistry',
  'Civil engineering',
  'Cognitive science',
  'Computer engineering',
  'Computer science',
  'Deep learning',
  'Economics',
  'Electrical engineering',
  'Environmental engineering',
  'Earth science',
  'Genetic engineering',
  'Genome editing',
  'History',
  'Industrial engineering',
  'Linguistics',
  'Literature',
  'Logic',
  'Machine learning',
  'Mathematics',
  'Mechanical engineering',
  'Neuroscience',
  'Philosophy',
  'Physics',
  'Political science',
  'Psychology',
  'Quantum computing',
  'Sociology',
  'Theoretical computer science',
  'Materials science',
  'Geology',
  'Geography',
  'Environmental science',
  'Medicine',
  'Engineering disciplines'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const basiCategorys = [
  'Literature',
  'Psychology',
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Economics',
  'Political science',
  'Linguistics',
  'History',
  'Computer science',
  'Artificial intelligence',
  'Engineering disciplines',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Biological engineering',
  'Computer engineering',
  'Industrial engineering',
  'Environmental engineering',
  'Cognitive science',
  'Machine learning',
  'Blockchains',
  'Deep learning',
  'Theoretical computer science',
  'Quantum computing',
  'Genetic engineering',
  'Genome editing',
  'Anthropology',
  'Neuroscience'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const lessCategorys = [
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Economics',
  'Political science',
  'Psychology',
  'Linguistics',
  'History',
  'Computer science',
  'Artificial intelligence',
  'Engineering disciplines',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Biological engineering',
  'Computer engineering',
  'Industrial engineering',
  'Environmental engineering'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const lessPersonCategorys = [
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Economics',
  'Political science',
  'Psychology',
  'Linguistics',
  'History',
  'Computer science',
  'Artificial intelligence',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Industrial engineering',
  'Environmental engineering'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const wikiArticleCategory = [
  'Materials science',
  'Geology',
  'Geography',
  'Environmental science',
  'Medicine',
  'Psychology',
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Economics',
  'Political science',
  'Linguistics',
  'History',
  'Computer science',
  'Artificial intelligence',
  'Engineering disciplines',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Biological engineering',
  'Computer engineering',
  'Industrial engineering',
  'Environmental engineering',
  'Cognitive science',
  'Machine learning',
  'Blockchains',
  'Deep learning',
  'Theoretical computer science',
  'Quantum computing',
  'Genetic engineering',
  'Genome editing',
  'Anthropology',
  'Neuroscience',
  'Literature',
  'Theoretical physics'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const peopleCategorys = [
  ['Anthropology', 'Anthropologist'],
  ['Artificial intelligence', 'AI scientist'],
  ['Biology', 'Biologist'],
  ['Chemical engineering', 'Chemical Engineer'],
  ['Chemistry', 'Chemist'],
  ['Civil engineering', 'Civil Engineer'],
  ['Cognitive science', 'Cognitive scientist'],
  ['Computer science', 'Computer scientist'],
  ['Economics', 'Economist'],
  ['Electrical engineering', 'Electrical Engineer'],
  ['Environmental engineering', 'Environmental Engineer'],
  ['History', 'Historian'],
  ['Industrial engineering', 'Industrial Engineer'],
  ['Linguistics', 'Linguist'],
  ['logic', 'logician'],
  ['Machine learning', 'Machine learning'],
  ['Mathematics', 'Mathematician'],
  ['Mechanical engineering', 'Mechanical Engineer'],
  ['Neuroscience', 'Neuroscientist'],
  ['Philosophy', 'Philosopher'],
  ['Physics', 'Physicist'],
  ['Political science', 'Political scientist'],
  ['Psychology', 'Psychologist'],
  ['Sociology', 'Sociologist']
].sort((x, y) => {
  return x[0] - y[0]
})

export const coreCategorys = [
  'Materials science',
  'Geography',
  'Environmental science',
  'Medicine',
  'Psychology',
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Earth science',
  'Geology',
  'Economics',
  'Political science',
  'Linguistics',
  'History',
  'Computer science',
  'Artificial intelligence',
  'Engineering disciplines',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Biological engineering',
  'Computer engineering',
  'Industrial engineering',
  'Environmental engineering',
  'Cognitive science',
  'Machine learning',
  'Blockchains',
  'Deep learning',
  'Theoretical computer science',
  'Quantum computing',
  'Genetic engineering',
  'Genome editing',
  'Anthropology',
  'Neuroscience',
  'Literature'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const defaultCategorySelect = ['Physics', 'Mathematics', 'Biology', 'Medicine', 'History', 'Philosophy', 'Economics', 'Linguistics', 'Chemistry', 'Sociology', 'Political science', 'Engineering disciplines', 'Computer science']

export const wikiZipfCategorySelect = ['Physics', 'Mathematics', 'Biology', 'History', 'Philosophy', 'Economics', 'Linguistics', 'Chemistry', 'Sociology', 'Political science', 'Engineering disciplines', 'Computer science']

// 去掉 Earth science 使用 Geology
export const defaultCategorySelect1 = ['Physics', 'Geology', 'Mathematics', 'Biology', 'Medicine', 'Philosophy', 'Economics', 'Linguistics', 'Chemistry', 'Sociology', 'Political science', 'Engineering disciplines', 'Computer science']
export const coreCategorys1 = [
  'Materials science',
  'Geography',
  'Environmental science',
  'Medicine',
  'Psychology',
  'Logic',
  'Philosophy',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Sociology',
  'Geology',
  'Economics',
  'Political science',
  'Linguistics',
  'Computer science',
  'Artificial intelligence',
  'Engineering disciplines',
  'Chemical engineering',
  'Civil engineering',
  'Electrical engineering',
  'Mechanical engineering',
  'Biological engineering',
  'Computer engineering',
  'Industrial engineering',
  'Environmental engineering',
  'Cognitive science',
  'Machine learning',
  'Blockchains',
  'Deep learning',
  'Theoretical computer science',
  'Quantum computing',
  'Genetic engineering',
  'Genome editing',
  'Anthropology',
  'Neuroscience',
  'Literature'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const MAGCoreCategorys2020 = ['Algebra', 'Anthropology', 'Applied mathematics', 'Applied physics', 'Artificial intelligence', 'Biological engineering', 'Biology',
  'Blockchains', 'Chemical engineering', 'Chemistry', 'Civil engineering', 'Cognitive science', 'Computational biology', 'Computer engineering', 'Computer science',
  'Deep learning', 'Discrete mathematics', 'Earth science', 'Economics', 'Electrical engineering', 'Engineering disciplines', 'Environmental engineering',
  'Environmental science', 'Experimental physics', 'Genetic engineering', 'Genome editing', 'Geography', 'Geology', 'Geometry', 'History', 'Industrial engineering',
  'Linguistics', 'Literature', 'Logic', 'Machine learning', 'Materials science', 'Mathematics', 'Mechanical engineering', 'Medicine', 'Neuroscience', 'Number theory',
  'Operating system', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Quantum computing', 'Sociology', 'Theoretical chemistry', 'Theoretical computer science',
  'Theoretical physics'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const MAGCoreCategorys2020_V1 = ['Algebra', 'Anthropology', 'Applied mathematics', 'Applied physics', 'Artificial intelligence', 'Biological engineering', 'Biology',
  'Blockchains', 'Chemical engineering', 'Chemistry', 'Civil engineering', 'Cognitive science', 'Computational biology', 'Computer engineering', 'Computer science',
  'Deep learning', 'Discrete mathematics', 'Earth science', 'Economics', 'Electrical engineering', 'Engineering disciplines', 'Environmental engineering',
  'Environmental science', 'Experimental physics', 'Genetic engineering', 'Genome editing', 'Geography', 'Geology', 'Geometry', 'History', 'Industrial engineering',
  'Linguistics', 'Literature', 'Logic', 'Machine learning', 'Materials science', 'Mathematics', 'Mechanical engineering', 'Medicine', 'Neuroscience', 'Number theory',
  'Operating system', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Quantum computing', 'Sociology', 'Theoretical chemistry', 'Theoretical computer science',
  'Theoretical physics', 'Art', 'Business'
].sort().map(each => {
  return {
    text: each === 'Engineering disciplines' ? 'Engineering' : each,
    value: each
  }
})

export const SELECT_MAG_DATA = ['Biology', 'Chemistry', 'Computer science',
  'Economics', 'Engineering disciplines', 'History', 'Environmental science', 'Political science',
  'Mathematics', 'Medicine', 'Philosophy', 'Physics', 'Sociology', 'Psychology', 'Materials science', 'Geology', 'Geography']

export const SELECT_MAG_DATA_V1 = ['Biology', 'Chemistry', 'Computer science',
  'Economics', 'Engineering disciplines', 'History', 'Environmental science', 'Political science',
  'Mathematics', 'Medicine', 'Philosophy', 'Physics', 'Sociology', 'Psychology', 'Materials science', 'Geology', 'Geography', 'Art', 'Business']

export function extendLineSeries(series) {
  return Object.assign({
    symbolSize: 10,
    // symbol: 'circle',
    smooth: false
  },
  series
  )
}

export const WIKI_TOP_CATEGORY = ['Geology', 'Geography', 'Psychology', 'Philosophy', 'Mathematics', 'Physics', 'Biology',
  'Chemistry', 'Sociology', 'Economics', 'Political science', 'Linguistics', 'Computer science',
  'Literature', 'History', 'Materials science', 'Engineering disciplines', 'Environmental science', 'Medicine', 'Art', 'Business']

// 单页图，使用这个模版
export function extendEchartsOpts(opt) {
  const basicEchartsOption = {
    // color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#003399', '#333366', '#663366', '#CC0099'],
    title: {
      left: 'center'
    },
    yAxis: {
      axisLine: {
        show: true
      }
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
          if (y.data === undefined) { return -1 }
          return y.data - x.data
        })
        let showHtm = ` ${params[0].name}<br>`
        for (let i = 0; i < params.length; i++) {
          if (params[i].data === undefined) {
            continue
          }
          const _text = params[i].seriesName
          const _data = params[i].data
          const _marker = params[i].marker
          showHtm += `${_marker}${_text}：${_data}<br>`
        }
        return showHtm
      }
    },
    legend: {
      type: 'scroll',
      left: '82%',
      right: 'left',
      top: 'middle',
      textStyle: {
        fontSize: 13
      },
      orient: 'vertical'
    },
    grid: {
      left: '5%',
      right: '20%',
      bottom: '5%',
      containLabel: true
    },
    toolbox: {
      right: 0,
      top: 0,
      orient: 'vertical',
      feature: {
        saveAsImage: {},
        dataZoom: {
          yAxisIndex: 'none'
        },
        // dataView: { readOnly: false },
        // magicType: { type: ['line', 'bar'] },
        restore: {}
      }
    }
  }
  for (const key of Object.keys(opt)) {
    if (opt[key] instanceof Array) {
      basicEchartsOption[key] = opt[key]
    } else {
      basicEchartsOption[key] = Object.assign(
        basicEchartsOption[key] || {},
        opt[key]
      )
    }
  }
  return basicEchartsOption
}
