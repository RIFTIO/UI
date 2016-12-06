
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
import RecordViewStore from '../recordViewer/recordViewStore.js';
import Button from 'widgets/button/rw.button.js';
import './nsConfigPrimitives.scss';
import TextInput from 'widgets/form_controls/textInput.jsx';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';

class NsrConfigPrimitives extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.vnfrMap = null;
        this.state.nsConfigPrimitives = null;
    }

    componentWillReceiveProps(props) {
        let vnfrs = props.data['vnfrs'];
        let vnfrMap = {};
        let nsConfigPrimitives = [];
        let vnfList = [];
        if (vnfrs &&  !this.state.nsConfigPrimitives) {
            vnfrs.map((vnfr) => {
                let vnfrConfigPrimitive = {};
                vnfrConfigPrimitive.name = vnfr['short-name'];
                vnfrConfigPrimitive['vnfr-id-ref'] = vnfr['id'];
                //input references
                let configPrimitives = vnfr['vnf-configuration']['service-primitive'];
                //input references by key
                let vnfrConfigPrimitives = {}

                if (configPrimitives) {
                    let vnfPrimitiveList = [];
                    configPrimitives.map((configPrimitive) => {
                        vnfrConfigPrimitives[configPrimitive.name] = configPrimitive;
                        vnfPrimitiveList.push({
                            name: configPrimitive.name,
                            parameter: configPrimitive.parameter
                        })
                    });
                    vnfrConfigPrimitive['service-primitives'] = vnfrConfigPrimitives;
                    vnfrMap[vnfr['member-vnf-index-ref']] = vnfrConfigPrimitive;
                }
            });
            //nsr service-primitives
            props.data['service-primitive'] && props.data['service-primitive'].map((nsConfigPrimitive, nsConfigPrimitiveIndex) => {
                 //Add optional field to group. Necessary for driving state.
                let optionalizedNsConfigPrimitiveGroup = nsConfigPrimitive['parameter-group'] && nsConfigPrimitive['parameter-group'].map((parameterGroup)=>{
                    if(parameterGroup && parameterGroup.mandatory != "true") {
                        parameterGroup.optionalChecked = true;
                    };
                    return parameterGroup;
                });
                let nscp = {
                    name: nsConfigPrimitive.name,
                    'nsr_id_ref': props.data.id,
                    'parameter': nsConfigPrimitive.parameter,
                    'parameter-group': optionalizedNsConfigPrimitiveGroup,
                    'vnf-primitive-group':[]
                }

                nsConfigPrimitive['vnf-primitive-group'] && nsConfigPrimitive['vnf-primitive-group'].map((vnfPrimitiveGroup, vnfPrimitiveGroupIndex) => {
                    let vnfMap = vnfrMap[vnfPrimitiveGroup['member-vnf-index-ref']];
                    let vnfGroup = {};
                    vnfGroup.name = vnfMap.name;
                    vnfGroup['member-vnf-index-ref'] = vnfPrimitiveGroup['member-vnf-index-ref'];
                    vnfGroup['vnfr-id-ref'] = vnfMap['vnfr-id-ref'];
                    vnfGroup.inputs = [];
                    vnfPrimitiveGroup.primitive.map((primitive, primitiveIndex) => {
                        console.log(primitive);
                        primitive.index = primitiveIndex;
                        primitive.parameter = [];
                        vnfMap['service-primitives'][primitive.name].parameter.map(function(p) {
                            p.index = primitiveIndex;
                            let paramCopy = p;
                            paramCopy.value = undefined;
                            primitive.parameter.push(paramCopy);
                        });
                        vnfGroup.inputs.push(primitive);
                    });
                    nscp['vnf-primitive-group'].push(vnfGroup);
                });
                nsConfigPrimitives.push(nscp);
            });
            this.setState({
                vnfrMap: vnfrMap,
                data: props.data,
                nsConfigPrimitives: nsConfigPrimitives
            });
        }
    }

    handleParamChange = (parameterIndex, vnfPrimitiveIndex, vnfListIndex, nsConfigPrimitiveIndex, event) => {
        let nsConfigPrimitives = this.state.nsConfigPrimitives;
        nsConfigPrimitives[nsConfigPrimitiveIndex]['vnf-primitive-group'][vnfListIndex]['inputs'][vnfPrimitiveIndex]['parameter'][parameterIndex]['value'] = event.target.value;
        this.setState({
            nsConfigPrimitives: nsConfigPrimitives
        });
    }

    handleNsParamChange = (parameterIndex, nsConfigPrimitiveIndex, event) => {
        let nsConfigPrimitives = this.state.nsConfigPrimitives;
        nsConfigPrimitives[nsConfigPrimitiveIndex]['parameter'][parameterIndex]['value'] = event.target.value;
        this.setState({
            nsConfigPrimitives: nsConfigPrimitives
        });
    }

    handleNsParamGroupParamChange = (parameterIndex, parameterGroupIndex, nsConfigPrimitiveIndex, event) => {
        let nsConfigPrimitives = this.state.nsConfigPrimitives;
        nsConfigPrimitives[nsConfigPrimitiveIndex]['parameter-group'][parameterGroupIndex]['parameter'][parameterIndex]['value'] = event.target.value;
        this.setState({
            nsConfigPrimitives: nsConfigPrimitives
        });
    }

    handleExecuteClick = (nsConfigPrimitiveIndex, event) => {
        var isValid = RecordViewStore.validateInputs({
            nsConfigPrimitives: this.state.nsConfigPrimitives,
            nsConfigPrimitiveIndex: nsConfigPrimitiveIndex
        });
        if(isValid) {
            RecordViewStore.constructAndTriggerNsConfigPrimitive({
                nsConfigPrimitives: this.state.nsConfigPrimitives,
                nsConfigPrimitiveIndex: nsConfigPrimitiveIndex
             });
            //Need a better way to reset
            //Reset disabled per TEF request
            // this.setState({
            //     nsConfigPrimitives: null
            // })
        } else {
                this.props.actions.showNotification('Could not execute service config. Please review your parameters');
        }
    }
    handleOptionalCheck = (parameterGroupIndex, nsConfigPrimitiveIndex, event) => {
        let nsConfigPrimitives = this.state.nsConfigPrimitives;
        let optionalChecked = nsConfigPrimitives[nsConfigPrimitiveIndex]['parameter-group'][parameterGroupIndex].optionalChecked;
        nsConfigPrimitives[nsConfigPrimitiveIndex]['parameter-group'][parameterGroupIndex].optionalChecked = !optionalChecked;
        console.log(nsConfigPrimitives)
        this.setState({
            nsConfigPrimitives: nsConfigPrimitives
        });
    }
    constructConfigPrimitiveTabs = (tabList, tabPanels) => {
        let self = this;
        let defaultFromRpc = '';
        //coded here for dev purposes
        let mandatoryFieldValue = 'true';
        if (self.state.vnfrMap) {
            this.state.nsConfigPrimitives && this.state.nsConfigPrimitives.map((nsConfigPrimitive, nsConfigPrimitiveIndex) => {
                tabList.push(
                    <Tab key={nsConfigPrimitiveIndex}>{nsConfigPrimitive.name}</Tab>
                );
                tabPanels.push(
                    (
                        <TabPanel key={nsConfigPrimitiveIndex + '-panel'}>
                            <h4>{nsConfigPrimitive.name}</h4>
                            <div className="noticeSubText noticeSubText_right">
                                * required
                            </div>
                            {nsConfigPrimitive['parameter'] && nsConfigPrimitive['parameter'].map((parameter, parameterIndex) => {
                                let optionalField = '';
                                let displayField = '';
								let defaultValue = parameter['default-value'] || '';
                                let isFieldHidden = (parameter['hidden'] && parameter['hidden'] == 'true') || false;
                                let isFieldReadOnly = (parameter['read-only'] && parameter['read-only'] == 'true') || false;
                                if (parameter.mandatory == mandatoryFieldValue) {
                                    optionalField = <span className="required">*</span>
                                }
                                if (isFieldReadOnly) {
                                    displayField = (
                                        <label data-required={(parameter.mandatory == mandatoryFieldValue)}>
                                            {parameter.name}
                                            <div className='readonly'>
                                                {parameter.value || defaultValue}
                                            </div>
                                        </label>
                                    )
                                } else {
                                    displayField = <TextInput label={parameter.name} required={(parameter.mandatory == mandatoryFieldValue)} className="" type="text" defaultValue={defaultValue} value={parameter.value} onChange={this.handleNsParamChange.bind(this, parameterIndex, nsConfigPrimitiveIndex)} />;
                                }
                                return (
                                    <div key={parameterIndex} className="nsConfigPrimitiveParameters" style={{display: isFieldHidden ? 'none':'inherit'}}>
                                        <ul>
                                        {
                                            <li key={parameterIndex} className="">
                                                    {displayField}
                                            </li>
                                        }
                                        </ul>
                                    </div>
                                )
                            })}
                            {nsConfigPrimitive['parameter-group'] && nsConfigPrimitive['parameter-group'].map((parameterGroup, parameterGroupIndex) => {
                                let optionalField = '';
                                let overlayGroup = null;
                                let isOptionalGroup = parameterGroup.mandatory != mandatoryFieldValue;
                                let optionalChecked = parameterGroup.optionalChecked;
                                let inputIsDiabled = (!optionalChecked && isOptionalGroup);
                                if (isOptionalGroup) {
                                    optionalField = <input type="checkbox" name="" checked={optionalChecked} onChange={self.handleOptionalCheck.bind(null, parameterGroupIndex, nsConfigPrimitiveIndex)} />;
                                    // overlayGroup = <div className="configGroupOverlay"></div>
                                }
                                return (
                                    <div key={parameterGroupIndex} className="nsConfigPrimitiveParameterGroupParameters">
                                    <h2>{parameterGroup.name} {optionalField}</h2>
                                    <div className="parameterGroup">
                                        {overlayGroup}
                                        <ul className="">
                                                <li className="">

                                                    {parameterGroup['parameter'] && parameterGroup['parameter'].map((parameter, parameterIndex) => {
                                                        let optionalField = '';
                                                        let displayField = '';
                                                        let defaultValue = parameter['default-value'] || '';
                                                        let isFieldHidden = (parameter['hidden'] && parameter['hidden'] == 'true') || false;
                                                        let isFieldReadOnly = (parameter['read-only'] && parameter['read-only'] == 'true') || false;
                                                        if (parameter.mandatory == mandatoryFieldValue) {
                                                            optionalField = <span className="required">*</span>
                                                        }
                                                        if (isFieldReadOnly) {
                                                            displayField = <div className='readonly'>{parameter.value || defaultValue}</div>
                                                        } else {
                                                            displayField = <input required={(parameter.mandatory == mandatoryFieldValue)} className="" disabled={inputIsDiabled} type="text" defaultValue={defaultValue} value={parameter.value} onChange={this.handleNsParamGroupParamChange.bind(this, parameterIndex, parameterGroupIndex, nsConfigPrimitiveIndex)} />
                                                        }
                                                        if (parameter.mandatory == mandatoryFieldValue) {
                                                            optionalField = <span className="required">*</span>
                                                        }
                                                        return (
                                                            <div key={parameterIndex} className="nsConfigPrimitiveParameters" style={{display: isFieldHidden ? 'none':'inherit'}}>
                                                                <ul>
                                                                {
                                                                    <li key={parameterIndex} className="">
                                                                        <label className={inputIsDiabled && 'disabled'} data-required={(parameter.mandatory == mandatoryFieldValue)}>
                                                                            {parameter.name}
                                                                            {displayField}
                                                                        </label>

                                                                    </li>
                                                                }
                                                                </ul>
                                                            </div>
                                                        )
                                                    })}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                            {nsConfigPrimitive['vnf-primitive-group'] && nsConfigPrimitive['vnf-primitive-group'].map((vnfGroup, vnfGroupIndex) => {
                                return (
                                    <div key={vnfGroupIndex} className="vnfParamGroup">
                                        <h2>{vnfGroup.name}</h2>

                                            {vnfGroup.inputs.map((inputGroup, inputGroupIndex) => {
                                                return (
                                                    <div key={inputGroupIndex}>
                                                        <h3>{inputGroup.name}</h3>
                                                        <ul className="parameterGroup">
                                                        {
                                                            inputGroup.parameter.map((input, inputIndex) => {
                                                                let optionalField = '';
                                                                let displayField = '';
																let defaultValue = input['default-value'] || '';
                                                                let isFieldHidden = (input['hidden'] && input['hidden'] == 'true') || false;
                                                                let isFieldReadOnly = (input['read-only'] && input['read-only'] == 'true') || false;
                                                                if (input.mandatory == mandatoryFieldValue) {
                                                                    optionalField = <span className="required">*</span>
                                                                }
                                                                if (isFieldReadOnly) {
                                                                    displayField = <div className='readonly'>{input.value || defaultValue}</div>
                                                                } else {
                                                                    displayField = <TextInput label={input.name} type="text" required={(input.mandatory == mandatoryFieldValue)} className="" type="text" defaultValue={defaultValue} value={input.value} onChange={this.handleParamChange.bind(this, inputIndex, inputGroupIndex, vnfGroupIndex, nsConfigPrimitiveIndex)}/>
                                                                }
                                                                return (
                                                                    <li key={inputIndex} style={{display: isFieldHidden ? 'none':'inherit'}}>
                                                                        {displayField}
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                        </ul>
                                                    </div>
                                                )
                                            })}

                                    </div>
                                )
                            })}
                            <Button label="Submit" isLoading={this.state.isSaving} onClick={this.handleExecuteClick.bind(this, nsConfigPrimitiveIndex)} className="dark"/>
                        </TabPanel>
                    )
                );
            });
        }
    }

    handleSelect = (index, last) => {
        // console.log('Selected tab is', index, 'last index is', last);
    }
    render() {

        let tabList = [];
        let tabPanels = [];
        let isConfiguring = (this.props.data['config-status'] && this.props.data['config-status'] != 'configured') || false;
        let displayConfigStatus = isConfiguring ? '(Disabled - Configuring)': '';

        this.constructConfigPrimitiveTabs(tabList, tabPanels);

        return (
            <div className="nsConfigPrimitives">
                <div className="launchpadCard_title">
                  SERVICE-PRIMITIVES {displayConfigStatus}
                </div>
                <div className={isConfiguring ? 'configuring': '' + 'nsConfigPrimitiveTabs'}>
                    <Tabs onSelect={this.handleSelect}>
                        <TabList>
                            {tabList}
                        </TabList>
                        {tabPanels}
                    </Tabs>
                </div>
            </div>

        );
    }
}


function deepCopy (toCopy, copyObj) {
    for (let k in toCopy) {
        switch (toCopy[k].constructor.name) {
            case "String":
                copyObj[k] = toCopy[k];
                break;
            case "Array":
                copyObj[k] = [];
                toCopy[k].map((v) => {
                    copyObj[k].push(v)
                });
                break;
            case "Object":
                deepCopy(toCopy[k], copyObj[k]);
                break;
            default:
                copyObj[k] = toCopy[k]
        }
    }
    return copyObj;
}
export default SkyquakeComponent(NsrConfigPrimitives);
