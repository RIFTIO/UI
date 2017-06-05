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
let rw = require('utils/rw.js');
var API_SERVER = rw.getSearchParams(window.location).api_server;
var loggingActions = require('./loggingActions.js');
var Utils = require('utils/utils.js');
import $ from 'jquery';

function apiUrl(endpoint) {
  return endpoint.replace(/\/$/,'') + '?api_server=' + API_SERVER;
}

export default {
  /**
   * Retrieve the logging configuration data from the Node API server
   */
  getLoggingConfig: function() {
    //console.log("LoggingSource.getLoggingConfig called");
    return {
      remote: function(state) {
        return new Promise(function(resolve, reject) {
          //console.log("loggingSource.getLoggingConfig called");
          $.ajax({
            url: apiUrl('api/aggregate'),
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              //console.log("LoggingSource.getLoggingConfig success call. data=", data);
              resolve(data);
            },
            error: function(e) {
              console.log("Error getting logging config details");
            }
          });
        });
      },
      success: loggingActions.getLoggingConfigSuccess,
      error: loggingActions.getLoggingConfigError
    }
  },
  /**
  * Update the logging configuration data on the server
  * @param {object} state -  Reference to parent store state
  * @param {object} loggingConfig - logging configuration data
  * @return {[type]}  [description]
  }
  */
  updateLoggingConfig: function () {
    return {
      remote: function(state, nulledCategories, loggingConfig) {
        return new Promise(function(resolve, reject) {
          let promises = [];
          let remove = null;
          if(loggingConfig.hasOwnProperty('allowDuplicateEvents')) {
            promises.push($.ajax({
              url: apiUrl('api/config/allow-duplicate-events'),
              type: 'PUT',
              beforeSend: Utils.addAuthorizationStub,
              data: {
                allowDuplicateEvents: loggingConfig.allowDuplicateEvents
              },
              success: function(data) {
                resolve(data);
              },
              error: function(error) {
                console.log("There was an error updating the logging config data",
                  error);
                reject(error);
              }
            }))
          }
          if(nulledCategories.length > 0) {
            remove = $.ajax({
              // url: apiUrl('api/config/default-severity'),
              url: apiUrl('api/config/default-syslog-severity/' + nulledCategories.join(',')),
              type: 'DELETE',
              beforeSend: Utils.addAuthorizationStub,
              success: function(data) {
                resolve(data);
              },
              error: function(error) {
                console.log("There was an error updating the logging config data",
                  error);
                reject(error);
              }
            });
            promises.push(remove);
          }
          Promise.all(promises).then(function(data) {
            return $.ajax({
                url: apiUrl('api/aggregate'),
                type: 'PUT',
                beforeSend: Utils.addAuthorizationStub,
                data: loggingConfig,
                success: function(data) {
                  resolve(data);
                },
                error: function(error) {
                  console.log("There was an error updating the logging config data",
                    error);
                  reject(error);
                }
          });
          }).then(function(data){
            resolve(data)
          }, function(){
            reject(arguments)
          })

        });

      },
      success: loggingActions.putLoggingConfigSuccess,
      error: loggingActions.putLoggingConfigError
    }
  }
}
