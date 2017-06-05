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
import Alt from './skyquakeAltInstance.js';
import $ from 'jquery';
import SkyquakeContainerActions from './skyquakeContainerActions'
import rw from 'utils/rw.js';
import Utils from 'utils/utils.js';

let API_SERVER = rw.getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = rw.getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let DEV_MODE = rw.getSearchParams(window.location).dev_mode || false;
let RW_REST_API_PORT = rw.getSearchParams(window.location).rw_rest_api_port || 8008;

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}

export default {
    getNav() {
        return {
            remote: function() {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: '/nav',
                        type: 'GET',
                        // beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            Utils.detectInactivity();
                            resolve(data);
                        }
                    })
                })
            },
            success: SkyquakeContainerActions.getSkyquakeNavSuccess
        }
    },

    getEventStreams() {
        return {
            remote: function(state, recordID) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: '//' + window.location.hostname + ':' + window.location.port + '/api/operational/restconf-state/streams?api_server=' + API_SERVER,
                        type: 'GET',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    }).fail(function(xhr) {
                        //Authentication and the handling of fail states should be wrapped up into a connection class.
                        Utils.checkAuthentication(xhr.status);
                    });;
                });
            },
            loading: SkyquakeContainerActions.getEventStreamsLoading,
            success: SkyquakeContainerActions.getEventStreamsSuccess,
            error: SkyquakeContainerActions.getEventStreamsError
        }
    },

    openNotificationsSocket() {
        return {
            remote: function(state, location, streamSource) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: '//' + window.location.hostname + ':' + window.location.port + '/socket-polling?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        data: {
                            url: location
                        },
                        success: (data) => {
                            // var url = Utils.webSocketProtocol() + '//' + window.location.hostname + ':' + data.port + data.socketPath;
                            // var ws = new WebSocket(url);
                            // resolve({
                            //     ws: ws,
                            //     streamSource: streamSource
                            // });
                            const checker = () => {
                                if (!Utils.isMultiplexerLoaded()) {
                                    setTimeout(() => {
                                        checker();
                                    }, 500);
                                } else {
                                    resolve({
                                        connection: data.id,
                                        streamSource: streamSource
                                    });
                                }
                            };

                            checker();
                        }
                    });
                });
            },
            loading: SkyquakeContainerActions.openNotificationsSocketLoading,
            success: SkyquakeContainerActions.openNotificationsSocketSuccess,
            error: SkyquakeContainerActions.openNotificationsSocketError
        }
    }
}

