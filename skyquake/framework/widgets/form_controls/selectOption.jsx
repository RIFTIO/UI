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

export default class SelectOption extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  handleOnChange = (e) => {
    this.props.onChange(e);
  }
  render() {
    let html;
    let defaultValue = this.props.defaultValue;
    let options =  this.props.options.map(function(op, i) {
      let value = JSON.stringify(op.value);
      return <option key={i} value={JSON.stringify(op.value)}>{op.label}</option>
    });
    if (this.props.initial) {
      options.unshift(<option key='blank' value={JSON.stringify(this.props.defaultValue)}></option>);
    }
    html = (
        <label>
            {this.props.label}
            <select className={this.props.className} onChange={this.handleOnChange} defaultValue={JSON.stringify(defaultValue)} >
                {
                 options
                }
            </select>
        </label>
    );
    return html;
  }
}
SelectOption.defaultProps = {
  options: [],
  onChange: function(e) {
    console.dir(e)
  },
  defaultValue: false,
  initial: false,
  label: null
}
