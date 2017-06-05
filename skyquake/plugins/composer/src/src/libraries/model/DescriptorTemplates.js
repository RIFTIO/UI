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
 * Created by onvelocity on 10/6/15.
 *
 * Model fragments used to construct partially completed models.
 */

'use strict';

//
// note: values can be expressions. After the object is created the funtion will be 
// invoked. if you use the arrow function syntax the this pointer will reference
// the created object.
//
export default {
	'vnfd': {
		'description': 'A simple VNF descriptor w/ one VDU',
		'version': '1.0',
		'connection-point': [
			{
				'name': 'connection-point-1',
				'type': 'VPORT'
			}
		],
		'vdu': [
			{
				'uiState': {
					'type': 'vdu'
				},
				'id': 'vdu-1',
				'name': 'vdu-1',
				'vm-flavor': {
					'vcpu-count': 4,
					'memory-mb': 16384,
					'storage-gb': 16
				},
				'image': '',
				'external-interface': [
					{
						'name': 'eth0',
						'vnfd-connection-point-ref': 'connection-point-1',
						'virtual-interface': {
							'type': 'VIRTIO'
						}
					}
				]
			}
		]
	},
	'vnfd.internal-vld': {
		'description': 'Virtual link for internal fabric',
		'type': 'ELAN'
	}
};
