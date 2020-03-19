const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev && 'cheap-source-map',
};
