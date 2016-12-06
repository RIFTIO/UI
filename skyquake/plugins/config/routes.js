/*
 * STANDARD_RIFT_IO_COPYRIGHT
 */

var app = require('express').Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js')
var ro = require('./api/ro.js')
 // Begin Accounts API
     app.get('/resource-orchestrator', cors(), function(req, res) {
        ro.get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.put('/resource-orchestrator', cors(), function(req, res) {
        ro.update(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    })

    utils.passThroughConstructor(app);

module.exports = app;
