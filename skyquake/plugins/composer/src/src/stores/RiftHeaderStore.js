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
 * Created by kkashalk on 11/10/15.
 */

 // NOTE: THIS FILE HAS BEEN DEPRECATED AND WILL BE REMOVED

'use strict';

import alt from '../alt'
import React from 'react'
import utils from '../libraries/utils'
import RiftHeaderActions from '../actions/RiftHeaderActions'
import RiftHeaderSource from '../sources/RiftHeaderSource'
import CatalogDataSource from '../sources/CatalogDataSource'
import CatalogDataSourceActions from '../actions/CatalogDataSourceActions'

class RiftHeaderStore {

	constructor() {
		let mgmt_domain_name = unescape(utils.getSearchParams(window.location).mgmt_domain_name);
		if(mgmt_domain_name.toUpperCase() == 'DASHBOARD' || mgmt_domain_name.toUpperCase() == 'UNDEFINED') {
			mgmt_domain_name = '';
		} else {
			mgmt_domain_name = ' : ' + mgmt_domain_name;
		}
		this.headerTitle = 'Launchpad' + mgmt_domain_name;
		this.nsdCount = 0;
		this.isStandAlone = false;
		this.registerAsync(CatalogDataSource);
		this.registerAsync(RiftHeaderSource);
		this.bindAction(CatalogDataSourceActions.LOAD_CATALOGS_SUCCESS, this.loadCatalogsSuccess);
		this.bindActions(RiftHeaderActions);
	}
	requestLaunchpadConfigSuccess(data) {
		this.setState({
			isStandAlone: true,
			headerTitle: 'Launchpad'
		});
	}
	loadCatalogsSuccess(data) {
		let self = this; {}
		let descriptorCount = 0;
		data.data.forEach((catalog) => {
			descriptorCount += catalog.descriptors.length;
		});

		self.setState({
			descriptorCount: descriptorCount
		});
	}
}

export default alt.createStore(RiftHeaderStore, 'RiftHeaderStore');
