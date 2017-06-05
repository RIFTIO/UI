
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
var alt = require('./alt');
var Utils = require('utils/utils.js');
var API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
var NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
var createActions = require('./createActions.js');
import $ from 'jquery';

module.exports = {
  getNetworkServices: function() {
    return {
      remote: function() {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: '//' + window.location.hostname + ':' + window.location.port + '/api/launchpad/network-service?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          })
        })
      },
      success: createActions.getNetworkServicesSuccess,
      error: createActions.getNetworkServicesError
    }
  },
  createEnvironment: function() {
    return {
      remote: function(state, environment) {
        return $.ajax({
          url: '//' + window.location.hostname + ':' + window.location.port + '/api/launchpad/environment?api_server=' + API_SERVER,
          type: 'POST',
          beforeSend: Utils.addAuthorizationStub,
          dataType: 'json',
          data: JSON.stringify(environment),
          contentType: 'application/json',
          accept: 'application/json'
        })

      },
      success: createActions.createEnvironmentSuccess,
      error: createActions.createEnvironmentsError
    }
  },
  getPools: function() {
    return {
      remote: function() {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: '//' + window.location.hostname + ':' + window.location.port + '/api/launchpad/pools?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          })
        })
      },
      success: createActions.getPoolsSuccess,
      error: createActions.getPoolsError
    }
  },
  getSlaParams: function() {
    return {
      remote: function() {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: '//' + window.location.hostname + ':' + window.location.port + '/api/launchpad/sla-params?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          })
        })
      },
      success: createActions.getSlaParamsSuccess,
      error: createActions.getSlaParamsError
    }
  }
}
