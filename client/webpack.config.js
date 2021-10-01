const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: "eval-cheap-source-map",
    output: {
        filename: 'index.js',
        path: path.join(__dirname, './dist'),
    },

    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: 8000,
        compress: true,
    }
}