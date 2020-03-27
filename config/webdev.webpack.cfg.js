/* global __dirname */
const path = require('path');
const webpack = require('webpack');
const Fiber = require('fibers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const file = require('kuma-helpers/node/file');

const entryArr = file(path.join(__dirname, '../src'), {
  igroneFile: true,
  igroneArr: ['styles'],
});

// webpack 配置
module.exports = {
  mode: 'development',
  entry: entryArr,
  output: {
    path: path.join(__dirname, '../dist'), // 出口目录，dist文件
    publicPath: "../",
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:10]',
                getLocalIdent: (context, localIdentName, localName) => {
                  const path = context._module.context;
                  if(/^((?!node_modules).)*(src){1}.*(components){1}.*$/.test(path)) {
                    return;
                  } else {
                    return localName;
                  }
                },
              },
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // 使用dart-sass去编译
              fiber: Fiber // 同步的库，使用dart-sass同步编译的速度是异步编译的2倍
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:10]',
                getLocalIdent: (context, localIdentName, localName) => {
                  const path = context._module.context;
                  if(/^((?!node_modules).)*(src){1}.*(components){1}.*$/.test(path)) {
                    return;
                  } else {
                    return localName;
                  }
                },
              },
            },
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/', // 图片输出的路径
            limit: 10 * 1024 // <10kb 使用base64
          }
        }
      }
    ]
  },
  plugins: (() => {
    let out = [
      // new CleanWebpackPlugin({ verbose: true }),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "css/[name].css"
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('development')
      }),
    ];
    Object.keys(entryArr).forEach(item => {
      out.push(new HtmlWebpackPlugin({
        template: path.join(entryArr[item], 'index.html'),
        filename: `${item}.html`,
        chunks: [item],
      }));
    });
    return out;
  })(),
  resolve: {
    // 自动补全后缀，注意第一个必须是空字符串,后缀一定以点开头
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@root': path.resolve(__dirname, '../'),
      '@admin': path.resolve(__dirname, '../', 'src', 'admin')
    }
  },
};
