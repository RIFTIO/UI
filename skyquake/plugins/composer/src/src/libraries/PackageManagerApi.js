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

import guid from '../libraries/guid'
import DropZone from 'dropzone'
import Utils from '../libraries/utils'
import CatalogPackageManagerActions from '../actions/CatalogPackageManagerActions'
import ReactDOM from 'react-dom'
import $ from 'jquery'

const API_SERVER = Utils.getSearchParams(window.location).api_server;




export default class PackageManager {
    constructor(element, button, action) {
        this.stagingArea = {
            packages: {
                ids: []
            }
        }
        this.stagingAreaMonitor = null;
    }
    createStagingArea(type, name) {
        return $.ajax({
            url: Utils.getSearchParams(window.location).api_server + ':8008/api/operations/create-staging-area',
            type: 'POST',
            data: {
                "input" : {
                    // Package type not important for package upload.
                    "package-type": type || "NSD",
                    "name": name || "Package Staging Area"
                }
            },
            error: function() {
                console.log('Something went wrong creating the staging area: ', arguments)
            }
        }).then(function(data) {
            /*
            {
              "output": {
                "endpoint": "api/upload/85f8e2dc-638b-46e7-89cb-ee8de322066f",
                "port": "4568"
              }
            }
             */
            const id = data.output.endpoint.split('/')[2];
            const port = data.output.port;
            this.stagingArea.packages.ids.push(id);
            this.stagingArea.packages[id] = {
                port: port
            };
            return data
        })
    }
    monitoringStagingAreaSocket() {
        let self = this;
        if(self.stagingAreaMonitor) {
            return self.stagingAreaMonitor;
        }
        new Promise(function(resolve, reject) {
            $.ajax({
                url: '/socket-polling',
                type: 'POST',
                beforeSend: Utils.addAuthorizationStub,
                data: {
                  url: 'launchpad/api/nsr?api_server=' + API_SERVER
                },
                success: function(data, textStatus, jqXHR) {
                  Utils.checkAndResolveSocketRequest(data, resolve, reject, self.monitoringStagingAreaSocketHandler);
                }
            })
        })

        return undefined;
    }
    monitoringStagingAreaSocketHandler(connection) {
        let self = this;
        let ws = window.multiplexer.channel(connection);
        if (!connection) return;
        self.stagingAreaMonitor = connection;
        ws.onmessage = function(socket) {
            try {
                Utils.checkAuthentication(data.statusCode, function() {
                    ws.close();
                });

            } catch(e) {
                console.log('An exception occurred in monitoringStagingAreaSocketHandler', e)
            }
        }
    }

}



