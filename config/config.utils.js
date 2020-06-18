/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-06-03 10:21:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-18 17:55:12
 */
const path = require('path');
const glob = require('glob');

exports.getMultiEntries = (globPath) => {
    const entries = {};
    glob.sync(globPath).forEach((entry) => {
        const basename = path.basename(entry, path.extname(entry)); // 返回路径最后一部分名称，去掉后缀名
        let dirname = path.basename(path.dirname(entry)); // 返回路径最后一个文件夹名称
        dirname = dirname + '/' + basename;
        entries[dirname] = entry;
    });
    return entries;
};

exports.getMultiUtils = (globPath) => {
    const entries = {};
    glob.sync(globPath).forEach((entry) => {
        const basename = path.basename(entry, path.extname(entry)); // 返回路径最后一部分名称，去掉后缀名
        let dirname = path.basename(path.dirname(entry)); // 返回路径最后一个文件夹名称
        dirname = dirname + '/' + basename;
        entries[dirname] = entry;
    });
    return entries;
};
