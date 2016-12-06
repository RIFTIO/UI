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
import ReactDOM from 'react-dom';
import '../../../node_modules/loaders.css/src/animations/line-scale-pulse-out-rapid.scss';
import '../styles/LoadingIndicator.scss';

export default class Loader extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let loader = '';
		var style = {
			height: this.props.size + 'rem',
			width: this.props.size * 0.15 + 'rem',
			backgroundColor: this.props.color || 'white'
		}
		if (this.props.show) {
			loader = (
				<div className = {"line-scale-pulse-out-rapid"}>
					<div style={style} ></div>
					<div style={style} ></div>
					<div style={style} ></div>
					<div style={style} ></div>
					<div style={style} ></div>
				</div>
			);
		}
		return loader;
	}
}
Loader.defaultProps = {
	show: true,
	size: '5'
}
