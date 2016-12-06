
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
//THIS SHOULD BE REMOVED ONCE EPA PARAMS ARE MOVED OVER

import React from 'react';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
class LaunchpadNSInfo extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {metrics: props.data};
  }
  render() {
    let metricSet = [];
    let toDisplay;
    this.props.data.map((metric, index)=> {
      if (metric.hasOwnProperty('label') && this.props.name != "NFVI-METRICS") {

      let displayValue = '';
      if (metric.hasOwnProperty('vm')) {
        displayValue = metric.vm + ' ' + metric.unit;
      }
      if (metric.hasOwnProperty('active-vm')) {
        displayValue = metric["active-vm"] + ' of ' + (parseInt(metric["active-vm"]) + parseInt(metric["inactive-vm"])) + ' Active';
      }
      if (metric.hasOwnProperty('used')) {
        displayValue = metric.used.value + ' / ' + metric.total.value + metric.total.unit;
      }

         metricSet.push((
            <li key={index}>
              <dl>
                <dt>{metric.label}:</dt>
                <dd>{displayValue}</dd>
              </dl>
            </li>
          ))
      };
      if(this.props.name == "NFVI-METRICS") {
        toDisplay = <NfviMetricBars metrics={this.props.data} />
      }
    });
        var infoClass = {
      'EPA-PARAM' : {
        height: '300px',
        overflow: 'scroll',
        width: '707px',
      },
      'NFVI-METRICS' : {
        height: '400px'
      }
    }
    // style={infoClass[this.props.name]}
    if (!metricSet.length) {
      let msgString = ''

      //DEMO ONLY
      if(this.props.name == "NFVI-METRICS") {
        toDisplay = <NfviMetricBars metrics={this.props.data} />
      } else {
        toDisplay = (<div className="empty">{ msgString }</div>);
      }
    } else {
      toDisplay = (
        <ul >
          {
            metricSet
          }
        </ul>
      )
    }

    return (
      <div style={{overflow: 'hidden'}}>
        <div className="launchpadCard_title">
          { this.props.name }
        </div>
        <div className={"launchpadCard_data-list" + ' ' + this.props.name}>
          { toDisplay }
        </div>
      </div>
    )
  }
}
LaunchpadNSInfo.propTypes = {
  data: React.PropTypes.array,
  name: React.PropTypes.string
 };
LaunchpadNSInfo.defaultProps = {
  name: 'Loading...',
  data: []
};

export default LaunchpadNSInfo;
