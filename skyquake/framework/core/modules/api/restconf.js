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
 * restconf api module. Provides API functions to interact with RESTCONF
 * @module framework/core/modules/api/restconf
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var Promise = require('bluebird');
var constants = require('../../api_utils/constants');
var utils = require('../../api_utils/utils');
var request = utils.request;
var restconfAPI = {};
var _ = require('lodash');
restconfAPI['streams'] = {};

/**
 * Get the RESTCONF/Netconf streams from the RESTCONF endpoint
 * @param {Object} req - the Express request object with or without a plugin_id
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
restconfAPI['streams'].get = function(req) {
	var api_server = req.query["api_server"];
    var uri = utils.confdPort(api_server);
    var url = req.path;
    return new Promise(function(resolve, reject) {
        request({
            url: uri + url + '?deep',
            method: 'GET',
            headers: _.extend({}, constants.HTTP_HEADERS.accept.data, {
                'Authorization': req.get('Authorization')
            }),
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
        }, function(error, response, body) {
            if (utils.validateResponse('restconfAPI.streams', error, response, body, resolve, reject)) {
                // resolve(JSON.parse(response.body))
                resolve({
                	statusCode: response.statusCode,
                	data: JSON.parse(response.body)
                })
            };
        })
    })
};


module.exports = restconfAPI;
