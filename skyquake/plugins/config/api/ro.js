/*
 * STANDARD_RIFT_IO_COPYRIGHT
 */

var request = require('request');
var Promise = require('bluebird');
var rp = require('request-promise');
var utils = require('../../../framework/core/api_utils/utils.js');
var constants = require('../../../framework/core/api_utils/constants.js');
var _ = require('underscore');
var RO = {}
RO.get = function(req) {
return new Promise(function(resolve, reject) {
        var self = this;
        var api_server = req.query["api_server"];
        var requestHeaders = {};
        var url = utils.confdPort(api_server) + '/api/running/resource-orchestrator';
        _.extend(
            requestHeaders,
            id ? constants.HTTP_HEADERS.accept.data : constants.HTTP_HEADERS.accept.collection, {
                'Authorization': req.get('Authorization')
            }
        );

        request({
                url: url + '?deep',
                type: 'GET',
                headers: requestHeaders,
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false
            },
            function(error, response, body) {
                var data;
                if (utils.validateResponse('RO.get', error, response, body, resolve, reject)) {
                    try {
                        data = JSON.parse(response.body);
                        if (!id) {
                            data = data.collection;
                        }

                        data = data[objKey]
                    } catch (e) {
                        console.log('Problem with "' + type.toUpperCase() + '.get"', e);
                        var err = {};
                        err.statusCode = 500;
                        err.errorMessage = {
                            error: 'Problem with "' + type.toUpperCase() + '.get": ' + e
                        }
                        return reject(err);
                    }
                    return resolve({
                        statusCode: response.statusCode,
                        data: data
                    });
                };
            });
    });
}

RO.update = updateAccount;

function updateAccount(req) {
    var self = this;
    var api_server = req.query["api_server"];
    var data = req.body;
    var requestHeaders = {};
    var url = utils.confdPort(api_server) + '/api/config/resource-orchestrator';
    var method = 'PUT'

    return new Promise(function(resolve, reject) {
        _.extend(requestHeaders,
            constants.HTTP_HEADERS.accept.data,
            constants.HTTP_HEADERS.content_type.data, {
                'Authorization': req.get('Authorization')
            });
        request({
            url: url,
            method: method,
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
            json: data,
        }, function(error, response, body) {
            if (utils.validateResponse('RO.update', error, response, body, resolve, reject)) {
                return resolve({
                    statusCode: response.statusCode,
                    data: JSON.stringify(response.body)
                });
            };
        });
    })
}

module.exports = RO;
