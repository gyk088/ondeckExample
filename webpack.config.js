const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const childProcess = require("child_process");
const { readdirSync } = require('fs')
const webpackConstants = require("./webpack.constants");
const { API_PREFIX, GOOGLE_KEY, WSP_PREFIX, ROOT_PATH, DEV_PORT } = webpackConstants;
let { version } = require("./package.json");

/* Для отображения версии приложения + коммита при запуске приложения */
try {
  version = `${version} rev. ${childProcess
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim()}`;
} catch (e) {
  // Если не удалось узнать хэш текущей фиксации, игнорируем ошибку.
}

const modules = {}
try {
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  readdirSync(path.resolve(__dirname, "src/modules/")).forEach(m => {
    modules[capitalize(m)] = path.resolve(__dirname, `src/modules/${m}`)
    console.info(`\x1b[37m Prepare module: \x1b[33m ${m}`)
  })
} catch (e) {
  console.error('\x1b[31m', e.toString())
  process.exit()
}

console.info(`\x1b[37m Project is running at \x1b[32m http://localhost:${DEV_PORT}/ \x1b[37m`)

const PATHS = {
  src: path.resolve(__dirname, "src/"),
  dist: path.resolve(__dirname, "dist/"),
  images: path.resolve(__dirname, "src/images/"),
  core: path.resolve(__dirname, "src/core/"),
}

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    filename: "[name].[hash].js",
    path: PATHS.dist,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        }
      }
    }
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: DEV_PORT,
    historyApiFallback: true,
    noInfo: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: PATHS.src,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/react"],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|jpg|svg|png)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Images: PATHS.images,
      OneDeckCore: PATHS.core,
      ...modules,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      API_PREFIX: JSON.stringify(API_PREFIX),
      WSP_PREFIX: JSON.stringify(WSP_PREFIX),
      GOOGLE_KEY: JSON.stringify(GOOGLE_KEY),
      VERSION: JSON.stringify(version),
      ROOT_PATH: JSON.stringify(ROOT_PATH),
    }),
    new MiniCssExtractPlugin({
      filename: "style.[hash].css"
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    }),
    new VueLoaderPlugin()
  ]
};