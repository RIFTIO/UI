
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
 * Created by onvelocity on 10/14/15.
 */
'use strict';

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ClassNames from 'classnames'

import ModalOverlayStore from '../stores/ModalOverlayStore'

import '../styles/ModalOverlay.scss'

const ModalOverlay = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return ModalOverlayStore.getState();
	},
	getDefaultProps() {
	},
	componentWillMount() {
		ModalOverlayStore.listen(this.onChange);
	},
	componentDidMount() {
		window.addEventListener('resize', this.onResizeCapture, true);
		window.addEventListener('mousemove', this.onMouseMoveCapture, true);
	},
	componentDidUpdate() {
	},
	componentWillUnmount() {
		ModalOverlayStore.unlisten(this.onChange);
		window.removeEventListener('resize', this.onResize, true);
		window.removeEventListener('mousemove', this.onMouseMoveCapture, true);
	},
	onChange(state) {
		this.setState(state);
	},
	onResizeCapture(event) {
		if (event.detail && event.detail.side) {
			if (this.state.visible) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
	},
	onMouseMoveCapture(event) {
		if (this.state.visible) {
			event.preventDefault();
			event.stopPropagation();
		}
	},
	render() {
		const className = ClassNames('ModalOverlay', {'-is-visible': this.state.visible});
		return (
			<div className={className}>
				<div className="background" onMouseMoveCapture={this.onMouseMoveCapture}></div>
				{this.state.ui ? <div className="foreground" onMouseMoveCapture={this.onMouseMoveCapture}><div className="ui">{this.state.ui}</div></div> : null}
			</div>
		);
	}
});

export default ModalOverlay;
