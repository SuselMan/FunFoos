 var path = require('path');
 var webpack = require('webpack');
 var package = require('./package.json');
 var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// var NpmInstallPlugin = require('npm-install-webpack-plugin')
// var autoprefixer = require('autoprefixer');
// var precss = require('precss');

module.exports = {
    //devtool: 'cheap-module-eval-source-map',
    entry: {
        front: "./front/main"
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    plugins: [
      new webpack.DefinePlugin({
        "VERSION": JSON.stringify( package.version )
      })
      // new webpack.optimize.UglifyJsPlugin({
      //   minimize: true,
      //   compress: {
      //     properties: true,
      //     drop_console:true
      //   }
      // })
    ],
    module: {
      rules: [
            {
                test   : /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader : 'babel-loader',
                query  : {
                    presets: [ 'es2015' ]
                }
            },
            {
                test   : /\.css$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader : 'style-loader!css-loader'
            },
            {
                test   : /\.scss$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader : 'style-loader!css-loader!sass-loader!import-glob-loader'
            },
            {
                test: /\.hbs$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'handlebars-loader'
            },
            {
                test   : /\.(jpg|png|gif)$/,
                include: /images/,
                loader : 'url-loader',
                options: {
                  limit: 50000, // Convert images < ~50kb to base64 strings
                  name: 'resourses/[name].[ext]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                include: /fonts/,
                loader: 'url-loader',
                options: {
                    limit: 50000,
                    name: 'resourses/[name].[ext]'
                }
            },
        ]
    },
    node: {
        fs: 'empty'
    }
};



