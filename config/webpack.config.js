/*
 * @文件描述: 
 * @作者: Anton
 * @Date: 2020-03-02 14:49:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-03 15:16:07
 */ 
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { getMultiEntries } = require('./config.utils');

const extractLESS = new ExtractTextPlugin({
	// disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境下直接内联，不抽离
    filename: 'styles/[name].[hash].css',
    // allChunks: true // 异步文件抽离样式，设置为true
});

var entries = getMultiEntries(path.resolve('src/pages/*'));

module.exports = {
    mode: 'development',
    entry: entries,
    // {
    //     // 入口文件，传入对象，定义不同的chunk（如app, utils）
    //     app: path.join(__dirname, '../src/script/index'),
    //     utils: path.join(__dirname, '../src/script/utils')
    // },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: (glob) => {
            const { name } = glob.chunk;
            return `scripts/${name}/${name}.[hash].js`;
        },
        // chunkFilename: 'script/[name]/[name].[hash].js',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                // 从右到左，loader安装后无需引入可直接使用
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                // use: [
                //     { loader: 'style-loader' }, // css 内联
                //     { loader: 'css-loader' }, // 解析 @import url() 语法
                //     { loader: 'less-loader' } // less 转译 css
                // ],
                use: extractLESS.extract({
                    // filename: '[name].[hash].css',
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader'],
                    publicPath: '../' // 默认取output.publicPath
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
                        publicPath: '',  // 可访问到图片的引用路径(相对/绝对)
                        esModule: false // 启用CommonJS模块语法 否则资源路径会显示[object module]
					}
				}
			}
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
			// filename: path.join(__dirname, 'entry.html'), // 生成的html(绝对路径：可用于生成到根目录)
            filename: 'pages/index.html', // 生成的html文件名（相对路径：将生成到output.path指定的dist目录下）
            template: path.join(__dirname, '../src/index.html'), // 以哪个文件作为模板，不指定的话用默认的空模板
            minify: {
                removeComments: true // 删除注释
            },
            hash: true // 加hash
        }),
        ...Object.keys(entries).map(entry => new HtmlWebpackPlugin({
            filename: `pages/${entry}.html`, 
            chunks: [entry]
        })),
        // new HtmlWebpackPlugin({
        //     filename: 'app.html', 
        //     chunks: ['app']
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'utils.html', 
        //     chunks: ['utils']
        // }),
        extractLESS
    ],
    devServer: {
        // index: 'menu.html', // 配置该项，localhost将不再默认指向index.html，访问入口文件需手动补全
        contentBase: '/', // 指定静态服务器的根目录，可以访问到 不通过webpack处理 的文件
        publicPath: '/', // 告诉浏览器通过什么路径去访问上面的 webpack打包目录
        host: 'localhost',
        port: 10010
    }
};