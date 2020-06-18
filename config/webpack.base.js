/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-03-02 14:49:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-18 19:40:08
 */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 显示进程的完成进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 设置进度字体颜色
const chalk = require('chalk');
// 以树图的方式展示打包后的文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getMultiEntries, getMultiUtils } = require('./config.utils');

const extractSass = new ExtractTextPlugin({
    // disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境下直接内联，不抽离
    filename: 'styles/[name].[hash].css'
    // allChunks: true // 异步文件抽离样式，设置为true
});

const entries = getMultiEntries(path.resolve('src/pages/*/*.+(jsx|js|tsx|ts)'));
const utils = getMultiUtils(path.resolve('src/utils/*.+(jsx|js|tsx|ts)'));
const utilChunks = {};
Object.keys(utils).forEach(
    (util) =>
        (utilChunks[util] = {
            chunks: 'initial',
            name: util,
            enforce: true
        })
);

module.exports = {
    entry: { ...utils, ...entries },
    // {
    //     // 入口文件，传入对象，定义不同的chunk（如app, utils）
    //     app: path.join(__dirname, '../src/script/index'),
    //     utils: path.join(__dirname, '../src/script/utils')
    // },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: (glob) => {
            const { name } = glob.chunk;
            return `scripts/${name}.[hash].js`;
        },
        publicPath: '../../',
        chunkFilename: 'scripts/[name].[contenthash].js'
    },
    // 解析扩展，添加了这个东西。我们就可以直接 import { a } from 'index'; 了，而不用必须 import { a } from 'index.ts' 这样输入了，因为 webpack 会自动帮我们搜索查询并添加
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js)x?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.css$/,
                // 从右到左，loader安装后无需引入可直接使用
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    // filename: '[name].[hash].css',
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                        {
                            // 全局样式
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [path.resolve(__dirname, '../src/styles/common.scss')]
                            }
                        }
                    ],
                    publicPath: '../../' // 默认取output.publicPath
                })
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 8, // 8k以下的base64内联，不产生图片文件
                        fallback: 'file-loader', // 8k以上，用file-loader抽离（非必须，默认就是file-loader）
                        name: '[name].[ext]?[hash]', // 文件名规则，默认是[hash].[ext] 图片最终的输出路径：path.join(outputPath, name)
                        outputPath: 'images/', // 输出路径
                        publicPath: '', // 可访问到图片的引用路径(相对/绝对)
                        esModule: false // 启用CommonJS模块语法 否则资源路径会显示[object module]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     cache: true, // 只有文件修改后才会重新打包文件
        //     // filename: path.join(__dirname, 'entry.html'), // 生成的html(绝对路径：可用于生成到根目录)
        //     filename: 'pages/index.html', // 生成的html文件名（相对路径：将生成到output.path指定的dist目录下）
        //     template: path.join(__dirname, '../src/index.html'), // 以哪个文件作为模板，不指定的话用默认的空模板
        //     minify: {
        //         removeComments: true // 删除注释
        //     },
        //     hash: true // 加hash
        // }),
        ...Object.keys(entries).map(
            (entry) =>
                new HtmlWebpackPlugin({
                    cache: true, // 只有文件修改后才会重新打包文件
                    filename: `${entry}.html`,
                    template: path.join(__dirname, '../src/index.html'), // 以哪个文件作为模板，不指定的话用默认的空模板
                    minify: {
                        removeComments: true // 删除注释
                    },
                    chunks: [...Object.keys(utilChunks), entry],
                    // chunks: [entry],
                    hash: true // 加hash
                })
        ),
        extractLESS,
        extractSass,
        new ProgressBarPlugin({
            format: chalk.green('Progressing') + '[:bar]' + chalk.green(':percent') + '(:elapsed seconds)',
            clear: false
        }),
        new webpack.ProvidePlugin({
            FastClick: path.resolve(__dirname, '../src/utils/fastclick.js'),
            // React: 'react',
            // ReactDOM: 'react-dom'
        })
    ]
    // 提取公共模块，包括第三方库和自定义工具库等
    // optimization: {
    //     // 找到chunk中共享的模块,取出来生成单独的chunk
    //     splitChunks: {
    //         chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
    //         cacheGroups: {
    //             vendors: {
    //                 // 抽离第三方插件
    //                 test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
    //                 name: 'vendors',
    //                 priority: -10 // 抽取优先级
    //             },
    //             // ...utilChunks
    //         }
    //     },
    //     // 为 webpack 运行时代码创建单独的chunk
    //     // runtimeChunk: {
    //     //     name: 'manifest'
    //     // }
    // }
};
