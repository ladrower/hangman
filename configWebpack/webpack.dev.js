/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    stats: 'errors-only'
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('DEVELOPMENT')
    })
  ]
})
