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
import NSVirtualLinkCreateActions from './nsVirtualLinkCreateActions.js';
import NSVirtualLinkCreateSource from './nsVirtualLinkCreateSource.js';
import Alt from '../alt';
import _cloneDeep from 'lodash/cloneDeep';
import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';

class NSVirtualLinkCreateStore {
	constructor() {

		this.vld = null;
		this.typeOptions = [{
			label: 'ELAN',
			value: 'ELAN'
		}];
		this.overlayTypeOptions = [{
			label: 'LOCAL',
			value: 'LOCAL'
		}, {
			label: 'FLAT',
			value: 'FLAT'
		}, {
			label: 'VLAN',
			value: 'VLAN'
		}, {
			label: 'VXLAN',
			value: 'VXLAN'
		}, {
			label: 'GRE',
			value: 'GRE'
		}];

		/* TODO: Move this to be populated from props */
		this.vnfdConnectionPointRefs = [{
			label: 'ping_vnfd/cp0',
			value: 'ping_vnfd/cp0'
		}, {
			label: 'pong_vnfd/cp0',
			value: 'pong_vnfd/cp0'
		}];

		/* end TODO */

		this.vldInitParamsTypes = [
			'vim-network-name',
			'ip-profile-ref',
			'unknown'
		];

		this.currentVLDInitParamsType = 'unknown';
		this.registerAsync(NSVirtualLinkCreateSource);
		this.bindAction(NSVirtualLinkCreateActions.EDIT_VIRTUAL_LINK_ERROR, this.editVirtualLinkError);
		this.bindAction(NSVirtualLinkCreateActions.DELETE_VIRTUAL_LINK_ERROR, this.deleteVirtualLinkError);
		this.bindAction(NSVirtualLinkCreateActions.CREATE_VIRTUAL_LINK_SUCCESS, this.createVirtualLinkSuccess);
		this.bindAction(NSVirtualLinkCreateActions.EDIT_VIRTUAL_LINK_SUCCESS, this.editVirtualLinkSuccess);
		this.bindAction(NSVirtualLinkCreateActions.DELETE_VIRTUAL_LINK_SUCCESS, this.deleteVirtualLinkSuccess);
		this.exportPublicMethods({
            persistVirtualLink: this.persistVirtualLink,
            updateFirstLevelKey: this.updateFirstLevelKey,
            updateSecondLevelKey: this.updateSecondLevelKey,
            updateVLDInitParamsType: this.updateVLDInitParamsType,
            updateVLDInitParamsValue: this.updateVLDInitParamsValue,
            saveNSRId: this.saveNSRId,
            saveVld: this.saveVld,
            addConnectionPointRef: this.addConnectionPointRef,
            removeConnectionPointRef: this.removeConnectionPointRef,
            updateFirstLevelListKeyChange: this.updateFirstLevelListKeyChange,
            saveMemberVnfIndexRefs: this.saveMemberVnfIndexRefs,
            saveVnfdIdRefs: this.saveVnfdIdRefs,
            saveIpProfileNames: this.saveIpProfileNames,
            removeVirtualLink: this.removeVirtualLink,
            saveMode: this.saveMode,
            saveOnSuccess: this.saveOnSuccess
        });
	}

	resetState = () => {
		delete this.vld;
		let vld = {};

		this.setState({

		});
	}

	saveOnSuccess = (onSuccess) => {
		this.setState({
			onSuccess: onSuccess
		})
	}

	saveMode = (mode) => {
		this.setState({
			mode: mode
		})
	}

	saveVnfdIdRefs = (vnfdIdRefs) => {
		this.setState({
			vnfdIdRefs: vnfdIdRefs
		});
	}

	saveMemberVnfIndexRefs = (memberVnfIndexRefs) => {
		this.setState({
			memberVnfIndexRefs: memberVnfIndexRefs
		});
	}

	saveIpProfileNames = (ipProfileNames) => {
		this.setState({
			ipProfileNames: ipProfileNames
		});
	}

	saveNSRId = (nsrId) => {
		this.setState({
			nsrId: nsrId
		})
	}

