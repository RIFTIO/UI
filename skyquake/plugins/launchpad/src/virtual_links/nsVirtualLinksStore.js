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
import NSVirtualLinksActions from './nsVirtualLinksActions.js';
import Alt from 'widgets/skyquake_container/skyquakeAltInstance';

class NSVirtualLinksStore {
	constructor() {
		this.column = {
			categories: [{
				key: 'details',
				label: 'DETAILS',
				fields: [{
					key: 'id',
					label: 'ID'
				}, {
					key: 'name',
					label: 'NAME'
				}, {
					key: 'short-name',
					label: 'SHORT NAME'
				}, {
					key: 'vendor',
					label: 'VENDOR'
				}, {
					key: 'description',
					label: 'DESCRIPTION'
				}, {
					key: 'version',
					label: 'VERSION'
				}, {
					key: 'type',
					label: 'TYPE'
				}, {
					key: 'root-bandwidth',
					label: 'ROOT BANDWIDTH'
				}, {
					key: 'leaf-bandwidth',
					label: 'LEAF BANDWIDTH'
				}, {
					key: 'res-id',
					label: 'RESOURCE MANAGER ID'
				}, {
					key: 'network-id',
					label: 'NETWORK ID'
				}]
			}, {
				key: 'provider-network',
				label: 'PROVIDER NETWORK',
				fields: [{
					key: 'provider-network.physical-network',
					label: 'PHYSICAL NETWORK'
				}, {
					key: 'provider-network.overlay-type',
					label: 'OVERLAY TYPE'
				}, {
					key: 'provider-network.segmentation_id',
					label: 'SEGMENTATION ID'
				}]
			}, {
				key: 'status',
				label: 'STATUS',
				fields: [{
					key: 'status',
					label: 'STATUS'
				}, {
					key: 'operational-status',
					label: 'OPERATIONAL STATUS'
				}, {
					key: 'create-time',
					label: 'CREATE TIME',
					transform: (value) => {
						if (!value) {
							return null;
						}
						return new Date(value);
					}
				}]
			}, {
				key: 'vim',
				label: 'VIMS',
			}, {
				key: 'vnfr-connection-point-ref',
				label: 'VNF CONNECTION POINTS',
				type: 'list',
				fields: [{
					key: 'vnfr-connection-point-ref',
					label: 'VNF Connection Point',
					transform: (value) => {
						return (value && (value['vnfr-name'] + ': ' + value['connection-point']));
					}
				}]
			},  {
				key: 'ip-profile-params',
				label: 'IP PROFILE INFO',
				fields: [{
					key: 'ip-profile-params.ip-version',
					label: 'IP VERSION'
				}, {
					key: 'ip-profile-params.subnet-address',
					label: 'SUBNET ADDRESS'
				}, {
					key: 'ip-profile-params.gateway-address',
					label: 'GATEWAY ADDRESS'
				}, {
					key: 'ip-profile-params.security-group',
					label: 'SECURITY GROUP'
				}, {
					key: 'ip-profile-params.subnet-prefix-pool',
					label: 'SUBNET PREFIX POOL'
				}, {
					key: 'ip-profile-params.dns-server',
					label: 'DNS SERVERS',
					type: 'list'
				}, {
					key: 'ip-profile-params.dhcp-params.enabled',
					label: 'ENABLED'
				}, {
					key: 'ip-profile-params.dhcp-params.start-address',
					label: 'START ADDRESS'
				}, {
					key: 'ip-profile-params.dhcp-params.count',
					label: 'COUNT'
				}]
			}]
		};
	}
}

export default Alt.createStore(NSVirtualLinksStore, 'NSVirtualLinksStore');