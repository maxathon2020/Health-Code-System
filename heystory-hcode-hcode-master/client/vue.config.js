const path = require('path')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/maxonrow-backend/public/static' : '/',
  outputDir: path.resolve(__dirname, '../app/public/static'),
  assetsDir: '',
  indexPath: '../../view/index.html',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    port: 7012,
    proxy: {
      "/maxonrow-frontend": {
        ws: false,
        target: "http://127.0.0.1:7001", //跨域网址
        changeOrigin: true, //自动修改http header里面的host
        pathRewrite: {
          // "^/maxonrow-frontend/api": "/api", //路径的替换规则
        }
      }
    }
  },
  configureWebpack: {
    externals:  {
      //此处引号中的urlConfig必须和window.urlConfig一致
      qrcode: 'qrcode',
      jQuery: 'jQuery',
      $: 'jQuery',
    }
  }
}
