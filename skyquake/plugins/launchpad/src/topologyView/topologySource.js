
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

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}


var TopologyActions = require('./topologyActions.js');
var Utils = require('utils/utils.js');
import $ from 'jquery';

export default {
  openNSRTopologySocket: function() {
    return {
      remote: function(state, id) {
        return new Promise(function(resolve, reject) {
          //If socket connection already exists, eat the request.
          if(state.socket) {
            return resolve(false);
          }
           $.ajax({
            url: '/socket-polling?api_server=' + API_SERVER ,
            type: 'POST',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              url: '/launchpad/api/nsr/' + id + '/compute-topology?api_server=' + API_SERVER
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
      loading: TopologyActions.openNSRTopologySocketLoading,
      success: TopologyActions.openNSRTopologySocketSuccess,
      error: TopologyActions.openNSRTopologySocketError
    };
  },
  getNSRTopology() {
    return {
        remote: function(state, id) {
        id = 0;
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: '/launchpad/api/nsr/' + id + '/compute-topology?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            contentType: "application/json",
            success: function(data) {
              resolve(data);
            },
            error: function(error) {
              console.log("There was an error getting the compute topology data", error);
              reject(error);
            }
          });
        });
      },
      local() {
        return null;
      },
      success: TopologyActions.getNSRTopologySuccess,
      error: TopologyActions.getNSRTopologyError,
      loading: TopologyActions.getNSRTopologyLoading
    }
  },
  getRawVNFR() {
    return {
      remote: function(state, vnfrID) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'passthrough/data/api/operational/vnfr-catalog/vnfr/' + vnfrID + '?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          });
        })
      },
      loading: TopologyActions.getRawLoading,
      success: TopologyActions.getRawSuccess,
      error: TopologyActions.getRawError
    }
  },
  getRawNSR() {
    return {
      remote: function(state, nsrID) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'passthrough/data/api/operational/ns-instance-opdata/nsr/' + nsrID + '?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          });
        })
      },
      loading: TopologyActions.getRawLoading,
      success: TopologyActions.getRawSuccess,
      error: TopologyActions.getRawError
    }
  },
  getRawVDUR() {
    return {
      remote: function(state, vdurID, vnfrID) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: 'passthrough/data/api/operational/vnfr-catalog/vnfr/' + vnfrID + '/vdur/' + vdurID + '?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function(data) {
              resolve(data);
            }
          });
        })
      },
      loading: TopologyActions.getRawLoading,
      success: TopologyActions.getRawSuccess,
      error: TopologyActions.getRawError
    }
  },
}
