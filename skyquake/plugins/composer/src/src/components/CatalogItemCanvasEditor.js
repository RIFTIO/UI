
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

import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import DescriptorGraph from '../libraries/graph/DescriptorGraph'
import ComposerAppStore from '../stores/ComposerAppStore'

import '../styles/CatalogItemCanvasEditor.scss'
import '../styles/DescriptorGraph.scss'

const CatalogItemCanvasEditor = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			graph: null
		};
	},
	getDefaultProps() {
		return {
			zoom: 100,
			containers: [],
			isShowingMoreInfo: false
		};
	},
	componentWillMount() {
	},
	componentDidMount() {
		const element = ReactDOM.findDOMNode(this.refs.descriptorGraph);
		const options = {
			zoom: this.props.zoom
		};
		const graph = new DescriptorGraph(element, options);
		graph.containers = this.props.containers;
		this.setState({graph: graph});
	},
	componentDidUpdate() {
		this.state.graph.containers = this.props.containers;
		const isNSD = this.props.containers[0] && this.props.containers[0].uiState.type === 'nsd';
		if (isNSD) {
			this.state.graph.showMoreInfo = this.props.isShowingMoreInfo;
		} else {
			this.state.graph.showMoreInfo = true;
		}
		this.state.graph.update();
	},
	componentWillUnmount() {
		this.state.graph.destroy();
	},
	render() {
		const graph = this.state.graph;
		if (graph) {
			graph.zoom(this.props.zoom);
		}
		return (
			<div data-offset-parent="true" className="CatalogItemCanvasEditor">
				<div key="outline-indicator" data-outline-indicator="true"></div>
				<div id='canvas-dropzone' style={{visibility: 'hidden'}}></div>
				<div ref="descriptorGraph" className="DescriptorGraph"></div>
			</div>
		);
	}
});

export default CatalogItemCanvasEditor;
