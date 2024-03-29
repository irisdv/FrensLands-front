const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "../../dist/client"),
    },
    watchFiles: path.join(__dirname, "../../dist/client"),
    hot: true,
    // proxy: {
    //   "/socket.io": {
    //     target: "http://127.0.0.1:3001",
    //     ws: true,
    //   },
    // },
    historyApiFallback: true,
    liveReload: true,
    compress: true,
    host: "localhost",
    port: 8008,
  },
});
