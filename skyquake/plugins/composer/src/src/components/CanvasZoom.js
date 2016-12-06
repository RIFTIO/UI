
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
import Range from './Range'
import numeral from 'numeral'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CanvasEditorActions from '../actions/CanvasEditorActions'
import SelectionManager from '../libraries/SelectionManager'

import '../styles/CanvasZoom.scss'

const CanvasZoom = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState: function () {
		return {};
	},
	getDefaultProps: function () {
		return {
			min: 25,
			max: 200,
			zoom: 100,
			defaultZoom: 100
		};
	},
	componentWillMount: function () {
	},
	componentDidMount: function () {
	},
	componentDidUpdate: function () {
	},
	componentWillUnmount: function () {
	},
	render() {
		const zoom = this.props.zoom || this.props.defaultZoom
		const displayValue = numeral(zoom).format('0.0') + '%';
		return (
			<div ref="canvasZoom" className="CanvasZoom" style={this.props.style} onClick={event => event.preventDefault()}>
				<Range
					   value={zoom} min={this.props.min} max={this.props.max}
					   title="Zoom the canvas. Double Click to reset to 100%."
					   onChange={this.onChange} onDoubleClick={this.onDblClick} />
				<span>{displayValue}</span>
			</div>
		);
	},
	onChange(event) {
		const zoom = event.target.value;
		CanvasEditorActions.setCanvasZoom(zoom);
	},
	onDblClick() {
		const zoom = this.props.defaultZoom;
		CanvasEditorActions.setCanvasZoom(zoom);
	}
});

export default CanvasZoom;
