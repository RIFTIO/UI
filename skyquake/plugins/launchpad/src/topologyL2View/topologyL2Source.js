
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
let getSearchParams = require('utils/rw.js').getSearchParams;

var API_SERVER = getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let DEV_MODE = getSearchParams(window.location).dev_mode || false;
var TopologyL2Actions = require('./topologyL2Actions.js');
var Utils = require('utils/utils.js');
import $ from 'jquery';

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}

export default {
  openTopologyApiSocket: function() {
    return {
      remote: function(state, id) {
        // TODO: add topology type to the parameter
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
              url: '/launchpad/api/network-topology?api_server=' + API_SERVER
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
      loading: TopologyL2Actions.openTopologyApiSocketLoading,
      success: TopologyL2Actions.openTopologyApiSocketSuccess,
      error: TopologyL2Actions.openTopologyApiSocketError
    };
  },
  fetchTopology() {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: '/launchpad/api/network-topology?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            contentType: "application/json",
            success: function(data) {
              resolve(data);
            },
            error: function(error) {
              console.log("There was an error getting the network topology data", error);
              reject(error);
            }
          });
        })
      },
      local() {
        return null;
      },
      success: TopologyL2Actions.getTopologyApiSuccess,
      error: TopologyL2Actions.getTopologyApiError,
      loading: TopologyL2Actions.getTopologyApiLoading
    }
  }
}
