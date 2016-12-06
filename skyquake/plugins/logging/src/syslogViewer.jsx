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
import './logging.scss';
import AppHeader from 'widgets/header/header.jsx';
import LoggingActions from './loggingActions.js';
import LoggingStore from './loggingStore.js';


export default class SyslogViewer extends React.Component {
	constructor(props) {
		super(props);
		/*
		console.log("SyslogViewer.constructor called");
		LoggingStore.listen(this.storeListener);
		this.state = LoggingStore.getState();
		console.log("SyslogViewer state=", this.state);
		*/
	}
	storeListener = (state) => {
		console.log("SyslogViewer.storeListener called. state=", state);
		//this.setState(state);
	}
	componentDidMount() {
		console.log("SyslogViewer.componentDidMount called");
		//LoggingStore.getLogConfig();
	}
	render() {
		console.log("SyslogViewer.render called. state=", this.state);
		//console.log("logConfig JSON=", JSON.stringify(this.state.logConfig));
		//const {sysLogViewerURL, ...props} = this.props;
		//let sysLogViewerURL = this.state.logConfig['syslog-viewer'];
		let sysLogViewerURL = "http://example.com";
 		return (
 			<div>
 				<h1>Syslog Viewer placeholder</h1>
				<div className="logViewerLink">
					<a href={sysLogViewerURL} target="_blank">System Log Viewer</a>
				</div>
 			</div>
 		)
 	}
}