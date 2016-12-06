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

./src-remove.sh

yfc schema -c rw-nsd.yang -f json -o json-nsd.json
yfc schema -c rw-vnfd.yang -f json -o json-vnfd.json
#yfc schema -c vnffgd.yang -f json -o json-vnffgd.json
#yfc schema -c rw-vld.yang -f json -o json-vld.json
#yfc schema -c ietf-inet-types.yang -f json -o ietf-inet-types.yang.json;
#yfc schema -c ietf-yang-types.yang -f json -o ietf-yang-types.yang.json

./src-append.sh

# todo: transform the -yang.json into a simpler json for the UI to consume
