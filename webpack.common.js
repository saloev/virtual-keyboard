const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "main.js"
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets/"),
      src: path.resolve(__dirname, "src/")
    }
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "src/assets/")
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-private-methods",
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("node-sass"),
              sassOptions: {
                // Nested dependancies not loaded @see https://github.com/rails/webpacker/issues/1951
                includePaths: ["./node_modules"]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "img/[contenthash].[ext]"
        }
      }
    ]
  }
};
