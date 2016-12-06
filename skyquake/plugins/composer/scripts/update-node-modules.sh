#!/bin/sh

# 
#   Copyright 2016 RIFT.IO Inc
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#


# the order of the install is important

#npm install -g grunt-cli

npm cache clean

rm -R node_modules

# dependencies
npm install --save alt
npm install --save change-case
npm install --save classnames
npm install --save d3
npm install --save dropzone
npm install --save es5-shim
npm install --save events
npm install --save flux
npm install --save highlight.js
npm install --save jquery
npm install --save lodash
npm install --save moment
npm install --save normalize.css
npm install --save numeral
npm install --save object-assign
npm install --save react
npm install --save react-dom
npm install --save react-addons-pure-render-mixin
npm install --save react-highlight
npm install --save react-tooltip
npm install --save babel-polyfill

# dev-dependencies
npm install --save-dev imagemin
npm install --save-dev jasmine-core
npm install --save-dev babel
npm install --save-dev babel-core
npm install --save-dev eslint
npm install --save-dev karma
npm install --save-dev grunt
npm install --save-dev webpack
npm install --save-dev node-sass
npm install --save-dev phantomjs

npm install --save-dev grunt-contrib-clean
npm install --save-dev grunt-contrib-connect
npm install --save-dev grunt-contrib-copy
npm install --save-dev grunt-karma
npm install --save-dev grunt-open
npm install --save-dev load-grunt-tasks

npm install --save-dev karma-jasmine
npm install --save-dev karma-phantomjs-launcher
npm install --save-dev karma-script-launcher
npm install --save-dev karma-webpack

npm install --save-dev webpack-dev-server
npm install --save-dev grunt-webpack
npm install --save-dev react-hot-loader
npm install --save-dev image-webpack-loader
npm install --save-dev sass-loader
npm install --save-dev style-loader
npm install --save-dev url-loader
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-preset-react
npm install --save-dev json-loader
npm install --save-dev babel-loader
npm install --save-dev css-loader
npm install --save-dev eslint-loader
npm install --save-dev eslint-plugin-react

grunt build
grunt serve
