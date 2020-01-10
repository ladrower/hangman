/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const appConfig = require('../appConfig.json')
const isDevMode = appConfig.environment === 'DEVELOPMENT'

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true
    }),
    new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: true }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html'
    }),
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify(appConfig.apiBaseURL),
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: { sourceMap: isDevMode }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
  }
}
