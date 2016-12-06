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
var Promise = require('promise');
var _ = require('underscore');
var utils = require('../../../../framework/core/api_utils/utils.js');
var constants = require('../../../../framework/core/api_utils/constants.js');
var ConfigAgentAccount = {};


// Config-Agent Account APIs
ConfigAgentAccount.get = function(req) {
    var self = this;

    var api_server = req.query["api_server"];
    var id = req.params.id;

    if (!id) {
        // Get all config accounts
        return new Promise(function(resolve, reject) {

            var requestHeaders = {};
            _.extend(requestHeaders,
                constants.HTTP_HEADERS.accept.collection, {
                    'Authorization': req.get('Authorization')
                });

            request({
                    url: utils.confdPort(api_server) + '/api/operational/config-agent/account',
                    type: 'GET',
                    headers: requestHeaders,
                    forever: constants.FOREVER_ON,
                    rejectUnauthorized: false,
                },
                function(error, response, body) {
                    var data;
                    var statusCode;
                    if (utils.validateResponse('ConfigAgentAccount.get', error, response, body, resolve, reject)) {
                        try {
                            data = JSON.parse(response.body).collection['rw-config-agent:account'];
                            statusCode = response.statusCode;
                        } catch (e) {
                            console.log('Problem with "ConfigAgentAccount.get"', e);
                            var err = {};
                            err.statusCode = 500;
                            err.errorMessage = {
                                error: 'Problem with "ConfigAgentAccount.get": ' + e.toString()
                            }
                            return reject(err);
                        }

                        return resolve({
                            statusCode: statusCode,
                            data: data
                        });
                    };
                });
        });
    } else {
        //Get a specific config account
        return new Promise(function(resolve, reject) {
            var requestHeaders = {};
            _.extend(requestHeaders,
                constants.HTTP_HEADERS.accept.data, {
                    'Authorization': req.get('Authorization')
                });

            request({
                    url: utils.confdPort(api_server) + '/api/operational/config-agent/account/' + id,
                    type: 'GET',
                    headers: requestHeaders,
                    forever: constants.FOREVER_ON,
                    rejectUnauthorized: false,
                },
                function(error, response, body) {
                    var data;
                    var statusCode;
                    if (utils.validateResponse('ConfigAgentAccount.get', error, response, body, resolve, reject)) {
                        try {
                            data = JSON.parse(response.body)['rw-config-agent:account'];
                            statusCode = response.statusCode;
                        } catch (e) {
                            console.log('Problem with "ConfigAgentAccount.get"', e);
                            var err = {};
                            err.statusCode = 500;
                            err.errorMessage = {
                                error: 'Problem with "ConfigAgentAccount.get": ' + e.toString()
                            }
                            return reject(err);
                        }

                        return resolve({
                            statusCode: statusCode,
                            data: data
                        });
                    }
                });
        });
    }
};

ConfigAgentAccount.create = function(req) {

    var api_server = req.query["api_server"];
    var data = req.body;

    return new Promise(function(resolve, reject) {
        var jsonData = {
            "account": Array.isArray(data) ? data : [data]
        };

        console.log('Creating with', JSON.stringify(jsonData));

        var requestHeaders = {};
        _.extend(requestHeaders,
            constants.HTTP_HEADERS.accept.data,
            constants.HTTP_HEADERS.content_type.data, {
                'Authorization': req.get('Authorization')
            });

        request({
            url: utils.confdPort(api_server) + '/api/config/config-agent',
            method: 'POST',
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
            json: jsonData,
        }, function(error, response, body) {
            if (utils.validateResponse('ConfigAgentAccount.create', error, response, body, resolve, reject)) {
                return resolve({
                    statusCode: response.statusCode,
                    data: JSON.stringify(response.body),
                    body:response.body.body
                });
            };
        });
    });
};

ConfigAgentAccount.update = function(req) {

    var api_server = req.query["api_server"];
    var id = req.params.id;
    var data = req.body;

    return new Promise(function(resolve, reject) {
        var jsonData = {
            "rw-config-agent:account": data
        };

        console.log('Updating config-agent', id, ' with', JSON.stringify(jsonData));

        var requestHeaders = {};
        _.extend(requestHeaders,
            constants.HTTP_HEADERS.accept.data,
            constants.HTTP_HEADERS.content_type.data, {
                'Authorization': req.get('Authorization')
            });

        request({
            url: utils.confdPort(api_server) + '/api/config/config-agent/account/' + id,
            method: 'PUT',
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
            json: jsonData,
        }, function(error, response, body) {
            if (utils.validateResponse('ConfigAgentAccount.update', error, response, body, resolve, reject)) {
                return resolve({
                    statusCode: response.statusCode,
                    data: JSON.stringify(response.body)
                });
            };
        });
    });
};

ConfigAgentAccount.delete = function(req) {

    var api_server = req.query["api_server"];
    var id = req.params.id;

    if (!id || !api_server) {
        return new Promise(function(resolve, reject) {
            console.log('Must specifiy api_server and id to delete config-agent account');
            return reject({
                statusCode: 500,
                errorMessage: {
                    error: 'Must specifiy api_server and id to delete config agent account'
                }
            });
        });
    };

    return new Promise(function(resolve, reject) {
        var requestHeaders = {};
        _.extend(requestHeaders,
            constants.HTTP_HEADERS.accept.data, {
                'Authorization': req.get('Authorization')
            });
        request({
            url: utils.confdPort(api_server) + '/api/config/config-agent/account/' + id,
            method: 'DELETE',
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
        }, function(error, response, body) {
            if (utils.validateResponse('ConfigAgentAccount.delete', error, response, body, resolve, reject)) {
                return resolve({
                    statusCode: response.statusCode,
                    data: JSON.stringify(response.body)
                });
            };
        });
    });
};



module.exports = ConfigAgentAccount;
