/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-23 15:47:50
 * @LastEditors: ider
 * @LastEditTime: 2020-05-14 19:27:44
 * @Description:
 */
export let basiCategorys = [
  "Literature",
  "Psychology",
  "Logic",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Sociology",
  "Economics",
  "Political science",
  "Linguistics",
  "History",
  "Computer science",
  "Artificial intelligence",
  "Engineering disciplines",
  "Chemical engineering",
  "Civil engineering",
  "Electrical engineering",
  "Mechanical engineering",
  "Biological engineering",
  "Computer engineering",
  "Industrial engineering",
  "Environmental engineering",
  "Cognitive science",
  "Machine learning",
  "Blockchains",
  "Deep learning",
  "Theoretical computer science",
  "Quantum computing",
  "Genetic engineering",
  "Genome editing",
  "Anthropology",
  "Neuroscience"
].sort();
export let lessCategorys = [
  "Logic",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Sociology",
  "Economics",
  "Political science",
  "Psychology",
  "Linguistics",
  "History",
  "Computer science",
  "Artificial intelligence",
  "Engineering disciplines",
  "Chemical engineering",
  "Civil engineering",
  "Electrical engineering",
  "Mechanical engineering",
  "Biological engineering",
  "Computer engineering",
  "Industrial engineering",
  "Environmental engineering"
].sort();

export let lessPersonCategorys = [
  "Logic",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Sociology",
  "Economics",
  "Political science",
  "Psychology",
  "Linguistics",
  "History",
  "Computer science",
  "Artificial intelligence",
  "Chemical engineering",
  "Civil engineering",
  "Electrical engineering",
  "Mechanical engineering",
  "Industrial engineering",
  "Environmental engineering"
].sort();
export let peopleCategorys = [
  ["Anthropology", "Anthropologist"],
  ["Artificial intelligence", "AI scientist"],
  ["Biology", "Biologist"],
  ["Chemical engineering", "Chemical Engineer"],
  ["Chemistry", "Chemist"],
  ["Civil engineering", "Civil Engineer"],
  ["Cognitive science", "Cognitive scientist"],
  ["Computer science", "Computer scientist"],
  ["Economics", "Economist"],
  ["Electrical engineering", "Electrical Engineer"],
  ["Environmental engineering", "Environmental Engineer"],
  ["History", "Historian"],
  ["Industrial engineering", "Industrial Engineer"],
  ["Linguistics", "Linguist"],
  ["logic", "logician"],
  ["Machine learning", "Machine learning"],
  ["Mathematics", "Mathematician"],
  ["Mechanical engineering", "Mechanical Engineer"],
  ["Neuroscience", "Neuroscientist"],
  ["Philosophy", "Philosopher"],
  ["Physics", "Physicist"],
  ["Political science", "Political scientist"],
  ["Psychology", "Psychologist"],
  ["Sociology", "Sociologist"]
].sort((x, y) => {
  return x[0] - y[0];
});

export let coreCategorys = [
  "Materials science",
  "Geology",
  "Geography",
  "Environmental science",
  "Medicine",
  "Psychology",
  "Logic",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Sociology",
  "Economics",
  "Political science",
  "Linguistics",
  "History",
  "Computer science",
  "Artificial intelligence",
  "Engineering disciplines",
  "Chemical engineering",
  "Civil engineering",
  "Electrical engineering",
  "Mechanical engineering",
  "Biological engineering",
  "Computer engineering",
  "Industrial engineering",
  "Environmental engineering",
  "Cognitive science",
  "Machine learning",
  "Blockchains",
  "Deep learning",
  "Theoretical computer science",
  "Quantum computing",
  "Genetic engineering",
  "Genome editing",
  "Anthropology",
  "Neuroscience",
  "Literature"
].sort();

// 单页图，使用这个模版
export function extendEchartsOpts(opt) {
  let basicEchartsOption = {
    title: {
      left: "40%"
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        align: "left"
      },
      axisPointer: {
        type: "cross",
        animation: true,
        label: {
          backgroundColor: "#505765"
        }
      },
      formatter: function(params) {
        params.sort((x, y) => {
          return y.data - x.data;
        });
        let showHtm = ` ${params[0].name}<br>`;
        for (let i = 0; i < params.length; i++) {
          let _text = params[i].seriesName;
          let _data = params[i].data;
          let _marker = params[i].marker;
          showHtm += `${_marker}${_text}：${_data}<br>`;
        }
        return showHtm;
      }
    },
    legend: {
      left: "83%",
      top: "middle",
      textStyle: {
        fontSize: 15
      },
      orient: "vertical"
    },
    grid: {
      left: "8%",
      right: "20%",
      bottom: "5%",
      containLabel: true
    },
    toolbox: {
      right: "20%",
      feature: {
        saveAsImage: {}
      }
    }
  };
  for (let key of Object.keys(opt)) {
    if (opt[key] instanceof Array) {
      basicEchartsOption[key] = opt[key];
    } else {
      basicEchartsOption[key] = Object.assign(
        basicEchartsOption[key] || {},
        opt[key]
      );
    }
  }
  return basicEchartsOption;
}
