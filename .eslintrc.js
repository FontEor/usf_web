/**
 * off | 0 : 表示不验证规则
 * warn | 1 : 表示验证规则，当不满足时，给警告
 * error | 2 : 表示验证规则，不满足时报错
 */
module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    globals: {
        _: true,
        jt: true,
        oauth: true,
        req: true,
        api: true,
        CNST: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 缩进4个空格
        'indent': [0, 4],
        // 不加分号
        'semi': [2, 'never'],
        'camelcase': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
