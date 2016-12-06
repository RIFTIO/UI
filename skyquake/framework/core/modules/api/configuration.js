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
 * Configuration api module. Provides API functions to configure node
 * @module framework/core/modules/api/configuration
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var Promise = require('bluebird');
var constants = require('../../api_utils/constants');
var utils = require('../../api_utils/utils');
var request = utils.request;
var configurationAPI = {};
var _ = require('lodash');
var GLOBAL_CONFIGURATION = {
    api_server: 'localhost',
    ssl_enabled: true
};

/**
 * Get the server configuration for the Express API
 * @param {Object} req - the Express request object
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
configurationAPI.get = function(req) {
	return new Promise(function(resolve, reject) {
        resolve({
            statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.OK,
            data: GLOBAL_CONFIGURATION
        });
    });
};

/**
 * Update the server configuration for the Express API
 * @param {Object} req - the Express request object
 * @return {Function} Promise that resolves with success object or rejects
 *                    with error
 */
configurationAPI.update = function(req) {
    var newConfiguration = req.body;
    return new Promise(function(resolve, reject) {
        try {
            _.merge(GLOBAL_CONFIGURATION, newConfiguration);
            resolve({
                statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.NO_CONTENT,
                data: {}
            })
        } catch (e) {
            console.log('Merging on new configuration failed. Error:', e);
            reject({
                statusCode: constants.HTTP_RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR,
                errorMessage: {
                    error: 'Problem with merging new configuration. Error: ' + JSON.stringify(e)
                }
            });
        }
    });
};

configurationAPI.globalConfiguration = {};
/**
 * Internally used (by Node.js components) to update server configuration
 * @param {Object} data - the configuration to merge
 */
configurationAPI.globalConfiguration.update = function(data) {
    _.merge(GLOBAL_CONFIGURATION, data);
};

/**
 * Internally used (by Node.js components) to get server configuration
 * @param {Object} data - the configuration to merge
 */
configurationAPI.globalConfiguration.get = function() {
    return GLOBAL_CONFIGURATION;
};

module.exports = configurationAPI;
