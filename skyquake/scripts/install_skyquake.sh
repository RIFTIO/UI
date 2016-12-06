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
# 13-July-2016 -- Jeremy.Mordkoff -- delete all pyo and pyc files


source_dir=$1
dest_dir=$2
bcache_dir=$3

# Create destination and build cache directories
mkdir -p $dest_dir
mkdir -p $bcache_dir

# Create necessary directories under dest and cache dirs
mkdir -p $dest_dir/framework
mkdir -p $bcache_dir/framework

find $source_dir -type f -name '*.py[oc]' -ls -delete

# Copy over skyquake-core components
cp -Lrf $source_dir/package.json $dest_dir/.
cp -Lrf $source_dir/node_modules $dest_dir/.
cp -Lrf $source_dir/skyquake.js $dest_dir/.
cp -Lrf $source_dir/framework/core $dest_dir/framework/.
cp -Lrf $source_dir/scripts $dest_dir/.

cp -Lrf $source_dir/package.json $bcache_dir/.
cp -Lrf $source_dir/node_modules $bcache_dir/.
cp -Lrf $source_dir/skyquake.js $bcache_dir/.
cp -Lrf $source_dir/framework/core $bcache_dir/framework/.
cp -Lrf $source_dir/scripts $bcache_dir/.
