
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
/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = {

	output: {
		filename: 'main.js',
		publicPath: '/assets/'
	},

	cache: true,
	debug: true,
	devtool: 'sourcemap',
	entry: [
		'webpack/hot/only-dev-server',
		'./src/components/ComposerApp.js'
	],

	stats: {
		colors: true,
		reasons: true
	},

	module: {
		preLoaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}
		],
		loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'react-hot'
			}, {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			}, {
				test: /\.scss/,
				loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
			}, {
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}, {
				test: /\.(jpg|woff|woff2|png)$/,
				loader: 'url-loader'
			}, {
				test: /\.(svg)(\?[a-z0-9]+)?$/i,
				loader: "file-loader"
			}
		]
	},
	resolve: {
		alias: {
			'styles': path.join(process.cwd(), './src/styles/'),
			'libraries': path.join(process.cwd(), './src/libraries/'),
			'components': path.join(process.cwd(), './src/components/'),
			//'stores': '../../../src/stores/',
			//'actions': '../../../src/actions/',
			'helpers': path.join(process.cwd(), './test/helpers/')
		}
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]

};
