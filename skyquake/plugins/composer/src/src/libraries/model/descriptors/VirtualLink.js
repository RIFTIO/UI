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

import UID from '../../../libraries/UniqueId'
import DescriptorModel from '../DescriptorModel'
import DescriptorModelFactory from '../DescriptorModelFactory'
import DescriptorModelMetaFactory from '../DescriptorModelMetaFactory'

export default class VirtualLink extends DescriptorModel {

	static get type() {
		return 'vld';
	}

	static get className() {
		return 'VirtualLink';
	}

	static get qualifiedType() {
		return 'nsd.' + VirtualLink.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = VirtualLink.type;
		this.uiState['qualified-type'] = VirtualLink.qualifiedType;
		this.className = VirtualLink.className;
	}

	get title() {
		const title = this.model['short-name'] || this.model.name || (this.model.type + '/' + this.id);
		if (title && title.length > 18) {
			return title.substr(0, 18) + '...';
		}
		return title;
	}

	get connection() {
		if (!this.model['vnfd-connection-point-ref']) {
			this.model['vnfd-connection-point-ref'] = [];
		}
		return this.model['vnfd-connection-point-ref'].map(d => DescriptorModelFactory.newVnfdConnectionPointRef(d, this));
	}

	set connection(connections) {
		this.updateModelList('vnfd-connection-point-ref', connections, DescriptorModelFactory.VnfdConnectionPointRef);
	}

	createVnfdConnectionPointRef(model) {
		model = model || DescriptorModelMetaFactory.createModelInstanceForType('nsd.vld.vnfd-connection-point-ref');
		return this.connection = DescriptorModelFactory.newVnfdConnectionPointRef(model, this);
	}

	removeVnfdConnectionPointRefKey(cpRefKey) {
		const child = this.connection.filter(d => d.key === cpRefKey)[0];
		return this.removeModelListItem('connection', child);
	}

	addConnectionPoint(cp) {
		this.parent.removeAnyConnectionsForConnector(cp);
		const cpRef = cp.toVnfdConnectionPointRef();
		this.connection = this.connection.concat(cpRef);
	}

	findConnectionPointRef(vnfdId, vnfdIndex, vnfdConnectionPointName) {
		return this.connection.filter(d => d.vnfdId === vnfdId && d.vnfdIndex === vnfdIndex && d.vnfdConnectionPointName === vnfdConnectionPointName)[0];
	}

	remove() {
		const nsdc = this.parent;
		return nsdc.removeVLD(this);
	}

	removeVnfdConnectionPointRefForVnfdIndex(vnfdIndex) {
		const size = this.connection.length;
		if (typeof vnfdIndex !== 'undefined') {
			this.connection = this.connection.filter(d => d.vnfdIndex !== vnfdIndex).map(d => d.model);
		}
		return size !== this.connection.length;
	}

}
