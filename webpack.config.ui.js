const path = require('path');
const rules = require('./webpack.rules.ui');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev && 'cheap-source-map',
    entry: './src/views/index.tsx',
    target: 'electron-renderer',

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.min.js',
    },

    module: {
        rules,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/views/index.html',
        }),
    ],
};
