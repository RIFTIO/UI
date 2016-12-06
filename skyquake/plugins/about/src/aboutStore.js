
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
import Alt from 'widgets/skyquake_container/skyquakeAltInstance';
function aboutStore () {
  this.descriptorCount = 0;
  this.exportAsync(require('./aboutSource.js'));
  this.bindActions(require('./aboutActions.js'));
}

aboutStore.prototype.getAboutSuccess = function(list) {
  this.setState({
    aboutList:list
  })
  console.log('success', list)
};

aboutStore.prototype.getCreateTimeSuccess = function(time) {
	this.setState({
		createTime:time['uptime']
	})
	console.log('uptime success', time)
}

module.exports = Alt.createStore(aboutStore);;

