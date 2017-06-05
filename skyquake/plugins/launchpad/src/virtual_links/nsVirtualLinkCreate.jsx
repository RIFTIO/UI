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
import React from 'react';
import Utils from 'utils/utils.js';
import './nsVirtualLinks.scss';
import NSVirtualLinkCreateStore from './nsVirtualLinkCreateStore.js';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import TextInput from 'widgets/form_controls/textInput.jsx';
import ScreenLoader from 'widgets/screen-loader/screenLoader.jsx';
import Button from 'widgets/button/rw.button.js';
import SelectOption from 'widgets/form_controls/selectOption.jsx';



class NsVirtualLinkCreate extends React.Component {
	constructor(props) {
		super(props);
	    this.Store = this.props.flux.stores.hasOwnProperty('NSVirtualLinkCreateStore') ? 
				this.props.flux.stores.NSVirtualLinkCreateStore : this.props.flux.createStore(NSVirtualLinkCreateStore, 'NSVirtualLinkCreateStore');
		this.state = this.Store.getState();
		this.Store.listen(this.handleUpdate);
	}

	componentWillMount() {
		(!this.state.nsrId && this.props.nsrId) && this.Store.saveNSRId(this.props.nsrId);
		this.Store.saveMode(this.props.mode);
		this.Store.saveOnSuccess(this.props.onSuccess);
		switch (this.props.mode) {
			case 'creating':
				if (!this.state.vld) {
					this.Store.saveVld({});
				}
				break;
			case 'editing':
				this.Store.saveVld(this.props.vld);
				break;
		}
		if (this.props.nsd && this.props.nsd['constituent-vnfd']) {
			let memberVnfIndexRefs = [];
			let vnfdIdRefs = [];
			this.props.nsd['constituent-vnfd'].map((cVNFD, cVNFDI) => {
				memberVnfIndexRefs.push({
					label: cVNFD['member-vnf-index'],
					value: cVNFD['member-vnf-index']
				});
				vnfdIdRefs.push({
					label: cVNFD['vnfd-id-ref'],
					value: cVNFD['vnfd-id-ref']
				});
			});

			let ipProfileNames = [];
			this.props.nsd['ip-profiles'] && this.props.nsd['ip-profiles'].map((ipProfile, ipProfileIndex) => {
				ipProfileNames.push({
					label: ipProfile['name'],
					value: ipProfile['name']
				});
			})

			this.Store.saveMemberVnfIndexRefs(memberVnfIndexRefs);
			this.Store.saveVnfdIdRefs(vnfdIdRefs);
			this.Store.saveIpProfileNames(ipProfileNames);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps != this.props) {
			if (nextProps.mode != this.props.mode) {
				// mode change
				this.Store.saveMode(nextProps.mode);
				switch (nextProps.mode) {
					case 'creating':
						// switching from editing to creating
						this.Store.saveVld({});
						break;
					case 'editing':
						// switching from creating to editing
						this.Store.saveVld(nextProps.vld);
						break;
				}
			} else {
				// no mode change, but props changed
				switch (nextProps.mode) {
					case 'creating':
						// switching from creating to creating
						// TODO: can't figure out how to empty out without affecting create being erased
						break;
					case 'editing':
						// switching from editing to editing
						if ((nextProps.vld && nextProps.vld.id) != (this.props.vld && this.props.vld.id)) {
							this.Store.saveVld(nextProps.vld);
						}
						break;
				}
			}
		}
	}

	componentWillUnmount() {
		this.Store.saveVld({});
		this.Store.unlisten(this.handleUpdate);
  	}

	handleUpdate = (storeState) => {
		this.setState(storeState);
	}

	handleSubmit = (mode, e) => {
		e.preventDefault();
		this.Store.persistVirtualLink(mode);
	}

	handleCancel = (e) => {
		e.preventDefault();
		this.props.onCancel && this.props.onCancel();
	}

	transformValue(field, value) {
		let transformedValue = (field.transform && field.transform(value)) || value;
		if (typeof transformedValue == 'object') {
			transformedValue = JSON.stringify(transformedValue);
		}
		return transformedValue;
	}

	handleFirstLevelKeyChange = (key, e) => {
		this.Store.updateFirstLevelKey(key, e);
	}

	handleSecondLevelKeyChange = (firstLevelKey, secondLevelKey, e) => {
		this.Store.updateSecondLevelKey(firstLevelKey, secondLevelKey, e);
	}

	handleFirstLevelListKeyChange = (listName, index, keyName, e) => {
		this.Store.updateFirstLevelListKeyChange(listName, index, keyName, e);
	}

