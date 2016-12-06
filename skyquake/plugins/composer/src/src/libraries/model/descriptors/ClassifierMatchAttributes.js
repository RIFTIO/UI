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

/**
 * A VirtualNetworkFunctionConnectionPoint is always a child of a VNFD. We use it to build VnfdConnectionPointRef instances. So convenience
 * methods are add to access the fields needed to do that.
 */
export default class ClassifierMatchAttributes extends DescriptorModel {

	static get type() {
		return 'match-attributes';
	}

	static get className() {
		return 'ClassifierMatchAttributes';
	}

	static get qualifiedType() {
		return 'nsd.vnffgd.classifier.' + ClassifierMatchAttributes.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = ClassifierMatchAttributes.type;
		this.uiState['qualified-type'] = ClassifierMatchAttributes.qualifiedType;
		this.className = ClassifierMatchAttributes.className;
		this.position = new Position();
	}

	getFieldValue(name) {
		return this.model[name];
	}

	setFieldValue(name, value) {
		this.model[name] = value;
	}

	remove() {
		return this.parent.removeMatchAttributes(this);
	}

}
