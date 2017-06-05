#!/bin/bash

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

PLUGIN_NAME=helloworld
# change to the directory of this script
THIS_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $THIS_DIR
cd ..

echo 'Building plugin '$PLUGIN_NAME
echo 'Fetching third-party node_modules for '$PLUGIN_NAME
npm install
echo 'Fetching third-party node_modules for '$PLUGIN_NAME'...done'
echo 'Packaging '$PLUGIN_NAME' using webpack'
ui_plugin_cmake_build=true ./node_modules/.bin/webpack --optimize-minimize --progress --config webpack.production.config.js
echo 'Packaging '$PLUGIN_NAME' using webpack... done'
echo 'Building plugin '$PLUGIN_NAME'... done'
