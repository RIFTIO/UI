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

var app = require('express').Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js')
var accountsAPI = require('./api/accounts.js')
 // Begin Accounts API
    app.get('/all', cors(), function(req, res) {
        accountsAPI.get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/:type', cors(), function(req, res) {
        accountsAPI.get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/:type/:name', cors(), function(req, res) {
        accountsAPI.get(req).then(function(data) {
            utils.sendSuccessResponse(data.data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/:type', cors(), function(req, res) {
        accountsAPI.create(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.put('/:type/:id', cors(), function(req, res) {
        accountsAPI.update(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/:type/:id', cors(), function(req, res) {
        accountsAPI.delete(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/:type/:name/refresh', cors(), function(req, res) {
        accountsAPI.refreshAccountConnectionStatus(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    })
    utils.passThroughConstructor(app);

module.exports = app;
