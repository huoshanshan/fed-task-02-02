const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.common')
module.exports = merge(config, {
    // 开发模式配置
    mode: 'development',
    devtool: 'cheap-eval-module-source-map',
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'public'),
        open: true
    }
})