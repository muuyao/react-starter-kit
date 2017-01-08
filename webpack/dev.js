const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const px2rem = require('postcss-px2rem');

const outputDir = path.join(__dirname, '../public');

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, '../src/index.js'),
    vendor: ['react', 'react-dom', 'redux', 'react-router', 'react-redux', 'redux-thunk']
  },
  output: {
    path: outputDir,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: ''
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
      loader: 'style-loader!css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]-[local]-[hash:base64:5]&sourceMap!postcss-loader?sourceMap=inline'
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

  postcss: [px2rem({
    remUnit: 75
  }), autoprefixer({
    browsers: ['> 5%', 'Android > 4.0']
  })],

  devtool: 'source-map',

  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080
  },

  resolve: {
    extensions: ['', '.js', '.jsx'], // require 无需后缀
    modulesDirectories: ['node_modules', 'components'],
    alias: {
      assets: path.resolve(__dirname, './assets')
    }
  },

  plugins: [
    // 公共库会被抽离到vendor.js里
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      filename: '[name].[hash].js'
    }),

    // 比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
    new webpack.optimize.OccurenceOrderPlugin(),

    // 允许错误不打断程序
    new webpack.NoErrorsPlugin(),

    // 实现 css 和 js 动态插入加 Hash
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunksSortMode: 'dependency'
    }),

    new webpack.DefinePlugin({
      __MODE__: JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
