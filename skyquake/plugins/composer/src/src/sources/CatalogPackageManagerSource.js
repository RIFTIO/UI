
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

import alt from '../alt'
import catalogUtils from '../libraries/utils'
import CatalogPackageManagerActions from '../actions/CatalogPackageManagerActions'
import Utils from 'utils/utils.js';

const getAuthorization = () => 'Basic ' + window.sessionStorage.getItem("auth");

const getStateApiPath = (operation, id) => 
	catalogUtils.getSearchParams(window.location).upload_server + ':4567/api/' + operation + '/' + id + '/state';

const getComposerApiPath = (api) =>
	window.location.origin + '/composer/api/' + api + '?api_server=' + catalogUtils.getSearchParams(window.location).api_server;

const SUCCESS = {
		pending: false,
		success: true,
		error: false,
		message: "Completely successfully"
	};
const FAILED = {
		pending: false,
		success: false,
		error: true,
		message: "Failed"
	};
const PENDING = {
		pending: true,
		success: false,
		error: false,
		message: "In progress"
	};

function ajaxFetch(url, operation, resolve, reject, method = 'GET', input, urlOverride) {
	let credentials = 'same-origin';
	let body = input ? JSON.stringify(input) : null;
	let headers = new Headers();
	headers.append('Authorization', getAuthorization());
	headers.append('Accept', 'application/json');
	if (input) {
		headers.append('Content-Type', 'application/json');
	}

	fetch(url, {method, credentials, headers, body})
		.then(checkStatusGetJson)
		.then(handleSuccess)
		.catch(handleError);

	function checkStatusGetJson(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.json();
		} else {
			var error = new Error(response.statusText)
			error.status = response.status;
			error.statusText = response.statusText;
			throw error
		}
	}

	function handleSuccess (data) {
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}
		resolve({
			state: operation,
			data,
			operation
		});
	}

	function handleError (data) {
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}
		reject({
			state: operation,
			data,
			operation
		});
	}
}

const CatalogPackageManagerSource = {

	requestCatalogPackageDownload: function () {
		return {
			remote: function (state, download, format, grammar, schema) {
				return new Promise((resolve, reject) => {
					// we need an initial status for UI (server does not send)
					const setStatusBeforeResolve = (response) => {
						response.data.status = 'download-requested';
						resolve(response);
					};
					const data = {
						"package-type": download['catalogItems'][0]['uiState']['type'].toUpperCase(),
						"package-id": download.ids,
						"export-format": format && format.toUpperCase() || 'YAML',
						"export-grammar": grammar && grammar.toUpperCase() || 'OSM',
						"export-schema": schema && schema.toUpperCase() || "RIFT"
					}
					const path = getComposerApiPath('package-export');
					ajaxFetch(path, download, setStatusBeforeResolve, reject, 'POST', data, true);
				})
			},
			success: CatalogPackageManagerActions.downloadCatalogPackageStatusUpdated,
			error: CatalogPackageManagerActions.downloadCatalogPackageError
		};
	},

	requestCatalogPackageDownloadStatus: function() {
		return {
			remote: function(state, download) {
				const transactionId = download.transactionId;
				return new Promise(function(resolve, reject) {
					const path = getStateApiPath('export', transactionId);
					ajaxFetch(path, download, resolve, reject);
				});
			},
			success: CatalogPackageManagerActions.downloadCatalogPackageStatusUpdated,
			error: CatalogPackageManagerActions.downloadCatalogPackageError
		}
	},

	requestCatalogPackageCopy: function () {
		return {
			remote: function (state, operationInfo) {
				return new Promise((resolve, reject) => {
					// we need an initial status for UI (server does not send)
					const successHandler = (response) => {
						const status = response.data.output.status;
						const state = status === "COMPLETED" ? SUCCESS : status === "FAILED" ? FAILED : PENDING;
						state.progress = 25; // put something
						let operation = Object.assign({}, operationInfo, state);
						operation.transactionId = response.data.output['transaction-id'];
						resolve(operation);
					}
					const failHandler = (response) => {
						let operation = Object.assign({}, this, FAILED);
						reject(operation);
					};
					const data = {
						"package-type": operationInfo.args.packageType,
						"package-id": operationInfo.args.id,
						"package-name": operationInfo.args.name
					}
					const path = getComposerApiPath('package-copy');
					ajaxFetch(path, operationInfo, successHandler, failHandler, 'POST', data, true);
				})
			},
			success: CatalogPackageManagerActions.updateStatus,
			error: CatalogPackageManagerActions.updateStatus
		};
	},

	requestCatalogPackageCopyStatus: function() {
		return {
			remote: function(state, operation) {
				return new Promise(function(resolve, reject) {
					const successHandler = (response) => {
						const status = response.data.status;
						const state = status === "COMPLETED" ? SUCCESS : status === "FAILED" ? FAILED : PENDING;
						state.progress = state.pending ? operation.progress + ((100 - operation.progress) / 2) : 100;
						let newOp = Object.assign({}, operation, state);
						resolve(newOp);
					};
					const failHandler = (response) => {
						reject(Object.assign({}, operation, FAILED));
					};
					const path = getComposerApiPath('package-manager/jobs/' + operation.transactionId);
					ajaxFetch(path, operation, successHandler, failHandler);
				});
			},
			success: CatalogPackageManagerActions.updateStatus,
			error: CatalogPackageManagerActions.updateStatus
		}
	},

	requestCatalogPackageUploadStatus: function () {
		return {
			remote: function (state, upload) {
				const transactionId = upload.transactionId;
				return new Promise(function (resolve, reject) {
					const action = upload.riftAction === 'onboard' ? 'upload' : 'update';
					const path = getStateApiPath(action, transactionId);
					ajaxFetch(path, upload, resolve, reject);
				});
			},
			success: CatalogPackageManagerActions.uploadCatalogPackageStatusUpdated,
			error: CatalogPackageManagerActions.uploadCatalogPackageError
		};
	}

};

export default CatalogPackageManagerSource;
