/*
 * @文件描述:
 * @作者: Anton
 * @Date: 2020-04-24 21:07:08
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-19 17:01:31
 */
module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parser: '@typescript-eslint/parser', // 解析typescript，从而检查和规范Typescript代码
    extends: [
        'plugin:react/recommended', // 检测和规范React代码
        'plugin:@typescript-eslint/recommended', // 包含了各类定义好的检测Typescript代码的规范
        'plugin:prettier/recommended', // 使ESLint会检测prettier的代码规范
        'prettier/@typescript-eslint' // 使得@typescript-eslint中的样式规范失效，遵循prettier中的样式规范
    ],
    plugins: ['@typescript-eslint'],
    settings: {
        //自动发现React的版本，从而进行规范react代码
        react: {
            pragma: 'React',
            version: 'detect'
        }
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        jsx: true,
        useJSXTextNode: true
    },
    rules: {
        'react/react-in-jsx-scope': 'off', // 关闭 jsx必须引入React
        'react/prop-types': 'off', // 关闭 prop-types 校验
        'react/no-string-refs': 'off', // 允许使用 ref
        'react/no-find-dom-node': 'off', // 允许使用 findDOMNode
        '@typescript-eslint/explicit-function-return-type': 'off', // 允许function不声明void
        '@typescript-eslint/interface-name-prefix': 'off', // 允许以 'I' 开头命名 interface
        '@typescript-eslint/camelcase': 'off', // 允许不是驼峰的命名
        '@typescript-eslint/no-explicit-any': 'off', // 允许any 太难了
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-empty-function': 'off', // 允许空函数
        '@typescript-eslint/no-var-requires': 'off',
        semi: [1, 'always'], // 句末需要分号
        // indent: [1, 4], // 缩进4个空格
        // "quotes": [1, "single"], // 请使用单引号
        'space-infix-ops': [
            1,
            {
                int32Hint: true
            }
        ], // 运算符周围空格
        'comma-spacing': [
            1,
            {
                before: false, // 逗号前不能有空格
                after: true // 逗号后一定要有空格
            }
        ], // 逗号周围空格
        'key-spacing': [
            1,
            {
                afterColon: true
            }
        ], // 健值对，冒号后要有空格
        'object-curly-spacing': [1, 'always'], // 对象大括号内空格
        // "array-bracket-spacing": [1, "always"], // 数组中括号内空格
        'space-before-blocks': [1, 'always'], // 块（左大括号）前必须有一个空格
        'no-unused-vars': [
            1,
            {
                // 未使用的变量或参数
                vars: 'all',
                args: 'after-used'
            }
        ]
    }
};
