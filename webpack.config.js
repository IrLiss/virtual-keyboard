const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    devServer: {
        static: './dist',
        open: {
            app: {
                name: 'chrome',
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: './src/img/keyboard-key.ico'
        }),
        new MiniCssExtractPlugin(),
    ],
    output: {
        filename: 'main.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};