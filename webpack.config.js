const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./server.config');

module.exports = (env, arg) => {
  const { mode } = arg;
  const isDev = mode === 'development';

  const webpackConfig = {
    mode,
    entry: {
      app: [
        path.resolve(config.src.js, 'index.tsx'),
        path.resolve(config.src.scss, 'index.scss'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(s)?css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: ['postcss-sort-media-queries', 'autoprefixer'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                typescript: true,
                ext: "tsx",
              }
          },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: isDev ? 'source-map' : false,
    output: {
      path: path.resolve(config.build.root),
      publicPath: '/',
      filename: isDev ? 'js/app.js' : 'js/app.[contenthash].js',
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: config.src.fonts, to: 'fonts', noErrorOnMissing: true },
          { from: config.src.img, to: 'img', noErrorOnMissing: true },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: path.resolve(config.src.html, 'index.html'),
        filename: path.resolve(config.build.root, 'index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? 'css/app.css' : 'css/app.[contenthash].css',
      }),
    ],
  };

  if (mode === 'development') {
    webpackConfig.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: config.port,
        proxy: `https://localhost/`,
      })
    );
  }

  return webpackConfig;
};
