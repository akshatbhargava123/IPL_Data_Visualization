// vue.config.js
module.exports = {
  chainWebpack: config => {
    // CSV Loader
    config.module
      .rule('csv')
      .test(/\.(c|d|t)sv$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}