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
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import './logging.scss';

import Button from 'widgets/button/rw.button.js';
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import ScreenLoader from 'widgets/screen-loader/screenLoader.jsx';

import LoggingActions from './loggingActions.js';
import LoggingStore from './loggingStore.js';
import LoggingNav from './loggingNav.jsx';

import CategorySeverityGrid from './categorySeverityGrid.jsx';
import DenyEventsEditGroup from './denyEventsEditGroup.jsx';
import {DropList, RadioButtonGroup, CardSection } from './loggingWidgets.jsx';

import Crouton from 'react-crouton';
import 'style/common.scss';


class DefaultCategorySeverityPanel extends React.Component {

  render() {
    const {defaultSeverities, severities, ...props } = this.props;
    return (
      <DashboardCard className="defaultCategorySeverityPanel"
        showHeader={true}
        title="Syslog Category Severity">
        <CategorySeverityGrid defaultSeverities={defaultSeverities}
          severityOptions={severities}/>
      </DashboardCard>
    );
  }
}


class LoggingEventsPanel extends React.Component {

  handleChangeAllowDuplicateEvents(e) {
    console.log("LoggingEventsPanel.handleChangeAllowDuplicateEvents:");
    console.log("- e.currentTarget.value=", e.currentTarget.value);
    console.log("- e.currentTarget=", e.currentTarget);

    // NOTE, we may want to generalize our string to boolean convert/compare
    let allowFlag = (e.currentTarget.value == 'true');
    LoggingStore.updateAllowDuplicateEvents(allowFlag);
  }

  handleAddDenyEvent(e) {
    LoggingStore.addDenyEvent(null);
  }

  render() {
    const {allowDuplicateEvents, eventIDs, radioItems, ...props} = this.props;
    let self = this;
    let selectedIndex = allowDuplicateEvents ? 0 :1;

    return (
      <DashboardCard className="loggingEventsPanel"
        showHeader={true}
        title="Events">
        <CardSection title={"Duplicates"}>
          <div className="radioButtonGroupHeader">Allow duplicate events</div>
          <RadioButtonGroup className="radioButtonGroup"
            items={radioItems}
            selectedItem={radioItems[selectedIndex]}
            onChange={this.handleChangeAllowDuplicateEvents}
            radioGroupName="allowDuplicateEvents"
          />
        </CardSection>
        <CardSection title={"Deny"}>
          <DenyEventsEditGroup className="denyEventsEditGroup"
            eventIDs={eventIDs}
            warnInvalidEventID={true}
          />
          <div className="plusButton" onClick={this.handleAddDenyEvent}>
            <span className="oi" data-glyph="plus"
                  title="Add event id" aria-hidden="true"></span>
          </div>
        </CardSection>
      </DashboardCard>
    );
  }
}
LoggingEventsPanel.defaultProps = {
  radioItems: [
    { label: "Allow", value: true },
    { label: "Deny", value: false }
  ],
  allowDuplicateEvents: false,
  eventIDs: []
}

/**
 *
 */
class LoggingGeneralDetailsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      syslogViewerURL: props.syslogViewerURL
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      syslogViewerURL: props.syslogViewerURL
    });
  }

  handleUpdateDetailTextField(fieldName) {
    let self = this;
    return function(e) {
      let state = {};
      state[fieldName] = e.target.value;
      self.setState(state);
    }
  }

  handleUpdateSyslogViewerURL(e) {
    LoggingStore.updateSyslogViewerURL(e.target.value);
  }
  handleOpenSysLogViewerURL(e) {
    e.preventDefault();
    window.open(this.state.syslogViewerURL);
  }

  render() {
    return (
      <DashboardCard className="loggingGeneralDetailsPanel"
        showHeader={true}
        title="SysLog Viewer">
        <div className="section syslogViewerSection">
          <label className="sectionLabel">Syslog Viewer URL</label>
          <div className="syslogViewerControls">
            <input className="textBox" type="text"
              value={this.state.syslogViewerURL}
              onBlur={this.handleUpdateSyslogViewerURL}
              onChange={this.handleUpdateDetailTextField('syslogViewerURL')}
              placeholder="syslogViewer URL"
            />
            <div className="goButton"
              onClick={this.handleOpenSysLogViewerURL.bind(this)}>
              <span>Go</span>
              <span className="oi" data-glyph="arrow-right"
                    title="Add event id" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  }
}
LoggingGeneralDetailsPanel.defaultProps = {
  syslogViewerURL: ""
}



