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
import NSVirtualLinkCreateStore from './nsVirtualLinkCreateStore.js';
import Button from 'widgets/button/rw.button.js';
import Utils from 'utils/utils.js';
import _find from 'lodash/find';
import './nsVirtualLinks.scss';
import UpTime from 'widgets/uptime/uptime.jsx';
import NSVirtualLinkDetails from './nsVirtualLinkDetails.jsx';
import NSVirtualLinkCreate from './nsVirtualLinkCreate.jsx';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';

class NsVirtualLinks extends React.Component {
	constructor(props) {
		super(props);
	    this.Store = this.props.flux.stores.hasOwnProperty('NSVirtualLinkCreateStore') ? 
				this.props.flux.stores.NSVirtualLinkCreateStore : this.props.flux.createStore(NSVirtualLinkCreateStore, 'NSVirtualLinkCreateStore');
		this.state = {};
		this.state.mode = 'viewing';	// Can be 'viewing'/'creating'/'editing'/'deleting'. Default is 'viewing'
		this.selectedVirtualLink = null;
		this.editingVirtualLink = null;
		this.Store.listen(this.handleUpdate);
	}

	handleUpdate = (storeState) => {
		// all we care about is if delete succeeded
		if (storeState.deleteState == 'success') {
			this.setState({
				mode: 'viewing',
				selectedVirtualLink: this.props.data && this.props.data['decorated-vlrs'] && this.props.data['decorated-vlrs'][0],
				editingVirtualLink: null
			});
		}
	}

	componentWillMount() {
		if (this.state.mode == 'viewing' && !this.state.selectedVirtualLink) {
			this.setState({
				selectedVirtualLink: this.props.data && this.props.data['decorated-vlrs'] && this.props.data['decorated-vlrs'][0]
			});
		}

		if (!this.state.nsd) {
			this.setState({
				nsd: this.props.data.nsd
			});	
		}

		if (!this.state.nsrId) {
			this.setState({
				nsrId: this.props.data.id
			});
		}

	}

	componentWillUnmount() {
		this.Store.unlisten(this.handleUpdate)
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.nsd) {
			this.setState({
				nsd: nextProps.data.nsd
			});	
		}

