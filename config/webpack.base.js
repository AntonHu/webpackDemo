/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-03-02 14:49:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-19 13:47:06
 */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 显示进程的完成进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 设置进度字体颜色
const chalk = require('chalk');
// 以树图的方式展示打包后的文件
const { getMultiEntries, getMultiUtils } = require('./config.utils');

const extractSass = new ExtractTextPlugin({
    // disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境下直接内联，不抽离
    filename: 'styles/[name].[md5:contenthash:hex:8].css' // webpack 4.3+ contenthash已经是关键字，不能当作变量，所以要改成这样
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
    output: {
        path: path.join(__dirname, '../dist'),
        filename: (glob) => {
            const { name } = glob.chunk;
            return `scripts/${name}.[contenthash].js`;
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
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                        {
                            // 全局样式
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [path.resolve(__dirname, '../src/styles/common.scss')],
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
        ...Object.keys(entries).map((entry) => {
            const getHtmlPath = (filePath) => {
                const defaultPath = path.join(__dirname, `../src/index.html`);
                try {
                    const stat = fs.statSync(filePath);
                    return stat.isFile() ? filePath : defaultPath;
                } catch (e) {
                    return defaultPath;
                }
            };
            return new HtmlWebpackPlugin({
                cache: true, // 只有文件修改后才会重新打包文件
                filename: `${entry}.html`,
                template: getHtmlPath(path.join(__dirname, `../src/pages/${entry}.html`)),
                minify: {
                    removeComments: true // 删除注释
                },
                chunks: [
                    entry,
                    `manifest-${entry}`,
                    ...Object.keys(utilChunks),
                    ...Object.keys(utilChunks).map((utilItem) => `manifest-${utilItem}`),
                    'vendor',
                    'common'
                ],
                // hash: true // script标签的src路径会加hash作为请求参数，这个会影响缓存
            });
        }),
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
    ],
    // 提取公共模块，包括第三方库和自定义工具库等
    optimization: {
        // 找到chunk中共享的模块,取出来生成单独的chunk
        splitChunks: {
            chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            minSize: 0,
            cacheGroups: {
                // 关闭webpack默认的 default vendors 配置
                default: false,
                vendors: false,
                vendor: {
                    // 抽离第三方插件
                    test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    enforce: true,
                    priority: 10, // 抽取优先级
                    name: 'vendor'
                },
                // 将所有依赖的自研发模块放到同一个文件中
                common: {
                    chunks: 'all',
                    minChunks: 2, // 只有被依赖2次或者以上的模块才被放到common中
                    name: 'common',
                    enforce: true,
                    priority: 5 // 优先级低于vendor
                }
            }
        },
        // 为 webpack 运行时代码创建单独的chunk
        runtimeChunk: {
            name: (entry) => `manifest-${entry.name}`
        }
    }
};
