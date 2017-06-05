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

let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || 8000;
let DEV_MODE = require('utils/rw.js').getSearchParams(window.location).dev_mode || false;

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}

var isSocketOff = true;
var FleetActions = require('./launchpadFleetActions.js');
var Utils = require('utils/utils.js');
import $ from 'jquery';


module.exports = function(Alt) {
  //NEW SOURCE
  return {
    nsrControl: {
      remote: function(state, method, url, value) {
        return new Promise(function(resolve, reject) {
          // $.ajax({});
          // console.log(method + 'ing: "' + value + '" to "' + url + '"');
          resolve(method + 'ing: "' + value + '" to "' + url + '"')
        });
      },
      success: FleetActions.nsrControlSuccess,
      error: FleetActions.nsrControlError
    },
    getNsrInstances: {
      remote: function() {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'api/nsr?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          });
        });
      },
      success: FleetActions.getNsrInstancesSuccess,
      error: FleetActions.getNsrInstancesError
    },
    getVDUConsoleLink: {
      remote: function(state, url) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: url + '?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            },
            error: function(error) {
              console.log('There was an error getting the VDU link', error);
              return reject(error);
            }
          });
        });
      },
      success: FleetActions.getVDUConsoleLinkSuccess,
      error: FleetActions.getVDUConsoleLinkError
    },
    deleteNsrInstance: {
      remote: function(d, id) {
        console.log(id)
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'api/nsr/' + id + '?api_server=' + API_SERVER,
            type: 'DELETE',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          });
        });
      },
      success: FleetActions.deleteNsrInstanceSuccess,
      error: FleetActions.deleteNsrInstancesError
    }  ,
    openNSRSocket: {
      remote: function(state) {
        return new Promise(function(resolve, reject) {
          //If socket connection already exists, eat the request.
          if(state.socket) {
            return resolve(false);
          }
           $.ajax({
            url: '/socket-polling?api_server=' + API_SERVER,
            type: 'POST',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              url: 'launchpad/api/nsr?api_server=' + API_SERVER
            },
            success: function(data, textStatus, jqXHR) {
              Utils.checkAndResolveSocketRequest(data, resolve, reject);
            }
          }).fail(function(xhr){
            //Authentication and the handling of fail states should be wrapped up into a connection class.
            Utils.checkAuthentication(xhr.status);
          });;
        });
      },
      loading: Alt.actions.global.openNSRSocketLoading,
      success: FleetActions.openNSRSocketSuccess,
      error: FleetActions.openNSRError
    },
    setNSRStatus: {
      remote: function(state, id, status) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'api/nsr/' + id + '/admin-status?api_server=' + API_SERVER ,
            type:'PUT',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              status: status
            },
            success: function(data, textStatus, jqXHR) {

            }
          });
        });
      },
      success: FleetActions.setNSRStatusSuccess,
      error: FleetActions.setNSRStatusError
    }
  }
};

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
