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

function handle_received_signal() {
    forever stopall
    echo "Stopped Skyquake and API servers started with forever"
    exit
}


start_servers() {
	cd $THIS_DIR
	echo "Stopping any previous instances of Skyquake and API servers started with forever"
	forever stopall


	echo "Running Node.js Skyquake server. HTTPS Enabled: ${ENABLE_HTTPS}"
	cd ..
	if [ ! -z "${ENABLE_HTTPS}" ]; then
		forever start -a -l forever.log -o out.log -e err.log skyquake.js	--enable-https --keyfile-path="${KEYFILE_PATH}" --certfile-path="${CERTFILE_PATH}"
	else
		forever start -a -l forever.log -o out.log -e err.log skyquake.js
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
	if [ -z "${KEYFILE_PATH}" ] || [ -z "${CERTFILE_PATH}" ]; then
		usage
		exit
	fi
fi


# change to the directory of this script
THIS_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $THIS_DIR

# Call script to handle tarred node_modules as cpack+RPM cannot handle a lot of files
$THIS_DIR/handle_plugin_node_modules

# Call function to start web and API servers
start_servers


# Ensure that the forever script is stopped when this script exits
trap "echo \"Received EXIT\"; handle_received_signal" EXIT
trap "echo \"Received SIGINT\"; handle_received_signal" SIGINT
trap "echo \"Received SIGKILL\"; handle_received_signal" SIGKILL
trap "echo \"Received SIGABRT\"; handle_received_signal" SIGABRT
trap "echo \"Received SIGQUIT\"; handle_received_signal" SIGQUIT
trap "echo \"Received SIGSTOP\"; handle_received_signal" SIGSTOP
trap "echo \"Received SIGTERM\"; handle_received_signal" SIGTERM
trap "echo \"Received SIGTRAP\"; handle_received_signal" SIGTRAP

# Keep this script in the foreground so the system doesn't think that the
# server crashed.
while true; do
  sleep 5
done
