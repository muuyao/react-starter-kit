const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const WebpackUploadPlugin = require('webpack-upload');
const px2rem = require('postcss-px2rem');

const config = require('./config');

module.exports = {
  entry: {
    bundle: './index.js',
    vendor: ['react', 'react-dom', 'react-router']
  },
  output: {
    path: config.outputDir,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: config.publicPath
  },
  module: {
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]-[local]-[hash:base64:5]!postcss-loader')
    }, {
      test: /\.(png|jp?g|gif|svg)$/i,
      exclude: /node_modules/,
      loader: 'url?limit=8192&name=img/[name].[hash:7].[ext]' // inline base64 URLs for <=8k images
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      exclude: /node_modules/,
      loader: 'url?limit=1024&name=fonts/[name].[hash:7].[ext]'
    }]
  },

  postcss: function () {
    return [px2rem({
      remUnit: 75
    }), autoprefixer({
      browsers: ['> 5%', 'Android > 4.0']
    })];
  },

  devtool: false,

  resolve: {
    extensions: ['', '.js', '.jsx'], // require 无需后缀
    modulesDirectories: ['node_modules', 'components'],
    alias: {
      assets: path.resolve(__dirname, '../src/assets')
    }
  },

  plugins: [
    new ExtractTextPlugin('[name].[contenthash].css'),

    new webpack.DefinePlugin({
      __MODE__: JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }), // 版本上线时开启

    // 公共库会被抽离到vendor.js里
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].[hash].js'
    }),

    // 比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
    new webpack.optimize.OccurenceOrderPlugin(),

    // 实现 css 和 js 动态插入加 Hash
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunksSortMode: 'dependency'
    }),

    // 静态资源实现cdn上传
    new WebpackUploadPlugin({
      receiver: 'http://10.1.1.1:8999/receiver',
      to: '/data/res/frontend/rs/huzhu'
    })
  ]
};
