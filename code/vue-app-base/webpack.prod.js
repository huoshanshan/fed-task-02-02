const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = merge(config, {
    mode: 'production',
    devtool: 'none',
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new UglifyJSPlugin(),
        ],
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                {
                    from: './public/favicon.ico',
                    to: './'
                }
            ],
        }),
        new CleanWebpackPlugin(),
    ]
});