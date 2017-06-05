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
import React, {Component} from 'react';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import {Panel, PanelWrapper} from 'widgets/panel/panel';
import InstantiateDescriptorPanel from './instantiateDescriptorPanel.jsx';
import InstantiateInputParams from './instantiateInputParams.jsx';
class Instantiate extends Component {
    constructor(props) {
    super(props);
  }
    handleSelectVNFConfigAgent = (vnfid) => {
        let self = this;
        return function(e) {
          let configAgentRef = JSON.parse(e.target.value);
          self.Store.updateSelectedVNFConfigAgent(vnfid, configAgentRef);
        }
    }
  render(){
    //temporary
    let selectedNSD = {};
    let self = this;
    this.props.nsd[0] && this.props.nsd[0].descriptors && this.props.nsd[0].descriptors.map(function(d) {
        if(self.props.params.nsd == d.id) {
            selectedNSD = d;
        }
    });
    return (
            <PanelWrapper>
            <InstantiateDescriptorPanel descriptor={selectedNSD} />
            <Panel title="Input Parameters">
                <InstantiateInputParams

                    nsFn={this.props.nsFn()}
                    vnfFn={this.props.vnfFn()}
                    vldFn={this.props.vldFn()}
                    ipProfileFn={this.props.ipProfileFn()}
                    dnsFn={this.props.dnsFn()}
                    usersFn={this.props.usersFn()}
                    sshFn={this.props.sshFn()}
                    updateName={this.props.nameUpdated}
                    updateInputParam={this.props.updateInputParam}

                    nsd={selectedNSD}
                    selectedNSDid={this.props.selectedNSDid}
                    name={this.props.name}

                    cloudAccounts={this.props.cloudAccounts}
                    selectedCloudAccount={this.props.selectedCloudAccount}
                    vnfdCloudAccounts={this.props.vnfdCloudAccounts}
                    ro={this.props.ro}
                    dataCenters={this.props.dataCenters}
                    configAgentAccounts={this.props.configAgentAccounts}
                    inputParameters={this.props['input-parameters']}

                    displayPlacementGroups={this.props.displayPlacementGroups}


                    nsPlacementGroups={this.props['ns-placement-groups']}
                    vnfPlacementGroups={this.props['vnf-placement-groups']}

                    vlds={this.props.vld}

                    ipProfileList={this.props.ipProfiles}

                    sshKeysList={this.props.sshKeysList}
                    sshKeysRef={this.props.sshKeysRef}

                    dnsServers={this.props.dnsServers}

                    usersList = {this.props.usersList}
                    selectedID={this.props.selectedNSDid}
                    selectedNSD={selectedNSD}

                    isOpenMano={this.props.isOpenMano}

                />
            </Panel>
        </PanelWrapper>
    )
  }
}

Instantiate.defaultProps = {
    nsd: [{}]
}

export default SkyquakeComponent(Instantiate);


/*




    ipProfiles={this.state.ipProfiles}
    dnsServers={this.state.dnsServers}
    vld={this.state.vld}
    nsd={this.state.nsd[0]}
    selectedID={this.state.selectedNSDid}
    selectedNSD={this.state.selectedNSD}

    vldFn={this.Store.vldFn()}
    ipProfileFn={this.Store.ipProfileFn()}
    dnsFn={this.Store.dnsFn()}
    usersFn={this.Store.usersFn()}
    sshFn={this.Store.sshFn()}
 */
