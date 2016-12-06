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
import './formControls.scss';

import React, {Component} from 'react';

export default class TextInput extends Component {
    render() {
        let {label, onChange, value, defaultValue, ...props} = this.props;
        let inputProperties = {
            value: value,
            onChange: onChange
        }
        let isRequired;
        let inputType;
        if(this.props.required) {
           isRequired = <span className="required">*</span>
        }
        if (defaultValue) {
            inputProperties.defaultValue = defaultValue;
        }
        if (props.pattern) {
            inputProperties.pattern = props.pattern;
        }
        if (value == undefined) {
            value = defaultValue;
        }
        switch(props.type) {
            case 'textarea':
                inputType = <textarea {...inputProperties} value={value}/>

                break;
            default:
                inputType = <input type={props.type} {...inputProperties} placeholder={props.placeholder}/>;
        }
        let html = (
            <label className={"sqTextInput " + props.className} style={props.style}>
              <span> { label } {isRequired}</span>
              {
                !props.readonly ? inputType : <div className="readonly">{value}</div>
              }

            </label>
        );
        return html;
    }
}

TextInput.defaultProps = {
    onChange: function(e) {
        console.log(e.target.value);
    },
    label: '',
    defaultValue: undefined,
    type: 'text',
    readonly: false,
    style:{}

}

