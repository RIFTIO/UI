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
import DescriptorModelFactory from '../DescriptorModelFactory'

export default class VirtualNetworkFunctionReadOnlyWrapper extends DescriptorModel {

	constructor(model, parent) {
		super(model, parent);
	}

	get vld() {
		if (!this.model['internal−vld']) {
			this.model['internal−vld'] = [];
		}
		return this.model['internal−vld'].map(d => DescriptorModelFactory.newInternalVirtualLink(d, this.parent));
	}

	get connectionPoint() {
		if (!this.model['connection-point']) {
			this.model['connection-point'] = [];
		}
		return this.model['connection-point'].map(d => DescriptorModelFactory.newConstituentVnfdConnectionPoint(d, this.parent));
	}

	get connectors() {
		return this.connectionPoint;
	}

}
