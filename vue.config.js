const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

console.log('Url prefix: ', process.env.PREFIX)

module.exports = {
  lintOnSave: false,
  publicPath: process.env.PREFIX,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [
        path.join(__dirname, './src/style/mixin.styl'),
        path.join(__dirname, './src/style/color.styl')
      ]
    }
  },
  // 路径别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
  }
}
