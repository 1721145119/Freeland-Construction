//@ts-ignore
const path = require("path");

/** @type import('webpack').Configuration */
const webpackConfig = {
  resolve: {
    /**
     * 本配置以当前文件夹（server）为基准目录。
     * 别名配置直接指向源代码目录/文件。
     */

    alias: {
      "@src": path.resolve(__dirname, "src"), // 指向于 server/src 目录
      "@shares": path.resolve(__dirname, "../shares"), // 指向于 shares 目录
      "@server": path.resolve(__dirname, "."), // 指向于 server 目录
      "@root": path.resolve(__dirname, "../"), // 指向于 最上层 目录
    },
  },
};
module.exports = webpackConfig;
