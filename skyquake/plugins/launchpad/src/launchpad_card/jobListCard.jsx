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
import './jobListCard.scss'
import TreeView from 'react-treeview';
import Uptime from 'widgets/uptime/uptime.jsx';
import Modal from 'react-awesome-modal';


class JobListCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.hideParameters = true;
        this.state.modalVisible = false;
    }
    openModal() {
        this.setState({
            modalVisible : true
        });
    }

    closeModal() {
        this.setState({
            modalVisible : false
        });
    }
    getStatusColor(status) {
        let color;
        switch(status) {
            case 'success' : color = 'green'; break;
            case 'failure' : color = 'red'; break;
            default : color = 'yellow'; break;
        }
        return 'jobListCard--status_' + color;
    }
    toggleParametersView(hideParameters) {
        this.setState({
            hideParameters: !hideParameters
        })
    }
    getJobDetails(job) {
        let jobDetails = null;
        if (job['job-status-details']) {
            let jobDetailsArray = job['job-status-details'].split(/\\n/);
            let jobDetailsText = [];
            jobDetailsArray && jobDetailsArray.map((jobDetail) => {
                jobDetailsText.push(jobDetail);
                jobDetailsText.push(<br/>);
            });
            jobDetails = (
                <section className='jobListCard--details'>
                    <h4 onClick={this.openModal.bind(this)}>Job Details</h4>
                    <Modal
                        className='jobListCard--details--modal'
                        visible={this.state.modalVisible}
                        width="600"
                        height="400"
                        effect="fadeInUp">
                        <div className='jobListCard--details--tree'>
                            <TreeView nodeLabel={<span>Job Details</span>} key={'job-details'} defaultCollapsed={false}>
                                <p>{jobDetailsText}</p>
                            </TreeView>
                            <h4 className='jobListCard--details--close' onClick={this.closeModal.bind(this)}>Close</h4>
                        </div>
                    </Modal>
                </section>
            );
        }
        return jobDetails;
    }
    nsrCardHTML(props, key) {
        let self = this;
        let jobListStatus = this.getStatusColor(this.props['job-status']);
        let hideParameters = this.state.hideParameters;
        let parameterList = function(props) {
            return props['parameter'] && props['parameter'].map((p, i) => {
                let k = null;
                if(key) {
                    k = k + '-' + i;
                }
                return (
                    <div key={k || i} className="jobListCard--listitem">
                        <span className="jobListCard--parameter">{p.name}:</span> {p.value}
                    </div>
                );
            });
        }
        let jobDetailsHTML = this.getJobDetails(this.props);
        return (
            <div className="jobListCard">
                <div className="jobListCard--header">
                    <div className="jobListCard--name">
                        {props['job-name']}
                    </div>
                    <div className={"jobListCard--status " + jobListStatus} title={jobListStatus.toUpperCase()}/>
                </div>
                <div className="jobListCard--subtitle">
                    <span>ID: {this.props['job-id']}</span>
                </div>
                <div className="jobListCard--subtitle">
                    <Uptime initialTime={props['create-time']} run={false} /> ago
                </div>
                <div className={"jobListCard--parameters"}>
                    <h4 onClick={self.toggleParametersView.bind(self, hideParameters)}>{hideParameters ? 'Show' : 'Hide'} Parameters</h4>
                    <div className={"jobListCard--list"} style={{display: hideParameters ? 'none' : 'flex'}}>
                        {
                            parameterList(props)
                        }
                        {
                            props.vnfr && props.vnfr.map(function(v) {
                                return v.primitive && v.primitive.map(function(p) {
                                    return parameterList(p, p.name)
                                })
                            })
                        }
                    </div>
                </div>
                {jobDetailsHTML}
            </div>
        )
    }
    vnfrCardHTML(props) {
        let self = this;
        let jobListStatus = this.getStatusColor(props['execution-status'] );
        let hideParameters = this.state.hideParameters;
        return (
            <div className="jobListCard">
                <div className="jobListCard--header">
                    <div className="jobListCard--name">
                        {props.name}
                    </div>
                    <div className={"jobListCard--status " + jobListStatus} title={jobListStatus.toUpperCase()}/>
                </div>
                <div className="jobListCard--subtitle">
                    <span>ID: {props['job-id']}</span>
                </div>
                <div className={"jobListCard--parameters"}>
                    <h4 onClick={self.toggleParametersView.bind(self, hideParameters)}>
                        { hideParameters ? 'Show' : 'Hide' } Parameters
                    </h4>
                    <div style={{display: hideParameters ? 'none' : 'initial'}}>
                        <div className={"jobListCard--list"}>
                            {
                                props['parameter'] && props['parameter'].map((q, k) => {
                                        return (
                                            <div key={k} className="jobListCard--listitem">
                                                <span className="jobListCard--parameter">{q.name}:</span> {q.value}
                                            </div>
                                        );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        let html;
        let card = <div></div>
        if (this.props.type=="nsr") {
            card = this.nsrCardHTML(this.props);
        }
        if (this.props.type=="vnfr") {
            card = this.vnfrCardHTML(this.props);
        }
        return card;
    }
}
export default JobListCard;
