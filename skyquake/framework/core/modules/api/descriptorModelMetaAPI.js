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
// DescriptorModelMeta API (NSD + VNFD)


var ModelMeta = {};
var Promise = require('bluebird');
var rp = require('request-promise');
var Promise = require('promise');
var constants = require('../../api_utils/constants');
var utils = require('../../api_utils/utils');
var _ = require('lodash');

ModelMeta.get = function(req) {
    var self = this;
    var api_server = req.query['api_server'];

    return new Promise(function(resolve, reject) {
        Promise.all([
            rp({
                uri: utils.confdPort(api_server) + '/api/schema/nsd-catalog/nsd',
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.collection, {
                    'Authorization': req.get('Authorization')
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
                resolveWithFullResponse: true
            }),
            rp({
                uri: utils.confdPort(api_server) + '/api/schema/vnfd-catalog/vnfd',
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.collection, {
                    'Authorization': req.get('Authorization')
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
                resolveWithFullResponse: true
            })
        ]).then(function(result) {
            var response = {};
            response['data'] = {};
            if (result[0].body && result[1].body) {
                response['data']['nsd'] = JSON.parse(result[0].body)['nsd'];
                response['data']['vnfd'] = JSON.parse(result[1].body)['vnfd'];
            }
            response.statusCode = constants.HTTP_RESPONSE_CODES.SUCCESS.OK

            resolve(response);
        }).catch(function(error) {
            var response = {};
            console.log('Problem with ModelMeta.get', error);
            response.statusCode = error.statusCode || 500;
            response.errorMessage = {
                error: 'Failed to get descriptorModelMeta' + error
            };
            reject(response);
        });
    });
};

module.exports = ModelMeta;
