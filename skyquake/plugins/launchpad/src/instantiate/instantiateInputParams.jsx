
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
import ReactDOM from 'react-dom';
import SelectOption from 'widgets/form_controls/selectOption.jsx';
import imgAdd from '../../node_modules/open-iconic/svg/plus.svg'
import imgRemove from '../../node_modules/open-iconic/svg/trash.svg'
import TextInput from 'widgets/form_controls/textInput.jsx';
import './instantiateInputParams.scss';

export default class InstantiateInputParams extends Component {
  constructor(props) {
    super(props);
  }
  nsConfigHTML = (props) => {
    return (
      <div className="configure-nsd_section">
        <div className="inputControls">
            <TextInput label="Instance Name" type="text" pattern="^[a-zA-Z0-9_]*$" style={{textAlign:'left'}} onChange={props.updateName} value={props.name}/>
          {
            !isOpenMano(props.ro) ?
              (
                <label>Select VIM Account
                  <SelectOption options={constructCloudAccountOptions(props.cloudAccounts)} onChange={props.nsFn.updateSelectedCloudAccount} />
                </label>
              )
            : null
          }
          {
            isOpenMano(props.ro) ?
              dataCentersHTML(props.dataCenters[props.ro.name],
                              props.nsFn.updateSelectedDataCenter)
              : null
          }
        </div>
      </div>
    )
  }
  vnfCloudAccountsHTML = (props) => {
    let nsd = props.nsd;
    let dataCenters = props.dataCenters;
    return (
      <div className="configure-nsd_section">
        <h3 className="launchpadCard_title">NS/VNF ACCOUNT PLACEMENTS</h3>
        {

            //selectedNSDid
              nsd['constituent-vnfd'] && nsd['constituent-vnfd'].map(function(v, i) {
                let defaultValue = false;
                if(props.vnfdCloudAccounts && props.vnfdCloudAccounts.hasOwnProperty(v['member-vnf-index'])) {
                  defaultValue = props.vnfdCloudAccounts[v['member-vnf-index']]
                }
                return (
                    <div className="inputControls" key={i}>
                    <h4 className="inputControls-title">VNFD: {v.name}</h4>
                  {
                    !isOpenMano(props.ro) ?
                      (
                        <label>Select VIM Account
                          <SelectOption options={constructCloudAccountOptions(props.cloudAccounts)} initial={true} onChange={props.vnfFn.updateSelectedCloudAccount.bind(null, v['member-vnf-index'])} defaultValue={defaultValue} />
                        </label>
                      )
                    : null
                  }
                      {
                        isOpenMano(props.ro) ?
                          dataCentersHTML(
                                          props.dataCenters[props.ro.name],
                                          props.vnfFn.updateSelectedDataCenter.bind(null, v['member-vnf-index']), true)
                          : null
                      }
                      {
                        (props.configAgentAccounts && props.configAgentAccounts.length > 0) ?
                        <label>Select Config Agent Account
                          <SelectOption options={props.configAgentAccounts && props.configAgentAccounts.map(function(c) {
                            return {
                              label: c.name,
                              value: c.name
                            }
                          })} initial={true} onChange={props.vnfFn.updateSelectedConfigAgent(v['member-vnf-index'])} defaultValue={false} />
                        </label> : null
                      }
                    </div>
                )
              })
        }
      </div>
    )
  }
  inputParametersHTML = (props) => {
    let inputParameters = props.inputParameters;
    const handleChange = (i, event) => props.updateInputParam(i, event.target.value);
    return inputParameters && inputParameters.map(function(input, i) {
        return (
                <div className="configure-nsd_section" key={i}>
                  <h3 className="launchpadCard_title">Input Parameters</h3>
                  <div className="inputControls">
                      <TextInput label={ input.label || input.xpath } type="text" onChange={handleChange.bind(this, i)} />
                  </div>
                </div>
        )
      })
  }
  nsPlacementGroupsHTML = (props) => {
    let nsPlacementGroups = props.nsPlacementGroups;
    let displayPlacementGroups = props.displayPlacementGroups;
    if (nsPlacementGroups && nsPlacementGroups.length > 0 && displayPlacementGroups) {
      return (
        <div className="configure-nsd_section">
          <h3 className="launchpadCard_title">NS Placement Groups</h3>
            {
              nsPlacementGroups.map(function(input, i) {
                return (
                  <div  key={i} className="configure-nsd_section-info">
                    <div className="placementGroup_description">
                      <div className="placementGroup_description-name">
                        <strong>{input.name}</strong> contains: {
                          input['member-vnfd'].map((m,i) => {
                            let s = m.name;
                            if(i>0) {
                              s = ', ' + m.name
                            };
                            return s;
                          })
                        }
                      </div>
                      <div><em>{input.requirement}</em></div>
                      <div><strong>Strategy:</strong> {input.strategy}</div>
                    </div>
                    <label>
                      <span> Availability Zone <span onClick={showInput} className="addInput"><img src={imgAdd} />Add</span> </span>
                      <div  style={{display:'none'}}>
                      <TextInput type="text" onChange={props.nsFn.placementGroupUpdate.bind(self, i, 'availability-zone')} />
                      <span onClick={hideInput} className="removeInput"><img src={imgRemove} />Remove</span>
                      </div>
                    </label>
                    <label>
                      <span> Affinity/Anti-affinity Server Group<span onClick={showInput} className="addInput"><img src={imgAdd} />Add</span></span>
                      <div style={{display:'none'}}>
                        <TextInput type="text" onChange={props.nsFn.placementGroupUpdate.bind(self, i, 'server-group')} />
                        <span onClick={hideInput} className="removeInput"><img src={imgRemove} />Remove</span>
                      </div>
                    </label>
                    <div className="host-aggregate">
                      <label>
                        <span> Host Aggregates <span onClick={props.nsFn.addHostAggregate.bind(self, i)} className="addInput"  ><img src={imgAdd} />Add</span></span>
                      {
                        input['host-aggregate'].length > 0 ?
                          input['host-aggregate'].map((h,j) => {
                            let key = h.key || '';
                            let value = h.value || '';
                            return (

                                  <div className="input_group" key={j}>
                                    <TextInput type="text" onChange={props.nsFn.placementGroupUpdate.bind(self, i, j, 'key')} placeholder="KEY" value={key} />
                                    <TextInput type="text" onChange={props.nsFn.placementGroupUpdate.bind(self, i, j, 'value')} placeholder="VALUE"  value={value} />
                                    <span onClick={props.nsFn.removeHostAggregate.bind(self, i, j)} className="removeInput"><img src={imgRemove} />Remove</span>
                                  </div>
                            )
                          }) : ''
                      }
                      </label>
                    </div>
                    </div>
                );
              })
            }
       </div>
     );
    }
  }
  vnfPlacementGroupsHTML = (props) => {
    let vnfPlacementGroups = props.vnfPlacementGroups;
    let displayPlacementGroups = props.displayPlacementGroups;
    if (vnfPlacementGroups && vnfPlacementGroups.length > 0 && displayPlacementGroups) {
      return vnfPlacementGroups.map(function(input, i) {
            return (
              <div className="configure-nsd_section" key={i}>
                <h3 className="launchpadCard_title">{input['vnf-name']} VNF Placement Group</h3>
                  <div className="configure-nsd_section-info">
                    <div className="placementGroup_description">
                      <div className="placementGroup_description-name">
                        <strong>{input.name}</strong> contains: {
                          input['member-vdus'].map((m,i) => {
                            let s = m['member-vdu-ref'];
                            if(i>0) {
                              s = ', ' + m['member-vdu-ref']
                            };
                            return s;
                          })
                        }
                      </div>
                      <div><em>{input.requirement}</em></div>
                      <div><strong>Strategy</strong>: {input.strategy}</div>
                    </div>
                    <label>
                      <span> Availability Zone <span onClick={showInput} className="addInput"><img src={imgAdd} />Add</span></span>
                      <div  style={{display:'none'}}>
                        <TextInput type="text" onChange={props.vnfFn.placementGroupUpdate.bind(self, i, 'availability-zone')} />
                           <span onClick={hideInput} className="removeInput"><img src={imgRemove} />Remove</span>
                      </div>
                    </label>
                    <label>
                      <span> Affinity/Anti-affinity Server Group<span onClick={showInput} className="addInput"><img src={imgAdd} />Add</span></span>
                      <div  style={{display:'none'}}>
                        <TextInput type="text" onChange={props.vnfFn.placementGroupUpdate.bind(self, i, 'server-group')} />
                         <span onClick={hideInput} className="removeInput"><img src={imgRemove} />Remove</span>
                      </div>
                    </label>
                    <div className="host-aggregate">
                    <label>
                      <span> Host Aggregates <span onClick={props.vnfFn.addHostAggregate.bind(self, i)} className="addInput"><img src={imgAdd} />Add</span></span>
                      {
                        input['host-aggregate'].length > 0 ?
                          input['host-aggregate'].map((h,j) => {
                            let key = h.key || '';
                            let value = h.value || '';
                            return (

                                  <div className="input_group" key={j}>
                                    <TextInput type="text" onChange={props.vnfFn.hostAggregateUpdate.bind(self, i, j, 'key')} placeholder="KEY" value={key} />
                                    <TextInput type="text" onChange={props.vnfFn.hostAggregateUpdate.bind(self, i, j, 'value')} placeholder="VALUE"  value={value} />
                                    <span onClick={props.vnfFn.removeHostAggregate.bind(self, i, j)} className="removeInput"><img src={imgRemove} />Remove</span>
                                  </div>

                            )
                          }) : ''
                      }
                      </label>
                    </div>
                    </div>
                </div>
            );
          });
    }
  }
  vldsHTML = (props) => {
    let self = this;
    let ipProfileList = props.ipProfileList;
    let vlds = props.vlds;
    return vlds && (
      <div className="configure-nsd_section">
        <h3 className="launchpadCard_title">VLDs</h3>
            {vlds && vlds.map(function(v, i) {
                  let currentType = v.type;
                  let isVIM = (currentType == 'vim-network-name');
                  let isUnknown = (currentType == 'none') || ((currentType != 'vim-network-name') && (currentType != 'ip-profile-ref'));
                  return (
                    <div key={self.props.nsd.id + '-' + i} className="inputControls">
                        <h4 className="inputControls-title">VLD: {v['short-name'] ? v['short-name'] : v['name']}</h4>
                        <label><span>Specify VLD Parameters</span></label>
                        <div  className="inputControls-radioGroup">
                          <label className="inputControls-radio" style={{display: ipProfileList ? 'flex' : 'none'}}>
                            <input type="radio" name={'vld-' + i } onChange={self.props.vldFn.updateType(i)} checked={!isVIM && !isUnknown} value='ip-profile-ref' />
                            IP Profile
                          </label>
                          <label className="inputControls-radio">
                            <input type="radio" name={'vld-' + i } onChange={self.props.vldFn.updateType(i)} checked={isVIM && !isUnknown} value='vim-network-name' />
                            VIM Network Name
                          </label>
                          <label className="inputControls-radio">
                            <input type="radio" name={'vld-' + i } onChange={self.props.vldFn.updateType(i)} checked={isUnknown} value='none' />
                            None
                          </label>
                        </div>
                          {
                            isUnknown ? null : isVIM ?
                            <TextInput label="Network Name" onChange={self.props.vldFn.updateValue(i, currentType)} value={v[currentType]} /> :
                            <div>
                              <SelectOption
                              label="IP PROFILE NAME"
                                options={ipProfileList && ipProfileList.map(function(ip) {
                                  return {
                                    label: ip.name,
                                    value: ip.name
                                  }
                                })}
                                initial={
                                  v['ip-profile-ref'] ? false : true
                                }
                                defaultValue={v['ip-profile-ref']}
                                onChange={self.props.vldFn.updateValue(i, currentType)}>
                              </SelectOption>

                            </div>
                          }
                    </div>
                  )
                })}
      </div>
    );
  }
  ipProfilesHTML = (props) => {
    let vldHasIPprofile = false;
    props.vlds && props.vlds.map(function(v){
      if(v.type == 'ip-profile-ref') {
        vldHasIPprofile = true;
      }
    })
    let ipProfileList = props.ipProfileList;
    return ipProfileList && vldHasIPprofile &&
      (
      <div className="configure-nsd_section">
        <h3 className="launchpadCard_title">IP Profiles</h3>
        {
          //IP Config
          ipProfileList && ipProfileList.map(function(ip, j) {
            let ipl = ip['ip-profile-params'];
              return (
                <div className="inputControls" key={j}>
                  <div className="inputControls-title" >
                    {ip.name}
                  </div>
                  <div  className="inputControls-radioGroup">
                    <label className="inputControls-radio">
                      <input type="radio" name={'ip-profile-' + j } onChange={props.ipProfileFn.updateVersion(j)} checked={ipl['ip-version'] == 'ipv4'} value='ipv4' />
                      ipv4
                    </label>
                    <label className="inputControls-radio">
                      <input type="radio" name={'ip-profile-' + j } onChange={props.ipProfileFn.updateVersion(j)} checked={ipl['ip-version'] == 'ipv6'} value='ipv6' />
                      ipv6
                    </label>
                    <label className="inputControls-radio">
                      <input type="radio" name={'ip-profile-' + j } onChange={props.ipProfileFn.updateVersion(j)} checked={ipl['ip-version'] == 'unknown'} value='unknown' />
                      unknown
                    </label>
                  </div>
                  <TextInput
                    label="subnet address"
                    onChange={props.ipProfileFn.updateProfile(j, 'subnet-address')}
                    value={ipl['subnet-address']}
                    />
                  <TextInput
                    label="gateway address"
                    onChange={props.ipProfileFn.updateProfile(j, 'gateway-address')}
                    value={ipl['gateway-address']}
                    />
                  <TextInput
                    label="security group"
                    onChange={props.ipProfileFn.updateProfile(j, 'security-group')}
                    value={ipl['security-group']}
                    />
                  <TextInput
                    label="subnet prefix pool"
                    onChange={props.ipProfileFn.updateProfile(j, 'subnet-prefix-pool')}
                    value={ipl['subnet-prefix-pool']}
                    />
                    <label>
                      <div style={{display:'flex'}}>
                        DNS SERVERS <span onClick={props.dnsFn.addDNS(j)} className="addInput"><img src={imgAdd} />Add</span>
                      </div>
                      {
                        ipl['dns-server'] && ipl['dns-server'].map(function(dns, k) {
                          return (
                            <div key={k} style={{display:'flex'}}>
                              <TextInput
                                  onChange={props.dnsFn.updateDNS(j,k)}
                                  value={ipl['dns-server'][k].address}
                                  />
                              <span onClick={props.dnsFn.removeDNS(j,k)} className="removeInput">
                                <img src={imgRemove} />Remove</span>
                            </div>
                          )
                        })
                      }
                    </label>
                  <div  className="inputControls-radioGroup">
                    <label className="inputControls-radio">
                    DHCP ENABLED
                      <input type="radio"
                        name={'ip-profile-dhcp' + j }
                        onChange={props.ipProfileFn.updateDHCP(j, 'enabled')}
                        checked={ipl.hasOwnProperty('dhcp-params') && ipl['dhcp-params'].enabled}
                        value={true} />
                      YES
                    </label>
                    <label className="inputControls-radio">
                      <input type="radio"
                        name={'ip-profile-dhcp' + j }
                        onChange={props.ipProfileFn.updateDHCP(j, 'enabled')}
                        checked={!ipl.hasOwnProperty('dhcp-params') || !ipl['dhcp-params'].enabled}
                        value={false} />
                      NO
                    </label>
                  </div>
                  {
                    (ipl['dhcp-params'] && ipl['dhcp-params'].enabled) ? dhcpHTML(props, ipl, j) : null
                  }
                </div>
              )
          })
        }
        </div>);
    function dhcpHTML(props, ipl, j){
      return (<div>
                  <TextInput
                    label="DHCP Start Address"
                    onChange={props.ipProfileFn.updateDHCP(j, 'start-address')}
                    value={ipl['dhcp-params'] && ipl['dhcp-params']['start-address']}
                    />
                  <TextInput
                    label="DHCP Count"
                    onChange={props.ipProfileFn.updateDHCP(j, 'count')}
                    value={ipl['dhcp-params'] && ipl['dhcp-params']['count']}
                    />
                </div>
                );
    }
  }
  sshKeysHTML = (props) => {
    let sshKeysList = props.sshKeysList;
    let sshKeysRef = props.sshKeysRef;
    if(sshKeysList && sshKeysList.length > 0) {
      return (
        <div className="configure-nsd_section">
          <h3 className="launchpadCard_title">SSH Authorized Keys</h3>

            {
              sshKeysRef.map(function(ref, i) {
                let keyref = JSON.stringify(ref)
                return (
                  <div key={keyref.name + '-' + i} className="inputControls inputControls-sshkeys">
                    <label>
                      <div>
                      <SelectOption
                        label="Key Pair"
                        options={sshKeysList && sshKeysList.map(function(k) {
                          return {
                            label: k.name,
                            value: k
                          }
                        })}
                        ref="keyPairSelection"
                        initial={false}
                        defaultValue={keyref.name || sshKeysList[0].name}
                        onChange={props.sshFn.updateKeyRef(i)}>
                      </SelectOption>
                      </div>
                    </label>
                    <label>
                      <span onClick={props.sshFn.updateKeyRef(i, true)} className="removeInput">
                        <img src={imgRemove} />
                        Remove
                      </span>
                    </label>
                  </div>
                )
              })
            }
            <div className="inputControls inputControls-sshkeys ">
              <label style={{display: 'flex', 'flexDirection': 'row'}}>
              SSH KEY PAIR
                <span onClick={props.sshFn.updateKeyRef().bind(null, {target:{value: JSON.stringify(sshKeysList[0])}})} className="addInput">
                  <img src={imgAdd} />
                  ADD
                </span>
              </label>
            </div>
        </div>
      );
    }
  }
  usersHTML = (props) => {
    let usersFn = props.usersFn;
    let sshKeysList = props.sshKeysList;
    let usersList = props.usersList && props.usersList.map(function(u, i) {
      let sshKeysRef = u['ssh-authorized-key'];
      return (
        <div className="input_group input_group-users" key={i}>
          <div className="inputControls">
          <div style={{fontWeight: 'bold', display: 'flex'}}>USER <span onClick={usersFn.remove(i)} className="removeInput"><img src={imgRemove} />Remove</span></div>

            <TextInput onChange={usersFn.update(i, 'name')} label="USERNAME" value={i.name} />
            <TextInput onChange={usersFn.update(i, 'user-info')} label="REAL NAME" value={i.gecos} />
            {
              sshKeysRef.map(function(ref, j) {
                let keyref = JSON.stringify(ref)
                return (
                  <div key={keyref.name + '-' + i + '-' + j} className="inputControls inputControls-sshkeys">
                    <label>
                      <div>
                      <SelectOption
                        label="Key Pair"
                        options={sshKeysList && sshKeysList.map(function(k) {
                          return {
                            label: k.name,
                            value: k
                          }
                        })}
                        ref="keyPairSelection"
                        initial={false}
                        defaultValue={ref}
                        onChange={usersFn.updateSSHkeyRef(i, j)}>
                      </SelectOption>
                      </div>
                    </label>
                    {
                      sshKeysRef.length > 0 ?
                        <label>
                          <span onClick={usersFn.updateSSHkeyRef(i, j, true)} className="removeInput">
                            <img src={imgRemove} />
                            Remove
                          </span>
                        </label>
                      : null
                    }

                  </div>
                )
              })
            }
              <div className="inputControls inputControls-sshkeys ">
                <label style={{display: 'flex', 'flexDirection': 'row', 'alignItems': 'center'}}>
                SSH KEY PAIR
                  <span onClick={usersFn.updateSSHkeyRef(i).bind(null, {target:{value: JSON.stringify(sshKeysList[0])}})} className="addInput">
                    <img src={imgAdd} />
                    ADD
                  </span>
                </label>
              </div>
          </div>
        </div>
      )
    });
    return (
      <div className="configure-nsd_section">
        <h3 className="launchpadCard_title">USERS</h3>
        {usersList}
        <div className="inputControls inputControls-sshkeys inputControls-addUser ">
            <span onClick={usersFn.add(sshKeysList)} className="addInput">
              <img src={imgAdd} />
              ADD USER
            </span>
        </div>
      </div>
    )
  }

