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
var router = require('express').Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js')

var loggingAPI = require('./api/logging.js');

var loggingRoutes = [
    // Config methods
    // config GET methods
    {
        method: 'GET',
        endpoint: '/api/aggregate',
        apiHandler: loggingAPI['aggregate'].get
    },
    {
        method: 'GET',
        endpoint: '/api/config',
        apiHandler: loggingAPI['config'].get
    },
    // Config modify methods
    {
        method: 'PUT',
        endpoint: '/api/config',
        apiHandler: loggingAPI['config'].set
    },
    {
        method: 'PUT',
        endpoint: '/api/aggregate',
        apiHandler: loggingAPI['aggregate'].set
    },
    {
        method: 'PUT',
        endpoint: '/api/config/console',
        apiHandler: loggingAPI['config'].setConsole
    },
    {
        method: 'PUT',
        endpoint: '/api/config/filter',
        apiHandler: loggingAPI['config'].setFilter
    },
    {
        method: 'PUT',
        endpoint: '/api/config/default-severity',
        apiHandler: loggingAPI['config'].setDefaultSeverity
    },{
        method: 'DELETE',
        endpoint: '/api/config/default-severity',
        apiHandler: loggingAPI['config'].deleteDefaultSeverity
    },
    {
        method: 'PUT',
        endpoint: '/api/config/default-syslog-severity',
        apiHandler: loggingAPI['config'].setDefaultSyslogSeverity
    },
    {
        method: 'DELETE',
        endpoint: '/api/config/default-syslog-severity/:nulledCategories',
        apiHandler: loggingAPI['config'].deleteDefaultSyslogSeverity
    },
    {
        method: 'PUT',
        endpoint: '/api/config/allow-duplicate-events',
        apiHandler: loggingAPI['config'].setAllowDuplicateEvents
    },
    {
        method: 'PUT',
        endpoint: '/api/config/deny-events',
        apiHandler: loggingAPI['config'].setAllowDuplicateEvents
    },
    {
        method: 'PUT',
        endpoint: '/api/config/sinks',
        apiHandler: loggingAPI['config'].setSinks
    },
    {
        method: 'PUT',
        endpoint: '/api/config/syslog-viewer',
        apiHandler: loggingAPI['config'].setSyslogViewer
    },
    // Operational methods
    {
        method: 'GET',
        endpoint: '/api/operational',
        apiHandler: loggingAPI['operational'].get
    },

    // Development/testing methods
    {
        method: 'GET',
        endpoint: '/api/test/roundtrip',
        apiHandler: loggingAPI['test'].roundtrip
    }
];

// Logging routes. Initial refactoring pass at reducing code duplication
loggingRoutes.forEach(function(route) {
    registerRoute(router, route.method, route.endpoint, route.apiHandler);
});

module.exports = router;


/**
 * Default route callback function
 */
function routeCallback(apiHandler) {
    return function(req, res) {
        apiHandler(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    };
}


/**
 * register the route
 */
function registerRoute(app, method, endpoint, apiHandler) {
    var methodUp = method.toUpperCase();
    // This is the explict version that does not use reflection to cast the
    // HTTP method to the corresponding express app function
    if (methodUp === 'GET') {
        app.get(endpoint, cors(), routeCallback(apiHandler));
    } else if (methodUp === 'PUT') {
        app.put(endpoint, cors(), routeCallback(apiHandler));
    } else if (methodUp === 'POST') {
        app.post(endpoint, cors(), routeCallback(apiHandler));
    } else if (methodUp === 'DELETE') {
        app.delete(endpoint, cors(), routeCallback(apiHandler));
    } else {
        console.log("ERROR: Unsupported HTTP method: %s", method);
    }

}



