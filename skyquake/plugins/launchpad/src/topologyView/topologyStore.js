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
import TopologyActions from './topologyActions.js';
import TopologySource from './topologySource.js';
// import source
import Alt from '../alt';
let rw = require('utils/rw.js');
class TopologyStore {
    constructor() {
        var self = this;
        // initial state
        this.isLoading = true;
        this.topologyData = {};
        this.socket = null;
        this.detailView = null;
        this.hasSelected = false;
        // bind action listeners
        this.bindActions(TopologyActions);

        // bind source listeners
        this.exportAsync(TopologySource);
        this.exportPublicMethods({
            selectNode: this.selectNode,
            closeSocket: this.closeSocket,
            getTopologyData: this.getTopologyData
        })
        this.ajax_mode = rw.getSearchParams(window.location).ajax_mode || false;
    }
    selectNode = (node) => {
        var apiType = {
            'nsr' : 'getRawNSR',
            'vdur' : 'getRawVDUR',
            'vnfr': 'getRawVNFR'
        }
        // TODO: VISIT
       apiType[node.type] && this.getInstance()[apiType[node.type]](node.id, node.parent ? node.parent.id : undefined);
    }
    getRawSuccess = (data) => {
        this.setState({
            detailView: data
        });
    }
    getRawLoading = () => {

    }
    getRawError = () => {

    }

    getTopologyData = (nsr_id) => {
        if (this.ajax_mode) {
            this.getInstance().getNSRTopology(nsr_id);
        } else {
            this.getInstance().openNSRTopologySocket(nsr_id);
        }
    }

    openNSRTopologySocketLoading = () => {
         console.log('loading')
    }
    openNSRTopologySocketSuccess = (connection) => {
        let self = this;

        let connectionManager = (type, connection) => {
            let ws = window.multiplexer.channel(connection);
            if (!connection) {
                console.warn('There was an issue connecting to the ' + type + ' socket');
                return;
            }
            if (self.socket) {
                self.closeSocket();
            }

            self.setState({
                socket: ws.ws,
                channelId: connection
            });
            ws.onmessage = function(data) {
                var tData = JSON.parse(data.data);
                var newState = {
                    topologyData: tData,
                    isLoading: false
                };
                if(!self.hasSelected) {
                    newState.hasSelected = true;
                    self.selectNode(tData);
                }
                self.setState(newState);

            };
        }

        connectionManager('nsr', connection);
    }
    openNSRTopologySocketError = () => {
        console.log('error')
    }
    handleLogout = () => {
        this.closeSocket();
    }
    closeSocket = () => {
        if (this.socket) {
            window.multiplexer.channel(this.channelId).close();
        }
        this.setState({
            socket: null
        })
    }
    getNSRTopologySuccess = (data) => {
        this.setState({
            topologyData: data,
            errorMessage: null,
            isLoading: false
        });
    }
    getNSRTopologyLoading = () => {}
    getNSRTopologyError = (errorMessage) => {
        console.log('error', errorMessage)
        //this.errorMessage = errorMessage;
    }

}
export default Alt.createStore(TopologyStore);