  render() {
    const props = this.props;
    let html;
    let self = this;

    html = (
        <div className="instantiateInputParams">
          {
            //NS NAMEA AND CLOUD
            this.nsConfigHTML(props)
          }
          {
            //VNF VIM ACCOUNTS
            this.vnfCloudAccountsHTML(props)
          }
          {
            //INPUT PARAMETERS
            this.inputParametersHTML(props)
          }
          {
            //NS PLACEMENTGROUPS
            this.nsPlacementGroupsHTML(props)
          }
          {
            //VNF PLACEMENTGROUPS
            this.vnfPlacementGroupsHTML(props)
          }
          {
            //VLD CONFIGURATION
            this.vldsHTML(props)
          }
          {
            //IP PROFILE CONFIGURATION
            this.ipProfilesHTML(props)
          }
          {
            //SSH KEY ASSIGNMENTS
            this.sshKeysHTML(props)
          }
          {
            //USER MANAGEMENT
            this.usersHTML(props)
          }
        </div>
    )
    return html;
  }
}
function showInput(e){
  let target = e.target;
  if(target.parentElement.classList.contains("addInput")) {
    target = target.parentElement;
  }
  target.style.display = 'none';
  target.parentElement.nextElementSibling.style.display = 'flex';
  // e.target.parentElement.nextElementSibling.children[1].style.display = 'initial';
}
function hideInput(e){
  let target = e.target;
  if(target.parentElement.classList.contains("removeInput")) {
    target = target.parentElement;
  }
  target.parentElement.style.display = 'none';
  target.parentElement.previousElementSibling.children[1].style.display = 'inline';
  target.previousSibling.value = '';
}
function addDNS(){}
function removeDNS(){}
function constructCloudAccountOptions(cloudAccounts){
  let CloudAccountOptions = cloudAccounts && cloudAccounts.map(function(ca, index) {
    return {
      label: ca.name,
      value: ca
    }
  });
  return CloudAccountOptions;
}
function dataCentersHTML(dataCenters, onChange, initial) {
  //Build DataCenter options
  //Relook at this, why is it an object?
  let DataCenterOptions = [];
  DataCenterOptions = dataCenters && dataCenters.map(function(dc, index) {
    return {
      label: dc.name,
      value: dc.uuid
    }
  });
  if (dataCenters && dataCenters.length > 0) {
    return (
      <label>Select Data Center
        <SelectOption initial={!!initial} options={DataCenterOptions} onChange={onChange} />
      </label>
    )
  }
}
function isOpenMano(account) {
  if (account) {
    let a = account;
    if (a.constructor.name == 'String') {
      a = JSON.parse(a);
    }
    return a['account-type'] == 'openmano';
  } else {
    return false;
  }
}
function updateNewSshKeyRefSelection(e) {
  this.setState({
    newRefSelection: e.target.value
  })
}
function resetRef() {
    this.setState({
    newRefSelection: null
  })
}
InstantiateInputParams.defaultProps = {
  data: [],
  sshKeysList: [],
  sshKeysRef: [],
  users: {}
}
