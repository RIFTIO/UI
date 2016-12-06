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

 export default class Logging extends React.Component {
 	constructor(props) {
 		super(props);
 		console.log("Logging.constructor called");
 		

 		this.state = LoggingStore.getState();
 		console.log("Logging.constructor: state=", this.state);
 		LoggingStore.listen(this.storeListener);
 		// LoggingStore.get();
 	}

 	storeListener = (state) => {
 		console.log("Logging.storeListener called");
 		this.setState(state);
 	}

 	//handleUpdate(data)
 	// Lifecycle methods
 	// https://facebook.github.io/react/docs/component-specs.html

 	componentWillMount() {
 		console.log("Logging.componentWillMount called");
 	}
 	componentDidMount() {
		console.log("Logging.componentDidMount called");
		//LoggingStore.getSysLogViewerURL();
		LoggingStore.getLoggingConfig();
		//LoggingStore.getLoggingOperational();
 	}

 	// Invoked when a component is receiving new props. This method is not called for the intial render.
 	// use this as an opportunity to react to a prop transition before render() is called
 	componentWillReceiveProps(nextProps) {
 		console.log("Logging.componentWillReceiveProps called");
 		// this.setState({ key: nextProps.value});
 	}

 	// shouldComonentUpdate(nextProps, nextState) {}
 	// Invoked immediately before rendering when new props or state are being received
 	// componentWillUpdate(nextProps, nextState) {}


 	// Invoked immediately after the component's updates are flushed to the DOM.
 	// This method is not called for the initial render.
	// Use this as an opportunity to operate on the DOM when the component has been updated.
 	componentDidUpdate(prevPros, prevState) {

 	}
 	componentWillUnmount() {
 		console.log("Logging.componentWillUnmount called");
 		//LoggingStore.unlisten(this.storeListener);
 	}
 	render() {
 		console.log("Logging.render called");
 		console.log("Logging.state=", JSON.stringify(this.state));
 		var html=(<div><h1>Hello Logging page</h1></div>);
 		if (this.state != null) {
 			html = (
 				<div>
 					<p>Placeholder for logging page</p>
 					<p>alpha</p>
 				</div>
 			);
 		}
 		return (
 			<div className="logging-container">
 				{html}
 			</div>
 		);
 	}

 }