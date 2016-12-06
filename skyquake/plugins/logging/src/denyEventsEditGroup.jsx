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

import LoggingStore from './loggingStore.js';

class DenyEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      eventID: props.eventID
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      eventID: props.eventID
    });
  }

  handleEventIdChange = (e) => {
    //console.log("DenyEvent.handleEventIdChange called. value=", e.target.value);
    // TODO: Save only if value is valid

    this.setState({
      eventID: e.target.value
    });
  }

  isEventIdValid(eventID) {
    // Return true if null, empty string or a number, else return false
    if (!eventID || eventID.length == 0) {
      return true;
    } else {
      return (isNaN(+eventID)) ? false : true;
    }
  }

  render() {
    const {className, onSave, onRemove, warnInvalidEventID, inputPattern,
      ...props} = this.props;
    let textBoxClassNames = "textBox";
    if (warnInvalidEventID && !this.isEventIdValid(this.state.eventID)) {
      //console.log("eventID is not valid: ", this.state.eventID);
      textBoxClassNames += " invalidValue";
    }
    return (
      <div className={className} >
        <input className={textBoxClassNames} type="text"
        value={this.state.eventID}
        pattern={inputPattern}
        onBlur={onSave}
        onChange={this.handleEventIdChange.bind(this)}
        placeholder="Event ID"
        />
        <div className="removeButton"
          onClick={onRemove}>
          <span className="oi" data-glyph="minus"
          title="Remove event id" aria-hidden="true"></span>
        </div>
      </div>
    );  
  }
}
DenyEvent.defaultProps = {
  eventID: "",
  warnInvalidEventID: true,
  inputPattern: "^\\d*$"
}


export default class DenyEventsEditGroup extends React.Component {

  handleUpdateEvent = (index) => {
    let enforceEventIdRules = this.props.enforceEventIdRules;
    return function(e) {
      if (e.target.value && e.target.value.trim().length > 0) {
        if (enforceEventIdRules) {
          console.log("attempting to set eventID[] to ", e.target.value)
          let value = +e.target.value;
          // long form:
          //let value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            LoggingStore.updateDenyEvent(index, value);
          } else {
            // Error. Show input error on screen
          }
        } else {
          LoggingStore.updateDenyEvent(index, e.target.value);
        }

        
      } else if (!e.target.value || e.target.value.trim().length == 0) {
        LoggingStore.updateDenyEvent(index, null);
      }
    }
  }

  handleRemoveEvent(index) {
    return function(e) {
      //console.log("handleRemoveEvent called for eventID: ", eventID);
      LoggingStore.removeDenyEvent(index);
    }
  }

  render() {
    let self = this;
    const {className, eventIDs, warnInvalidEventID, ...props} = this.props;
    let newRow = null;

    return (
      <div className={className}>
        {
          eventIDs.map(function(eventID, index) {
            return (<DenyEvent className="eventEditRow"
              key={index}
              eventID={eventID}
              index={index}
              onRemove={self.handleRemoveEvent(index)}
              onSave={self.handleUpdateEvent(index)}
              warnInvalidEventID={warnInvalidEventID}
              />);
          })
        }
      </div>
    );
  }
}
DenyEventsEditGroup.defaultProps = {
  eventIDs: [],
  enforceEventIdRules: false,
  warnInvalidEventID: false
}
