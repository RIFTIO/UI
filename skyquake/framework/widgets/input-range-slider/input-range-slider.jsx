
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
// import Slider from 'react-rangeslider';
// import Slider from './react-rangeslider.jsx';
import './input-range-slider.scss';


class RWslider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {...props}
  }

  handleChange = (value) => {
    this.props.handleInputUpdate(value);
    this.setState({
      value: value
    });
  };

  render() {
    let state = this.state;
      var className = "input-range-slider_" + this.props.orientation;
    return (
      <div className={className}>
      <div className={className + '-info'}>
      {state["min-value"]}
      </div>
      <Slider
        displayValue={true}
        value={state.value}
        max={state["max-value"]}
        min={state["min-value"]}
        step={state["step-value"]}
        onChange={this.handleChange}
        className={className + '-info'} />
      <div className={className + '-info'}>
      {state["max-value"]}
      </div>
      </div>
    );
  }
}

RWslider.defaultProps = {
    value: 10,
    "min-value": 0,
    "max-value":100,
    "step-value":1,
    "units": "%",
    orientation: "horizontal"
}

export default RWslider

