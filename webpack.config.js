var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
    filename: 'stylesheet.css'
});

module.exports = {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, './public/assets/'),
        filename: 'bundle.js',
        publicPath: "/assets/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.sass$/,
                use: extractPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: false
                            }
                        }, 
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|svg)$/,
                use: ['url-loader?limit=100000', 'img-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader?limit=100000'
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
        compress: true,
        inline: true,
        port: 8080
    },
    plugins: [
        extractPlugin
    ]
};