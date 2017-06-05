#!/bin/bash

# STANDARD_RIFT_IO_COPYRIGHT

PLUGIN_NAME=accounts
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
