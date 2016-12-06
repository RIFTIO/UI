
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
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import MonitoringParamsCarousel from '../monitoring_params/monitoringParamsCarousel.jsx';
import './vnfrCard.scss';
import VnfrCardNfviMetrics from './vnfrCardNfviMetrics.jsx';
class VnfrCard extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let html;
    let monitoring_params = <MonitoringParamsCarousel component_list={this.props.data["monitoring-param"]} slideno={this.props.slideno}/>;
    let nfviMetrics = this.props.data["nfvi-metrics"] ? <VnfrCardNfviMetrics metrics={this.props.data["nfvi-metrics"]} /> : <div style={{textAlign:'center', paddingTop:'2rem'}}>No NFVI Metrics Configured</div>;
    console.log(this.props.data)
    html = (
      <DashboardCard className="VNFRcard" showHeader={true} title={this.props.data["short-name"]}>
        {monitoring_params}
        {nfviMetrics}
      </DashboardCard>
    )
    return html;
  }
}

export default VnfrCard;
