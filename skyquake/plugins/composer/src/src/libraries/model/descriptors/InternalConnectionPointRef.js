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

export default class InternalConnectionPointRef extends DescriptorModel {

	static get type() {
		return 'internal-connection-point';
	}

	static get className() {
		return 'InternalConnectionPointRef';
	}

	static get qualifiedType() {
		return 'vnfd.internal-vld.' + InternalConnectionPointRef.type;
	}

	constructor(m, parent) {
		super(m, parent);
		this.uid = this.id;
		this.type = InternalConnectionPointRef.type;
		this.uiState['qualified-type'] = InternalConnectionPointRef.qualifiedType;
		this.className = InternalConnectionPointRef.className;
	}

	get key() {
		return this.model['id-ref'];
	}

	get idRef() {
		return this.model['id-ref'];
	}

	set idRef(id) {
		return this.model['id-ref'] = id;
	}

	get cpNumber() {
		return this.uiState.cpNumber;
	}

	set cpNumber(n) {
		this.uiState.cpNumber = n;
	}

	remove() {
		return this.parent.removeInternalConnectionPointRefForId(this.idRef);
	}

}
