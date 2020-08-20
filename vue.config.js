module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "https://lmd.wiki.knogen.com:10443/api/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": "/"
        }
      },
      "/wapi": {
        "target": "https://lmd.wiki.knogen.com:10443/wapi/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/wapi": "/"
        }
      },
      "/goapi": {
        "target": "https://lmd.wiki.knogen.com:10443/goapi/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/goapi": "/"
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
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