		if (!this.state.nsrId) {
			this.setState({
				nsrId: nextProps.data.id
			});
		}
	}


	handleCreateVirtualLinkClick = (nsrId, event) => {
		this.setState({
			mode: 'creating'
		});
	}

	resetState = () => {
		let self = this;
		this.setState({
			mode: 'viewing',
			selectedVirtualLink: self.props.data && self.props.data['decorated-vlrs'] && self.props.data['decorated-vlrs'][0],
			editingVirtualLink: null
		})
	}

	handleDeleteVirtualLinkClick = (nsrId, virtualLinkId, event) => {
		let self = this;
		event.preventDefault();
		event.stopPropagation();
		this.Store.removeVirtualLink(nsrId, virtualLinkId);
	}

	handleSelectVirtualLinkClick = (virtualLinkId, event) => {
		this.setState({
			mode: 'viewing',
			selectedVirtualLink: this.props.data && this.props.data['decorated-vlrs'] && _find(this.props.data['decorated-vlrs'], {id: virtualLinkId}),
			editingVirtualLink: null
		});
	}
	handleEditVirtualLinkClick = (nsrId, vlrId, vldId, event) => {
		event.stopPropagation();
		this.setState({
			mode: 'editing',
			editingVirtualLink: this.props.data && this.props.data['nsd'] && this.props.data['nsd']['vld'] && _find(this.props.data['nsd']['vld'], {id: vldId}),
			selectedVirtualLink: this.props.data && this.props.data['decorated-vlrs'] && _find(this.props.data['decorated-vlrs'], {id: vlrId})
		});
	}

	handleCancelCreate = () => {
		this.resetState();
	}

	createVirtualLinksTable = () => {
		let trows = [];

		let nsr = this.props.data && this.props.data;
		let nsd = nsr.nsd && nsr.nsd;

		nsr['decorated-vlrs'] && nsr['decorated-vlrs'].map((vlr, vlrIndex) => {
			let name = vlr.name || 'Undergoing virtual link operation';
			let operationalStatus = vlr['operational-status'];
			let vlrId = vlr['id'];
			let vldId = vlr['vld-ref'];

			let selectedClassName = (!(this.state.mode == 'creating') && ((this.state.selectedVirtualLink && this.state.selectedVirtualLink.id) == vlrId)) ? 'selectedVirtualLink' : ''

			trows.push(
				<tr key={vlrIndex} className={selectedClassName} onClick={this.handleSelectVirtualLinkClick.bind(this, vlrId)}>
					<td>{name}</td>
					<td>{operationalStatus}</td>
					<td>
						<a onClick={this.handleEditVirtualLinkClick.bind(this, this.props.data.id, vlrId, vldId)}>
							<span className="oi" data-glyph="pencil" aria-hidden="true"></span>
						</a>
						<a onClick={this.handleDeleteVirtualLinkClick.bind(this, this.props.data.id, vldId)}>
							<span className="oi" data-glyph="trash" aria-hidden="true"></span>
						</a>
					</td>
				</tr>
			);
		});

		let tbody = (
			<tbody>
				{trows}
			</tbody>
		);

		return (
			<table className="nsVirtualLinksTable">
			    <thead>
			        <tr>
			        	<th style={{width: '50%'}}>Name</th>
			            <th style={{width: '35%'}}>Status</th>
			            <th style={{width: '15%'}}> </th>
			        </tr>
			    </thead>
			    {tbody}
			</table>
		);

		return (
			<div>
				{JSON.stringify(nsd)}
			</div>
		);
	}

	render() {
		let nsVirtualLinksTable = this.createVirtualLinksTable();

		let nsVirtualLinkCreateButton = (
			<Button label='Create Virtual Link' className="dark" isLoading={false} onClick={this.handleCreateVirtualLinkClick.bind(this, this.props.data.id)} />
		);

		let nsVirtualLinkDetails = null;
		if (this.state.mode == 'viewing') {
			nsVirtualLinkDetails = (
				<div className='nsVirtualLinkDetailsWrapper'>
                	<div className="launchpadCard_title" style={{textAlign:'right'}}><span style={{float:'left'}}>VLR DETAILS</span>
					</div>
                	<NSVirtualLinkDetails virtualLink={this.state.selectedVirtualLink} mode={this.state.mode} nsd={this.props.data}/>
                </div>
			);
		} else {
			nsVirtualLinkDetails = (
				<div className='nsVirtualLinkDetailsWrapper'>
                	<div className="launchpadCard_title" style={{textAlign:'right'}}><span style={{float:'left'}}>VLD DETAILS</span>
					</div>
                	{
                		<NSVirtualLinkCreate vld={this.state.editingVirtualLink} mode={this.state.mode} nsd={this.state.nsd} nsrId={this.state.nsrId} onSuccess={this.resetState.bind(this)} onCancel={this.handleCancelCreate}/>
                	}
                </div>
            );
		}

		return (
			<div className='nsVirtualLinks'>
                <div className='nsVirtualLinksListWrapper'>
                	<div className="launchpadCard_title" style={{textAlign:'right'}}><span style={{float:'left'}}>VIRTUAL LINKS</span>
					</div>
                	<div className='nsVirtualLinksTableWrapper'>
                		{nsVirtualLinksTable}
                	</div>
                	<div className='nsVirtualLinksCreateButtonWrapper'>
                		{nsVirtualLinkCreateButton}
                	</div>
                </div>
                {nsVirtualLinkDetails}
            </div>
		);
	}
}
export default SkyquakeComponent(NsVirtualLinks);