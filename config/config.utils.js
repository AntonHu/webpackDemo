/*
 * @文件描述: 
 * @作者: Anton
 * @Date: 2020-06-03 10:21:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-03 11:12:00
 */ 
const path = require('path');
const glob = require('glob');

exports.getMultiEntries = globPath => {
    let entries = {}, basename;
    glob.sync(globPath).forEach(entry => {
        basename = path.basename(entry, path.extname(entry));
        entries[basename] = entry + '/index.js';
    });
    return entries;
};