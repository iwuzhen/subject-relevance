module.exports = {
  devServer: {
    // 设置代理
    proxy: {
      '/api': {
        target: 'http://192.168.1.224:10004/wiki_api/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  }
};
