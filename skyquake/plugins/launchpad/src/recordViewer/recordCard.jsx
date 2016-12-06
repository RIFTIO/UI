
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
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import MonitoringParamsCarousel from '../monitoring_params/monitoringParamsCarousel.jsx';
import VnfrCard from '../vnfr/vnfrCard.jsx';
import {LaunchpadCard, LpCardNfviMetrics, EpaParams, NsrPrimitiveJobList} from '../launchpad_card/launchpadCard.jsx';
import VnfrConfigPrimitives from '../launchpad_card/vnfrConfigPrimitives.jsx';
import NsrConfigPrimitives from '../launchpad_card/nsrConfigPrimitives.jsx';
import NsrScalingGroups from '../launchpad_card/nsrScalingGroups.jsx';
import LoadingIndicator from 'widgets/loading-indicator/loadingIndicator.jsx';
import NfviMetricBars from 'widgets/nfvi-metric-bars/nfviMetricBars.jsx';
import ParseMP from '../monitoring_params/monitoringParamComponents.js';
import PlacementGroupsInfo from './placementGroupsInfo.jsx';
import JobListCard from '../launchpad_card/jobListCard.jsx';
import NSVirtualLinks from '../virtual_links/nsVirtualLinks.jsx';
import LaunchpadFleetStore from '../launchpadFleetStore.js';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';


