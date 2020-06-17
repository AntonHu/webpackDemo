/*
 * @文件描述: 
 * @作者: Anton
 * @Date: 2020-06-17 17:54:32
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-17 18:16:34
 */

const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const prodConfig = {
    /**
     * 打包模式，不配置会警告，但底层还是会去配置默认的，就是production
     * production: 压缩模式，被压缩的代码
     * development: 开发模式，不压缩的代码
     *
     */
    mode: 'production',
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    }
};

module.exports = merge(baseConfig, prodConfig);
