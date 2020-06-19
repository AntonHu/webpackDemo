/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-06-17 17:54:24
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-19 16:32:57
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devConfig = {
    /**
     * 打包模式，不配置会警告，但底层还是会去配置默认的，就是production
     * production: 压缩模式，被压缩的代码
     * development: 开发模式，不压缩的代码
     *
     */
    mode: 'development',
    /**
     * cheap:在生成source-map的时候可以不带列信息，只带行信息就可以了
     * 同时不要对我load代码的source-map。只要对我的业务代码进行source-map生成
     * 这种方式提示的错误比较全，打包速度比较快，
     */
    devtool: 'inline-source-map', // 起个服务器
    devServer: {
        index: 'pages/index.html', // 配置该项，localhost将不再默认指向index.html，访问入口文件需手动补全
        compress: true,
        // contentBase: 'dist', // 指定静态服务器的根目录，可以访问到 不通过webpack处理 的文件
        publicPath: '/', // 告诉浏览器通过什么路径去访问上面的 webpack打包目录
        host: 'localhost',
        port: 10010
    },
    plugins: [
        new webpack.DefinePlugin({
            APP_CONFIG: JSON.stringify({
                APPID_QP: 'wx525c1aa33476c7d9', //壳牌华北小程序id
                APP_SERVICE: 'https://api-test.1kmxc.com/appservice/',
                WECHAT2_APP_URL: 'https://wechat-test.1kmxc.com/',
                STATIC_URL: 'https://source.1kmxc.com/static-web-new/',
                HOME_STATIC: 'https://home-static.1kmxc.com/', //本地服务器静态文件目录
                IMG_URL: 'https://source.1kmxc.com/',
                IMG_BIG_URL: 'https://source.1kmxc.com/Big/',
                PINGAN_URL: 'https://icore-vass-client-stg1.pingan.com/', //平安好车主的域名
                BPPC_URL: 'https://ppst02.bppc.com.cn', //中油BP的域名
                ZJZSY_URL: 'http://hos.dev.zjzsyxs.com/portal.html?pageName=washCarDeatail&data=' //浙江中石油订单页链接
            })
        })
        // new BundleAnalyzerPlugin()
    ]
};

module.exports = merge(baseConfig, devConfig);
