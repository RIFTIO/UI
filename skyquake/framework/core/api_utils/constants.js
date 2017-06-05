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

 /**
  * constants module. Provides constants for use within the skyquake instance
  * @module api_utils/constants
  */

var constants = {};

constants.FOREVER_ON = true;
constants.HTTP_HEADERS = {
    accept: {
        data: {
            'Accept': 'application/vnd.yang.data+json'
        },
        collection: {
            'Accept': 'application/vnd.yang.collection+json'
        }
    },
    content_type: {
        data: {
            'Content-Type': 'application/vnd.yang.data+json'
        },
        collection: {
            'Content-Type': 'application/vnd.yang.collection+json'
        }
    }
};

// (Incomplete) set of expected HTTP response codes
constants.HTTP_RESPONSE_CODES = {
    SUCCESS: {
        OK:                         200,
        CREATED:                    201,
        ACCEPTED:                   202,
        NO_CONTENT:                 204,
        MOVED_PERMANENTLY:          301,
        NOT_MODIFIED:               304
    },
    ERROR: {
        BAD_REQUEST:                400,
        UNAUTHORIZED:               401,
        FORBIDDEN:                  403,
        NOT_FOUND:                  404,
        METHOD_NOT_ALLOWED:         405,
        NOT_ACCEPTABLE:             406,
        CONFLICT:                   409,
        INTERNAL_SERVER_ERROR:      500,
        NOT_IMPLEMENTED:            501,
        BAD_GATEWAY:                502,
        SERVICE_UNAVAILABLE:        504,
        HTTP_VERSION_UNSUPPORTED:   505

    }
}
constants.SOCKET_BASE_PORT = 3500;
constants.SOCKET_POOL_LENGTH = 20;
constants.SERVER_PORT = process.env.SERVER_PORT || 8000;
constants.SECURE_SERVER_PORT = process.env.SECURE_SERVER_PORT || 8443;

constants.BASE_PACKAGE_UPLOAD_DESTINATION = 'upload/packages/';
constants.PACKAGE_MANAGER_SERVER_PORT = 4567;
constants.PACKAGE_FILE_DELETE_DELAY_MILLISECONDS = 3 * 1000 * 60; //5 minutes
constants.PACKAGE_FILE_ONBOARD_TRANSACTION_STATUS_CHECK_DELAY_MILLISECONDS = 2 * 1000; //2 seconds


module.exports = constants;