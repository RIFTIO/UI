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
var _ = require('lodash');

var Support={};

Support.globalDefaultSeverity = function() {
  return 'error';
}

Support.severities = function() {
      return [
        null,
        "emergency",
        "alert",
        "critical",
        "error",
        "warning",
        "notice",
        "info",
        "debug"];
}

/**
 * Class to convert RESTConf data to logging plugin
 */



LoggingConfigDecoder = function(debugMode) {
  this.debugMode = debugMode || false
}

LoggingConfigDecoder.prototype.categories = function(data) {
  if (data && data.categories && data.categories.category) {
    return data.categories.category;
  } else {
    return [];
  }
}
LoggingConfigDecoder.prototype.defaultSeverities = function (data) {
  var globalDefaultSeverity = Support.globalDefaultSeverity();
  if (data.categories && data.categories.category) {
    var defaultSeverities = data["default-severity"] || [];
    return data.categories.category.map(function(name) {
      return  _.find(defaultSeverities, {category: name})
       ||
        { category: name, severity: null };
    });
  } else {
    throw("Logging categories not available");
  }
}

LoggingConfigDecoder.prototype.allowDuplicateEvents = function (data) {
  // if the property does not exist, then value is false
  // otherwise value is true
  //return (data.hasOwnProperty('allow') && data.allow.duplicate == 'events');
  return (data.allow && data.allow.duplicate == 'events');
}

// NOTE: confd can also set event ids in a range
LoggingConfigDecoder.prototype.denyEventIDs = function(data) {
  if (data.deny && data.deny.event) {
    return data.deny.event.map(function(event, index) {
      return event['event-Id'];
    });
  } else {
    return [];
  }
}

LoggingConfigDecoder.prototype.consoleData = function(data) {
  //console.log("LoggingConfigDecoder.consoleData=", data.console);
  // NOTE: We may need to fill in the data.console.on|off if that is not
  // present when filters are present
  if (data && data.console) {
    return data.console;
  } else {
    return {
      off: [ null ]
    };
  }
}

LoggingConfigDecoder.prototype.decode = function(loggingConfig, loggingOperational) {
	// tack on raw retrieved config and operational data while we are in
  // development

  // TODO: robustify: check inputs if they have a 'data' property, then set
  // local var to the data property, else just use the passed in param
  // this means we don't have to pass 'loggingOperational.data' to the methods
  // we call
	if (loggingOperational.data) {
    var results = {
      categories: this.categories(loggingOperational.data),
      defaultSeverities: this.defaultSeverities(loggingOperational.data),
      severities: Support.severities(),
      globalDefaultSeverity: Support.globalDefaultSeverity(),
      syslogviewer: loggingOperational.data['syslog-viewer'],
      sinks: loggingOperational.data.sink,
      allowDuplicateEvents: this.allowDuplicateEvents(loggingOperational.data),
      denyEventIDs: this.denyEventIDs(loggingOperational.data),
      console: this.consoleData(loggingOperational.data)
  	}

    if (this.debugMode) {
      // carry-on original request data
      results.loggingConfig = loggingConfig;
      results.loggingOperational = loggingOperational;
    }
    return results;
  } else {
    return {};
  }
}

// Logging encoding

/**
 * LoggingConfigEncoder transform the API logging configuration data to the
 * format required to PUT to the restconf /api/config/logging endpoint
 * The initial version is implemented in an imperative way: Explicit coding
 * of specific fields. After this works, we can refactor to do a more
 * declarative approach
 */
LoggingConfigEncoder = function() {

}

LoggingConfigEncoder.prototype.denyEvents = function(data) {

  if (data.denyEventIDs) {
    var events = [];
    // TODO: sort keys and filter nulls out
    data.denyEventIDs.forEach(function(eventID) {
      if (eventID) {
        events.push({ "event-Id": eventID })
      }
    });
    if (events.length > 0) {
      return { event: events };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

/**
 * in the Yang model, allow duplicate events flag is triggers by the presence
 * or absence of the { "allow": { "duplicate": "events" }} key/value hierarchy
 */
LoggingConfigEncoder.prototype.allow = function(data) {
  if (data.allowDuplicateEvents && data.allowDuplicateEvents.toUpperCase() == "TRUE") {
    return { duplicate: "events" };
  } else {
    return null;
  }
}
LoggingConfigEncoder.prototype.consoleData = function(data) {
  if (data.console && data.console.on) {
    return data.console;
  } else {
    return null;
  }
}

LoggingConfigEncoder.prototype.encode = function(apiData) {

  var restConfData = {};
  var n = 1;
  // Only assign to the following keys if we have values
  // NOTE: This may change with the implementation of the RIFT REST PUT
  var denyData = this.denyEvents(apiData);
  if (denyData) {
    restConfData['deny'] = denyData;
  }
  console.log(n++);
  var allowData = this.allow(apiData);
  if (allowData) {
    restConfData['allow'] = allowData;
  }
  var consoleData = this.consoleData(apiData);
  if (consoleData) {
    restConfData['console'] = consoleData;
  }
  restConfData['sink'] = apiData.sinks;
  restConfData['syslog-viewer'] = apiData.syslogviewer;
  restConfData['default-severity'] = apiData.defaultSeverities;

  return restConfData;
}

module.exports = {
  LoggingConfigDecoder: LoggingConfigDecoder,
  LoggingConfigEncoder: LoggingConfigEncoder,
  Support: Support
}
