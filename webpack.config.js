 var path = require('path')
 var webpack = require('webpack')
// var NpmInstallPlugin = require('npm-install-webpack-plugin')
// var autoprefixer = require('autoprefixer');
// var precss = require('precss');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        front: "./front/main"
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
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
                loader : 'style!css!sass!import-glob-loader'
            },
            {
                test: /\.hbs$/,
                exclude: /node_modules/,
                loader: 'handlebars-loader'
            },
            {
                test   : /\.(jpg|png|gif)$/,
                include: /images/,
                loader : 'url'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                include: /fonts/,
                loader: 'url',
                options: {
                    limit: 50000,
                }
            },
        ]
    },
    node: {
        fs: 'empty'
    }
}

 // import-glob-loader translate @import "foo/**/*"; to
 // @import "foo/1.scss";
 // @import "foo/bar/2.scss";
 // @import "foo/bar/3.scss";