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
 * navigation api module. Provides API functions to interact with
 * the navigation_manager
 * @module framework/core/modules/api/navigation
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var navigation_manager = require('../navigation_manager');
var Promise = require('promise');
var constants = require('../../api_utils/constants');
var navigationAPI = {};

/**
 * Get the navigation object stored in this instance
 * @param {Object} req - the Express request object with or without a plugin_id
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
navigationAPI.get = function(req) {
	return new Promise(function(resolve, reject) {
		if (req.params.plugin_id) {
			var navigation = navigation_manager.getNavigation();
			if (navigation[req.params.plugin_id]) {
				resolve({
					statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.OK,
					data: navigation[req.params.plugin_id]
				});
			} else {
				reject({
					statusCode: constants.HTTP_RESPONSE_CODES.ERROR.NOT_FOUND,
					errorMessage: 'No navigation found for plugin_id ' + req.params.plugin_id
				});
			}
		} else {
			resolve({
				statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.OK,
				data: navigation_manager.getNavigation()
			});
		}
	});
};

/**
 * Create the navigation object stored in this instance for a plugin.
 * To be used across framework instances for informing each other of
 * inter-instance navigation options.
 * @param {Object} req - the Express request object
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
navigationAPI.post = function(req) {
	return new Promise(function(resolve, reject) {
		var plugin_nav = navigation_manager.getNavigation()[req.params.plugin_id] || {};
		if (plugin_nav != {}) {
			reject({
				statusCode: constants.HTTP_RESPONSE_CODES.ERROR.CONFLICT,
				errorMessage: 'Navigation for ' + req.params.plugin_id + ' already exist'
			});
		} else {
			navigation_manager.addNavigation(req.params.plugin_id, req.body);
			resolve({
				statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.CREATED,
				data: {}
			});
		}
	});
};

/**
 * Update the navigation object stored in this instance for a plugin.
 * @param {Object} req - the Express request object with a plugin_id and route_id
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
navigationAPI.put = function(req) {
	return new Promise(function(resolve, reject) {
		var plugin_nav = navigation_manager.getNavigation()[req.params.plugin_id]['routes'][req.params.route_id];
		if (plugin_nav == null || plugin_nav == undefined) {
			reject({
				statusCode: constants.HTTP_RESPONSE_CODES.ERROR.BAD_REQUEST,
				errorMessage: 'Navigation for route' + req.params.route_id + ' under plugin ' + req.params.plugin_id + ' does not exist'
			});
		} else {
			navigation_manager.addNavigation(req.plugin_id, req.body);
			resolve({
				statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.OK,
				data: {}
			});
		}
	});
};

/**
 * Delete a particulat route navigation object stored in this instance for a plugin.
 * @param {Object} req - the Express request object with a plugin_id and route_id
 * @return {Function} Promise that resolves with success object or rejects
 *					  with error
 */
navigationAPI.delete = function(req) {
	return new Promise(function(resolve, reject) {
		var plugin_nav = navigation_manager.getNavigation()[req.params.plugin_id]['routes'[req.params.route_id]];
		if (plugin_nav == null || plugin_nav == undefined) {
			reject({
				statusCode: constants.HTTP_RESPONSE_CODES.ERROR.BAD_REQUEST,
				errorMessage: 'Navigation for route' + req.params.route_id + ' under plugin ' + req.params.plugin_id + ' does not exist'
			});
		} else {
			navigation_manager.deleteNavigation(req.params.plugin_id, req.params.route_id);
			resolve({
				statusCode: constants.HTTP_RESPONSE_CODES.SUCCESS.OK,
				data: {}
			});
		}
	});
};


module.exports = navigationAPI;