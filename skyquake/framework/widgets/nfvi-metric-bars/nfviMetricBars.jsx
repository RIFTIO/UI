
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
import './nfviMetricBars.scss';
class MetricChart extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let html;
    let byteSize = 1e+9;
    let utilization = this.props.utilization;
    // let utilization = (1 > this.props.utilization) ? Math.round(this.props.utilization * 100) : this.props.utilization;
    let isVCPU = (this.props.label == "VCPU");
    let label;
    if (isVCPU) {
      label = this.props.total;
    } else {
      var num = this.props.used / byteSize;
      label = Math.round(num * 100) / 100 + ' / ' +  Math.round(this.props.total / byteSize) + 'GB';
    }
    html = (
            <div className="nvfi-metric-container">
              <div className="nfvi-metric-chart">
                <div className="nfvi-metric-chart-value">{utilization}%</div>
                <div className="nfvi-metric-chart-bar" style={{height: utilization + '%'}}></div>
              </div>
              <div className="nfvi-metric-value">{label}</div>
              <div className="nfvi-metric-label">{this.props.label}</div>
            </div>
            );
    return html;
  }
}

class nfviMetrics extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let html;
    let nfviMetrics = this.props.metrics.map(function(metric, k) {
      //Do not display network metrics
      if("outgoing" in metric || "incoming" in metric){
        return
      } else {
        return (<MetricChart key={k} utilization={metric.utilization} label={metric.label} total={metric.total} used={metric.used}/>)
      }
    });
    html = (
      <div className="nfvi-metrics-tray">
        {nfviMetrics}
      </div>
    )
    return html;
  }
}
nfviMetrics.defaultProps = {
  metrics: []
}



export default nfviMetrics;
