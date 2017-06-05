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

export default class ConfigParameterMap extends DescriptorModel {

// <<<<<<< Updated upstream
//     static get type() {
//         return 'config-parameter-map';
//     }

//     static get className() {
//         return 'ConfigParameterMap';
//     }

//     constructor(model, parent) {
//         super(model, parent);
//         this.type = 'config-parameter-map';
//         this.uiState['qualified-type'] = 'nsd.config-parameter-map';
//         this.className = 'ConfigParameterMap';
//         // this.addProp('vnfdRef', DescriptorModelFactory.newVirtualNetworkFunctionReadOnlyWrapper({}, this));
//     }

//     get id() {
//         return this.model.id;
//     }
//     get capability() {
//         return {
//             'member-vnf-index': this.model.capability['member-vnf-index'],
//             'capability-ref': this.model.capability['capability-ref'],
//         }
//     }
//     get availableCapabilities() {

//     }

//     get dependency() {

//     }
// =======
	static get type() {
		return 'config-parameter-map';
	}

	static get className() {
		return 'ConfigParameterMap';
	}
	static get qualifiedType() {
		return 'nsd.' + ConfigParameterMap.type;
	}
	constructor(model, parent) {
		super(model, parent);
		this.type = 'config-parameter-map';
		this.uiState['qualified-type'] = 'nsd.config-parameter-map';
		this.className = 'ConfigParameterMap';
		// this.addProp('vnfdRef', DescriptorModelFactory.newVirtualNetworkFunctionReadOnlyWrapper({}, this));
	}

	get id() {
		return this.model.id;
	}
	// get capability() {
	// 	return {
	// 		'member-vnf-index': this.model.capability['member-vnf-index'],
	// 		'capability-ref': this.model.capability['capability-ref'],
	// 	}
	// }
	// get availableCapabilities() {

	// }

	// get dependency() {

	// }


}
