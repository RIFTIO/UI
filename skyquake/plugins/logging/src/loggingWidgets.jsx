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

 // import sass


 // --- ---
// Generalized component classes
// --- ---

class DropList extends React.Component {

  handleOnChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const {className, selectedOption, options, ...props} = this.props;
    return (
      <select className={className} onChange={this.handleOnChange}
       value={selectedOption}>
        {
          options.map(function(op, i) {
            return (
             <option key={i} value={op}>{op}</option>
            );
          })
        }
      </select>
    );
  }
}
DropList.defaultProps = {
  options: [],
  onChange: function(e) {
    console.log("DropList defaultProps onChange called, e=", e);
  }
}

class RadioButtonGroup extends React.Component {

  /**
   * 
   * TODO: Enable option to swap order of radio button and label
   */
  render() {
    const {className, items, selectedItem, radioGroupName, onChange, ...props} = this.props;
    return (
      <div className={className}>
        {
          items.map(function(item, index) {
            return (
              <div key={index} className="radioItem">
                <input type="radio" name={radioGroupName}
                  value={item.value}
                  checked={selectedItem.value == item.value}
                  onChange={onChange} />
                <label>{item.label}</label>
              </div>
            );
          })
        }
      </div>
    );
  }
}

/**
 *
 */
// TODO: support externally defined className(s)
class CardSection extends React.Component {

  render() {
    const {title, children, ...props} = this.props;
    return (
      <div className="cardSection">
        <div className="cardSectionHeader">{title}</div>
        {children}
      </div>
    );
  }
}

module.exports = {
  DropList: DropList,
  RadioButtonGroup: RadioButtonGroup,
  CardSection: CardSection
}
