/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-06-17 17:54:24
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-17 18:00:37
 */

const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

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
    // new BundleAnalyzerPlugin()
};

module.exports = merge(baseConfig, devConfig);
