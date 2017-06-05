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
 * Created by onvelocity on 11/23/15.
 */

'use strict';

import utils from '../../utils'
import DescriptorModel from '../DescriptorModel'
import DescriptorModelFactory from '../DescriptorModelFactory'
import DescriptorModelMetaFactory from '../DescriptorModelMetaFactory'

export default class VirtualNetworkFunction extends DescriptorModel {

	static get type() {
		return 'vnfd';
	}

	static get className() {
		return 'VirtualNetworkFunction';
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = 'vnfd';
		this.className = 'VirtualNetworkFunction';
	}

	get vdu() {
		const list = this.model.vdu || (this.model.vdu = []);
		return list.map(d => DescriptorModelFactory.newVirtualDeploymentUnit(d, this));
	}

	set vdu(obj) {
		this.updateModelList('vdu', obj, DescriptorModelFactory.VirtualDeploymentUnit);
	}

	createVdu() {
		const property = DescriptorModelMetaFactory.getModelMetaForType('vnfd.vdu');
		const uniqueName = DescriptorModelMetaFactory.generateItemUniqueName(this.vdu, property);
		const model = DescriptorModelMetaFactory.createModelInstanceForType('vnfd.vdu', uniqueName);
		return this.vdu = DescriptorModelFactory.newVirtualDeploymentUnit(model, this);
	}

	removeVirtualDeploymentUnit(vdu) {
		vdu.connectors.forEach(cp => this.removeAnyConnectionsForConnector(cp));
		return this.vdu = this.vdu.filter(d => d.id !== vdu.id);
	}

	get vld() {
		const list = this.model['internal-vld'] || (this.model['internal-vld'] = []);
		return list.map(d => DescriptorModelFactory.newInternalVirtualLink(d, this));
	}

	set vld(obj) {
		this.updateModelList('internal-vld', obj, DescriptorModelFactory.InternalVirtualLink);
	}

	createVld() {
		const property = DescriptorModelMetaFactory.getModelMetaForType('vnfd.internal-vld');
		const uniqueName = DescriptorModelMetaFactory.generateItemUniqueName(this['internal-vld'], property);
		const model = DescriptorModelMetaFactory.createModelInstanceForType('vnfd.internal-vld', uniqueName);
		return this.vld = DescriptorModelFactory.newInternalVirtualLink(model, this);
	}

	/**
	 * @deprecated use `removeInternalVirtualLink()`
	 * @param vld
	 * @returns {*}
	 */
	removeVld(vld) {
		return this.removeModelListItem('vld', vld);
	}

	get connectionPoint() {
		const list = this.model['connection-point'] || (this.model['connection-point'] = []);
		return list.map(d => DescriptorModelFactory.newVirtualNetworkFunctionConnectionPoint(d, this));
	}

	set connectionPoint(obj) {
		return this.updateModelList('connection-point', obj, DescriptorModelFactory.VirtualNetworkFunctionConnectionPoint);
	}

	removeConnectionPoint(cp) {
		return this.removeModelListItem('connectionPoint', cp);
	}

	get connectors() {
		return this.connectionPoint;
	}

	remove() {
		if (this.parent) {
			this.parent.removeConstituentVnfd(this);
			this.connectors.forEach(cpc => this.parent.removeAnyConnectionsForConnector(cpc));
		}
	}

	removeAnyConnectionsForConnector(cpc) {
		this.vld.forEach(vld => vld.removeInternalConnectionPointRefForId(cpc.id));
	}

	removeInternalVirtualLink(ivl) {
		return this.removeModelListItem('vld', ivl);
	}

}

