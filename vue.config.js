const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
    // 配置代理
  devServer: {
    proxy: {
        '/data': {
            target: 'http://localhost:3000',
            pathRewrite: {'^/data': ''},
            ws: true,
            changeOrigin: true
        }
    }
}
})