	handleAddConnectionPointRef = () => {
		this.Store.addConnectionPointRef();
	}

	handleRemoveConnectionPoint = (vCPRI, e) => {
		this.Store.removeConnectionPointRef(vCPRI);
	}


	updateVLDInitParamsType = (type) => {
		this.Store.updateVLDInitParamsType(type);
	}

	updateVLDInitParamsValue = (currentVLDInitParamsType, e) => {
		this.Store.updateVLDInitParamsValue(currentVLDInitParamsType, e);
	}

	render() {
		let self = this;

		let typeOptions = this.state.typeOptions;
		let overlayTypeOptions = this.state.overlayTypeOptions;
		let currentVLDInitParamsType = this.state.currentVLDInitParamsType;
		let memberVnfIndexRefs = this.state.memberVnfIndexRefs;
		let vnfdIdRefs = this.state.vnfdIdRefs;
		let vnfdConnectionPointRefs = this.state.vnfdConnectionPointRefs;
		let ipProfileNames = this.state.ipProfileNames;

		let connectionPointsHtml = [];

		this.state.vld && this.state.vld['vnfd-connection-point-ref'] && this.state.vld['vnfd-connection-point-ref'].map((vCPR, vCPRI) => {
			connectionPointsHtml.push(
				<li className='vnfd-connection-points-list-item'>
					<div>
						<span>
							VNFD CONNECTION POINT REF - {vCPRI}
						</span>
						<a key={'vnfd-connection-point-delete-' + vCPRI} onClick={this.handleRemoveConnectionPoint.bind(self, vCPRI)} title="Delete">
	                		<span key={'trash-' + vCPRI} className="oi" data-glyph="trash" aria-hidden="true"></span>
	                	</a>
	                </div>
	            	<SelectOption key={'vnfd-connection-point-ref-member-vnfd-index-ref-' + vCPRI} label={'MEMBER VNF INDEX REF'} initial={memberVnfIndexRefs[0].value} options={memberVnfIndexRefs} onChange={this.handleFirstLevelListKeyChange.bind(self, 'vnfd-connection-point-ref', vCPRI, 'member-vnf-index-ref')} defaultValue={this.state.vld['vnfd-connection-point-ref'] && this.state.vld['vnfd-connection-point-ref'][vCPRI] && this.state.vld['vnfd-connection-point-ref'][vCPRI]['member-vnf-index-ref']}/>
	            	<SelectOption key={'vnfd-connection-point-ref-vnfd-id-ref-' + vCPRI} label={'VNFD ID REF'} initial={vnfdIdRefs[0].value} options={vnfdIdRefs} onChange={this.handleFirstLevelListKeyChange.bind(self, 'vnfd-connection-point-ref', vCPRI, 'vnfd-id-ref')} defaultValue={this.state.vld['vnfd-connection-point-ref'] && this.state.vld['vnfd-connection-point-ref'][vCPRI] && this.state.vld['vnfd-connection-point-ref'][vCPRI]['vnfd-id-ref']}/>
	            	<TextInput key={'vnfd-connection-point-ref-vnfd-connection-point-ref-' + vCPRI} label='VNFD CONNECTION POINT REF' className='value' type='text' value={this.state.vld['vnfd-connection-point-ref'] && this.state.vld['vnfd-connection-point-ref'][vCPRI] && this.state.vld['vnfd-connection-point-ref'][vCPRI]['vnfd-connection-point-ref']} onChange={this.handleFirstLevelListKeyChange.bind(self, 'vnfd-connection-point-ref', vCPRI, 'vnfd-connection-point-ref')} />
				</li>
			);
		});

		
		let vldHTML = this.state.vld && (
			<div>
				<h3>DETAILS</h3>
				<TextInput key={'id'} className='value' label={'ID'} type='text' value={this.state.vld.id} onChange={this.handleFirstLevelKeyChange.bind(self, 'id')} readonly={this.state.mode == 'editing' ? true:false} />
				<TextInput key={'name'} className='value' label={'NAME'} type='text' value={this.state.vld.name} onChange={this.handleFirstLevelKeyChange.bind(self, 'name')} />
				<TextInput key={'short-name'} className='value' label={'SHORT NAME'} type='text' value={this.state.vld['short-name']} onChange={this.handleFirstLevelKeyChange.bind(self, 'short-name')} />
				<TextInput key={'vendor'} className='value' label={'VENDOR'} type='text' value={this.state.vld.vendor} onChange={this.handleFirstLevelKeyChange.bind(self, 'vendor')} />
				<TextInput key={'description'} className='value' label={'DESCRIPTION'} type='text' value={this.state.vld.description} onChange={this.handleFirstLevelKeyChange.bind(self, 'description')} />
				<TextInput key={'version'} className='value' label={'VERSION'} type='text' value={this.state.vld.version} onChange={this.handleFirstLevelKeyChange.bind(self, 'version')} />
				<SelectOption label={'TYPE'} initial={typeOptions[0].value} options={typeOptions} onChange={this.handleFirstLevelKeyChange.bind(self, 'type')} defaultValue={this.state.vld['type']} />
				<TextInput key={'root-bandwidth'} className='value' label={'ROOT BANDWIDTH'} type='text' value={this.state.vld['root-bandwidth']} onChange={this.handleFirstLevelKeyChange.bind(self, 'root-bandwidth')} />
				<TextInput key={'leaf-bandwidth'} className='value' label={'LEAF BANDWIDTH'} type='text' value={this.state.vld['leaf-bandwidth']} onChange={this.handleFirstLevelKeyChange.bind(self, 'leaf-bandwidth')} />
				<h3>PROVIDER NETWORK</h3>
				<TextInput key={'physical-network'} className='value' label={'PHYSICAL NETWORK'} type='text' value={this.state.vld['provider-network'] && this.state.vld['provider-network']['physical-network']} onChange={this.handleSecondLevelKeyChange.bind(self, 'provider-network', 'physical-network')} />
				<SelectOption label={'OVERLAY TYPE'} initial={overlayTypeOptions[0].value} options={overlayTypeOptions} onChange={this.handleSecondLevelKeyChange.bind(self, 'provider-network', 'overlay-type')} defaultValue={this.state.vld['provider-network'] && this.state.vld['provider-network']['overlay-type']}/>
				<TextInput key={'segmentation_id'} className='value' label={'SEGMENTATION ID'} type='text' value={this.state.vld['provider-network'] && this.state.vld['provider-network']['segmentation_id']} onChange={this.handleSecondLevelKeyChange.bind(self, 'provider-network', 'segmentation_id')} />
				<h3>VNF CONNECTION POINTS
					<a className="plusButton" onClick={this.handleAddConnectionPointRef}>
		            	<span className="oi" data-glyph="plus"
		            	      title="Add connection point ref" aria-hidden="true"></span>
		        	</a>
				</h3>
		        <ul className='vnfd-connection-points-list'>
					{connectionPointsHtml}
				</ul>
				<h3>INIT PARAMS</h3>
				<div className="inputControls-radioGroup">
					<label className="inputControls-radio">
						<input type="radio" name={'ip-profile-ref'} onChange={this.updateVLDInitParamsType.bind(self, 'ip-profile-ref')} checked={currentVLDInitParamsType == 'ip-profile-ref'} value='ip-profile-ref' />
						IP Profile
					</label>
					<label className="inputControls-radio">
						<input type="radio" name={'vim-network-name'} onChange={this.updateVLDInitParamsType.bind(self, 'vim-network-name')} checked={currentVLDInitParamsType == 'vim-network-name'} value='vim-network-name' />
						VIM Network Name
					</label>
					<label className="inputControls-radio">
						<input type="radio" name={'unknown'} onChange={this.updateVLDInitParamsType.bind(self, 'unknown')} checked={currentVLDInitParamsType == 'unknown'} value='unknown' />
						Unknown
					</label>
				</div>
				{
					(currentVLDInitParamsType == 'unknown') ? 
						null
					:
						(currentVLDInitParamsType == 'vim-network-name') ?
							<TextInput label='NETWORK NAME' onChange={this.updateVLDInitParamsValue.bind(self, currentVLDInitParamsType)} value={this.state.vld[currentVLDInitParamsType]} />
						:
							<SelectOption label={'IP PROFILE NAME'} initial={ipProfileNames[0].value} options={ipProfileNames} onChange={this.updateVLDInitParamsValue.bind(self, currentVLDInitParamsType)} />
				}
			</div>
		);

		return (
			<form className={'createVirtualLink'} onKeyDown={this.evaluateCreateVirtualLink}>
				{vldHTML}
				<div className='buttonGroup'>
					<Button label='Submit' onClick={this.handleSubmit.bind(self, this.state.mode)} className='dark' type='submit' />
					<Button label='Cancel' onClick={this.handleCancel.bind(self)} className='dark' type='reset' />
				</div>
			</form>
		);
	}
}

export default SkyquakeComponent(NsVirtualLinkCreate);