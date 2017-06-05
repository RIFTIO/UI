/*
 * 
 *   Copyright 2016 RIFT.IO Inc
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'main.js');
var uiPluginCmakeBuild = process.env.ui_plugin_cmake_build || false;
var frameworkPath = uiPluginCmakeBuild?'../../../../skyquake/skyquake-build/framework':'../../framework';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");

// Added to overcome node-sass bug https://github.com/iam4x/isomorphic-flux-boilerplate/issues/62
process.env.UV_THREADPOOL_SIZE=64;
var config = {
    devtool: 'source-map',
    entry: mainPath,
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: "build/"
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.scss'],
        root: path.resolve(frameworkPath),
        alias: {
            'widgets': path.resolve(frameworkPath) + '/widgets',
            'style':  path.resolve(frameworkPath) + '/style',
            'utils':  path.resolve(frameworkPath) + '/utils'
        }
    },
    module: {
        loaders: [{
                test: /\.(jpe?g|png|gif|svg|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/i,
                loader: "file-loader"
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /react-treeview/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015", "stage-0", "react"]
                }
            }, {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.scss/,
                loader: 'style!css!sass?includePaths[]='+ path.resolve(frameworkPath)
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html', 
            templateContent: '<div id="app"></div>'
        })
    ]
};

if (process.argv.indexOf('--optimize-minimize') !== -1) {
    // we are going to output a gzip file in the production process
    config.output.filename = "gzip-" + config.output.filename;
    config.plugins.push(new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }));
    config.plugins.push(new CompressionPlugin({
        asset: "[path]", // overwrite js file with gz file
        algorithm: "gzip",
        test: /\.(js)$/
    }));
}
module.exports = config;
