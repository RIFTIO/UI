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

export default class LaunchpadBreadcrumbs extends React.Component {

  constructor(props) {
    super(props);
    this.current = props.current;
  }
  componentDidMount() {

  }
  componentWillReceiveProps(props) {

  }
  breadcrumbItem(url, name, isCurrent) {
    if (isCurrent) {
      return (<span className="current">{name}</span>);
    } else {
      return (<a href={url} onClick={this.props.clickHandler}>{name}</a>);
    }
  }
  render() {
    let mgmtDomainName = window.location.hash.split('/')[2];
    let nsrId = window.location.hash.split('/')[3];
    let url_base = '#/launchpad/' + mgmtDomainName + '/' + nsrId;
    let html = (
      <div className="header-nav">
        <a href={'#/launchpad/' + mgmtDomainName} onClick={this.props.clickHandler}>DASHBOARD</a>
        <span className="spacer"> > </span>
        {this.breadcrumbItem(url_base+'/detail', 'Viewport', (this.props.current == 'viewport'))}
        <span className="spacer"> | </span>
        {this.breadcrumbItem(url_base+'/topology', 'Topology', (this.props.current == 'topology' ))}
        <span className="spacer"> | </span>
        {this.breadcrumbItem(url_base+'/topologyL2', 'Topology L2', (this.props.current == 'topologyL2' ))}
        <span className="spacer"> | </span>
        {this.breadcrumbItem(url_base+'/topologyL2Vm', 'Topology L2Vm', (this.props.current == 'topologyL2Vm'))}
      </div>
    );
    return html;
  }
}