/**
 *  Page level class renders the general logging config page of three panels:
 * 1. Default severity per category
 * 2. Events configuration
 * 3. Syslog viewer setting, launch
 */
export default class LoggingGeneral extends React.Component {

  constructor(props) {
    super(props);
    this.state = LoggingStore.getState();
    LoggingStore.listen(this.storeListener);
    this.state.validateErrorEvent = 0;
    this.state.validateErrorMsg = '';
    this.state.isLoading = true;
    this.state.showDumpStateButton = false;
  }

  storeListener = (state) => {
    this.setState(state);
  }

  getData() {
    LoggingStore.getLoggingConfig();
    this.setState({
      isLoading: _isEmpty(this.state.loggingConfig)
    });
  }
  componentWillUnmount = () => {
    LoggingStore.unlisten(this.storeListener);
  }

  componentDidMount() {
    //console.log("LoggingGeneral.componentDidMount called");
    this.getData();
  }

  componentDidUpdate() {
    //console.log("LoggingGeneral.componentDidUpdate called");
  }

  handleSave = (formData, e) => {
    e.preventDefault();

    if (this.validateData()) {
      this.setState({
        isLoading: true
      });
      LoggingStore.updateLoggingConfig(
         /* this.collectNulledCategories(
            this.state.initialLoggingConfig,
            this.state.loggingConfig),
            this.removeCategoryNulls(
            this.state.loggingConfig */
        this.state.nulledCategories,
        this.cleanupConfig(
          this.state.loggingConfig
        )
      )
    } else {
      console.log("LoggingGeneral.handleSave failed validation");
    }
    this.context.router.push({pathname: ''});
  }
  // removeCategoryNulls(config) {
  //   let cleanConfig = _cloneDeep(config);
  //   let cleanSeverities = [];
  //   config.defaultSeverities.map(function(d) {
  //     if (d.severity) {
  //       cleanSeverities.push(d);
  //     }
  //   });
  //   cleanConfig.defaultSeverities = cleanSeverities;
  //   return cleanConfig;
  // }
  cleanupConfig(config) {
    let cleanConfig = _cloneDeep(config);
    let cleanSeverities = [];
    cleanConfig.defaultSeverities && cleanConfig.defaultSeverities.map((defSev) => {
      if (defSev.severity) {
        cleanSeverities.push(defSev);
      }
    });
    cleanConfig.defaultSeverities = cleanSeverities;

    return cleanConfig;
  }
  // collectNulledCategories(oldCat, newCat) {
  //   let nulledCategories = [];
  //   let newSeverities = newCat.defaultSeverities;
  //   let oldSeverities = oldCat.defaultSeverities;
  //   newSeverities.map(function(c, i) {
  //     if(!c.severity) {
  //       if(oldSeverities[i].severity) {
  //         //verify that categories are the same
  //         if(oldSeverities[i].category == c.category) {
  //           nulledCategories.push({category: c.category})
  //         }
  //       }
  //     }
  //   });
  //   return nulledCategories;
  // }
  validateData() {

    function isEventIdValid(eventID) {
      // Return true if null, empty string or a number, else return false
      if (!eventID || eventID.length == 0) {
        return true;
      } else {
        return (isNaN(+eventID)) ? false : true;
      }
    }

    let invalidEventIDs = [];
    this.state.loggingConfig.denyEventIDs.forEach(
      function(eventID, index) {
        if (!isEventIdValid(eventID)) {
          invalidEventIDs.push({ eventID: eventID, index: index});
        }
      })
    if (invalidEventIDs.length > 0) {
      console.log("invalidEvents = ", invalidEventIDs);
      if (invalidEventIDs.length == 1) {
        let msg = 'There is ' + invalidEventIDs.length + ' invalid event ID';
        this.validateError(msg);
      } else {
        let msg = 'There are ' + invalidEventIDs.length + ' invalid event IDs';
        this.validateError(msg);
      }
      // How should we identify each invalid value?

      return false;
    } else {
      return true;
    }
  }
  handleCancel = (e) => {
    console.log("LoggingGeneral.handleCancel clicked");
    e.preventDefault();
    // TODO: restore original state
    LoggingStore.resetLoggingConfigData();
    this.context.router.push({pathname: ''});

  }

