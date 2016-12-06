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

import DescriptorModel from '../DescriptorModel'

/**
 * This class creates the identity of a VirtualNetworkFunctionConnectionPoint on a VNFD. Visually
 * this class represents an svg:Path between the parent VLD and VirtualNetworkFunctionConnectionPoint.
 *
 *     VNFD.VirtualNetworkFunctionConnectionPoint ====path==== VLD
 *
 * The VNFD is referenced by nsd.constituent-vnfd.member-vnf-index.
 * The VirtualNetworkFunctionConnectionPoint is referenced by vnfd.connection-point.name.
 */
export default class VnfdConnectionPointRef extends DescriptorModel {

	static get type() {
		return 'vnfd-connection-point-ref';
	}

	static get className() {
		return 'VnfdConnectionPointRef';
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = 'vnfd-connection-point-ref';
		this.uiState['qualified-type'] = 'nsd.vld.vnfd-connection-point-ref';
		this.className = 'VnfdConnectionPointRef';
	}

	get key() {
		return this.model['member-vnf-index-ref'] + '/' + this.model['vnfd-connection-point-ref'];
	}

	get title() {
		return this.type;
	}

	get vnfdId() {
		return this.model['vnfd-id-ref'];
	}

	set vnfdId(id) {
		return this.model['vnfd-id-ref'] = id;
	}

	get vnfdIndex() {
		return this.model['member-vnf-index-ref'];
	}

	set vnfdIndex(index) {
		return this.model['member-vnf-index-ref'] = index;
	}

	get vnfdConnectionPointName() {
		return this.model['vnfd-connection-point-ref'];
	}

	set vnfdConnectionPointName(name) {
		return this.model['vnfd-connection-point-ref'] = name;
	}

	get cpNumber() {
		return this.uiState.cpNumber;
	}

	set cpNumber(n) {
		this.uiState.cpNumber = n;
	}

	get order() {
		return this.model['order'];
	}

	set order(n) {
		this.model['order'] = n;
	}

	remove() {
		if (this.parent) {
			return this.parent.removeVnfdConnectionPointRefKey(this.key);
		}
	}

}
