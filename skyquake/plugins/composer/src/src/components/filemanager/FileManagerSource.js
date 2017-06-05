
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
'use strict';

import $ from 'jquery'
import alt from '../../alt'
import utils from '../../libraries/utils'
import FileManagerActions from './FileManagerActions'
let Utils = require('utils/utils.js');
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;
let HOST = API_SERVER;
let NODE_PORT = require('utils/rw.js').getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
const FileManagerSource = {

    getFilelist: function() {
        return {
            remote: function(state, id, type) {
                return new Promise(function(resolve, reject) {
                    console.log('Getting File Manager');
                    $.ajax({
                        beforeSend: Utils.addAuthorizationStub,
                        url: 'api/file-manager?api_server=' + utils.getSearchParams(window.location).api_server +'&package_type=' + type + '&package_id=' + id,
                        success: function(data) {
                            resolve(JSON.parse(data));
                        },
                        error: function(error) {
                            if (typeof error == 'string') {
                                error = JSON.parse(error);
                            }
                            reject(error);
                        }
                    }).fail(function(xhr){
                        //Authentication and the handling of fail states should be wrapped up into a connection class.
                        Utils.checkAuthentication(xhr.status);
                    });
                });
            },
            success: FileManagerActions.getFilelistSuccess,
            error: FileManagerActions.getFilelistError
        }
    },
    addFile: function() {
        return {
            remote: function(state, id, type, assetType, path, url, refresh) {
                return new Promise(function(resolve, reject) {
                    console.log('Adding file');
                    console.log(id, type, path, url);
                    let splitUrl = url.split('/');
                    let fileName = splitUrl[splitUrl.length -1];
                    let packagePath = refresh ? path + ((path[path.length - 1] == '/') ? '' : '/') : (path ? path + '/' + fileName : fileName);
                    let assetFolder = assetType.toLowerCase();
                    $.ajax({
                        beforeSend: (xhr) => {
                                Utils.addAuthorizationStub(xhr);
                                // lets get the buzy graphic rolling
                                FileManagerActions.addFileSuccess.defer({
                                                path: assetFolder + (path ? '/' + path: ''),
                                                fileName: fileName,
                                                refresh: refresh
                                            });                            
                            },
                        url: 'api/file-manager?api_server=' + utils.getSearchParams(window.location).api_server +'&package_type=' + type + '&package_id=' + id + '&package_path=' + packagePath + '&asset_type=' + assetType + '&url=' + url,
                        success: function(data) {
                            resolve({
                                data: data,
                                path: assetFolder + (path ? '/' + path: ''),
                                fileName: fileName,
                                refresh: refresh
                            });
                        },
                        error: function(error) {
                            if (typeof error == 'string') {
                                error = JSON.parse(error);
                            }
                            reject(error);
                        }
                    }).fail(function(xhr){
                        //Authentication and the handling of fail states should be wrapped up into a connection class.
                        Utils.checkAuthentication(xhr.status);
                    });
                });
            },
            success: FileManagerActions.addFileSuccess,
            error: FileManagerActions.addFileError
        }
    },
    deleteFile: function() {
        return {
            remote: function(state, id, type, assetType, path) {
                let assetFolder = assetType.toLowerCase();
                return new Promise(function(resolve, reject) {
                    $.ajax({
                        method: 'DELETE',
                        beforeSend: Utils.addAuthorizationStub,
                        url: 'api/file-manager?api_server=' + utils.getSearchParams(window.location).api_server +'&package_type=' + type + '&package_id=' + id + '&asset_type=' + assetType + '&package_path=' + path ,
                        success: function(data) {
                            if (data.output.status == 'True') {
                                resolve({data, assetFolder, path});
                            } else {
                                reject({data, assetFolder, path})
                            }
                        },
                        error: function(error) {
                            if (typeof error == 'string') {
                                error = JSON.parse(error);
                            }
                            reject({data, assetFolder, path});
                        }
                    }).fail(function(xhr){
                        //Authentication and the handling of fail states should be wrapped up into a connection class.
                        Utils.checkAuthentication(xhr.status);
                    });
                });
            },
            success: FileManagerActions.deleteFileSuccess,
            error: FileManagerActions.deleteFileError
        }
    },
    updateFile: function() {
        return {
            remote: function(state, file) {
                return new Promise(function(resolve, reject) {
                    console.log('Getting File Manager');
                    if(file) {
                        console.log('Updating single file');
                    }
                    if(!file) {
                        console.log('Update all files')
                    }
                    resolve({});
                });
            },
            success: FileManagerActions.getFilelistSuccess,
            error: FileManagerActions.getFilelistError
        }
    },
    openDownloadMonitoringSocket: function() {
        return {
            remote: function(state, packageID) {
                return new Promise(function(resolve, reject) {
                    //api/operational/download-jobs/job/
                   $.ajax({
                    url: '/socket-polling?api_server=' + API_SERVER,
                    type: 'POST',
                    beforeSend: Utils.addAuthorizationStub,
                    data: {
                      url: 'composer/api/file-manager/jobs/' + packageID + '?api_server=' + API_SERVER,
                    },
                    success: function(data, textStatus, jqXHR) {
                        Utils.checkAndResolveSocketRequest(data, resolve, reject);
                    }
                  }).fail(function(xhr){
                    //Authentication and the handling of fail states should be wrapped up into a connection class.
                    Utils.checkAuthentication(xhr.status);
                  });
                });
            },
            success: FileManagerActions.openDownloadMonitoringSocketSuccess,
            error: FileManagerActions.openDownloadMonitoringSocketError
        }
    },
    openFileMonitoringSocket: function() {
        return {
            remote: function(state, id, type) {
                return new Promise(function(resolve, reject) {
                    //api/operational/download-jobs/job/
                   $.ajax({
                    url: '/socket-polling?api_server=' + API_SERVER,
                    type: 'POST',
                    beforeSend: Utils.addAuthorizationStub,
                    data: {
                      url: 'composer/api/file-manager?api_server=' + utils.getSearchParams(window.location).api_server +'&package_type=' + type + '&package_id=' + id
                    },
                    success: function(data, textStatus, jqXHR) {
                        Utils.checkAndResolveSocketRequest(data, resolve, reject);
                    }
                  }).fail(function(xhr){
                    //Authentication and the handling of fail states should be wrapped up into a connection class.
                    Utils.checkAuthentication(xhr.status);
                  });
                });
            },
            success: FileManagerActions.getFilelistSocketSuccess,
            error: FileManagerActions.getFilelistError
        }
    }
};

export default FileManagerSource;
