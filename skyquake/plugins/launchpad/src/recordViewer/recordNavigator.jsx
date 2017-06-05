
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
import RecordViewActions from './recordViewActions.js';
import LoadingIndicator from 'widgets/loading-indicator/loadingIndicator.jsx';
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import Utils from 'utils/utils.js';

import './recordNavigator.scss';

export default class RecordNavigator extends React.Component{
  constructor(props) {
    super(props)
  }
  handleImageError = (e) => {
      console.log('Bad logo path, using default');
      e.target.src = require('style/img/catalog-default.svg');
  }

  getDescriptorTypeFromRecordType = (recordType) => {
      if (recordType == 'nsr') {
          return 'nsd';
      } else if (recordType == 'vnfr') {
          return 'vnfd';
      }

      return null;
  }

  render(){
    let navClass = 'catalogItems';

    let self = this;
    let html;
    let className = this.props.isLoading ? 'loading' : '';
    let nav = [];

    this.props.nav.map(function(n, k) {
      let itemClassName = navClass + '_item';
      let catalog_name = (n.type == 'nsr' ? <span>({n.nsd_name})</span> : '');
      let scalingGroupClass = '';
      let scalingGroupTitleClass = '';
      let scalingGroupTitle = '';
      let navObj = [];
      if (n.scalingGroupName) {
        scalingGroupClass = navClass + ' -is-scaled';
        scalingGroupTitleClass = scalingGroupClass + '_title';
        scalingGroupTitle = n.scalingGroupName + '_' + n.scalingGroupInstanceId;
        n.vnfr && n.vnfr.map((vnfr, vnfrIndex) => {
          let iClassName = itemClassName;
          if(vnfr.id == self.props.activeNavID) {
            iClassName += ' -is-selected';
          }
          navObj.push(
            <div key={'id' + k + '-' + vnfr.id}  onClick={self.props.loadRecord.bind(self,vnfr)} className={iClassName}>
              <img
                  onError={self.handleImageError}
                  src={Utils.cleanImageDataURI(vnfr.logo, self.getDescriptorTypeFromRecordType(vnfr.type), vnfr.logoId)}
              />
              <section id={vnfr.id}>
              <h1 title={vnfr.name}>{vnfr.name}</h1>
                <h2>{vnfr.type}</h2>
              </section>
            </div>
          )
        });
      } else {
        if(n.id == self.props.activeNavID) {
          itemClassName += ' -is-selected';
        }
        navObj.push(
          <div key={'id' + k + '-' + n.id}  onClick={self.props.loadRecord.bind(self,n)} className={itemClassName}>
            <img
                onError={self.handleImageError}
                src={Utils.cleanImageDataURI(n.logo, self.getDescriptorTypeFromRecordType(n.type), n.logoId)}
            />
            <section id={n.id}>
            <h1 title={n.name}>{n.name}</h1>
              <h2>{n.type}</h2>
            </section>
          </div>
        );
      }
      nav.push(
        <li className={scalingGroupClass} key={"scalingGroupTile-" + k}>
          <div className={scalingGroupTitleClass}>
            {scalingGroupTitle}
          </div>
          {navObj}
        </li>
      )
    })
    if(this.props.isLoading) {
        html = <DashboardCard className="loading" showHeader={true} title="Loading..."><LoadingIndicator size={10} show={true} /></DashboardCard>
    } else {
        html = (
          <DashboardCard showHeader={true} title="Select Record" className={"recordNavigator" + className}>
            <ul className="catalogItems">
              {
                nav
              }
            </ul>
          </DashboardCard>
        );
    }
    return html;
  }
}
RecordNavigator.defaultProps = {
  nav: []
}


