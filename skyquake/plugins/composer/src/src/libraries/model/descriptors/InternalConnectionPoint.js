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

import Position from '../../graph/Position';
import DescriptorModel from '../DescriptorModel';
import DescriptorModelFactory from '../DescriptorModelFactory';
import InternalConnectionPointRef from './InternalConnectionPointRef';

export default class InternalConnectionPoint extends DescriptorModel {

	static get type() {
		return 'internal-connection-point';
	}

	static get className() {
		return 'InternalConnectionPoint';
	}

	static get qualifiedType() {
		return 'vnfd.vdu.' + InternalConnectionPoint.type;
	}

	constructor(model, parent) {
		super(model, parent);
		// evil type collides with the YANG property 'type' for this object
		this.type = 'internal-connection-point';
		this.uiState['qualified-type'] = InternalConnectionPoint.qualifiedType;
		this.className = 'InternalConnectionPoint';
		this.location = 'bottom-left';
		this.position = new Position(parent.position.value());
		this.position.top = parent.position.bottom;
		this.position.width = 14;
		this.position.height = 14;
	}

	get key() {
		return this.id;
	}

	get id() {
		return this.model.id;
	}

	get name() {
		return this.model.name
	}

	get idRef() {
		return this.parent.idRef;
	}

	get cpNumber() {
		return this.uiState.cpNumber;
	}

	set cpNumber(n) {
		this.uiState.cpNumber = n;
	}

	toInternalConnectionPointRef() {
		const ref = new InternalConnectionPointRef({});
		ref.idRef = this.id;
		// ref.cpNumber = this.cpNumber;
		return ref;
	}

	canConnectTo(obj) {
		return DescriptorModelFactory.isInternalVirtualLink(obj) || (DescriptorModelFactory.isInternalConnectionPoint(obj) && obj.parent !== this.parent);
	}

	remove() {
		return this.parent.removeInternalConnectionPoint(this);
	}

}
