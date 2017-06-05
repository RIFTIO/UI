
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
 import './vnfrConfigPrimitives.scss';
 import TextInput from 'widgets/form_controls/textInput.jsx';
 import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';

 class VnfrConfigPrimitives extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vnfrs: []
        };
        this.state.execPrimitive = {};
    }

    handleExecuteClick = (configPrimitiveIndex, vnfrIndex, e) => {
        let execute = RecordViewStore.constructAndTriggerVnfConfigPrimitive({
                vnfrs: this.state.vnfrs,
                configPrimitiveIndex: configPrimitiveIndex,
                vnfrIndex: vnfrIndex
        });
        if (!execute) {
            this.props.actions.showNotification('Could not execute service config. Please review your parameters');
        }
    }

    handleParamChange = (paramIndex, configPrimitiveIndex, vnfrIndex, e) => {
        let vnfrs = this.state.vnfrs;
        vnfrs[vnfrIndex]["vnf-configuration"]["config-primitive"][configPrimitiveIndex]["parameter"][paramIndex].value = e.target.value
        this.setState({
            vnfrs: vnfrs
        })
    }

    componentWillReceiveProps(props) {
        if (this.state.vnfrs.length == 0) {
            this.setState({
                vnfrs: props.data
            })
        }
    }

    constructConfigPrimitiveTabs = (tabList, tabPanels) => {
        let mandatoryFieldValue = 'true';
        this.state.vnfrs && this.state.vnfrs.map((vnfr, vnfrIndex) => {
            if (vnfr['vnf-configuration'] && vnfr['vnf-configuration']['config-primitive'] && vnfr['vnf-configuration']['config-primitive'].length > 0) {
                vnfr['vnf-configuration']['config-primitive'].map((configPrimitive, configPrimitiveIndex) => {
                    let params = [];
                    if (configPrimitive['parameter'] && configPrimitive['parameter'].length > 0) {
                        configPrimitive['parameter'].map((param, paramIndex) => {
                            let optionalField = '';
                            let displayField = '';
                            let defaultValue = param['default-value'] || '';
                            let isFieldHidden = (param['hidden'] && param['hidden'] == 'true') || false;
                            let isFieldReadOnly = (param['read-only'] && param['read-only'] == 'true') || false;
                            if (param.mandatory == mandatoryFieldValue) {
                                optionalField = <span className="required">*</span>
                            }
                            if (isFieldReadOnly) {
                                displayField = <div className='readonly'>{param.value || defaultValue}</div>
                            } else {
                                displayField = <TextInput type="text" label={param.name} required={(param.mandatory == mandatoryFieldValue)} className="" type="text" defaultValue={defaultValue} value={param.value} onChange={this.handleParamChange.bind(this, paramIndex, configPrimitiveIndex, vnfrIndex)} />
                            }
                            params.push(
                                <li key={paramIndex}>
                                    {displayField}
                                </li>
                            );
                        });
                    }
                    tabList.push(
                        <Tab key={configPrimitiveIndex}>{configPrimitive.name}</Tab>
                    );

                    tabPanels.push(
                        <TabPanel key={configPrimitiveIndex + '-panel'}>
                            <h4>{configPrimitive.name}</h4>
                            <div className="noticeSubText noticeSubText_right">
                                * required
                            </div>
                            <div>
                                <ul className="parameterGroup">
                                    {params}
                                </ul>
                            </div>
                            <button className="dark" role="button" onClick={this.handleExecuteClick.bind(this, configPrimitiveIndex, vnfrIndex)}>{configPrimitive.name}</button>
                        </TabPanel>
                    )
                });
            }
        });
    }

    render() {

        let tabList = [];
        let tabPanels = [];
        let isConfiguring = (this.props.data['config-status'] && this.props.data['config-status'] != 'configured') || false;
        let displayConfigStatus = isConfiguring ? '(Disabled - Configuring)': '';

        this.constructConfigPrimitiveTabs(tabList, tabPanels);

        return (
            <div className="nsConfigPrimitives vnfrConfigPrimitives">
                <div className="launchpadCard_title">
                  CONFIG-PRIMITIVES {displayConfigStatus}
                </div>
                <div className={isConfiguring ? 'configuring': 'nsConfigPrimitiveTabs'}>
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
export default SkyquakeComponent(VnfrConfigPrimitives);
