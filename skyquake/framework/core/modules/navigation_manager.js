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
 * navigation_manager module. manages navigation state for a skyquake instance
 * @module framework/core/modules/navigation_manager
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

var path = require('path');
var fs = require('fs');
var util = require('util');
var skyquakeEmitter = require('./skyquakeEmitter');
require('require-json');
var _ = require('lodash');

/**
 * navigation looks like:
 * {
 *		"plugin_name": <{routes>}>
 * }
 */

var NAVIGATION = {};

function addNavigation(plugin_name, routes) {
	if (!NAVIGATION[plugin_name]) {
		NAVIGATION[plugin_name] = {};
	}

	if (!NAVIGATION[plugin_name].routes) {
		NAVIGATION[plugin_name].routes = routes;
	} else {
		_.extend(NAVIGATION[plugin_name].routes, routes);
	}
}
function addOrder(plugin_name, order) {
	if (!NAVIGATION[plugin_name]) {
		NAVIGATION[plugin_name] = {};
	}
	NAVIGATION[plugin_name].order = order || 5;
}
function addPriority(plugin_name, priority) {
	if (!NAVIGATION[plugin_name]) {
		NAVIGATION[plugin_name] = {};
	}
	NAVIGATION[plugin_name].priority = priority || 1;
}

function addLabel(plugin_name, label) {
	if (!NAVIGATION[plugin_name]) {
		NAVIGATION[plugin_name] = {};
	}
	NAVIGATION[plugin_name].label = label || 'RW.UI Plugin';
}

function getNavigation() {
	return NAVIGATION;
}

function deleteNavigation(plugin_name, route_id) {
	delete NAVIGATION[plugin_name]['routes'][route_id];
}

function onNavigationDiscovered(plugin_name, plugin) {
	addNavigation(plugin_name, plugin.routes);
	addOrder(plugin_name, plugin.order);
	addPriority(plugin_name, plugin.priority);
	addLabel(plugin_name, plugin.name);
}

function init() {
	skyquakeEmitter.on('config_discoverer.navigation_discovered', onNavigationDiscovered);
}

function config(config) {

}

function run() {

}


module.exports = {
	init: init,
	config: config,
	run: run,
	addNavigation: addNavigation,
	getNavigation: getNavigation
};
