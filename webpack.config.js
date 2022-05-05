const path = require('path');
const iconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    ],
    output: {
        filename: 'main.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
};