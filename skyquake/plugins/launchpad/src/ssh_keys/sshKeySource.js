
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
let Utils = require('utils/utils.js');
let rw = require('utils/rw.js');
const API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
const API_PORT = require('utils/rw.js').getSearchParams(window.location).api_port;
export default function(Alt){
  const Actions = Alt.actions.global;
  return {
  getSshKey: {
      remote (state) {
        return new Promise((resolve,reject) => {
          $.ajax({
            url: 'api/ssh-key?api_server=' + API_SERVER,
            type: 'GET',
            beforeSend: Utils.addAuthorizationStub,
            success: function (data) {
              resolve(data);
            }
          }).fail(function(xhr){
            console.log(xhr)
            //Authentication and the handling of fail states should be wrapped up into a connection class.
            Utils.checkAuthentication(xhr.status);
          });
        });
      },
      loading: Actions.getSshKeyLoading,
      success: Actions.getSshKeySuccess,
      error: Actions.getSshKeyError
  },
  saveSshKey: {
      remote (state, pair) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: 'api/ssh-key?api_server=' + API_SERVER,
            type: 'POST',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              "key-pair": [pair]
            },
            success: function (data) {
              resolve(pair);
            },
            error: function (err) {
              console.log('There was an error saving the ssh key')
            }
          }).fail(function(xhr){
            //Authentication and the handling of fail states should be wrapped up into a connection class.
            Utils.checkAuthentication(xhr.status);
            reject();
          });
        })
      },
      loading: Actions.saveSshKeyLoading,
      success: Actions.saveSshKeySuccess,
      error: Actions.saveSshKeyError
  },
  updateSshKey: {
      remote (state, pair) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: 'api/ssh-key?api_server=' + API_SERVER,
            type: 'PUT',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              "key-pair": [pair]
            },
            success: function (data) {
              resolve(pair);
            },
            error: function (err) {
              console.log('There was an error updating the ssh key')
            }
          }).fail(function(xhr){
            //Authentication and the handling of fail states should be wrapped up into a connection class.
            Utils.checkAuthentication(xhr.status);
            reject();
          });
        })
      },
      loading: Actions.saveSshKeyLoading,
      success: Actions.updateSshKeySuccess,
      error: Actions.saveSshKeyError
  },
  deleteSshKey: {
      remote (state, name) {
        return new Promise((resolve, reject) => {
          $.ajax({
            url: 'api/ssh-key/'+ encodeURI(name) + '?api_server=' + API_SERVER,
            type: 'DELETE',
            beforeSend: Utils.addAuthorizationStub,
            success: function (data) {
              resolve({
                'status':'success',
                name: name
            });
            },
            error: function (err) {
              console.log('There was an error updating the ssh key')
            }
          }).fail(function(xhr){
            //Authentication and the handling of fail states should be wrapped up into a connection class.
            Utils.checkAuthentication(xhr.status);
            reject();
          });
        })
      },
      loading: Actions.saveSshKeyLoading,
      success: Actions.deleteSshKeySuccess,
      error: Actions.saveSshKeyError
  }
}
}
