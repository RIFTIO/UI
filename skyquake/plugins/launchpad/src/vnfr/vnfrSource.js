
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
let alt = require('../alt');
import VnfrActions from './vnfrActions.js';
let Utils = require('utils/utils.js');
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let isSocketOff = true;
import $ from 'jquery';

export default {
  openVnfrSocket: function() {
    return {
      remote: function(state) {
        let nsrRegEx = new RegExp("([0-9a-zA-Z-]+)\/vnfr$");
        let nsr_id;
        try {
          console.log('NSR ID in url is', window.location.hash.match(nsrRegEx)[1]);
          nsr_id = window.location.hash.match(nsrRegEx)[1];
        } catch (e) {

        }
        return new Promise(function(resolve, reject) {
          if (state.socket) {
            resolve(false);
          }
          console.log(nsr_id)
          $.ajax({
            url: '//' + window.location.hostname + ':' + window.location.port + '/socket-polling?api_server=' + API_SERVER,
            type: 'POST',
            beforeSend: Utils.addAuthorizationStub,
            data: {
              url: API_SERVER + ':' + NODE_PORT + '/launchpad/nsr/' + nsr_id + '/vnfr?api_server=' + API_SERVER,
            },
            success: function(data) {
              Utils.checkAndResolveSocketRequest(data, resolve, reject);
            }
          });
        })
      },
      loading: VnfrActions.openVnfrSocketLoading,
      success: VnfrActions.openVnfrSocketSuccess,
      error: VnfrActions.openVnfrSocketError,
    }
  }
}
