module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://127.0.0.1:10004/wiki_api/api/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": "/"
        }
      },
      "/wapi": {
        "target": "http://wikidb.lambdax.cn:5555/wikidb_web/rest/",
        "changeOrigin": true,
        "pathRewrite": {
          "^/wapi": "/"
        }
      }
    }
  },
  "configureWebpack": {
    "externals": {
      "diff2html": "Diff2Html",
      "diff": "Diff",
      "localforage": "localforage",
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}