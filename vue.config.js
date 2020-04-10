module.exports = {
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://192.168.1.224:10004/wiki_api/api/",
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
      "diff": "Diff"
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}