
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

 // NOTE: THIS FILE HAS BEEN DEPRECATED AND WILL BE REMOVED
 
'use strict';

import $ from 'jquery'
import alt from '../alt'
import utils from '../libraries/utils'
import RiftHeaderActions from '../actions/RiftHeaderActions'

function getApiServerOrigin() {
	return utils.getSearchParams(window.location).api_port || ((window.location.protocol == 'https:') ? 8443 : 8000);
}
function ajaxRequest(path, catalogPackage, resolve, reject, method = 'GET') {
	$.ajax({
		url: '//' + window.location.hostname + ':' + getApiServerOrigin() + path,
		type: method,
		beforeSend: utils.addAuthorizationStub,
		dataType: 'json',
		success: function(data) {
			if (typeof data == 'string') {
				data = JSON.parse(data);
			}
			resolve({
				data: data,
				state: catalogPackage
			});
		},
		error: function(error) {
			if (typeof error == 'string') {
				error = JSON.parse(error);
			}
			reject({
				data: error,
				state: catalogPackage
			});
		}
	});
}

const RiftHeaderSource = {

	requestLaunchpadConfig: function () {
		return {
			remote: function (state, download) {
				return new Promise((resolve, reject) => {
					// const path = '/launchpad/config?api_server=' + utils.getSearchParams(window.location).api_server;
					// ajaxRequest(path, download, resolve, reject);
					resolve();
				});
			},
			success: RiftHeaderActions.requestLaunchpadConfigSuccess,
			error: RiftHeaderActions.requestLaunchpadConfigError
		};
	},
};

export default RiftHeaderSource;
