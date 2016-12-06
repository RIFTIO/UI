
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
 * navigation routes module. Provides a RESTful API for this
 * skyquake instance's navigation state.
 * @module framework/core/modules/routes/navigation
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var cors = require('cors');
var bodyParser = require('body-parser');
var navAPI = require('../api/navigation');
var Router = require('express').Router();
var utils = require('../../api_utils/utils');
var configurationAPI = require('../api/configuration');

Router.use(bodyParser.json());
Router.use(cors());
Router.use(bodyParser.urlencoded({
    extended: true
}));

Router.get('/', cors(), function(req, res, next) {
	res.redirect('/launchpad/?api_server=' + req.protocol + '://' + configurationAPI.globalConfiguration.get().api_server + '&upload_server=' + req.protocol + '://' + (configurationAPI.globalConfiguration.get().upload_server || req.hostname));
});

Router.get('/nav', cors(), function(req, res) {
	navAPI.get(req).then(function(data) {
		utils.sendSuccessResponse(data, res);
	}, function(error) {
		utils.sendErrorResponse(error, res);
	});
});

Router.get('/nav/:plugin_id', cors(), function(req, res) {
	navAPI.get(req).then(function(data) {
		utils.sendSuccessResponse(data, res);
	}, function(error) {
		utils.sendErrorResponse(error, res);
	});
});

Router.post('/nav/:plugin_id', cors(), function(req, res) {
	navAPI.create(req).then(function(data) {
		utils.sendSuccessResponse(data, res);
	}, function(error) {
		utils.sendErrorResponse(error, res);
	});
});

Router.put('/nav/:plugin_id/:route_id', cors(), function(req, res) {
	navAPI.update(req).then(function(data) {
		utils.sendSuccessResponse(data, res);
	}, function(error) {
		utils.sendErrorResponse(error, res);
	});
});

Router.delete('/nav/:plugin_id/:route_id', cors(), function(req, res) {
	navAPI.delete(req).then(function(data) {
		utils.sendSuccessResponse(data, res);
	}, function(error) {
		utils.sendErrorResponse(error, res);
	});
});


module.exports = Router;
