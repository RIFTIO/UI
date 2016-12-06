
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
'use strict';
var Promise = require('bluebird');
var utils = require('../../../framework/core/api_utils/utils.js');
var request = utils.request;
var constants = require('../../../framework/core/api_utils/constants.js');
var _ = require('lodash');
var APIVersion = '/v2';
var transforms = require('./transforms.js');

var foreverOn = true;

var Config = {};
var Console = {};
var Filter = {};
var Operational = {};
var Sink = {};
var SysLogViewer = {};
var Aggregate = {};

var Test = {};

// Helper functions
// TODO: Consolidate the build functions, provide method type as arg

function buildGetRequestOptions(req, endpoint) {
  var headers = _.extend({},
    constants.HTTP_HEADERS.accept.data, {
    'Authorization': req.get('Authorization')
  });
  var api_server = req.query["api_server"];
  var requestOptions = {
    url: utils.confdPort(api_server) + endpoint,
    method: 'GET',
    headers: headers,
    forever: constants.FOREVER_ON,
    rejectUnauthorized: false
  };
  return requestOptions;
}

function buildPutRequestOptions(req, endpoint, jsonData) {
  var headers = _.extend({},
    constants.HTTP_HEADERS.accept.data,
    constants.HTTP_HEADERS.content_type.data, {
    'Authorization': req.get('Authorization')
  });
  var api_server = req.query["api_server"];
  var requestOptions = {
    url: utils.confdPort(api_server) + endpoint,
    method: 'PUT',
    headers: headers,
    forever: constants.FOREVER_ON,
    rejectUnauthorized: false,
    json: jsonData
  };
  return requestOptions;
}


function buildDeleteRequestOptions(req, endpoint) {
  var headers = _.extend({},
    constants.HTTP_HEADERS.accept.data,
    constants.HTTP_HEADERS.content_type.data, {
    'Authorization': req.get('Authorization')
  });
  var api_server = req.query["api_server"];
  var requestOptions = {
    url: utils.confdPort(api_server) + endpoint,
    method: 'DELETE',
    headers: headers,
    forever: constants.FOREVER_ON,
    rejectUnauthorized: false
  };
  return requestOptions;
}

/**
* Used for simulating latency
*/
function resolve_with_delay(resolve, data, delay) {
  return setTimeout(function() {
    resolve(data)
  }, delay);
}

/**
 * This function provides the default callback for requests
 */
function requestCallback(resolve, reject, transformFunc) {
  return function(error, response, body) {
    if (utils.validateResponse('', error, response, body, resolve, reject)) {
      if (transformFunc) {
        var data = transformFunc(response.body);
      } else {
        var data = JSON.stringify(response.body);
      }
      return resolve({
        statusCode: response.statusCode,
        data: data
      });
    };
  };
}

function handleGetRequest(req, endpoint, responseTransform) {
  return new Promise(function(resolve, reject) {
    request(
      buildGetRequestOptions(req, endpoint),
      requestCallback(resolve, reject, responseTransform)
    );
  });
}

/**
 *
 */
// TODO: Add arg for transform function to transfrm req.body to json data
// Right now we'll just pass the request through, until we need to implement
// a transformer
function handlePutRequest(req, endpoint, body) {
  return new Promise(function(resolve, reject) {
    request(
      buildPutRequestOptions(req, endpoint, body||req.body),
      requestCallback(resolve, reject)
    );
  });
}

function handleDeleteRequest(req, endpoint, body) {
  return new Promise(function(resolve, reject) {
    request(
      buildDeleteRequestOptions(req, endpoint),
      requestCallback(resolve, reject)
    );
  });
}

function handleMockResponse(req, success, statusCode, data, delay) {
  delay = delay || 0;
  return new Promise(function(resolve, reject) {
    if (success) {
      resolve_with_delay(resolve, { statusCode: statusCode, data: data }, delay)
    } else { reject({ statusCode: statusCode, data: data }); }
  });
}


function handleReject(req, statusCode, message) {
  return new Promise(function(resolve, reject) {
    reject({ statusCode: statusCode, data: message});
  })
}

/**
* Calllback function to parse the response body into an object and
* remove the restconf top level key if it is present.
*/
function transformLoggingRootResponseCallback(responseBody) {
  var data = JSON.parse(responseBody);
  if (data['rwlog-mgmt:logging']) {
    data = data['rwlog-mgmt:logging'];
  }
  return data;
}


