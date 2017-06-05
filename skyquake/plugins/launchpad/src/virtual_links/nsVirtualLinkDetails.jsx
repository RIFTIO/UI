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
import RecordViewStore from '../recordViewer/recordViewStore.js';
import Utils from 'utils/utils.js';
import _isArray from 'lodash/isArray';
import './nsVirtualLinks.scss';
import UpTime from 'widgets/uptime/uptime.jsx';
import NSVirtualLinksStore from './nsVirtualLinksStore.js';
import NSVirtualLinksActions from './nsVirtualLinksActions.js';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import TextInput from 'widgets/form_controls/textInput.jsx';

class NsVirtualLinkDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = NSVirtualLinksStore.getState();
	}

	resolvePath = (obj, path) => {
		// supports a.b, a[1] and foo[bar], etc.
		// where obj is ['nope', 'yes', {a: {b: 1}, foo: 2}]
		// then [1] returns 'yes'; [2].a.b returns 1; [2].a[foo] returns 2;
		path = path.split(/[\.\[\]]/).filter(d => d);
		return path.reduce((r, p) => {
			if (r) {
				return r[p];
			}
		}, obj);
	}

	transformValue(field, value) {
		let transformedValue = (field.transform && field.transform(value)) || value;
		if (typeof transformedValue == 'object') {
			transformedValue = JSON.stringify(transformedValue);
		}
		return transformedValue;
	}

	render() {

		let self = this;
		let column = [];
		
		this.state.column.categories.map((category) => {
			let fields = [];

			category.fields && category.fields.map((field) => {
				let value = this.resolvePath(this.props.virtualLink, field.key);
				let textFields = [];

				if (_isArray(value)) {
					value.map((v, idx) => {
						let transformedValue = this.transformValue(field, v);
						textFields.push(
							<TextInput key={field.key + idx} className='value' type='text' value={transformedValue} readonly='true' defaultValue='--' />
						);
					})
				} else {
					let transformedValue = this.transformValue(field, value);
					textFields.push(
						<TextInput key={field.key} className='value' label={field.label} type='text' value={transformedValue} readonly='true' defaultValue='--' />
					);
				}
				fields.push(
					<div key={field.key}>
						{textFields}
					</div>
				);
			});

			column.push(
				<div key={category.key}>
					<h3>
						{category.label}
					</h3>
					{fields}
				</div>
			);
		});

		
		return this.props.virtualLink ? (
			<div className='nsVirtualLinkDetails'>
				<div className='column'>
					{column}
				</div>
			</div>
		) : null
	}
}

export default SkyquakeComponent(NsVirtualLinkDetails);