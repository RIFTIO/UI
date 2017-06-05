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
import './about.scss';
import UpTime from 'widgets/uptime/uptime.jsx';
import AppHeader from 'widgets/header/header.jsx';
var aboutActions = require('./aboutActions.js');
var aboutStore = require('./aboutStore.js');
//var MissionControlStore = require('./missionControlStore.js');
class About extends React.Component {
  constructor(props) {
    super(props)
    var self = this;
    this.state = aboutStore.getState();
    aboutStore.listen(this.listenerUpdate);
    aboutStore.get();
    aboutStore.createTime();
  }
  componentWillUnmount() {
    aboutStore.listen(this.listenerUpdate);
  }
  listenerUpdate = (data) => {
      if (data.aboutList) {
        this.setState({
          list:data.aboutList
        })
      }
      if (data.createTime) {
        // Required cause backend won't provide a create-time
        let createTime = (data.createTime) ? Math.floor((new Date() / 1000)) - parseInt(data.createTime) : null;
        this.setState({
          createTime: createTime
        })
      }
      if (data.descriptorCount) {
        this.setState({
          descriptorCount: data.descriptorCount
        });
      }
    }
  render() {
    let self = this;
    let refPage = window.sessionStorage.getItem('refPage') || '{}';
    refPage = JSON.parse(refPage);

    let mgmtDomainName = window.location.hash.split('/')[2];
    // If in the mission control, create an uptime table;
    var uptime = this.state.createTime && this.state.createTime;

    var fossInfoComponent = (
      <div className="table-container">
        <h2> FOSS Info </h2>
        <table>
          <thead>
            <tr>
              <th>
                <a target="_blank" href='https://open.riftio.com/open-source-software-usage/'>
                  Click here for FOSS Info (requires Internet connection)
                </a>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );

    var uptimeComponent = (
      <div className="table-container">
                  <h2> Uptime Info </h2>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Uptime
                        </th>
                        <th>
                          <UpTime initialTime={uptime} run={true} />
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
    );

    var vcs_info = [];

    for (let i = 0; this.state && this.state.list && i < this.state.list.vcs.components.component_info.length; i++) {
      var node = this.state.list.vcs.components.component_info[i];
      vcs_info.push(
          <tr key={i}>
            <td>
              {node.component_name}
            </td>
            <td>
              {node.component_type}
            </td>
            <td>
              {node.state}
            </td>
          </tr>

        )
    }

    if (this.state != null) {
      var html = (
              <div className="table-container-wrapper">
                {fossInfoComponent}
                {uptimeComponent}
                <div className="table-container">
                  <h2> Version Info </h2>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Build SHA
                        </th>
                        <th>
                          Version
                        </th>
                        <th>
                          Build Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {this.state.list ? this.state.list.version.build_sha : null}
                        </td>
                        <td>
                          {this.state.list ? this.state.list.version.version : null}
                        </td>
                        <td>
                          {this.state.list ? this.state.list.version.build_date : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="table-container">
                  <h2> Component Info </h2>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Component Name
                        </th>
                        <th>
                          Component Type
                        </th>
                        <th>
                          State
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vcs_info}
                    </tbody>
                  </table>
                </div>
              </div>
              );
    } else {
      html = ''
    }
    return (
            <div className="about-container">
              {html}
            </div>
            )
  }
}
export default About;
