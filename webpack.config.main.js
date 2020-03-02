const isDev = process.env.NODE_ENV !== 'production';

module.exports = [
    {
        mode: isDev ? 'development' : 'production',
        entry: './src/main/main.ts',
        target: 'electron-main',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
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
    },
];
