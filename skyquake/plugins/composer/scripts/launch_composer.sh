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

usage() {
	echo "usage: launch_ui.sh [--enable-https --keyfile-path=<keyfile_path> --certfile-path=<certfile-path>]"
}

start_servers() {
	cd $THIS_DIR
	echo "Killing any previous instance of server_composer_ui.py"
	ps -ef | awk '/[s]cripts\/server_composer_ui.py/{print $2}' | xargs kill -9
	
	echo "Running Python webserver. HTTPS Enabled: ${ENABLE_HTTPS}"
	cd ../dist
	if [ ! -z "${ENABLE_HTTPS}" ]; then
		../scripts/server_composer_ui.py --enable-https --keyfile-path="${KEYFILE_PATH}" --certfile-path="${CERTFILE_PATH}"&
	else
		../scripts/server_composer_ui.py
	fi
}

# Begin work
for i in "$@"
do
case $i in
    -k=*|--keyfile-path=*)
    KEYFILE_PATH="${i#*=}"
    shift # past argument=value
    ;;
    -c=*|--certfile-path=*)
    CERTFILE_PATH="${i#*=}"
    shift # past argument=value
    ;;
    -h|--help)
    usage
    exit
    ;;
    -e|--enable-https)
    ENABLE_HTTPS=YES
    shift # past argument=value
    ;;
    *)
        # unknown option
    ;;
esac
done

if [[ ! -z "${ENABLE_HTTPS}" ]]; then
	if [ -z "${KEYFILE_PATH}" ] || [ -z "{CERTFILE_PATH}" ]; then
		usage
		exit
	fi
fi

# change to the directory of this script
THIS_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Call function to start web and API servers
start_servers

while true; do
  sleep 5
done
