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
import $ from 'jquery';
var Utils = require('utils/utils.js');
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let DEV_MODE = require('utils/rw.js').getSearchParams(window.location).dev_mode || false;

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}


module.exports = function(Alt) {
    return {
        openAccountsSocket: {
          remote: function(state) {
            return new Promise(function(resolve, reject) {
              //If socket connection already exists, eat the request.
              if(state.socket) {
                console.log('connection already exists')
                return resolve(false);
              }
               $.ajax({
                url: '/socket-polling?api_server=' + API_SERVER,
                type: 'POST',
                beforeSend: Utils.addAuthorizationStub,
                data: {
                    url: 'accounts/all?api_server=' + API_SERVER
                },
                success: function(data, textStatus, jqXHR) {
                  Utils.checkAndResolveSocketRequest(data, resolve, reject);
                }
              }).fail(function(xhr){
                //Authentication and the handling of fail states should be wrapped up into a connection class.
                Utils.checkAuthentication(xhr.status);
                reject(xhr.responseText || 'An error occurred. Check your logs for more information');
              });;
            });
          },
          loading: Alt.actions.global.openAccountSocketLoading,
          success: Alt.actions.global.openAccountSocketSuccess,
          error: Alt.actions.global.openAccountSocketError
        },
        refreshAll: {
            remote: function(state, accounts) {
                return new Promise(function(resolve, reject) {
                    let Refreshing = syncRefresh();
                    Refreshing.next();
                    function* syncRefresh() {
                        for (let t of accounts) {
                            if (t.data.constructor.name == "Array") {
                               for (let u of t.data) {
                                  console.log('Refreshing: ' + u.name);
                                  yield refreshStatus(t.type, u.name);
                               }
                            }
                        }
                        resolve({})
                    }

                    function refreshStatus(type, name) {
                        let url = type + '/' + name + '/refresh?api_server=' + API_SERVER;
                        setTimeout(function(){
                          Refreshing.next();
                        },100);
                        $.ajax({
                            url: url,
                            type: 'POST',
                            beforeSend: Utils.addAuthorizationStub,
                            success: function() {

                            },
                            error: function() {
                            }
                          });

                    }
                })
            },
          loading: Alt.actions.global.refreshAllAccountsLoading,
          success: Alt.actions.global.refreshAllAccountsSuccess,
          error: Alt.actions.global.refreshAllAccountsError
        },
        refreshAccount: {
          remote: function(state, name, type) {
            return new Promise(function(resolve, reject) {
              $.ajax({
                url: type + '/' + name + '/refresh?api_server=' + API_SERVER,
                type: 'POST',
                beforeSend: Utils.addAuthorizationStub,
                success: function(account) {
                  resolve(account);
                }
              });
            });
          },
          success: Alt.actions.global.refreshCloudAccountSuccess,
          error: Alt.actions.global.refreshCloudAccountFail
        },
        create: {
          remote: function(state, account, type, cb) {
            delete account['connection-status'];
            return new Promise(function(resolve, reject) {
              $.ajax({
                url: type + '?api_server=' + API_SERVER,
                type:'POST',
                beforeSend: Utils.addAuthorizationStub,
                data: JSON.stringify(account),
                contentType: "application/json",
                success: function(data) {
                  resolve({data, cb});
                },
                error: function(error) {
                  console.log("There was an error creating the account: ", arguments);

                }
              }).fail(function(xhr){
                //Authentication and the handling of fail states should be wrapped up into a connection class.
                Utils.checkAuthentication(xhr.status);
                reject(xhr.responseText || 'An error occurred. Check your logs for more information');
              });

            });
          },
          success: Alt.actions.global.createAccountSuccess,
          loading: Alt.actions.global.createAccountLoading,
          error: Alt.actions.global.createAccountFail
      },
        update: {
          remote: function(state, account, type, cb) {
            var payload = Object.assign({}, account);
            delete payload['connection-status'];
            delete payload['params'];
            delete payload['pools'];
            (
              (payload.nestedParams == null) &&
              delete payload.nestedParams
            ) ||
            (
              payload.nestedParams &&
              payload.nestedParams['container-name'] &&
              delete payload[payload.nestedParams['container-name']] &&
              delete payload.nestedParams
            );


            return new Promise(function(resolve, reject) {
              $.ajax({
                url: type + '/' + account.name + '?api_server=' + API_SERVER,
                type:'PUT',
                beforeSend: Utils.addAuthorizationStub,
                data: JSON.stringify(payload),
                contentType: "application/json",
                success: function(data) {
                  resolve({data, cb});
                },
                error: function(error) {
                  console.log("There was an error updating the account: ", arguments);

                }
              }).fail(function(xhr){
                //Authentication and the handling of fail states should be wrapped up into a connection class.
                Utils.checkAuthentication(xhr.status);
                reject(xhr.responseText || 'An error occurred. Check your logs for more information');
              });

            });
          },
          interceptResponse: interceptResponse({
            'error': 'There was an error updating the account.'
          }),
          success: Alt.actions.global.createAccountSuccess,
          loading: Alt.actions.global.createAccountLoading,
          error: Alt.actions.global.showNotification
      },
        delete: {
          remote: function(state, type, name, cb) {
            return new Promise(function(resolve, reject) {
              $.ajax({
                url: type + '/' + name + '/?api_server=' + API_SERVER,
                type:'DELETE',
                dataType : 'html',
                beforeSend: Utils.addAuthorizationStub,
                success: function(data) {
                  console.log('Account deleted');
                  resolve(data);
                }
              }).fail(function(xhr){
                //Authentication and the handling of fail states should be wrapped up into a connection class.
                Utils.checkAuthentication(xhr.status);
                reject(xhr.responseText || 'An error occurred. Check your logs for more information');
              });
            })
          },
          interceptResponse: interceptResponse({
            'error': 'Something went wrong while trying to delete the account. Check the error logs for more information' }),
          success: Alt.actions.global.deleteAccountSuccess,
          loading: Alt.actions.global.deleteAccountLoading,
          error: Alt.actions.global.showNotification
      },
        getResourceOrchestrator: {
          remote: function() {
              return new Promise(function(resolve, reject) {
                $.ajax({
                  url: 'passthrough/data/api/running/resource-orchestrator' + '?api_server=' + API_SERVER,
                  type: 'GET',
                  beforeSend: Utils.addAuthorizationStub,
                  contentType: "application/json",
                  success: function(data) {
                    let returnedData;
                    if (data.hasOwnProperty("rw-launchpad:resource-orchestrator")) {
                      returnedData = data;
                    } else {
                      returnedData = {};
                    }
                    resolve(returnedData);
                  },
                  error: function(error) {
                    console.log("There was an error updating the account: ", arguments);

                  }
                }).fail(function(xhr){
                  //Authentication and the handling of fail states should be wrapped up into a connection class.
                  Utils.checkAuthentication(xhr.status);
                  return reject('error');
                });
              });
          },
          interceptResponse: interceptResponse({
            'error': 'There was an error retrieving the resource orchestrator information.'
          }),
          success: Alt.actions.global.getResourceOrchestratorSuccess,
          loading: Alt.actions.global.showScreenLoader,
          error: Alt.actions.global.showNotification
        },
    }
}

function interceptResponse (responses) {
  return function(data, action, args) {
    if(responses.hasOwnProperty(data)) {
      return {
        type: data,
        msg: responses[data]
      }
    } else {
      return data;
    }
  }
}
