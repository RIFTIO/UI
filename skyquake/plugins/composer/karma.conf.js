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
'use strict';

var path = require('path');

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', 'es6-shim'],
		files: [
			'test/spec/**/*.js'
		],
		preprocessors: {
			'test/spec/**/*.js': ['webpack']
		},
		webpack: require('./webpack.config.js'),
		webpackMiddleware: {
			noInfo: true,
			stats: {
				colors: true
			}
		},
		webpackServer: {
			noInfo: true //please don't spam the console when running in karma!
		},
		exclude: [],
		port: 8080,
		logLevel: config.LOG_INFO,
		colors: true,
		autoWatch: true,
		browsers: ['Chrome'],
		reporters: ['dots'],
		captureTimeout: 60000,
		singleRun: false,
		plugins: [
			require('karma-webpack'),
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-phantomjs-launcher'),
			require('karma-es6-shim')
		]
	});
};
