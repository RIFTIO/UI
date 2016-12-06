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
import TopologyL2Actions from './topologyL2Actions.js';
import TopologyL2Source from './topologyL2Source.js';
import Alt from '../alt';
let rw = require('utils/rw.js');
class TopologyL2Store {
    constructor() {
        var self = this;
        // initial state
        this.isLoading = true;
        this.topologyData = {
            nodes: [],
            links: [],
            network_ids: []
        };
        this.errorMessage = null;
        this.socket = null;
        this.detailView = null;

        this.bindActions(TopologyL2Actions);
        // bind source listeners
        this.exportAsync(TopologyL2Source);
        this.exportPublicMethods({
            closeSocket: this.closeSocket,
            getTopologyData: this.getTopologyData
        });
        this.ajax_mode = rw.getSearchParams(window.location).ajax_mode || false;
    }

    getTopologyData = (id) => {
        if (this.ajax_mode) {
            this.getInstance().fetchTopology();
        } else {
            this.getInstance().openTopologyApiSocket(id);
        }
    }
    openTopologyApiSocketLoading() {}
    openTopologyApiSocketSuccess = (connection) => {
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
                self.setState({
                    topologyData: JSON.parse(data.data),
                    isLoading: false,
                });
            };
        }

        connectionManager('foo-type', connection);

    }
    openTopologyApiSocketError() {}

    handleLogout = () => {
        this.closeSocket();
    }

    closeSocket = () => {
        if (this.socket) {
            window.multiplexer.channel(this.channelId).close();
        }
        this.setState({
            socket: null
        });

        this.detailView = null;
        this.hasSelected = false;

        this.bindListeners({
            getTopologyApiSuccess: TopologyL2Actions.GET_TOPOLOGY_API_SUCCESS,
            getTopologyApiLoading: TopologyL2Actions.GET_TOPOLOGY_API_LOADING,
            getTopologyApiError: TopologyL2Actions.GET_TOPOLOGY_API_ERROR
        });
        // bind source listeners
        this.exportAsync(TopologyL2Source);
    }

    getTopologyApiSuccess = (data) => {
        this.setState({
            topologyData: data,
            errorMessage: null
        });
    }

    getTopologyApiLoading = () => {}

    getTopologyApiError = (errorMessage) => {
        this.errorMessage = errorMessage;
    }

    getNodeData = (node_id) => {
        // find node in thisa.topologyData.nodes
        var node_data = this.topologyData.nodes.find(
            function(element, index, array) {
                return (element.id == node_id);
            });
        return node_data;
    }

    nodeClicked = (node_id) => {
        this.setState({
            detailData: this.getNodeData(node_id)
        });
    }
}
    export default Alt.createStore(TopologyL2Store);
