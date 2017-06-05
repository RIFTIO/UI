
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
/**
 * Created by onvelocity on 10/27/15.
 */

import guid from '../libraries/guid'
import DropZone from 'dropzone'
import Utils from '../libraries/utils'
import CatalogPackageManagerActions from '../actions/CatalogPackageManagerActions';
import FileManagerActions from '../components/filemanager/FileManagerActions.js';

/**
 * This class is responsible for wiring the DropZone.js to our React actions.
 */

const ACTIONS = {
	onboard: 'onboard',
	update: 'update'
};

function getCatalogPackageManagerServerOrigin() {
	// return Utils.getSearchParams(window.location).upload_server + ':4567';
	return window.location.origin;
}

function initializeDropZone(element = '#dropzone', button = false, action = ACTIONS.onboard, getUploadProps) {
	let Auth = 'Basic ' + window.sessionStorage.getItem("auth");
	let dev_download_server = Utils.getSearchParams(window.location).dev_download_server;
	DropZone.autoDiscover = false;
	return new DropZone(element, {
		paramName: 'package',
		url() {
			let {packageType, packageId, assetGroup, path} = getUploadProps();
			if (action === ACTIONS.update) {
				return getCatalogPackageManagerServerOrigin() + '/api/update';
			}
			let url = getCatalogPackageManagerServerOrigin() 
				+ '/composer/api/file-manager?api_server=' 
				+ Utils.getSearchParams(window.location).api_server 
				+ '&package_type=' + packageType 
				+ '&package_id=' + packageId 
				+ '&package_path=' + path 
				+ '&asset_type=' + assetGroup.id
				+ ( dev_download_server ? '&dev_download_server=' + dev_download_server : '');
			return url;
		},
		headers: {
			'Authorization': Auth
		},
		maxFilesize: 10000000000,
		clickable: button,
		autoProcessQueue: true,
		previewTemplate: '',
		sending(file, xhr, formData) {
			// NOTE ie11 does not get this form data
			let {packageType, packageId, assetGroup, path} = getUploadProps();
			formData.append('id', file.id);
			FileManagerActions.addFileSuccess({
				path: assetGroup.folder + (path ? '/' + path: ''),
				fileName: file.name
			});
		},
		error(file, errorMessage) {
			const response = {
				state: file,
				data: {
					status: 'upload-error',
					message: errorMessage
				}
			};
			CatalogPackageManagerActions.uploadCatalogPackageError(response);
		},
		success(file) {
			const data = JSON.parse(file.xhr.responseText);
			data.status = 'upload-success';
			const response = {
				state: file,
				data: data
			};
			//CatalogPackageManagerActions.uploadCatalogPackageStatusUpdated(response);
		},
		addedfile(file) {
			file.id = file.id || guid();
			file.riftAction = action;
			//CatalogPackageManagerActions.uploadCatalogPackage(file);
		},
		thumbnail(file, dataUrl) {
			const response = {
				state: file,
				data: {
					status: 'upload-thumbnail',
					dataUrl: dataUrl
				}
			};
			//CatalogPackageManagerActions.uploadCatalogPackageStatusUpdated(response);
		},
		uploadprogress(file, progress, bytesSent) {
			// FileManagerActions.addFileSuccess({
			// 	path: path,
			// 	fileName: file.name
			// });
			const response = {
				state: file,
				data: {
					status: 'upload-progress',
					progress: progress,
					bytesSent: bytesSent
				}
			};
			//CatalogPackageManagerActions.uploadCatalogPackageStatusUpdated(response);
		}
	});
}

export default class FileManagerUploadDropZone {

	constructor(element, button, action, getUploadProps) {
		this.dropZone = initializeDropZone(element, button, action, getUploadProps);
	}

	static get ACTIONS() {
		return ACTIONS;
	}

	on(eventName, eventCallback) {
		this.dropZone.on(eventName, eventCallback);
	}

}
