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

import Position from '../../graph/Position'
import InternalConnectionPoint from './InternalConnectionPoint'


/**
 * A VirtualDeploymentUnitInternalConnectionPoint is always a child of a VDU.
 * We use it to build internal-connection-point.id-ref instances. So convenience
 * methods are add to access the fields needed to do that.
 */
export default class VirtualDeploymentUnitInternalConnectionPoint extends InternalConnectionPoint {

	static get type() {
		return 'internal-connection-point';
	}

	static get className() {
		return 'VirtualDeploymentUnitInternalConnectionPoint';
	}

	static get qualifiedType() {
		return 'vnfd.vdu.' + VirtualDeploymentUnitInternalConnectionPoint.type;
	}

	constructor(model, parent) {
		super(model, parent);
		this.type = VirtualDeploymentUnitInternalConnectionPoint.type;
		this.uiState['qualified-type'] = VirtualDeploymentUnitInternalConnectionPoint.qualifiedType;
		this.className = 'VirtualNetworkFunctionConnectionPoint';
	}

	remove() {
		return this.parent.removeInternalConnectionPoint(this);
	}

}
