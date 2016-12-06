
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

import _ from 'lodash'
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import messages from './messages'
import serializers from '../libraries/model/DescriptorModelSerializer'
import JSONViewer from 'widgets/JSONViewer/JSONViewer';
import PopupWindow from './PopupWindow'
import CatalogItemDetailsEditor from './CatalogItemDetailsEditor'
import SelectionManager from '../libraries/SelectionManager'

import '../styles/DetailsPanel.scss'

const DetailsPanel = React.createClass({
	mixins: [PureRenderMixin, SelectionManager.reactPauseResumeMixin],
	getInitialState() {
		return {};
	},
	getDefaultProps() {
		return {
			containers: [],
			showJSONViewer: false
		};
	},
	componentWillMount() {
	},
	componentDidMount() {
	},
	componentDidUpdate() {
		SelectionManager.refreshOutline();
	},
	componentWillUnmount() {
	},
	render() {
		let json = '{}';
		let bodyComponent =  messages.detailsWelcome();
		const selected = this.props.containers.filter(d => SelectionManager.isSelected(d));
		const selectedContainer = selected[0];
		if (selectedContainer) {
			bodyComponent = <CatalogItemDetailsEditor container={selectedContainer} width={this.props.layout.right} />;
			const edit = _.cloneDeep(selectedContainer.model);
			json = serializers.serialize(edit) || edit;
		}
		const jsonViewerTitle = selectedContainer ? selectedContainer.model.name : 'nothing selected';
		const hasNoCatalogs = this.props.hasNoCatalogs;
		return (
			<div className="DetailsPanel" data-resizable="left" data-resizable-handle-offset="0 5" style={{width: this.props.layout.right}} onClick={event => event.preventDefault()}>
				<div className="DetailsPanelBody">
					{hasNoCatalogs ? null : bodyComponent}
				</div>
				<PopupWindow show={this.props.showJSONViewer} title={jsonViewerTitle}><JSONViewer json={json}/></PopupWindow>
			</div>
		);
	}
});

export default DetailsPanel;
