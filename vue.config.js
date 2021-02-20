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
  "configureWebpack": {
    "externals": {
      "diff2html": "Diff2Html",
      "diff": "Diff",
      "localforage": "localforage",
      "d3": "d3",
      "lodash": "_",
      "dayjs": "dayjs",
      "THREE": "three",
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
