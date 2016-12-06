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

import DescriptorModel from '../DescriptorModel'
import DescriptorModelFactory from '../DescriptorModelFactory'
import DescriptorModelMetaFactory from '../DescriptorModelMetaFactory'

export default class InternalVirtualLink extends DescriptorModel {

	static get type() {
		return 'internal-vld';
	}

	static get className() {
		return 'InternalVirtualLink';
	}

	static get qualifiedType() {
		return 'vnfd.' + InternalVirtualLink.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = InternalVirtualLink.type;
		this.uiState['qualified-type'] = InternalVirtualLink.qualifiedType;
		this.className = InternalVirtualLink.className;
	}

	get title() {
		return super.title || (this.type + '/' + this.id);
	}

	get connection() {
		if (!this.model['internal-connection-point']) {
			this.model['internal-connection-point'] = [];
		}
		return this.model['internal-connection-point'].map(d => DescriptorModelFactory.newInternalConnectionPointRef(d, this));
	}

	set connection(connections) {
		return this.updateModelList('internal-connection-point', connections, DescriptorModelFactory.InternalConnectionPointRef);
	}

	createInternalConnectionPoint(model) {
		model = model || DescriptorModelMetaFactory.createModelInstanceForType('vnfd.internal-vld.internal-connection-point');
		return this.connection = DescriptorModelFactory.newInternalConnectionPointRef(model, this);
	}

	removeInternalConnectionPointRefForIdRefKey(cpRefKey) {
		const child = this.connection.filter(d => d.key === cpRefKey)[0];
		return this.removeModelListItem('connection', child);
	}

	addConnectionPoint(icp) {
		this.parent.removeAnyConnectionsForConnector(icp);
		const icpRef = icp.toInternalConnectionPointRef();
		// this.connection = icp.toInternalConnectionPointRef();
		this.connection = this.connection.concat(icpRef);
	}

	removeInternalConnectionPointRefForId(idRef) {
		// return this.connection = this.connection.filter(d => d.idRef !== idRef).map(d => d.idRef);
		// KKTODO: Check if below works instead
		return this.connection = this.connection.filter(d => d.idRef !== idRef).map(d => d.model);
	}

	remove() {
		return this.parent.removeInternalVirtualLink(this);
	}

}
