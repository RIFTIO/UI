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
import RecordViewActions from './recordViewActions.js';
let Utils = require('utils/utils.js');
import $ from 'jquery';
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
let DEV_MODE = require('utils/rw.js').getSearchParams(window.location).dev_mode || false;

if (DEV_MODE) {
    HOST = window.location.protocol + '//' + window.location.hostname;
}

export default {
    getNSR() {
        return {
            remote: function(state, recordID) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + recordID + '?api_server=' + API_SERVER,
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
            loading: RecordViewActions.getNSRLoading,
            success: RecordViewActions.getNSRSuccess,
            error: RecordViewActions.getNSRError
        };
    },
    getRawVNFR() {
        return {
            remote: function(state, vnfrID) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'passthrough/data/api/operational/vnfr-catalog/vnfr/' + vnfrID + '?api_server=' + API_SERVER,
                        type: 'GET',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.getRawLoading,
            success: RecordViewActions.getRawSuccess,
            error: RecordViewActions.getRawError
        }
    },
    getRawNSR() {
        return {
            remote: function(state, nsrID) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'passthrough/data/api/operational/ns-instance-opdata/nsr/' + nsrID + '?api_server=' + API_SERVER,
                        type: 'GET',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.getRawLoading,
            success: RecordViewActions.getRawSuccess,
            error: RecordViewActions.getRawError
        }
    },
    getNSRSocket() {
        return {
            remote(state, recordID) {
                return new Promise(function(resolve, reject) {
                    console.log('Getting NSR Socket');
                    $.ajax({
                        url: '/socket-polling?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        data: {
                            url: '/launchpad/api/nsr/' + recordID + '?api_server=' + API_SERVER,
                        },
                        success: function(data) {
                            Utils.checkAndResolveSocketRequest(data, resolve, reject);
                        }
                    });
                })
            },
            loading: RecordViewActions.getNSRSocketLoading,
            success: RecordViewActions.getNSRSocketSuccess,
            error: RecordViewActions.getNSRSocketError
        }
    },
    getConfigJobSocket() {
        return {
            remote(state, recordID) {
                return new Promise(function(resolve, reject) {
                    console.log('Getting Job Socket');
                    $.ajax({
                        url: '/socket-polling?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        data: {
                            url: '/launchpad/api/nsr/' + recordID + '?api_server=' + API_SERVER,
                        },
                        success: function(data) {
                            Utils.checkAndResolveSocketRequest(data, resolve, reject);
                        }
                    });
                })
            },
            success: RecordViewActions.getConfigSocketJobSuccess,
            error: RecordViewActions.getConfigSocketJobError
        }
    },
    getVNFRSocket() {
        return {
            remote(state) {
                return new Promise(function(resolve, reject) {
                    console.log('Getting VNFR Socket for: ' + state.recordID);
                    $.ajax({
                        url: '/socket-polling?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        data: {
                            url: '/launchpad/api/vnfr/' + state.recordID + '?api_server=' + API_SERVER,
                        },
                        success: function(data) {
                            Utils.checkAndResolveSocketRequest(data, resolve, reject);
                        }
                    });
                })
            },
            loading: RecordViewActions.getVNFRSocketLoading,
            success: RecordViewActions.getVNFRSocketSuccess,
            error: RecordViewActions.getVNFRSocketError
        }
    },
    execNsConfigPrimitive() {
        return {
            remote(state, payload) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/exec-ns-service-primitive?api_server=' + API_SERVER,
                        type: 'POST',
                        data: payload,
                        dataType: 'json',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.execNsConfigPrimitiveLoading,
            success: RecordViewActions.execNsConfigPrimitiveSuccess,
            error: RecordViewActions.execNsConfigPrimitiveError
        }
    },
    createScalingGroupInstance() {
        return {
            remote(state, params) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + params.nsr_id + '/' + params.scaling_group_id + '/instance' + '?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.createScalingGroupInstanceLoading,
            success: RecordViewActions.createScalingGroupInstanceSuccess,
            error: RecordViewActions.createScalingGroupInstanceError
        }
    },
    deleteScalingGroupInstance() {
        return {
            remote(state, params) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + params.nsr_id + '/' + params.scaling_group_id + '/instance/' + params.scaling_instance_index + '?api_server=' + API_SERVER,
                        type: 'DELETE',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.deleteScalingGroupInstanceLoading,
            success: RecordViewActions.deleteScalingGroupInstanceSuccess,
            error: RecordViewActions.deleteScalingGroupInstanceError
        }
    },
    createVirtualLink() {
        return {
            remote(state, params) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + params.nsr_id + '/vld' + '?api_server=' + API_SERVER,
                        type: 'POST',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.createVirtualLinkLoading,
            success: RecordViewActions.createVirtualLinkSuccess,
            error: RecordViewActions.createVirtualLinkError
        }
    },
    deleteVirtualLink() {
        return {
            remote(state, params) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + params.nsr_id + '/vld/' + params.vldId + '?api_server=' + API_SERVER,
                        type: 'DELETE',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.deleteVirtualLinkLoading,
            success: RecordViewActions.deleteVirtualLinkSuccess,
            error: RecordViewActions.deleteVirtualLinkError
        }
    },
    editVirtualLink() {
        return {
            remote(state, params) {
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        url: 'api/nsr/' + params.nsr_id + '/vld/' + params.vldId + '?api_server=' + API_SERVER,
                        type: 'PUT',
                        beforeSend: Utils.addAuthorizationStub,
                        success: function(data) {
                            resolve(data);
                        }
                    });
                })
            },
            loading: RecordViewActions.editVirtualLinkLoading,
            success: RecordViewActions.editVirtualLinkSuccess,
            error: RecordViewActions.editVirtualLinkError
        }
    }
}
