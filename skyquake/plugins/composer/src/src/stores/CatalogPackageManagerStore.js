
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

import _delay from 'lodash/delay'
import _pick from 'lodash/pick'
import alt from '../alt'
import guid from '../libraries/guid'
import numeral from 'numeral'
import moment from 'moment'
import utils from '../libraries/utils'
import CatalogPackageManagerSource from '../sources/CatalogPackageManagerSource'
import CatalogPackageManagerActions from '../actions/CatalogPackageManagerActions'
import CatalogDataSource from '../sources/CatalogDataSource'

import imgDownload from '../../../node_modules/open-iconic/svg/cloud-download.svg'
import imgOnboard from '../../../node_modules/open-iconic/svg/cloud-upload.svg'
import imgUpdate from '../../../node_modules/open-iconic/svg/data-transfer-upload.svg'
import imgCopy from '../../../node_modules/open-iconic/svg/layers.svg'

const defaults = {
	operation: {
		id: '',
		name: '',
		icon: '',
		transactionId: '',
		progress: 0,
		message: 'Requested',
		args: {},
		pending: false,
		success: false,
		error: false,
	},
	downloadPackage: {
		id: '',
		name: '',
		icon: imgDownload,
		catalogItems: [],
		transactionId: '',
		progress: 0,
		message: 'Requesting catalog package export...',
		pending: false,
		success: false,
		error: false,
		url: '',
		urlValidUntil: ''
	},
	checkStatusDelayInSeconds: 2,
	downloadUrlTimeToLiveInMinutes: 5
};

const exception = function ignoreException() {};

const packagePropertyNames = Object.keys(defaults.downloadPackage);

function getCatalogPackageManagerServerOrigin() {
	return utils.getSearchParams(window.location).upload_server + ':4567';
}

function delayStatusCheck(statusCheckFunction, operation) {
	if (!operation.checkStatusTimeoutId) {
		const delayCallback = function () {
			delete operation.checkStatusTimeoutId;
			statusCheckFunction(operation).catch(exception);
		};
		operation.checkStatusTimeoutId = _delay(delayCallback, defaults.checkStatusDelayInSeconds * 1000);
	}
}

class CatalogPackageManagerStore {

	constructor() {

		this.operations = [];

		this.registerAsync(CatalogDataSource);
		this.registerAsync(CatalogPackageManagerSource);
		this.bindAction(CatalogPackageManagerActions.REMOVE_CATALOG_OPERATION, this.removeCatalogOperation);
		this.bindAction(CatalogPackageManagerActions.DOWNLOAD_CATALOG_PACKAGE, this.downloadCatalogPackage);
		this.bindAction(CatalogPackageManagerActions.DOWNLOAD_CATALOG_PACKAGE_STATUS_UPDATED, this.onDownloadCatalogPackageStatusUpdated);
		this.bindAction(CatalogPackageManagerActions.DOWNLOAD_CATALOG_PACKAGE_ERROR, this.onDownloadCatalogPackageError);
		this.bindAction(CatalogPackageManagerActions.UPLOAD_CATALOG_PACKAGE, this.uploadCatalogPackage);
		this.bindAction(CatalogPackageManagerActions.UPLOAD_CATALOG_PACKAGE_STATUS_UPDATED, this.onUploadCatalogPackageStatusUpdated);
		this.bindAction(CatalogPackageManagerActions.UPLOAD_CATALOG_PACKAGE_ERROR, this.onUploadCatalogPackageError);
		this.bindAction(CatalogPackageManagerActions.COPY_CATALOG_PACKAGE, this.copyCatalogPackage);
		this.bindAction(CatalogPackageManagerActions.UPDATE_STATUS, this.updateOperationStatus);
	}

	addOperation(operation) {
		const operations = [operation].concat(this.operations);
		this.setState({operations});
	}

	updateOperation(operation) {
		const operations = this.operations.map(d => {
			if (d.id === operation.id) {
				return Object.assign({}, d, operation);
			}
			return d;
		});
		this.setState({operations});
	}

	removeCatalogOperation(operation) {
		const operations = this.operations.filter(d => d.id !== operation.id);
		this.setState({operations});
	}

	copyCatalogPackage(sourcePackage) {
		let operationInfo = Object.assign({}, defaults.operation);

		operationInfo.args.packageType = sourcePackage['uiState']['type'].toUpperCase();
		operationInfo.args.id =  sourcePackage.id;
		operationInfo.args.name =  sourcePackage.name + ' copy';

		operationInfo.id = guid();
		operationInfo.icon = imgCopy;
		operationInfo.type = 'copy';
		operationInfo.name =  "Creating " + operationInfo.args.name;
		operationInfo.message = "Requesting duplication";

		this.addOperation(operationInfo);
		this.getInstance().requestCatalogPackageCopy(operationInfo, sourcePackage);
	}

	updateOperationStatus(operation) {
		console.debug('package manager operation status update', operation);
		this.updateOperation(operation);
		if (operation.pending) {
			delayStatusCheck(this.getInstance().requestCatalogPackageCopyStatus, operation);
		}
	}

	uploadCatalogPackage(file) {
		file.id = file.id || guid();
		const operation = _pick(file, packagePropertyNames);
		operation.icon = file.riftAction === 'onboard' ? imgOnboard : imgUpdate;
		operation.type = 'upload';
		this.addOperation(operation);
		// note DropZone.js handles the async upload so we don't have to invoke any async action creators
	}

