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

var request = require('request');
var Promise = require('bluebird');
var rp = require('request-promise');
var utils = require('../../../framework/core/api_utils/utils.js');
var constants = require('../../../framework/core/api_utils/constants.js');
var _ = require('underscore');
var APIVersion = '/v1';
var About = {};

About.getVCS = function(req) {
  var api_server = req.query["api_server"];

  return new Promise(function(resolve, reject) {
    var requestHeaders = {};
    _.extend(requestHeaders,
      constants.HTTP_HEADERS.accept.data, {
        'Authorization': req.get('Authorization')
      });
    request({
        url: utils.confdPort(api_server) + APIVersion + '/api/operational/vcs/info?deep',
        type: 'GET',
        headers: requestHeaders,
        forever: constants.FOREVER_ON,
        rejectUnauthorized: false,
      },
      function(error, response, body) {
        var data;
        console.log(error);
        if (utils.validateResponse('About/vcs.get', error, response, body, resolve, reject)) {
          try {
            data = JSON.parse(response.body)["rw-base:info"]
          } catch (e) {
            return reject({});
          }

          return resolve(data);
        }
      });
  });
}

About.getVersion = function(req) {
  var api_server = req.query["api_server"];

  return new Promise(function(resolve, reject) {
    var requestHeaders = {};
    _.extend(requestHeaders,
      constants.HTTP_HEADERS.accept.data, {
        'Authorization': req.get('Authorization')
      });
    request({
        url: utils.confdPort(api_server) + APIVersion + '/api/operational/version?deep',
        type: 'GET',
        headers: requestHeaders,
        forever: constants.FOREVER_ON,
        rejectUnauthorized: false,
      },
      function(error, response, body) {
        var data;
        console.log(error);
        if (utils.validateResponse('About/version.get', error, response, body, resolve, reject)) {
          try {
            data = JSON.parse(response.body)['rw-base:version']
          } catch (e) {
            return reject({});
          }

          return resolve(data);
        }
      });
  });
}

About.get = function(req) {

  var api_server = req.query["api_server"];

  return new Promise(function(resolve, reject) {
    Promise.all([
        About.getVCS(req),
        About.getVersion(req)
      ])
      .then(function(results) {
        var AboutObject = {};
        AboutObject.vcs = results[0];
        AboutObject.version = results[1];
        resolve(AboutObject);
      }, function(error) {
        console.log('error getting vcs data', error);
        reject(error)
      });
  });
};

About.uptime = function(req) {
  var api_server = req.query["api_server"];
  return new Promise(function(resolve, reject) {
    var requestHeaders = {};
    _.extend(requestHeaders,
      constants.HTTP_HEADERS.accept.data, {
        'Authorization': req.get('Authorization')
      });
    request({
        url: utils.confdPort(api_server) + APIVersion + '/api/operational/uptime/uptime',
        type: 'GET',
        headers: requestHeaders,
        forever: constants.FOREVER_ON,
        rejectUnauthorized: false
      },
      function(error, response, body) {
        if (utils.validateResponse('About.uptime', error, response, body, resolve, reject)) {
          try {
            data = JSON.parse(response.body);
          } catch (e) {
            return reject({});
          }
          return resolve(data)

        }
      })
  })
}
module.exports = About;
