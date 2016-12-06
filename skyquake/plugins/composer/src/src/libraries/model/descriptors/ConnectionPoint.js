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

import Position from '../../graph/Position'
import DescriptorModel from '../DescriptorModel'
import RspConnectionPointRef from './RspConnectionPointRef'
import VnfdConnectionPointRef from './VnfdConnectionPointRef'
import DescriptorModelFactory from '../DescriptorModelFactory'

/**
 * A VirtualNetworkFunctionConnectionPoint is always a child of a VNFD. We use it to build VnfdConnectionPointRef instances. So convenience
 * methods are add to access the fields needed to do that.
 */
export default class ConnectionPoint extends DescriptorModel {

	static get type() {
		return 'connection-point';
	}

	static get className() {
		return 'VirtualNetworkFunctionConnectionPoint';
	}

	static get qualifiedType() {
		return 'vnfd.' + ConnectionPoint.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = ConnectionPoint.type;
		this.uiState['qualified-type'] = ConnectionPoint.qualifiedType;
		this.className = 'VirtualNetworkFunctionConnectionPoint';
		this.location = 'bottom-left';
		this.position = new Position(parent.position.value());
		this.position.top = parent.position.bottom;
		this.position.width = 14;
		this.position.height = 14;
	}

	get id() {
		return this.model.name;
	}

	get key() {
		return this.parent.key + '/' + this.model.name;
	}

	get name() {
		return this.model.name;
	}

	get vnfdIndex() {
		return this.parent.vnfdIndex;
	}

	get vnfdId() {
		return this.parent.vnfdId;
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

	/**
	 * Convenience method to generate a VnfdConnectionPointRef instance from any given VirtualNetworkFunctionConnectionPoint.
	 *
	 * @returns {RspConnectionPointRef}
	 */
	toRspConnectionPointRef() {
		const ref = new RspConnectionPointRef({});
		ref.vnfdId = this.vnfdId;
		ref.vnfdIndex = this.vnfdIndex;
		ref.vnfdConnectionPointName = this.name;
		ref.cpNumber = this.cpNumber;
		ref.order = this.order;
		return ref;
	}

	toVnfdConnectionPointRef() {
		const ref = new VnfdConnectionPointRef({});
		ref.vnfdId = this.vnfdId;
		ref.vnfdIndex = this.vnfdIndex;
		ref.vnfdConnectionPointName = this.name;
		ref.cpNumber = this.cpNumber;
		ref.order = this.order;
		return ref;
	}

	canConnectTo(obj) {
		return (DescriptorModelFactory.isVirtualLink(obj) || DescriptorModelFactory.isConnectionPoint(obj)) && obj.parent !== this.parent;
	}

	remove() {
		return this.parent.removeConnectionPoint(this);
	}

}