	onUploadCatalogPackageStatusUpdated(response) {
		const upload = updateStatusInfo(response);
		this.updateOperation(upload);
		console.log('updating package upload')
		// if pending with no transaction id - do nothing
		// bc DropZone.js will notify upload progress
		if (upload.pending && upload.transactionId) {
			console.log('checking status')
			delayStatusCheck(this.getInstance().requestCatalogPackageUploadStatus, upload);
		} else if (upload.success) {
			this.getInstance().loadCatalogs();
			console.log('finished uploading to node, requesting status from rest')
		}
	}

	onUploadCatalogPackageError(response) {
		console.warn('onUploadCatalogPackageError', response);
		const operation = updateStatusInfo(response);
		this.updateOperation(operation);
	}

	downloadCatalogPackage(data) {
		let catalogItems = data['selectedItems'] || [];
		let schema = data['selectedFormat'] || 'mano';
		let grammar = data['selectedGrammar'] || 'osm';
		let format = "YAML";
		if (catalogItems.length) {
			const operation = Object.assign({}, defaults.downloadPackage, {id: guid()});
			operation.name = catalogItems[0].name;
			operation.type = 'download';
			if (catalogItems.length > 1) {
				operation.name += ' (' + catalogItems.length + ' items)';
			}
			operation.ids = catalogItems.map(d => d.id).sort().toString();
			operation.catalogItems = catalogItems;
			this.addOperation(operation);
			this.getInstance().requestCatalogPackageDownload(operation, format, grammar, schema).catch(exception);
		}
	}

	onDownloadCatalogPackageStatusUpdated(response) {
		const download = updateStatusInfo(response);
		this.updateOperation(download);
		if (download.pending) {
			delayStatusCheck(this.getInstance().requestCatalogPackageDownloadStatus, download);
		}
	}

	onDownloadCatalogPackageError(response) {
		console.warn('onDownloadCatalogPackageError', response);
		const operation = updateStatusInfo(response);
		this.updateOperation(operation);
	}

}

function calculateUploadProgressMessage(size = 0, progress = 0, bytesSent = 0) {
	const amount = parseFloat(progress) || 0;
	const loaded = amount === 100 ? size : size * amount / 100;
	let progressText;
	if (amount === 100) {
		progressText = numeral(loaded).format('0.0b') + ' loaded ';
	} else if (typeof amount === 'number' && amount != 0) {
		progressText = numeral(bytesSent).format('0.0b') + ' out of ' + numeral(size).format('0.0b');
	} else {
		progressText = progress;
	}
	return progressText;
}

function updateStatusInfo(response) {
	// returns the operation object with the status fields updated based on the server response
	const statusInfo = {
		pending: false,
		success: false,
		error: false
	};
	const responseData = (response.data.output) ? response.data.output :  response.data;
	const operation = response.state;
	if ( typeof response.data.status !== "number" ) {
		switch(response.data.status) {
		case 'upload-progress':
			statusInfo.pending = true;
			statusInfo.progress = parseFloat(responseData.progress) || 0;
			statusInfo.message = calculateUploadProgressMessage(operation.size, responseData.progress, responseData.bytesSent);
			break;
		case 'upload-success':
			statusInfo.pending = true;
			statusInfo.progress = 100;
			statusInfo.message = 'Upload completed.';
			statusInfo.transactionId = responseData['transaction_id'] || responseData['transaction-id'] || operation.transactionId;
			break;
		case 'upload-error':
			statusInfo.error = true;
			statusInfo.message = responseData.message;
			break;
		case 'download-requested':
			statusInfo.pending = true;
			statusInfo.progress = 25;
			statusInfo.transactionId = responseData['transaction_id'] || responseData['transaction-id']  || operation.transactionId;
			break;
		case 'pending':
			statusInfo.pending = true;
			statusInfo.progress = 50;
			statusInfo.message = responseData.events[responseData.events.length - 1].text;
			break;
		case 'success':
			statusInfo.success = true;
			statusInfo.progress = 100;
			statusInfo.message = responseData.events[responseData.events.length - 1].text;
			if (operation.type === 'download') {
				statusInfo.urlValidUntil = moment().add(defaults.downloadUrlTimeToLiveInMinutes, 'minutes').toISOString();
				if (responseData.filename) {
					statusInfo.url = getCatalogPackageManagerServerOrigin() + '/api/export/' + responseData.filename;
				} else {
					statusInfo.url = getCatalogPackageManagerServerOrigin() + '/api/export/' + operation.transactionId + '.tar.gz';
				}
			}
			break;
		case 'failure':
			statusInfo.error = true;
			statusInfo.message = responseData.errors[0].value;
			break;
		default:
			throw new ReferenceError('a status of "request", "success", "failure", "pending", "upload-completed", "upload-error", "download-requested", "upload-progress", "upload-action" is required');
		}
	} else {
		// typically get here due to unexpected development errors (backend exceptions, down/up load server access issues)
		statusInfo.error = true;
		statusInfo.message = responseData.statusText || 'Error';
	}
	return Object.assign({}, operation, statusInfo);
}

export default alt.createStore(CatalogPackageManagerStore, 'CatalogPackageManagerStore');