/**
 * Debug function
 */
function dumpLoggingConfig(data) {
  console.log("dumpLoggingconfig");
  var logConfig = data['lwlog-mgmt:logging'] || data;

  console.log("keys=", Object.keys(logConfig));
  console.log("stringify=", JSON.stringify(logConfig));
  if (logConfig['default-severity']) {
    logConfig['default-severity'].forEach(function(obj) {
      console.log(obj);
    })
  }
  if (logConfig['sink']) {
    console.log('sink=', JSON.stringify(logConfig['sink']));
  }
  if (logConfig['console']) {
    console.log('console=', JSON.stringify(logConfig['console']));
  }
  if (logConfig['deny']) {
    console.log('deny=', JSON.stringify(logConfig['deny']));
  }
}

// Aggregate calls

/**
* This method should fill out the full data set
*/
Aggregate.get = function(req) {
  // get config data
  // get operational data
  //massage them
  var configData = Config.get(req);
  var operationalData = Operational.get(req);

  return new Promise(function(resolve, reject) {
    Promise.all([configData, operationalData]).then(function(resolves) {
      //console.log("Resolved all request promises (config, operational logging data)");
      // TODO: Make sure the statusCodes for each resulves is 200
      var decoder = new transforms.LoggingConfigDecoder();
      resolve({
        statusCode: 200,
        data: decoder.decode(resolves[0], resolves[1])
      });

    }).catch(function(error) {
      console.log("Logging: Aggregate.get error: ", error);
      reject({
        statusCode: 404,
        errorMessage: error
      })
    })
  });
}

/**
* This method expects the full data set (keys and values) for the logging
* config to replace the existing logging config
*/
Aggregate.set = function(req) {
  // NOTE: Left some debugging code remarked out

  //console.log("Logging Aggregate.set called");
  //console.log("data=", req.body);

  // Do nothing to test delay in response
  var encoder = new transforms.LoggingConfigEncoder();
  var data = encoder.encode(req.body);
  // console.log("Aggregate.set. encoded data=");
  // console.log(data);
  // dumpLoggingConfig(data);
  let setData = {
    'rwlog-mgmt:logging' : data
  }
  return handlePutRequest(req, APIVersion + '/api/config/logging', setData);
  // if (this.mockResponse['set']) {
  //   return handleMockResponse(req, true, 201, data, delay=100);
  // }
}





// Config calls

/**
 * Get all currently set logging config data
 */
Config.get = function(req) {
  return handleGetRequest(req, APIVersion + '/api/config/logging?deep',
    transformLoggingRootResponseCallback
  );
}

/**
 * Top level put method. Restconf cannot currently handle a global put on
 * logging, so this method is currently for testing
 */
Config.set = function(req) {
  return handlePutRequest(req, APIVersion + '/api/config/logging');
}


Config.setConsole = function(req) {
  return handlePutRequest(req, APIVersion + '/api/config/logging/console');
}

Config.setFilter = function(req) {
  return handlePutRequest(req, APIVersion + '/api/config/logging/console/filter');
}

Config.setDefaultSeverity = function(req) {
  // TODO: verify there is one key at root of data: 'default-severity'
  // OR just filter on the request body
  return handlePutRequest(req, APIVersion + '/api/config/logging/');
}

Config.deleteDefaultSeverity = function(req) {
  // TODO: verify there is one key at root of data: 'default-severity'
  // OR just filter on the request body
  var Categories = req.body['default-severity'];
  return new Promise(function(resolve, reject) {
    var promises = Categories.map(function(c) {
      return handleDeleteRequest(req, APIVersion + '/api/config/logging/default-severity/' + c.category);
    });
    return Promise.all(promises).then(
      function(data) {
        resolve(data[0]);
      },
      function(data) {
        reject(data);
      }
    )
  })

}

// NOTE: In rel_4.3 we are going to affect syslog sink category by default

Config.setDefaultSyslogSeverity = function(req) {
  // TODO: verify there is one key at root of data: 'default-severity'
  // OR just filter on the request body
  return handlePutRequest(req, APIVersion + '/api/config/logging/sink/syslog');
}

