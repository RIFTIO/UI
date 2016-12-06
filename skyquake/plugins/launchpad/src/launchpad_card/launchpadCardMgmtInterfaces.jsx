
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
import Loader from 'widgets/loading-indicator/loadingIndicator.jsx';
import LaunchpadFleetStore from '../launchpadFleetStore.js';


export default class managementInterfaces extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {

  }

  openConsole = (url, event) => {
    event.preventDefault();
    LaunchpadFleetStore.getVDUConsoleLink(url);
  }
  render() {
    let self = this;
    let dashboard_html;
    let console_html;
    let isDisplayed = this.props.display;
    let status;
    let notice;
    let applicationDashboards = this.props.interfaces.sort(function(a,b) {
      try {
            if ((a["short-name"] + '-' + a.id.substr(0,4)) > (b["short-name"] + '-' + b.id.substr(0,4))) {
              return 1;
            }
      } catch(e) {
        return 1;
      }
      return -1;
    });

    if(applicationDashboards.length > 0){
      status = applicationDashboards.map(function(i, index) {
        let mgmtLink = i["dashboard-url"] ? i["dashboard-url"] : 'None';
          return (
            <li key={index}><h3>{i["short-name"] + '-' + i.id.substr(0,4)}</h3><a href={i["dashboard-url"]} target="_blank">{mgmtLink}</a></li>
          )
        });
    } else {
      status = <li>No Application Dashboard Links have been specified.</li>
    }
    dashboard_html = (
          <ul>
            {status}
          </ul>
      );

    let consoleLinks = this.props.consoleUrls && this.props.consoleUrls.sort(function(a,b) {
      try {
            if ((a["name"] + '-' + a.id.substr(0,4)) > (b["name"] + '-' + b.id.substr(0,4))) {
              return 1;
            }
      } catch(e) {
        return 1;
      }
      return -1;
    });

    if(consoleLinks && consoleLinks.length > 0){
      status = consoleLinks.map(function(i, index) {
        let consoleLink = i["console-url"] ? 'Obtain Token And Open VM Console' : 'None';
          return (
            <li key={index}><h3>{i["name"] + '-' + i.id.substr(0,4)}</h3><span className='consoleLink' onClick={self.openConsole.bind(self, i["console-url"])}>{consoleLink} *</span></li>
          )
        });
      notice = <li className='notice'>* If a separate browser window does not open, please check if the popup was blocked and allow it.</li>
    } else {
      status = <li>No VDU Console Links have been specified.</li>
    }
    console_html = (
        <ul>
          {status}
          {notice}
        </ul>
    );

    return (
      <div className={this.props.className + (isDisplayed ? '_open':'_close')}>
        <h2>
          Application Dashboard Links
        </h2>
        {dashboard_html}
        <h2>
          VM Console Links
        </h2>
        {console_html}
      </div>);
  }
}

managementInterfaces.defaultProps = {
  display: false,
  interfaces: []
}


