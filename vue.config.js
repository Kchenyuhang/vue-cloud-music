module.exports = {
  devServer: {
    host: 'localhost',
    port: 8099,
    https: false,
    open: true,
    hotOnly: true
  },
  outputDir: './dist',
  assetsDir: './assets/',
  publicPath: './',
  indexPath: './index.html',
  transpileDependencies: ['vuetify']
}
