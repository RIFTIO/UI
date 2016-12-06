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


var Promise = require('bluebird');
var utils = require('../../../framework/core/api_utils/utils.js');
var request = utils.request;
var constants = require('../../../framework/core/api_utils/constants.js');
var APIVersion = '/v1';
var crashDetails = {};
var debug = {};
var _ = require('lodash');

crashDetails.get = function(req) {
  var api_server = req.query["api_server"];

  return new Promise(function(resolve, reject) {
    var requestHeaders = {};
    _.extend(requestHeaders,
      constants.HTTP_HEADERS.accept.data, {
        'Authorization': req.get('Authorization')
      });
    request({
        url: utils.confdPort(api_server) + APIVersion +'/api/operational/crash?deep',
        type: 'GET',
        headers: requestHeaders,
        forever: constants.FOREVER_ON,
        rejectUnauthorized: false,
      },
      function(error, response, body) {
        var data;
        console.log(error);
        if (utils.validateResponse('crashDetails.get', error, response, body, resolve, reject)) {
          try {
            data = JSON.parse(response.body)['rwshell-mgmt:crash'].list.vm;
          } catch (e) {
            return reject(e);
          }

          return resolve(data);
        }
      });
  });
}

debug.crashDetails = crashDetails;

module.exports = debug;