export default class RecordCard extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSelect = (index, last) => {
      // console.log('Selected tab is', index, 'last index is', last);
  }

  openConsole = (url, event) => {
    event.preventDefault();
    LaunchpadFleetStore.getVDUConsoleLink(url);
  }

  render(){
    let self = this;
    let html;
    let content;
    let card;
    let cardData = {};
    let components = [];
    let configPrimitivesProps = {};
    let displayConfigPrimitives = false;
    let configPrimitiveComponent = null;
    let scalingGroupsProps = {};
    let displayScalingGroups = false;
    let scalingGroupComponent = null;
    let consoleUrlsComponent = null;
    let consoleUrlsList = [];

    let displayNSVirtualLinks = false;
    let nsVirtualLinksProps = {};
    let nsVirtualLinksComponent = null;
    let displayVolumesTab = false;
    let volumesHTML = [];
    let tabList = [];
    let tabPanels = [];

    let notice = null;

    switch(this.props.type) {
      case 'vnfr' :
        cardData = this.props.data[0];
        // Disabling config primitives for VNF
        configPrimitivesProps = [cardData];
        displayConfigPrimitives = cardData['service-primitives-present'];
        if (displayConfigPrimitives) {
          configPrimitiveComponent = (
            <div className="flex vnfrConfigPrimitiveContainer">
              <VnfrConfigPrimitives data={configPrimitivesProps} />
            {/* <NsrPrimitiveJobList jobs={cardData['config-agent-job']}/> */}
            <div style={{display:'flex', flexDirection: 'column',     flex: '1 1 40%'}}>
                <div className="launchpadCard_title">
                  JOB LIST
                </div>
                <div className="scrollContainer">
                {
                  //Sort for recent on top
                  this.props.jobData
                  .sort(function(a,b){
                    return parseInt(b['job-id']) - parseInt(a['job-id']);
                  })
                  .map(function(job){
                    //Return only vnfr configs
                    if(job["triggered-by"] == 'vnf-primitive') {
                      return job.vnfr.map(function(v){
                        //That match the currently selected job id
                        if(v.id == cardData.id) {
                          return v.primitive.map(function(p, i) {
                            return <JobListCard type="vnfr" job-id={job['job-id']} cardData={cardData} key={ob['job-id'] + '-' + i} {...p} />
                          })
                        }
                      })
                    }
                  })}
                </div>
              </div>
            </div>
          );
        }

        if (cardData['vdur']) {
          cardData['vdur'].map((vdur, index) => {
            let consoleLink = vdur['console-url'] ? 'Obtain Token And Open VM Console' : 'None';
            consoleUrlsList.push(
              <li key={index}>
                <h3>
                  {vdur['name'] + '-' + vdur.id.substr(0,4)}
                </h3>
                <span className='consoleLink' onClick={self.openConsole.bind(self, vdur["console-url"])}>
                  {consoleLink} *
                </span>
              </li>
            )
            notice = <li className='notice'>* If a separate browser window does not open, please check if the popup was blocked and allow it.</li>
            if(vdur.hasOwnProperty('volumes') && (vdur.volumes.length > 0)) {
              displayVolumesTab = true;
              vdur.volumes.map((volume, vi) => {
                // let html = Prism.highlight(JSON.stringify(volume), Prism.languages.javascript, 'javascript');
                // volumesHTML.push(
                //     <pre className="language-js" key={index + '-' + vi}>
                //       <code dangerouslySetInnerHTML={{__html: html}} />
                //     </pre>
                function buildProperties(obj) {
                  let p = [];
                    _.forEach(obj, function(v, k) {
                    p.push(
                      <div style={{margin: '0.5rem 0.5rem'}} key={k + vi}>
                        <div style={{margin: '0 0.5rem',
    fontWeight: 'bold', textTransform: 'uppercase', color: '#5b5b5b'}}>{k}</div>
                        <div style={{margin: '0 0.5rem'}}>{v.constructor.name != 'Object' ? v : buildProperties(v)}</div>
                      </div>
                    )
                  });
                    return p;
                 }
                volumesHTML.push(
                    <div key={vi}>
                      <div className="launchpadCard_title">
                        VOLUME
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                      {
                        buildProperties(volume)
                      }
                      </div>
                    </div>
                )
              })
            }
          });
          consoleUrlsComponent = (
            <div className="consoleUrlsComponent">
              <ul className="consoleUrlsList">
                {consoleUrlsList}
                {notice}
              </ul>
            </div>
          );
        }
        components = ParseMP.call(this, cardData["monitoring-param"], "vnfr-id");
        break;
      case 'nsr' :
        cardData = this.props.data.nsrs[0];
        configPrimitivesProps = cardData;
        scalingGroupsProps = cardData;
        displayConfigPrimitives = cardData['service-primitive'];
        displayScalingGroups = cardData['scaling-group-descriptor'] ? true : false;
        let sortedJobs = this.props.jobData.sort(function(a,b){
                    return parseInt(b['job-id']) - parseInt(a['job-id']);
                  });
        if (displayConfigPrimitives) {
          configPrimitiveComponent = (
            <div className="flex nsConfigPrimitiveContainer">
              <NsrConfigPrimitives data={configPrimitivesProps} />
              <div style={{display:'flex', flexDirection: 'column',     flex: '1 1 40%'}}>
                <div className="launchpadCard_title">
                  JOB LIST
                </div>
                <div className="scrollContainer">
                  {sortedJobs.map(function(job, i){
                    if(job["triggered-by"] == 'ns-primitive') {
                      return <JobListCard type="nsr" job-id={job['job-id']} cardData={cardData} key={job['job-id'] + '-' + 'nsr'} {...job} />
                    }
                  })
                  .concat(sortedJobs.map(function(job) {
                    if(!job.hasOwnProperty('job-name') && (job["triggered-by"] == 'ns-primitive')) {
                      return job.vnfr.map(function(v, h){
                        //That match the currently selected job id
                        if(v.id == cardData.id) {
                          return v.primitive.map(function(p, i) {
                            return <JobListCard type="vnfr" job-id={job['job-id']} cardData={cardData} key={ob['job-id'] + '-' + 'vnfr' + '-' + h} {...p} />
                          })
                        }
                      })
                    }
                  }))
                }
                </div>
              </div>
            </div>
          );
        }
        if (displayScalingGroups) {
          scalingGroupComponent = (
            <div className="flex nsrScalingGroupContainer">
              <NsrScalingGroups data={scalingGroupsProps} />
            </div>
          );
        }

        // Virtual Links tab content
        displayNSVirtualLinks = true;
        nsVirtualLinksProps = cardData;
        if (displayNSVirtualLinks) {
          nsVirtualLinksComponent = (
            <div className='flex nsVirtualLinksContainer'>
              <NSVirtualLinks data={nsVirtualLinksProps} />
            </div>
          );
        };

        components = ParseMP.call(this, cardData["monitoring-param"], "vnfr-id");
        break;
    }
    let mgmt_interface = cardData["dashboard-url"];
    let mgmtHTML;
    let metricsAndParams = [];


    let nfviMetrics = <LpCardNfviMetrics data={cardData["nfvi-metrics"]} />;
    metricsAndParams.push(<div className="monitoringParams" key="mp">
                          {components.map(function(c, k) {
                            return <div key={k} className="mpSlide">{c.title}{c.component}</div>
                          })}
                          </div>)
    metricsAndParams.push((<div key="nvfi" className="nfvi-metrics">
      { nfviMetrics }
      <EpaParams data={cardData["epa-params"]} />
    </div>))



    if(mgmt_interface) {
      mgmtHTML = <a href={mgmt_interface} target="_blank">Open Application Dashboard</a>;
    }
      if(this.props.isLoading) {
        html = <DashboardCard className="loading" showHeader={true} title={cardData["short-name"]}><LoadingIndicator size={10} show={true} /></DashboardCard>
      } else {
        let glyphValue = (this.props.mmmrecordDetailsToggleValue) ? "chevron-left" : "chevron-right";

        if (this.props.type == 'nsr') {
          tabList.push(
            <Tab key={cardData.id}>NS Data</Tab>
          )
        } else if (this.props.type == 'vnfr') {
          tabList.push(
            <Tab key={cardData.id}>VNF Data</Tab>
          )
        }

        tabPanels.push(
          <TabPanel key={cardData.id + '-panel'}>

              <div className="launchpadCard_title" style={{textAlign:'right'}}><span style={{float:'left'}}>MONITORING PARAMETERS</span>
                {mgmtHTML}
              </div>
              {metricsAndParams}
              <div className="cardSectionFooter">
              </div>
          </TabPanel>
        )


        if (this.props.type == 'nsr') {
          if (scalingGroupComponent) {
            tabList.push(
            <Tab key={cardData.id + '-sg'}>Scaling Groups</Tab>
          );

          tabPanels.push(
              <TabPanel key={cardData.id + '-sg-panel'}>
                  <div>
                    {scalingGroupComponent}
                  </div>
                  <div className="cardSectionFooter">
                  </div>
              </TabPanel>
            );
          }
          if(cardData.hasOwnProperty('vnfd-placement-group-maps')
             || cardData.hasOwnProperty('nsd-placement-group-maps')) {
            tabList.push(
               <Tab key='placement_groups'>
                Placement
               </Tab>
             );
            tabPanels.push(
               <TabPanel key='placement_groups_panel'>
                  <div>
                    <PlacementGroupsInfo nsr={cardData} navRef={this.props.navRef} />
                  </div>
              </TabPanel>
             );
          }
        }

        if (configPrimitiveComponent) {
          let primitivesTabTitle = '';
          if (this.props.type == 'nsr') {
            primitivesTabTitle = 'Service Primitive';
          } else if (this.props.type == 'vnfr') {
            primitivesTabTitle = 'Service Primitive'
          }

          tabList.push(
            <Tab key={cardData.id + '-cp'}>{primitivesTabTitle}</Tab>
          );

          tabPanels.push(
            <TabPanel key={cardData.id + '-cp-panel'}>
              <div className="configPrimitives">
                {configPrimitiveComponent}
              </div>
              <div className="cardSectionFooter">
              </div>
            </TabPanel>
          )
        }

        if (nsVirtualLinksComponent) {
          let nsVirtualLinksTabTitle = 'Virtual Links';
          tabList.push(
              <Tab key={cardData.id + '-nsvl'}>{nsVirtualLinksTabTitle}</Tab>
          );

          tabPanels.push(
            <TabPanel key={cardData.id + '-nsvl-panel'}>
              <div className='nsVirtualLinks'>
                {nsVirtualLinksComponent}
              </div>
              <div className="cardSectionFooter">
              </div>
            </TabPanel>
          );
        }

        if (consoleUrlsComponent) {
          let consoleUrlsTabTitle = '';
          consoleUrlsTabTitle = 'VDU Console Links';

          tabList.push(
            <Tab key={cardData.id + '-cp'}>{consoleUrlsTabTitle}</Tab>
          );

          tabPanels.push(
            <TabPanel key={cardData.id + '-cp-panel'}>
              <div className="consoleUrls">
                {consoleUrlsComponent}
              </div>
              <div className="cardSectionFooter">
              </div>
            </TabPanel>
          )
        }

        if (displayVolumesTab) {

          tabList.push(
            <Tab key={cardData.id + '-volumes'}>Volumes</Tab>
          );

          tabPanels.push(
            <TabPanel key={cardData.id + '-volumes-panel'}>
              {volumesHTML}
              <div className="cardSectionFooter">
              </div>
            </TabPanel>
          )
        }

        html = (
            <DashboardCard className="recordCard" showHeader={true} title={cardData["short-name"]}>
              <a onClick={this.props.recordDetailsToggleFn} className={"recordViewToggle " + (this.props.recordDetailsToggleValue ? "on": null)}><span className="oi" data-glyph={glyphValue} title="Toggle Details Panel" aria-hidden="true"></span></a>
              <Tabs onSelect={this.handleSelect}>
                <TabList>
                    {tabList}
                </TabList>
                {tabPanels}
              </Tabs>
            </DashboardCard>
        );
      }
    return html;
  }
}
RecordCard.defaultProps = {
  type: "default",
  data: {},
  isLoading: true,
  jobData: []
}