  validateError = (msg) => {
    this.setState({
      validateErrorEvent: true,
      validateErrorMsg: msg
    });
  }
  validateReset = () => {
    this.setState({
      validateErrorEvent: false
    });
  }
  returnCrouton = () => {
    return <Crouton id={Date.now()}
      message={this.state.validateErrorMsg}
      type={'error'}
      hidden={!(this.state.validateErrorEvent && this.state.validateErrorMsg)}
      onDismiss={this.validateReset}
    />;
  }
  preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  renderDumpStateButton() {

  }

  render() {
    var self = this;


    let errorMessage = this.returnCrouton();

    let syslogViewerURL = this.state.loggingConfig.syslogviewer;
    let defaultSeverities = this.state.loggingConfig.defaultSeverities;
    // NOTE: There are modifications to original code here
    // for RIFT-14856 so that default severities map to syslog sink
    
    // Find first syslog sink with (WTF - no type on sinks!) name syslog.
    let syslogSink = this.state.loggingConfig.sinks && _find(this.state.loggingConfig.sinks, {
      name: 'syslog'
    });
    let defaultSyslogSeverities = [];

    this.state.loggingConfig && this.state.loggingConfig.defaultSeverities && this.state.loggingConfig.defaultSeverities.map((defaultSeverity) => {
      // Mapping between default categories and names inside a sink
      let syslogFilterCategory = (syslogSink.filter && syslogSink.filter.category && _find(syslogSink.filter.category, {
        name: defaultSeverity.category
      })) || {
        name: defaultSeverity.category,
        severity: null
      };
      defaultSyslogSeverities.push(syslogFilterCategory);
    });
    let severities = this.state.loggingConfig.severities;
    let allowDuplicateEvents = this.state.loggingConfig.allowDuplicateEvents;
    let denyEventIDs = this.state.loggingConfig.denyEventIDs;

    let dumpStateButton = (
        <button name="dump_state"
            onClick={this.handleDumpState}>Dump State</button>);


    return (
      <div className="app-body">
        {
          (this.state.showLoggingNav) ? <LoggingNav currentPage="General" /> : ''
        }

        <form className="loggingPage loggingGeneral"
          onSubmit={this.preventDefault}>
          {errorMessage}
          <ScreenLoader show={this.state.isLoading}/>
          <div className="panelContainer">
            {/*<DefaultCategorySeverityPanel defaultSeverities={defaultSeverities}
              severities={severities}
              />*/}
            <DefaultCategorySeverityPanel defaultSeverities={defaultSyslogSeverities}
              severities={severities}
              />
            <LoggingEventsPanel allowDuplicateEvents={allowDuplicateEvents}
              eventIDs={denyEventIDs} />
            <LoggingGeneralDetailsPanel syslogViewerURL={syslogViewerURL} />
          </div>
          <div className="loggingPageFooter">
            <div className="loggingformButtonGroup">
              {
                (this.state.showDumpStateButton) ? dumpStateButton : ''
              }
              <Button className="cancel light" label="Reset"
                onClick={this.handleCancel} />
              <Button className="save dark" role="button" label="Save"
                onClick={this.handleSave.bind(this, true)} />
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Dev and debug support
  handleDumpState = (e) => {
    console.log("State dump:");
    console.log("event ids=", this.state.loggingConfig.denyEventIDs);
    console.log("initial state=", this.state.initialLoggingConfig);
    console.log("active state=", this.state.loggingConfig);
  }
}
LoggingGeneral.contextTypes = {
  router: React.PropTypes.object
}