Config.deleteDefaultSyslogSeverity = function(req) {
  // TODO: verify there is one key at root of data: 'default-severity'
  // OR just filter on the request body
  var Categories = req.params.nulledCategories.split(',');
  var promises = [];
  return new Promise(function(resolve, reject) {
    promises.concat(Categories.map(function(categoryName) {
        return handleDeleteRequest(req, APIVersion + '/api/config/logging/sink/syslog/filter/category/' + categoryName);
      }));
      return Promise.all(promises).then(
        function(data) {
          resolve({statusCode:  data[0].statusCode, data: data[0].data});
        },
        function(data) {
          reject({statusCode:  data[0].statusCode, data: data[0].data});
        }
      )
    });
}

/*
  get body of forms

{
  "allowDuplicateEvents" : true
}
*/

/**
 * TODO: Repeat delete calls (when 'allowDuplicateEvents' value is false) cause
 * a 404 error
 * TODO: the call to handleDeleteRequest returns stringified data, but the PUT
 * does not (This is the behavior we want)
 *
 * Improvement? Allos string representation of true/false
 */
Config.setAllowDuplicateEvents = function(req) {
  // TODO: verify there is one key at root of data: 'default-severity'
  // OR just filter on the request body
console.log(req.body)
  if (req.body.hasOwnProperty('allowDuplicateEvents')) {
    if (req.body.allowDuplicateEvents.toUpperCase() == "TRUE") {
      return handlePutRequest(req, '/api/config/logging/allow', {
        "duplicate": "events"
      });
    } else { // false, remove entry from logging config
      return handleDeleteRequest(req, '/api/config/logging/allow/duplicate');
    }
  } else {
    return handleReject(statusCode=400,
      data={
        "message": 'Expected key, "allowDuplicateEvents" not found',
        "original-request" : req.body
      });
  }
}

/*
  "denyEvents": {
    "eventIDs": [
      1
    ]
  },
*/

/*
      "deny": {
        "event": [
          {
            "event-Id": 1
          }
        ]
      },
*/

Config.setDenyEvents = function(req) {
  var reqBody = {
    deny: {
      events: req.body.denyEvents.eventIDs.map(function(eventID) {
        return { "event-Id": eventID };
      })
    }
  };
  return handlePutRequest(req, APIVersion + '/api/config/logging', reqBody);
}

Config.setSyslogViewer = function(req) {
  // TODO: Verify structure of req.body
  var reqBody = {
    "syslog-viewer" : req.body['syslog-viewer']
  }
  return handlePutRequest(req, APIVersion + '/api/config/logging', reqBody);
}


// Operational calls

Operational.get = function(req) {
  var APIVersion = '/v1'
  return handleGetRequest(req, APIVersion + '/api/operational/logging?deep',
    transformLoggingRootResponseCallback
  );
}


/**
 * Legacy call to get sys log viewer
 */

SysLogViewer.get = function(req) {
  console.log("\n***\n SysLogViewer.get called");
  var api_server = req.query['api_server'];
  return new Promise(function(resolve, reject) {
    request({
      uri: utils.confdPort(api_server) + APIVersion + '/api/config/logging/syslog-viewer',
      method: 'GET',
      headers: _.extend({},
        constants.HTTP_HEADERS.accept.data,
        {
          'Authorization': req.get('Authorization')
        }),
      forever: foreverOn,
      rejectUnauthorized: false
    },
    function(error, response, body) {
      if(error) {
        console.log('Logging.get failed. Error:', error);
        reject({
          statusCode: response ? response.statusCode : 404,
          errorMessage: 'Issue retrieving syslog-viewer url'
        });
      } else {
        var data;
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          console.log('Logging.get failed while parsing response.body. Error:', e);
          reject({
            statusCode: 500,
            errorMessage: 'Error parsing response.body during Logging.get'
          });
        }
        resolve(data);
      }
    });
  });
};

/**
 * Test methods
 */
Test.roundtrip = function(req) {
  return new Promise(function(resolve, reject) {
    Aggregate.get(req).then(function(result) {
      var data = (new transforms.LoggingConfigEncoder()).encode(result.data);
      resolve({
        statusCode: 200,
        data: {
          'rwlog-mgmt:logging': data
        }
      });
    }, function(err) {
      console.log('Test.get error:', err);
      reject({
        statusCode: 500,
        errorMessage: err
      });
    });
  });
}

module.exports = {
  aggregate: Aggregate,
  config : Config,
  operational: Operational,
  sysLogViewer: SysLogViewer,
  test: Test
}
