
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
import VnfrActions from './vnfrActions.js';
import VnfrSource from './vnfrSource.js';

let alt = require('../alt');
class VnfrStore {
  constructor() {
    this.vnfrs = [];
    this.socket;
    this.isLoading = false;
    this.bindActions(VnfrActions);
    this.exportAsync(VnfrSource);



  }
  openVnfrSocketError() {

  }
  openVnfrSocketLoading() {

  }
  openVnfrSocketSuccess(connection) {
    var self = this;
    let ws = window.multiplexer.channel(connection);
    if (!connection) return;
    self.setState({
      socket: ws.ws,
      channelId: connection
    });
    ws.onmessage = function(data) {
      try {
        var data = JSON.parse(data.data);
        if (!data) {
          console.warn('NSRS property not present on the payload, check that the api server is functioning correct and that the LP is fully launched. Received: ', data);
          data = [];
        }
        self.setState({
          vnfrs: data,
          isLoading: false
        });
      } catch (e) {

      }
    };
  }
};

export default alt.createStore(VnfrStore, 'VnfrStore')
