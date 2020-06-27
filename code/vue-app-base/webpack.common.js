const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: './src/main.js', // 打包入口文件
    output: {
        path: path.join(__dirname, 'dist'), // 所有输出文件的路径 必须是绝对路径（使用node.js的path 模块）
        filename: "bundle.[hash:8].js", //打包输出的文件名
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'eslint-loader',
                enforce: 'pre'
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        esModule: false,
                        limit: 10240
                    }
                }]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin(
            {
                filename: 'index.html',
                template: './src/index.html',
                title: "webpack vue"
            }
        ),
        new webpack.DefinePlugin({
            BASE_URL: '"http://localhost:8080/"'
        }),
        new miniCssExtractPlugin({
            filename: 'style.[hash:8].css'
        })
    ]
}