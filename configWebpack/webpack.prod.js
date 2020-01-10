/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const appConfig = require('../appConfig.json')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(appConfig.environment)
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()]
  }
})