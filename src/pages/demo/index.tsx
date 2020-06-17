/*
 * @文件描述: 
 * @作者: Anton
 * @Date: 2020-06-03 10:37:48
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-17 16:53:35
 */ 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

interface Demo {
    props: any;
};

const Demo = () => {
    var sym = Symbol();
    const arr = [1, 2, 3];
    const newArr = [4, 5, 6, ...arr];
    const findItem = Array.from(newArr);
    console.log(findItem)
    return (<div>demo page</div>)
};
ReactDOM.render(
    <Demo />,
    document.getElementById('app')
);