const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackMd5Hash = require("webpack-md5-hash")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src/"),
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
      Images: path.resolve(__dirname, "src/images/"),
      OneDeckCore: path.resolve(__dirname, "src/core/"),
      ExampleRootWebix: path.resolve(
        __dirname,
        "src/modules/exampleRootWebix/"
      ),
      ExampleReact: path.resolve(__dirname, "src/modules/exampleReact/"),
      ExampleVue: path.resolve(__dirname, "src/modules/exampleVue/"),
      ExampleWebix: path.resolve(__dirname, "src/modules/exampleWebix/"),
      ExampleRootVue: path.resolve(__dirname, "src/modules/exampleRootVue/"),
      ExampleAuth: path.resolve(__dirname, "src/modules/exampleAuth/")
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9001,
    historyApiFallback: true,
    noInfo: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[hash].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    }),
    new WebpackMd5Hash(),
    new VueLoaderPlugin()
  ]
}
