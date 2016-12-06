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

plugin=accounts
source_dir=$1
dest_dir=$2
bcache_dir=$3

# Create destination and build cache directories
mkdir -p $dest_dir
mkdir -p $bcache_dir

# Create necessary directories under dest and cache dirs
mkdir -p $dest_dir/framework
mkdir -p $dest_dir/plugins
mkdir -p $bcache_dir/framework
mkdir -p $bcache_dir/plugins

# Copy over built plugin's public folder, config.json, routes.js and api folder as per installed_plugins.txt
mkdir -p $dest_dir/plugins/$plugin
cp -Lrf $source_dir/public $dest_dir/plugins/$plugin/.
cp -Lrf $source_dir/config.json $dest_dir/plugins/$plugin/.
cp -Lrf $source_dir/routes.js $dest_dir/plugins/$plugin/.
cp -Lrp $source_dir/api $dest_dir/plugins/$plugin/.
tar -cf $dest_dir/plugins/$plugin/node_modules.tar node_modules package.json -C $source_dir
#cp -Lrp $source_dir/node_modules $dest_dir/plugins/$plugin/.
mkdir -p $bcache_dir/plugins/$plugin
cp -Lrf $source_dir/public $bcache_dir/plugins/$plugin/.
cp -Lrf $source_dir/config.json $bcache_dir/plugins/$plugin/.
cp -Lrf $source_dir/routes.js $bcache_dir/plugins/$plugin/.
cp -Lrp $source_dir/api $bcache_dir/plugins/$plugin/.
tar -cf $bcache_dir/plugins/$plugin/node_modules.tar node_modules package.json -C $source_dir
#cp -Lrp $source_dir/node_modules $bcache_dir/plugins/$plugin/.
