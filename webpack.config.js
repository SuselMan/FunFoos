 var path = require('path')
 var webpack = require('webpack')
// var NpmInstallPlugin = require('npm-install-webpack-plugin')
// var autoprefixer = require('autoprefixer');
// var precss = require('precss');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './front/main'
    ],
    output: {
        path: path.join(__dirname, 'back/public'),
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                loader : 'babel',
                query  : {
                    presets: [ 'es2015' ]
                }
            },
            {
                test   : /\.css$/,
                exclude: /node_modules/,
                loader : 'style!css'
            },
            {
                test   : /\.scss$/,
                exclude: /node_modules/,
                loader : 'style!css!sass'
            },
            {
                test   : /\.(jpg|png|gif)$/,
                include: /images/,
                loader : 'url'
            }
        ]
    }
}