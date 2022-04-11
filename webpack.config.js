const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    'assets/engine.js': [
      './src/js/main.js',
      './src/css/style.css',
      'perfect-scrollbar/dist/css/perfect-scrollbar.css'
    ],
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: false,
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      url: require.resolve("url/"),
    },
    modules: [
      'node_modules',
      'src/js',
      'src/assets'
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      PIXI: 'pixi.js'
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/robots.txt', to: 'robots.txt' },
        { from: './src/html/privacy.html', to: 'privacy.html' },
        { from: './src/html/contact.html', to: 'contact.html' },
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      hash: true,
      inject: 'head'
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].css",
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].map'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "style",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true
        }
      }
    }
  }
}
