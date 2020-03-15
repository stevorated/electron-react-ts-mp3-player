const WebpackShellPlugin = require('webpack-shell-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const startupScript = isDev
    ? 'sleep 3 && yarn run:electron'
    : 'sleep 3 && yarn run:electron';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: 'cheap-source-map',
    entry: './src/main/main.ts',
    target: 'electron-main',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'awesome-typescript-loader' }],
            },
        ],
    },
    output: {
        path: __dirname + '/dist',
        filename: 'electron.js',
    },
    externals: {
        sqlite3: 'commonjs sqlite3',
        'electron-reload': 'commonjs electron-reload',
        'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['echo "Webpack Start"'],
            onBuildEnd: [startupScript],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: true,
                    keep_fnames: false,
                    safari10: false,
                },
            }),
        ],
    },
};
