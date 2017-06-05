
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
import './crash.scss';
import TreeView from 'react-treeview';
import '../node_modules/react-treeview/react-treeview.css';
import AppHeader from 'widgets/header/header.jsx';
import ScreenLoader from 'widgets/screen-loader/screenLoader.jsx';
var crashActions = require('./crashActions.js');
var crashStore = require('./crashStore.js');
// var MissionControlStore = require('../missioncontrol/missionControlStore.js');
function openDashboard() {
    window.location.hash = "#/";
}
class CrashDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = crashStore.getState();
        crashStore.listen(this.storeListener);
    }
    storeListener = (data) => {
        this.setState({
            isLoading: data.isLoading,
            list: data.crashList,
            noDebug: !this.hasDebugData(data.crashList)
        });
    }
    componentWillUnmount() {
        crashStore.unlisten(this.storeListener);
    }
    componentWillMount() {
        crashStore.get();
    }
    hasDebugData(list) {
        console.log(list);
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                var trace = list[i].backtrace;
                for (let j = 0; j < trace.length; j++) {
                    console.log(trace[j])
                    if (trace[j].detail) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    downloadFile(fileName) {
        // wait till download selected to create text blob
        let urlData = JSON.stringify(this.state.list, null, 2);
        let replacedNewLines = urlData.replace(/\\n/g, '\n');
        let replacedTabs = replacedNewLines.replace(/\\t/g, '\t');
        let replacedQuotes = replacedTabs.replace(/\\"/g, '"');
        let textFileBlob = new Blob([replacedQuotes], { type: 'text/plain;charset=UTF-8' });
        let aLink = document.createElement('a');
        aLink.download = fileName;
        aLink.href = window.URL.createObjectURL(textFileBlob);
        aLink.click(); // suprise, this works without being on the page
        // it seems to cause no problems cleaning up the blob right away
        window.URL.revokeObjectURL(aLink.href);
        // assuming aLink just goes away when this function ends
    }
    render() {
        let html;
        if (this.state != null) {
            if (!this.state.noDebug) {
                let tree = this.state.list && this.state.list.map((node, i) => {
                    const vm = node.name;
                    const vm_label = <span>{vm}</span>;
                    const backtrace = node.backtrace;
                    return (
                        <TreeView key={vm + '|' + i} nodeLabel={vm_label} defaultCollapsed={false}>
                            {backtrace.map(details => {
                                // do some trickery to normalize details 'new line' char(s)
                                let textareaElement = document.createElement("textarea")
                                textareaElement.innerHTML = details.detail;
                                let detailsFormatted = textareaElement.value;
                                let arr = detailsFormatted.split(/\n/);
                                let text = [];
                                for (let i = 0; i < arr.length; i++) {
                                    text.push(arr[i]);
                                    text.push(<br key={'line-' + i} />); // react likes keys on array children
                                }

                                return (
                                    <TreeView nodeLabel={<span>{details.id}</span>} key={vm + '||' + details.id} defaultCollapsed={false}>
                                        <p>{text}</p>
                                    </TreeView>
                                );
                            })}
                        </TreeView>
                    );
                });
                let doDownload = this.downloadFile.bind(this, 'crash.txt');
                html = (
                    <div className="crash-details-wrapper">
                        <div className="form-actions">
                            <button role="button" className="dark" onClick={this.state.noDebug ? false : doDownload}>Download Crash Details</button>
                        </div>
                        <div className="crash-container">
                            <h2> Debug Information </h2>
                            <div className="tree">{tree}</div>
                        </div>
                    </div>
                );
            } else {
                let text = this.state.isLoading ? "Loading Debug Information" : "No Debug Information Available"
                html = (
                    <div className="crash-details-wrapper">
                        <div className="crash-container">
                            <div style={{ 'marginLeft': 'auto', 'marginRight': 'auto', 'width': '230px', 'padding': '90px' }}>{text}</div>
                        </div>
                    </div>
                );
            }
        } else {
            html = <div className="crash-container"></div>
        };
        let refPage = window.sessionStorage.getItem('refPage');
        refPage = JSON.parse(refPage);
        return (
            <div className="crash-app">
                {html}
                <ScreenLoader show={this.state.isLoading}/> 
            </div>
        );
    }
}
export default CrashDetails;
