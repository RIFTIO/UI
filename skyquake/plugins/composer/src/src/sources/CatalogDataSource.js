
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

import _ from 'lodash'
import $ from 'jquery'
import alt from '../alt'
import utils from '../libraries/utils'
import serializers from '../libraries/model/DescriptorModelSerializer'
import CatalogDataSourceActions from '../actions/CatalogDataSourceActions'
let Utils = require('utils/utils.js');
const CatalogDataSource = {

	loadCatalogs: function() {
		return {
			remote: function() {
				return new Promise(function(resolve, reject) {
					$.ajax({
						beforeSend: Utils.addAuthorizationStub,
						url: 'api/catalog?api_server=' + utils.getSearchParams(window.location).api_server,
						// url: '/composer/big-honking-catalog',
						// url: '/composer/ping-pong-catalog',
						// url: '/composer/empty-nsd-catalog',
						success: function(data) {
							if (typeof data == 'string') {
								data = JSON.parse(data);
							}
							const context = Object.assign({}, this, {data: data});
							resolve(context);
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
			success: CatalogDataSourceActions.loadCatalogsSuccess,
			error: CatalogDataSourceActions.loadCatalogsError
		}
	},

	deleteCatalogItem: function() {
		return {
			remote: function(state, catalogType, itemId) {
				return new Promise(function(resolve, reject) {
					$.ajax({
						url: 'api/catalog/' + catalogType + '/' + itemId + '?api_server=' + utils.getSearchParams(window.location).api_server,
						type: 'DELETE',
						beforeSend: utils.addAuthorizationStub,
						success: function(data) {
							resolve({
								data: data,
								catalogType: catalogType,
								itemId: itemId
							});
						},
						error: function(error) {
							reject({
								error: error,
								catalogType: catalogType,
								itemId: itemId
							});
						}
					});
				});
			},
			success: CatalogDataSourceActions.deleteCatalogItemSuccess,
			error: CatalogDataSourceActions.deleteCatalogItemError
		}
	},

	saveCatalogItem: function () {
		return {
			remote: function (state, item = {}) {
				const method = item.uiState.isNew ? 'POST' : 'PUT';
				const payload = serializers.serialize(item);
				return new Promise((resolve, reject) => {
					if (payload === false) {
						reject({
							error: 'unable to serialize item: ' + item.id,
							catalogType: item.uiState.type,
							itemId: payload.id
						});
					}
					if (method === 'POST') {
						$.ajax({
							url: 'api/catalog/' + item.uiState.type + '?api_server=' + utils.getSearchParams(window.location).api_server,
							type: method,
							beforeSend: utils.addAuthorizationStub,
							data: payload,
							dataType: 'json',
							success: function(data) {
								resolve({
									data: data,
									catalogType: item.uiState.type,
									itemId: payload.id
								});
							},
							error: function(error) {
								reject({
									error: error,
									catalogType: item.uiState.type,
									itemId: payload.id
								});
							}
						});
					} else {
						$.ajax({
							url: 'api/catalog/' + item.uiState.type + '/' + payload.id + '?api_server=' + utils.getSearchParams(window.location).api_server,
							type: method,
							beforeSend: utils.addAuthorizationStub,
							data: payload,
							dataType: 'json',
							success: function(data) {
								resolve({
									data: data,
									catalogType: item.uiState.type,
									itemId: payload.id
								});
							},
							error: function(error) {
								reject({
									error: error,
									catalogType: item.uiState.type,
									itemId: payload.id
								});
							}
						});
					}
				});
			},
			success: CatalogDataSourceActions.saveCatalogItemSuccess,
			error: CatalogDataSourceActions.saveCatalogItemError
		};
	}
};

export default CatalogDataSource;
