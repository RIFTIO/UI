
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
 * Created by onvelocity on 11/6/15.
 */
'use strict';

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ClassNames from 'classnames'

const DropTarget = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {isDragHover: false};
	},
	getDefaultProps() {
		return {onDrop: () => {}, dropZone: null, className: 'DropTarget'};
	},
	componentWillMount() {
	},
	componentDidMount() {
		if (this.props.dropZone) {
			const dropTarget = this;
			const dropZone = this.props.dropZone(dropTarget);
			dropZone.on('dragover', this.onDragOver);
			dropZone.on('dragleave', this.onDragLeave);
			dropZone.on('dragend', this.onDragEnd);
			dropZone.on('drop', this.onDrop);
		}
	},
	componentDidUpdate() {
	},
	componentWillUnmount() {
	},
	render() {
		const classNames = ClassNames(this.props.className, 'dnd-target', {'-drag-hover': this.state.isDragHover});
		return (
				<div className={classNames}
					 onDrop={this.onDrop}
					 onDragEnd={this.onDragEnd}
					 onMouseOut={this.onDragEnd}
					 onDragExit={this.onDragEnd}
					 onDragOver={this.onDragOver}
					 onDragLeave={this.onDragLeave}>{this.props.children}</div>
		);
	},
	onDragOver(e) {
		// NOTE calling preventDefault makes this a valid drop target
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		this.setState({isDragHover: true});
	},
	onDragLeave() {
		this.setState({isDragHover: false});
	},
	onDragEnd() {
		this.setState({isDragHover: false});
	},
	onDrop(e) {
		this.setState({isDragHover: false});
		this.props.onDrop(e);
	}
});

export default DropTarget;
