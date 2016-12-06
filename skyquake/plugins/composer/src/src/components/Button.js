
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
 * Created by onvelocity on 12/1/15.
 */
'use strict';

import guid from '../libraries/guid'
import React from 'react'
import ClassNames from 'classnames'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SelectionManager from '../libraries/SelectionManager'

import '../styles/Button.scss'

const Button = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState: function () {
		return {};
	},
	getDefaultProps: function () {
		return {
			className: '',
			label: null,
			title: null,
			src: null,
			onClick: () => {}
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
		const src = this.props.src;
		const label = this.props.label;
		const title = this.props.title;
		const draggable = this.props.draggable;
		const className = ClassNames(this.props.className, 'Button');
		return (
			<div className={className} onClick={this.props.onClick} title={title} draggable={draggable} onDragStart={this.props.onDragStart}>
				<img src={src} />
				<span>{label}</span>
			</div>
		);
	}
});

export default Button;
