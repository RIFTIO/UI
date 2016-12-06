
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
 * Export Selector Dialog component.
 * @module ExportSelectorDialog
 * @author Kiran Kashalkar <kiran.kashalkar@riftio.com>
 */

import React from 'react'

const defaults = {
	catalogItemExportFormats: ['mano', 'rift'],
	catalogItemExportGrammars: ['osm', 'tosca']
};

export default class ExportSelectorDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.state.onCancel = props.onCancel;
		this.state.onDownload = props.onDownload;
		this.state.onSelectGrammar = props.onSelectGrammar;
		this.state.onSelectFormat = props.onSelectFormat;
		this.state.currentlySelectedFormat = props.currentlySelectedFormat;
		this.state.currentlySelectedGrammar = props.currentlySelectedGrammar;
	}

	selectFormat = (format, event) => {
		this.setState({
			currentlySelectedFormat: format
		});
		
		this.state.onSelectFormat.call(this, format);
	}

	selectGrammar = (grammar, event) => {
		this.setState({
			currentlySelectedGrammar: grammar
		});

		this.state.onSelectGrammar.call(this, grammar);
	}

	render () {
		let dialogListElements = [];

		let schemaList = defaults.catalogItemExportFormats.map((format) => {
			let classNames = 'action Button';
			if (format == this.state.currentlySelectedFormat) {
				classNames += ' primary-action';
			} else {
				classNames += ' secondary-action';
			}

			return (
				<li>
					<a className={classNames} onClick={this.selectFormat.bind(this, format)} style={{textTransform: 'uppercase'}}>{format}</a>
				</li>
			);
		});

		let grammarList = defaults.catalogItemExportGrammars.map((grammar) => {
			let classNames = 'action Button';
			if (grammar == this.state.currentlySelectedGrammar) {
				classNames += ' primary-action';
			} else {
				classNames += ' secondary-action';
			}

			return (
				<li>
					<a className={classNames} onClick={this.selectGrammar.bind(this, grammar)} style={{textTransform: 'uppercase'}}>{grammar}</a>
				</li>
			);
		});

		dialogListElements.push(
			<li>
				<ul>
					<li>Select a descriptor schema:</li>
					{schemaList}
				</ul>
				<ul>
					<li>Select a descriptor grammar:</li>
					{grammarList}
				</ul>
			</li>
		);

		dialogListElements.push(
			<li>
				<a className="action Button" onClick={this.state.onCancel} style={{textTransform: 'capitalize', marginTop: '4rem', float: 'right'}}>Cancel</a>
				<a className="action Button" onClick={this.state.onDownload} style={{textTransform: 'capitalize', marginTop: '4rem', float: 'right'}}>Download</a>
			</li>
		);

		return (
			<div className="actions panel">
		 		<div className="panel-header" style={{minWidth: '30rem'}}>
		 			<h1>Export Catalog Item</h1>
		 		</div>
		 		<div className="panel-body">
		 			<ul className="schema-selector">
		 				{dialogListElements}
		 			</ul>
				</div>
			</div>
		);
	}
}