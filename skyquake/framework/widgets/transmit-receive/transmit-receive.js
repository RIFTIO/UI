
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
var React = require("react");
var MIXINS = require("../mixins/ButtonEventListener.js");




/**
 *  Transmit and Receive Component
 *  It's props values and a brief description below
 *
 *
 *
 **/
module.exports = React.createClass({
  displayName: 'TransmitReceive',
  mixins:MIXINS,
  propTypes: {
    component_data:React.PropTypes.shape({
      incoming:React.PropTypes.shape({
        bytes:React.PropTypes.number,
        packets:React.PropTypes.number,
        label:React.PropTypes.string, 
        "byte-rate":React.PropTypes.number,
        "packet-rate":React.PropTypes.number
      }),
      outgoing:React.PropTypes.shape({
        bytes:React.PropTypes.number,
        packets:React.PropTypes.number,
        label:React.PropTypes.string, 
        "byte-rate":React.PropTypes.number,
        "packet-rate":React.PropTypes.number
      })
    })
  },

  /**
   * Defines default state.
   *

   */
  getInitialState: function() {
  },


  /**
   *  Called when props are changed.  Syncs props with state.
   */
  componentWillReceiveProps: function(nextProps) {

  },

  /**
   * Calls the render on the gauge object once the component first mounts
   */
  componentDidMount: function() {
    this.canvasRender(this.state);
  },

  /**
   * If any of the state variables have changed, the component should update.
   * Note, this is where the render step occures for the gauge object.
   */
  shouldComponentUpdate: function(nextProps, nextState) {

  },

  /**
   * Renders the Gauge Component
   * Returns the canvas element the gauge will be housed in.
   * @returns {*}
   */
  render: function() {
    var gaugeDOM = React.createElement("div", null,
      React.createElement("canvas",
        {className: "rwgauge", style:
          {width:'100%',height:'100%','maxWidth':this.state.width + 'px','maxHeight':'240px'},
          ref:'gaugeDOM'
        }
      )
    )



    return gaugeDOM;
  }
});
