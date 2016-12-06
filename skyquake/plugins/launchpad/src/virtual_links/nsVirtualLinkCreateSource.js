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
import NSVirtualLinkCreateActions from './nsVirtualLinkCreateActions.js';
import $ from 'jquery';
var Utils = require('utils/utils.js');
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let DEV_MODE = require('utils/rw.js').getSearchParams(window.location).dev_mode || false;

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}


export default {
    createVirtualLink() {
        return {
            remote(state, nsrId, payload) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + nsrId + '/vld' + '?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        dataType:'json',
                        data: payload,
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            console.log("There was an error creating the virtual link: ", error);
                            return reject();
                        }
                    });
                })
            },
            loading: NSVirtualLinkCreateActions.createVirtualLinkLoading,
            success: NSVirtualLinkCreateActions.createVirtualLinkSuccess,
            error: NSVirtualLinkCreateActions.createVirtualLinkError
        }
    },
    deleteVirtualLink() {
        return {
            remote(state, nsrId, vldId) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + nsrId + '/vld/' + vldId + '?api_server=' + API_SERVER,
                        type: 'DELETE',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            console.log("There was an error deleting the virtual link: ", error);
                            return reject();
                        }
                    });
                })
            },
            loading: NSVirtualLinkCreateActions.deleteVirtualLinkLoading,
            success: NSVirtualLinkCreateActions.deleteVirtualLinkSuccess,
            error: NSVirtualLinkCreateActions.deleteVirtualLinkError
        }
    },
    editVirtualLink() {
        return {
            remote(state, nsrId, vldId, vld) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + nsrId + '/vld/' + vldId + '?api_server=' + API_SERVER,
                        type: 'PUT',
                        beforeSend: Utils.addAuthorizationStub,
                        dataType:'json',
                        data: vld,
                        success: function(data) {
                            resolve(data);
                        },
                        error: function(error) {
                            console.log("There was an error editing the virtual link: ", error);
                            return reject();
                        }
                    });
                })
            },
            loading: NSVirtualLinkCreateActions.editVirtualLinkLoading,
            success: NSVirtualLinkCreateActions.editVirtualLinkSuccess,
            error: NSVirtualLinkCreateActions.editVirtualLinkError
        }
    }

}
