
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

export default class LaunchpadCardCloudAccount extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    let html;
    let isDisplayed = this.props.display;
    let status = [];
    if (this.props.nsr['cloud-account']) {
      status.push(
        (<li key="nsr"><h3>NSR: {this.props.nsr['cloud-account']}</h3></li>)
      )
    }
    this.props.nsr['vnfrs'].map(function(v,i) {
      if(v.hasOwnProperty('cloud-account')) {
        status.push(
          (<li key={i}><h3>VNFR {v['short-name']}: {v['cloud-account']}</h3></li>)
        )
      }
    })
    html = (
          <ul>
            {status}
          </ul>
      )
    return (<div className={this.props.className + (isDisplayed ? '_open':'_close')}><h2>VIM Accounts</h2>{html}</div>);
  }
}

LaunchpadCardCloudAccount.defaultProps = {
  display: false,
  nsr: {}
}


