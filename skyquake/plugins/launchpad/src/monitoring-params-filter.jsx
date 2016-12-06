
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

let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var LaunchpadFleetActions = require('./launchpadFleetActions.js');
var LaunchpadFleetStore = require('./launchpadFleetStore.js');

class MPFilter extends React.Component {
  constructor(props) {
    super(props);
    var self = this;
    this.state = LaunchpadFleetStore.getState();
    this.state.slideno = 0;

  }
  componentDidMount() {
}
change(e) {
  var pane = JSON.parse(e.target.value);
  var ret = {no: pane[1], pane:pane, slideChange:this.props.nsrs.length}
  this.setState({slideno:pane[1], dropdownSlide:pane, slideChange: this.state.nsrs.length});
  LaunchpadFleetActions.slideNoStateChange(ret);
}

render () {
    var self = this;
    /////////
    // This code shouldn't be in here. It needs to be placed in an isolated component.
    var drop_down = [];
    var key = [];
    if (self.props.nsrs
        && self.props.nsrs.length > 0
        && self.props.nsrs[0]
         && self.props.nsrs[0]["monitoring-param"]) {
      drop_down.push(<option key={'default'} value={JSON.stringify(['default', -1])}>Monitoring Params</option>)
      for (var j = 0; j < self.props.nsrs.length; j++) {
        var monitoring_params = self.props.nsrs[j]["monitoring-param"];
        checkAndAddKey(monitoring_params);
        for (var i = 0; i < monitoring_params.length; i++) {
          if (key.indexOf(monitoring_params[i]["group-tag"]) == -1) {
            var same = false;
            for (var k = 0; k < drop_down.length; k++) {
              if (monitoring_params[i]["mp-id"] == drop_down[k].key) {
                same = true;
              }
            }
            if (!same) {
              drop_down.push(<option key={monitoring_params[i]["mp-id"]} value={JSON.stringify([monitoring_params[i]["mp-id"], monitoring_params[i]['group-tag'][6] - 1])}>{monitoring_params[i].name}</option>)
              key.push(monitoring_params[i]);
            }
          }
        }
      }
    }
    //
    /////////

    return (
      <div>
          <div
            style={{
              display:'flex',
              justifyContent: 'start',
              flexWrap:'wrap'
            }}
          >
          <h4>CHANGE METRICS</h4>
            <select style={{margin:'0px 0px 14px 15px'}} onChange={this.change.bind(this)} value={JSON.stringify(['default',0])}>{drop_down}</select>
          </div>
        </div>
            )
  }
}
function checkAndAddKey (monitoring_params) {
  monitoring_params.forEach(function(v, i) {
    if(v["mp-id"] == "") {
      v["mp-id"] = v["group-tag"] + "-" + i;
    }
  })
}

export default MPFilter
