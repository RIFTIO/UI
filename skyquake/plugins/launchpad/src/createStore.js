
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
var alt = require('../core/alt');
function CreateFleet () {
  this.exportAsync(require('./createSource.js'));
  this.bindActions(require('./createActions.js'));
  this.nsd = [];
  this.vnfd = [];
  this.pnfd = [];
  validateErrorEvent = false;
  validateErrorMsg = "";
};

CreateFleet.prototype.getNetworkServicesSuccess = function(data) {
  this.setState({
    networkServices: data
  })
};
CreateFleet.prototype.getSlaParamsSuccess = function(data) {
  this.setState({
    slaParams: data
  })
};
CreateFleet.prototype.getPoolsSuccess = function(data) {
  this.setState({
    pools: data
  })
};
CreateFleet.prototype.validateError = function(msg) {
  this.setState({
    validateErrorEvent: true,
    validateErrorMsg: msg
  });
};
CreateFleet.prototype.validateReset = function() {
  this.setState({
    validateErrorEvent: false
  });
};

module.exports = alt.createStore(CreateFleet, 'CreateFleet');

