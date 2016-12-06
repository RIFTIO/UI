
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
 * Created by kkashalk on 11/10/15.
 */

 // NOTE: THIS FILE HAS BEEN DEPRECATED AND WILL BE REMOVED

'use strict';

import utils from '../libraries/utils'
import React from 'react'
import ClassNames from 'classnames'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import RiftHeaderActions from '../actions/RiftHeaderActions'
import RiftHeaderStore from '../stores/RiftHeaderStore'

import '../styles/RiftHeader.scss'

const uiTransientState = {
	timeoutId: 0
};

const RiftHeader = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return RiftHeaderStore.getState();
	},
	getDefaultProps() {
	},
	componentWillMount() {
	},
	componentDidMount() {
		RiftHeaderStore.listen(this.onChange);
		const loadCatalogs = function () {
			RiftHeaderStore.loadCatalogs();
			uiTransientState.timeoutId = setTimeout(loadCatalogs, 2000);
		};
		RiftHeaderStore.requestLaunchpadConfig();
		loadCatalogs();
	},
	componentDidUpdate() {
	},
	componentWillUnmount() {
		if (uiTransientState.timeoutId) {
			clearTimeout(uiTransientState.timeoutId);
		}
		RiftHeaderStore.unlisten(this.onChange);
	},

	onChange(state) {
		this.setState(state);
	},
	onClickOpenDashboard() {
		if (uiTransientState.timeoutId) {
			clearTimeout(uiTransientState.timeoutId);
		}
		RiftHeaderStore.unlisten(this.onChange);
		window.location.href = '//' + window.location.hostname + ':8000/index.html?api_server=' + utils.getSearchParams(window.location).api_server + '#/launchpad/' + utils.getSearchParams(window.location).mgmt_domain_name;
	},
	onClickOpenAccounts() {
		if (uiTransientState.timeoutId) {
			clearTimeout(uiTransientState.timeoutId);
		}
		RiftHeaderStore.unlisten(this.onChange);
		window.location.href = '//' + window.location.hostname + ':8000/index.html?api_server=' + utils.getSearchParams(window.location).api_server + '#/launchpad/' + utils.getSearchParams(window.location).mgmt_domain_name + '/cloud-account/dashboard';
	},
	render() {
		let Header = (
	              		<header className="header-app">
							<h1>{this.state.headerTitle}</h1>
							<nav className="header-nav"> </nav>
						</header>
					);
		Header = null;
		return (
			null
		);
	}
});

export default RiftHeader;
