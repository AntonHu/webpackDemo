/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-06-17 17:54:32
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-19 13:49:27
 */
const webpack = require('webpack');
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
        // 压缩css
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new webpack.DefinePlugin({
            APP_CONFIG: JSON.stringify({
                APPID_QP: 'wx525c1aa33476c7d9', //壳牌华北小程序id
                APP_SERVICE: 'https://api.1kmxc.com/appservice/',
                WECHAT2_APP_URL: 'https://wechat.1kmxc.com/',
                STATIC_URL: 'https://source.1kmxc.com/static-web-new/',
                HOME_STATIC: 'https://home-static.1kmxc.com/', //本地服务器静态文件目录
                IMG_URL: 'https://source.1kmxc.com/',
                IMG_BIG_URL: 'https://source.1kmxc.com/Big/',
                PINGAN_URL: 'https://icore-vass-client.pingan.com/', //平安好车主的域名
                BPPC_URL: 'https://ppst02.bppc.com.cn', //中油BP的域名
                ZJZSY_URL: 'http://hos.zjzsyxs.com/portal.html?pageName=washCarDeatail&data=', //浙江中石油订单页链接
                ISPROD: true //是否是正式环境
            })
        })
    ]
};

module.exports = merge(baseConfig, prodConfig);
