//配置引用cdn的js、css地址
const cdn = {
  css: [
    "https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/normalize/8.0.1/normalize.min.css",
    "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
    // "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css",
    "https://cdn.staticfile.org/MaterialDesign-Webfont/7.0.96/css/materialdesignicons.min.css",
    "https://cdn.staticfile.org/element-plus/2.2.8/index.min.css",
    "https://cdn.staticfile.org/font-awesome/6.1.1/css/all.css",
    "//cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css",
    'https://cdn.staticfile.org/vuetify/2.6.7/vuetify.min.css',
    // 'https://www.unpkg.com/handsontable@11.1.0/dist/handsontable.full.min.css',
    // 'https://www.unpkg.com/@ruangnazi/markdown-it-vue@1.1.6/dist/markdown-it-vue.css',
    // 'https://www.unpkg.com/markdown-it-vue@1.1.7/dist/markdown-it-vue.css',
  ],
  js: [
    'https://cdn.staticfile.org/vue/2.7.7/vue.min.js',
    'https://cdn.staticfile.org/vuetify/2.6.7/vuetify.min.js',
    'https://cdn.staticfile.org/vue-router/3.5.3/vue-router.min.js',
    '//cdn.bootcss.com/diff2html/2.12.2/diff2html-ui.min.js',
    "//cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js",
    "//lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jsdiff/4.0.2/diff.min.js",
    "//lib.baomitu.com/localforage/1.10.0/localforage.min.js",
    "https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js",
    "https://cdn.staticfile.org/d3/5.16.0/d3.min.js",
    "//lib.baomitu.com/dayjs/1.10.8/dayjs.min.js",
    "//lib.baomitu.com/dayjs/1.10.8/locale/zh-cn.min.js",
    "//lib.baomitu.com/dayjs/1.10.8/plugin/relativeTime.min.js",
    "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/three.js/r125/three.min.js",
    "https://cdn.staticfile.org/echarts/5.3.3/echarts.min.js",
    "https://cdn.staticfile.org/axios/0.27.2/axios.min.js",
    // 'https://www.unpkg.com/handsontable@11.1.0/dist/handsontable.full.min.js',
    // 'https://www.unpkg.com/@handsontable/vue@11.1.0/dist/vue-handsontable.min.js',
    // 'https://www.unpkg.com/@ruangnazi/markdown-it-vue@1.1.6/dist/markdown-it-vue.umd.min.js',
    // 'https://www.unpkg.com/markdown-it-vue@1.1.7/dist/markdown-it-vue.umd.min.js',
  ],
};

//生产环境标记
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const externals = {
  // 属性名称 vue, 表示遇到 import xxx from 'vue' 这类引入 'vue'的，不去 node_modules 中找，而是去找全局变量 Vue（其他的为VueRouter、Vuex、axios、ELEMENT、echarts，注意全局变量是一个确定的值，不能修改为其他值，修改为其他大小写或者其他值会报错，若有异议可留言）
  // vue: 'Vue',
  diff2html: "Diff2Html",
  diff: "Diff",
  localforage: "localforage",
  d3: "d3",
  lodash: "_",
  dayjs: "dayjs",
  THREE: "three",
  vue: "Vue",
  "vue-router": "VueRouter",
  // "@ruangnazi/markdown-it-vue":"markdown-it-vue",
  // '@handsontable/vue':'@handsontable/vue',
  // handsontable:'Handsontable',
  // vuex: "Vuex",
  axios: "axios",
  // "vuetify": "Vuetify",
  // vuetify: 'Vuetify',
  'vuetify/lib': 'Vuetify',
  echarts: "echarts",
  lodash: "_",
  // diff2html: 'Diff2Html',
  // diff: 'Diff',
  // localforage: 'localforage',
  // d3: 'd3',
  // lodash: '_',
  // dayjs: 'dayjs',
  // THREE: 'three',
};

module.exports = {
  "devServer": {
    "proxy": {
      "/api/": {
        "target": "https://wiki.lmd.knogen.com:10443/api/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": "/"
        }
      },
      "/wapi/": {
        "target": "https://wiki.lmd.knogen.com:10443/wapi/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/wapi": "/"
        }
      },
      "/goapi/": {
        "target": "https://wiki.lmd.knogen.com:10443/goapi/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/goapi": "/"
        },
      },
      "/apigo/": {
        "target": "https://wiki.lmd.knogen.com:10443/apigo/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/apigo": "/"
        }
      }
    }
  },
  configureWebpack: {
    externals: IS_PRODUCTION ? externals : {},
  },
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
    //视为一个外部库，而不将它打包进来
    config.externals(externals);
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
