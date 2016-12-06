/*
 * STANDARD_RIFT_IO_COPYRIGHT
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
        getResourceOrchestrator: {
          remote: function() {
              return new Promise(function(resolve, reject) {
                $.ajax({
                  url: 'passthrough/data/api/running/resource-orchestrator' + '?api_server=' + API_SERVER,
                  type: 'GET',
                  beforeSend: Utils.addAuthorizationStub,
                  contentType: "application/json",
                  success: function(data) {
                    resolve(data["rw-launchpad:resource-orchestrator"]);
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
        update: {
          remote: function(state, account) {

            return new Promise(function(resolve, reject) {
              $.ajax({
                url: 'resource-orchestrator' + '?api_server=' + API_SERVER,
                type:'PUT',
                beforeSend: Utils.addAuthorizationStub,
                data: JSON.stringify(account),
                contentType: "application/json",
                success: function(data) {
                  resolve({data});
                },
                error: function(error) {
                  console.log("There was an error updating the account: ", arguments);
                  return null;
                }
              }).fail(function(xhr){
                //Authentication and the handling of fail states should be wrapped up into a connection class.
                Utils.checkAuthentication(xhr.status);
                return reject('error');
              });

            });
          },
          interceptResponse: interceptResponse({
            'error': 'There was an error updating the account.'
          }),
          success: Alt.actions.global.updateResourceOrchestratorSuccess,
          loading: Alt.actions.global.showScreenLoader,
          error: Alt.actions.global.showNotification
      }
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
