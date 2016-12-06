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


# change to the directory of this script
THIS_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $THIS_DIR
cd ..

echo "NPM config"
npm config ls
echo "Building RW.UI framework"
npm install
echo "RW.UI framework build... done"

echo "Building RW.UI plugins"
cd plugins
for f in *; do
    if [[ -d $f ]]; then
        echo 'Building plugin '$f
        cd $f
        echo 'Fetching third-party node_modules for '$f
        npm install
        echo 'Fetching third-party node_modules for '$f'...done'
        echo 'Packaging '$f' using webpack'
        ./node_modules/.bin/webpack --progress --config webpack.production.config.js
        echo 'Packaging '$f' using webpack... done'
        cd ..
        echo 'Building plugin '$f'... done'
    fi
done

echo "Building RW.UI plugins... done"

