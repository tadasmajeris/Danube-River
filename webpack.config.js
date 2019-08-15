const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ENV = process.argv[process.argv.length - 1];
const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'build');

const plugins = [
  new CopyPlugin([
    {
      from: path.join(SRC_DIR, 'assets'),
      to: path.join(BUILD_DIR, 'assets'),
    },
  ]),
  new MiniCssExtractPlugin({
    filename: 'index.css',
    path: BUILD_DIR,
  }),
  new HtmlWebpackPlugin({
    template: path.join(SRC_DIR, 'index.html'),
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    },
  }),
];

if (ENV === 'production') {
  plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
      preset: ['default', {discardComments: {removeAll: true}}],
    },
  }));
}

module.exports = {
  mode: ENV,
  entry: [
    path.join(SRC_DIR, 'index.js'),
    path.join(SRC_DIR, 'index.scss'),
  ],
  output: {
    filename: 'index.js',
    chunkFilename: `[name].[chunkhash].js`,
    path: BUILD_DIR,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|svg|gif|mp4|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins,
  devtool: 'source-map',
};