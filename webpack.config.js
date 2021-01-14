const htmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const cssExternal = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: {
        main: './src/js/index.js'
    },
    output: {
        filename: '[name]-[contenthash:8].js',
        path: path.resolve(__dirname, 'dist', 'js')
    },
    plugins: [
        new htmlPlugin({
            template: 'template.html',
            filename: '../../index.html'
        }),
        new cssExternal({
            filename: '../css/[name]-[contenthash:8].css',
        }),
        new CleanWebpackPlugin({
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true,
            cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/**/*')]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [cssExternal.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpeg|jpg)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        outputPath: '../images/',
                        publicPath: 'dist/images',
                        name: '[name]-[hash:8].[ext]',
                        esModule: false,
                    }
                }
            },
            {
                test: /\.(ttf|woff)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: '../../fonts/',
                        publicPath: 'dist/fonts',
                        name: '[name]-[hash:8].[ext]'
                    }
                }
            }
        ]
    },
}