	saveVld = (vld) => {
		this.setState({
			vld:vld
		})
	}

	updateFirstLevelKey = (key, e) => {
		let vld = _cloneDeep(this.vld);
		let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
		vld[key] = value;
		this.setState({
			vld: vld
		});
	}

	updateSecondLevelKey = (firstLevelKey, secondLevelKey, e) => {
		let vld = _cloneDeep(this.vld);
		if (!vld[firstLevelKey]) {
			vld[firstLevelKey] = {};
		}
		let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
		vld[firstLevelKey][secondLevelKey] = value;
		this.setState({
			vld: vld
		});
	}

	updateVLDInitParamsType = (value) => {
		let vld = this.vld;

		// Reset init param types
		this.vldInitParamsTypes.map((vldInitParamType) => {
			vld[vldInitParamType] && delete vld[vldInitParamType];
		});

		this.setState({
			currentVLDInitParamsType: value,
			vld: vld
		})
	}

	updateVLDInitParamsValue = (currentVLDInitParamsType, e) => {
		let vld = _cloneDeep(this.vld);
		this.vldInitParamsTypes.map((vldInitParamType) => {
			if (currentVLDInitParamsType == vldInitParamType) {
				let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
				vld[currentVLDInitParamsType] = value;
			} else {
				vld[vldInitParamType] && delete vld[vldInitParamType];
			}
		});

		this.setState({
			vld: vld
		})
	}

	updateFirstLevelListKeyChange = (listName, index, keyName, e) => {
		let vld = _cloneDeep(this.vld);
		

		!vld[listName] && (vld[listName] = []);
		!vld[listName][index] && (vld[listName][index] = {});
		vld[listName][index][keyName] = e.target.value;
		
		this.setState({
			vld: vld
		})
	}

	addConnectionPointRef = () => {
		let vld = {};
		if (this.vld) {
			vld = _cloneDeep(this.vld);
			if (!vld['vnfd-connection-point-ref']) {
				vld['vnfd-connection-point-ref'] = [];
			}
			vld['vnfd-connection-point-ref'].push({
				'member-vnf-index-ref': '',
				'vnfd-id-ref': '',
				'vnfd-connection-point-ref': ''
			});

			this.setState({
				vld: vld
			});
		}
	}

	removeConnectionPointRef = (vnfdConnectionPointRefIndex) => {
		let vld = _cloneDeep(this.vld);
		vld['vnfd-connection-point-ref'].splice(vnfdConnectionPointRefIndex, 1);
		this.setState({
			vld: vld
		});
	}

	createVirtualLinkError(data) {
		this.alt.actions.global.showError.defer('Something went wrong while trying to create the virtual link. Check the error logs for more information');
	}

	editVirtualLinkError(data) {
		this.alt.actions.global.showError.defer('Something went wrong while trying to save the virtual link. Check the error logs for more information');
	}

	deleteVirtualLinkError(data) {
		this.alt.actions.global.showError.defer('Something went wrong while trying to delete the virtual link. Check the error logs for more information');
		this.setState({
			deleteState: 'error'
		})
	}

	createVirtualLinkSuccess(data) {
		this.onSuccess();
	}
	editVirtualLinkSuccess(data) {
		this.onSuccess();
	}
	deleteVirtualLinkSuccess(data) {
		this.onSuccess();
	}

	cleanupPayload = (mode, vld) => {
		// Do necessary cleanup here
		let cleanVld = _pickBy(vld, _identity);
		return cleanVld;
	}

	setLoadingState = (state = false) => {
		this.setState({
			isLoading: state
		})
	}

	setLoaded = () => {
		this.setLoadingState(true);
	}

	persistVirtualLink = (mode) => {
		let self = this;

		let payload = this.cleanupPayload(mode, this.vld);

		if (mode == 'creating') {
			this.getInstance().createVirtualLink(this.nsrId, payload);
		} else {
			this.getInstance().editVirtualLink(this.nsrId, this.vld.id, payload);
		}
	}

	removeVirtualLink = (nsrId, vldId) => {
		this.getInstance().deleteVirtualLink(nsrId, vldId);
	}

}

export default NSVirtualLinkCreateStore;