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
//This will reach out to the global routes endpoint

import Alt from './skyquakeAltInstance.js';
import SkyquakeContainerSource from './skyquakeContainerSource.js';
import SkyquakeContainerActions from './skyquakeContainerActions';
import _indexOf from 'lodash/indexOf';
//Temporary, until api server is on same port as webserver
import rw from 'utils/rw.js';

var API_SERVER = rw.getSearchParams(window.location).api_server;
var UPLOAD_SERVER = rw.getSearchParams(window.location).upload_server;

class SkyquakeContainerStore {
    constructor() {
        this.currentPlugin = getCurrentPlugin();
        this.nav = {};
        this.notifications = [];
        this.socket = null;
        //Notification defaults
        this.notificationMessage = '';
        this.displayNotification = false;
        this.notificationType = 'error';
        //Screen Loader default
        this.displayScreenLoader = false;
        this.bindActions(SkyquakeContainerActions);
        this.exportAsync(SkyquakeContainerSource);


        this.exportPublicMethods({
            // getNav: this.getNav
        });

    }
    getSkyquakeNavSuccess = (data) => {
        var self = this;
        this.setState({
            nav: decorateAndTransformNav(data, self.currentPlugin)
        })
    }

    closeSocket = () => {
        if (this.socket) {
            window.multiplexer.channel(this.channelId).close();
        }
        this.setState({
            socket: null
        });
    }
    //Remove once logging plugin is implemented
    getSysLogViewerURLSuccess(data){
        window.open(data.url);
    }
    getSysLogViewerURLError(data){
        console.log('failed', data)
    }

    openNotificationsSocketLoading = () => {
        this.setState({
            isLoading: true
        })
    }

    openNotificationsSocketSuccess = (data) => {
        var self = this;

        let connection = data.connection;
        let streamSource = data.streamSource;
        console.log('Success opening notification socket for stream ', streamSource);

        let ws = window.multiplexer.channel(connection);

        if (!connection) return;
        self.setState({
            socket: ws.ws,
            isLoading: false,
            channelId: connection
        });

        ws.onmessage = (socket) => {
            try {
                var data = JSON.parse(socket.data);
                if (!data.notification) {
                    console.warn('No notification in the received payload: ', data);
                } else {
                    // Temp to test before adding multi-sources
                    data.notification.source = streamSource;
                    if (_indexOf(self.notifications, data.notification) == -1) {
                        // newly appreared event.
                        // Add to the notifications list and setState
                        self.notifications.unshift(data.notification);
                        self.setState({
                            newNotificationEvent: true,
                            newNotificationMsg: data.notification,
                            notifications: self.notifications,
                            isLoading: false
                        });
                    }
                }
            } catch(e) {
                console.log('Error in parsing data on notification socket');
            }
        };

        ws.onclose = () => {
            self.closeSocket();
        };
    }

    openNotificationsSocketError = (data) => {
        console.log('Error opening notification socket', data);
    }

    getEventStreamsLoading = () => {
        this.setState({
            isLoading: true
        });
    }

    getEventStreamsSuccess = (streams) => {
        console.log('Found streams: ', streams);
        let self = this;

        streams['ietf-restconf-monitoring:streams'] &&
        streams['ietf-restconf-monitoring:streams']['stream'] &&
        streams['ietf-restconf-monitoring:streams']['stream'].map((stream) => {
            stream['access'] && stream['access'].map((streamLocation) => {
                if (streamLocation['encoding'] == 'ws_json') {
                    setTimeout(() => {
                        self.getInstance().openNotificationsSocket(streamLocation['location'], stream['name']);
                    }, 0);
                }
            })
        })

        this.setState({
            isLoading: true,
            streams: streams
        })
    }

    getEventStreamsError = (error) => {
        console.log('Failed to get streams object');
        this.setState({
            isLoading: false
        })
    }

    //Notifications
    showNotification = (data) => {
        let state = {
                displayNotification: true,
                notificationMessage: data,
                notificationType: 'error',
                displayScreenLoader: false
            }
        if(typeof(data) == 'string') {

        } else {
            state.notificationMessage = data.msg;
            if(data.type) {
                state.notificationType = data.type;
            }
        }
        this.setState(state);
    }
    hideNotification = () => {
        this.setState({
            displayNotification: false
        })
    }
    //ScreenLoader
    showScreenLoader = () => {
        this.setState({
            displayScreenLoader: true
        });
    }
    hideScreenLoader = () => {
        this.setState({
            displayScreenLoader: false
        })
    }

}

/**
 * Receives nav data from routes rest endpoint and decorates the data with internal/external linking information
 * @param  {object} nav           Nav item from /nav endoingpoint
 * @param  {string} currentPlugin Current plugin name taken from url path.
 * @return {array}               Returns list of constructed nav items.
 */
function decorateAndTransformNav(nav, currentPlugin) {
    for ( let k in nav) {
        nav[k].pluginName = k;
            if (k != currentPlugin)  {
                nav[k].routes.map(function(route, i) {
                    if (API_SERVER) {
                        route.route = '/' + k + '/index.html?api_server=' + API_SERVER + '&upload_server=' + UPLOAD_SERVER + '#' + route.route;
                    } else {
                        route.route = '/' + k + '/#' + route.route;
                    }
                    route.isExternal = true;
                })
            }
        }
        return nav;
}

function getCurrentPlugin() {
    var paths = window.location.pathname.split('/');
    var currentPath = null;
    if (paths[0] != "") {
        currentPath = paths[0]
    } else {
        currentPath = paths[1];
    }
    if (currentPath != null) {
        return currentPath;
    } else {
        console.error('Well, something went horribly wrong with discovering the current plugin name - perhaps you should consider moving this logic to the server?')
    }
}

export default Alt.createStore(SkyquakeContainerStore, 'SkyquakeContainerStore');
