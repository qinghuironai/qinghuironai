const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

console.log('Url prefix: ', process.env.VUE_APP_PREFIX)

module.exports = {
  lintOnSave: false,
  publicPath: process.env.VUE_APP_PREFIX,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [
        'D:\\project\\learn\\pixivic-mobile-master\\pixivic-mobile-master\\src\\style\\mixin.styl',
        'D:\\project\\learn\\pixivic-mobile-master\\pixivic-mobile-master\\src\\style\\color.styl'
      ]
    },
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },

  // 路径别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
  },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  }
}
