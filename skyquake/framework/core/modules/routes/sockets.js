
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
 * socket routes module. Provides a RESTful API for this
 * skyquake instance's navigation state.
 * @module framework/core/modules/routes/socket
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var cors = require('cors');
var bodyParser = require('body-parser');
var Router = require('express').Router();
var utils = require('../../api_utils/utils');

var sockets = {};

sockets.routes = function(socketManager) {
	console.log('Configuring socket routes');
	Router.use(bodyParser.json());
	Router.use(cors());
	Router.use(bodyParser.urlencoded({
	    extended: true
	}));

	Router.post('/socket-polling', cors(), function(req, res) {
		socketManager.subscribe(req).then(function(data) {
			utils.sendSuccessResponse(data, res);
		}, function(error) {
			utils.sendErrorResponse(error, res);
		});
	});

	Router.get('/socket-polling-test', cors(), function(req, res) {
		utils.sendSuccessResponse({
			statusCode: 200,
			data: {
				message: 'Hello socket polling'
			}
		}, res);
	});
}

sockets.router = Router;

module.exports = sockets;
