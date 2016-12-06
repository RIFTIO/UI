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
 * Main skyquake module.
 * @module skyquake
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

// Standard library imports for forking
var cluster = require("cluster");
var cpu = require('os').cpus().length;
var clusteredLaunch = process.env.CLUSTER_SUPPORT || false;
var constants = require('./framework/core/api_utils/constants');
// Uncomment for Replay support
// const Replay  = require('replay');
var freePorts = [];
for (var i = 0; i < constants.SOCKET_POOL_LENGTH; i++) {
	freePorts[i] = constants.SOCKET_BASE_PORT + i;
};


if (cluster.isMaster && clusteredLaunch) {
    console.log(cpu, 'CPUs found');
    for (var i = 0; i < cpu; i ++) {
    	var worker = cluster.fork();
    	worker.on('message', function(msg) {
	    	if (msg && msg.getPort) {
				worker.send({
					port: freePorts.shift()
				});
				console.log('freePorts after shift for worker', this.process.pid, ':', freePorts);
			} else if (msg && msg.freePort) {
				freePorts.unshift(msg.port);
				console.log('freePorts after unshift of', msg.port, 'for worker', this.process.pid, ':', freePorts);
			}
	    });
    }

    cluster.on('online', function(worker) {
        console.log("Worker Started pid : " + worker.process.pid);
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' stopped');
    });
} else {
	// Standard library imports
	var argv = require('minimist')(process.argv.slice(2));
	var pid = process.pid;
	var fs = require('fs');
	var https = require('https');
	var http = require('http');
	var express = require('express');
	var session = require('express-session');
	var cors = require('cors');
	var bodyParser = require('body-parser');
	var _ = require('lodash');
	var reload = require('require-reload')(require);
	var Sockets = require('./framework/core/api_utils/sockets.js');

	require('require-json');

	// SSL related configuration bootstrap
	var httpServer = null;
	var secureHttpServer = null;

	var httpsConfigured = false;

	var sslOptions = null;

	try {
		if (argv['enable-https']) {
			var keyFilePath = argv['keyfile-path'];
			var certFilePath = argv['certfile-path'];

			sslOptions = {
				key: fs.readFileSync(keyFilePath),
		    	cert: fs.readFileSync(certFilePath)
			};

			httpsConfigured = true;
		}
	} catch (e) {
		console.log('HTTPS enabled but file paths missing/incorrect');
		process.exit(code = -1);
	}

	var app = express();

	app.use(session({
	  secret: 'ritio rocks',
	  resave: true,
	  saveUninitialized: true
	}));
	app.use(bodyParser.json());
	app.use(cors());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	var socketManager = new Sockets();
	var socketConfig = {
		httpsConfigured: httpsConfigured
	};

	if (httpsConfigured) {
		socketConfig.sslOptions = sslOptions;
	}

	// Rift framework imports
	var constants = require('./framework/core/api_utils/constants');
	var skyquakeEmitter = require('./framework/core/modules/skyquakeEmitter');
	var navigation_routes = require('./framework/core/modules/routes/navigation');
	var socket_routes = require('./framework/core/modules/routes/sockets');
	var restconf_routes = require('./framework/core/modules/routes/restconf');
	var inactivity_routes = require('./framework/core/modules/routes/inactivity');
	var descriptor_routes = require('./framework/core/modules/routes/descriptorModel');
	var configuration_routes = require('./framework/core/modules/routes/configuration');
	var configurationAPI = require('./framework/core/modules/api/configuration');
	/**
	 * Processing when a plugin is added or modified
	 * @param {string} plugin_name - Name of the plugin
	 */
	function onPluginAdded(plugin_name) {
		// Load plugin config
		var plugin_config = reload('./plugins/' + plugin_name + '/config.json');

		// Load all app's views
		app.use('/' + plugin_name, express.static('./plugins/' + plugin_name + '/' + plugin_config.root));

		// Load all app's routes
		app.use('/' + plugin_name, require('./plugins/' + plugin_name + '/routes'));

		// Publish navigation links
		if (plugin_config.routes && _.isArray(plugin_config.routes)) {
			skyquakeEmitter.emit('config_discoverer.navigation_discovered', plugin_name, plugin_config);
		}

	}

	/**
	 * Start listening on a port
	 * @param {string} port - Port to listen on
	 * @param {object} httpServer - httpServer created with http(s).createServer
	 */
	function startListening(port, httpServer) {
		var server = httpServer.listen(port, function () {
			var host = server.address().address;

			var port = server.address().port;

			console.log('Express server listening on port', port);
		});
		return server;
	}

	/**
	 * Initialize skyquake
	 */
	function init() {
		skyquakeEmitter.on('plugin_discoverer.plugin_discovered', onPluginAdded);
		skyquakeEmitter.on('plugin_discoverer.plugin_updated', onPluginAdded);
	}

	/**
	 * Configure skyquake
	 */
	function config() {
		// Conigure any globals
		process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

		// Configure navigation router
		app.use(navigation_routes);

		// Configure restconf router
		app.use(restconf_routes);

		//Configure inactivity route(s)
		app.use(inactivity_routes);

		// Configure global config with ssl enabled/disabled
		configurationAPI.globalConfiguration.update({
			ssl_enabled: httpsConfigured
		});

		// Configure configuration route(s)
		app.use(configuration_routes);

		//Configure descriptor route(s)
		app.use(descriptor_routes);

		// app.get('/testme', function(req, res) {
		// 	res.sendFile(__dirname + '/index.html');
		// });

		// Configure HTTP/HTTPS server and populate socketConfig.
		if (httpsConfigured) {
			console.log('HTTPS configured. Will create 2 servers');
			secureHttpServer = https.createServer(sslOptions, app);
			// Add redirection on SERVER_PORT
			httpServer = http.createServer(function(req, res) {
				var host = req.headers['host'];
				host = host.replace(/:\d+$/, ":" + constants.SECURE_SERVER_PORT);

				res.writeHead(301, { "Location": "https://" + host + req.url });
    			res.end();
			});

			socketConfig.httpServer = secureHttpServer;
		} else {
			httpServer = http.createServer(app);
			socketConfig.httpServer = httpServer;
		}

		// Configure socket manager
		socketManager.configure(socketConfig);

		// Configure socket router
		socket_routes.routes(socketManager);
		app.use(socket_routes.router);

		// Serve multiplex-client
		app.get('/multiplex-client', function(req, res) {
			res.sendFile(__dirname + '/node_modules/websocket-multiplex/multiplex_client.js');
		});
	}

	/**
	 * Run skyquake functionality
	 */
	function run() {

		// Start plugin_discoverer
		var navigation_manager = require('./framework/core/modules/navigation_manager');
		var plugin_discoverer = require('./framework/core/modules/plugin_discoverer');

		// Initialize asynchronous modules
		navigation_manager.init();
		plugin_discoverer.init();

		// Configure asynchronous modules
		navigation_manager.config()
		plugin_discoverer.config({
			plugins_path: './plugins'
		});

		// Run asynchronous modules
		navigation_manager.run();
		plugin_discoverer.run();


		// Server start
		if (httpsConfigured) {
			console.log('HTTPS configured. Will start 2 servers');
			// Start listening on SECURE_SERVER_PORT (8443)
			var secureServer = startListening(constants.SECURE_SERVER_PORT, secureHttpServer);
		}
		// Start listening on SERVER_PORT (8000)
		var server = startListening(constants.SERVER_PORT, httpServer);

	}

	init();

	config();

	run();
}
