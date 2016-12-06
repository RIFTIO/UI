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
import ConnectionPoint from './ConnectionPoint'
import RspConnectionPointRef from './RspConnectionPointRef'
import VnfdConnectionPointRef from './VnfdConnectionPointRef'
import DescriptorModelFactory from '../DescriptorModelFactory'

/**
 * A VirtualNetworkFunctionConnectionPoint is always a child of a VNFD. We use it to build VnfdConnectionPointRef instances. So convenience
 * methods are add to access the fields needed to do that.
 */
export default class VirtualNetworkFunctionConnectionPoint extends ConnectionPoint {

	static get type() {
		return 'connection-point';
	}

	static get className() {
		return 'VirtualNetworkFunctionConnectionPoint';
	}

	static get qualifiedType() {
		return 'vnfd.' + VirtualNetworkFunctionConnectionPoint.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = VirtualNetworkFunctionConnectionPoint.type;
		this.uiState['qualified-type'] = VirtualNetworkFunctionConnectionPoint.qualifiedType;
		this.className = 'VirtualNetworkFunctionConnectionPoint';
	}

}
