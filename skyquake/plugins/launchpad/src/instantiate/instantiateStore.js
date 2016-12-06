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
import NetworkServiceActions from './launchNetworkServiceActions.js';
import NetworkServiceSource from './launchNetworkServiceSource.js';
import GUID from 'utils/guid.js';
import AppHeaderActions from 'widgets/header/headerActions.js';
import Alt from '../alt';
import _ from 'lodash';


class LaunchNetworkServiceStore {
    constructor() {
        this.nsd = [];
        this.nsdDict = {};
        this.vnfd = [];
        this.pnfd = [];
        this.vld = [];
        this.name = "";
        this.ipProfiles = [];
        this.dnsServers = [];
        this.sshKeysList = [];
        this.sshKeysRef = [];
        this.sla_parameters = [];
        this.selectedNSDid;
        this.selectedNSD = {};
        this.selectedCloudAccount = {};
        this.dataCenters = [];
        this.cloudAccounts = [];
        this.isLoading = false;
        this.hasConfigureNSD = false;
        this['input-parameters'] = [];
        this.displayPlacementGroups = false;
        this.ro = {};
        this.bindActions(NetworkServiceActions);
        this.nsdConfiguration = {
            name:'',
            selectedCloudAccount: {},
            dataCenterID: null
        };
        /*Collection of vnf state containting cloud account and datacenter info.
        keyed off vnfd-id-ref
        */
        this.vnfdCloudAccounts = {};
        this.usersList = [];
        this.configAgentAccounts = [];

        this.isPreviewing = false;
        this.isOpenMano = false;
        this.registerAsync(NetworkServiceSource);
        this.exportPublicMethods({
            getMockData: getMockData.bind(this),
            getMockSLA: getMockSLA.bind(this),
            saveNetworkServiceRecord: this.saveNetworkServiceRecord,
            nsFn: this.nsFn,
            vnfFn: this.vnfFn,
            updateInputParam: this.updateInputParam,
            resetView: this.resetView,
            nameUpdated: this.nameUpdated,
            //nspg
            descriptorSelected: this.descriptorSelected.bind(this),
            deselectDescriptor: this.deselectDescriptor,
            previewDescriptor: this.previewDescriptor,
            vldFn: this.vldFn,
            ipProfileFn: this.ipProfileFn,
            dnsFn: this.dnsFn,
            usersFn: this.usersFn,
            sshFn: this.sshFn
        });
    }

    //
    resetView = () => {
        console.log('reseting state');
        this.setState({
            name: '',
            'input-parameter-xpath': null,
            'ns-placement-groups': null,
            'vnf-placement-groups':null,
            vnfdCloudAccounts: {}
        })
    }


    //Action Handlers
    getCatalogSuccess(catalogs) {
        let self = this;
        let nsdDict = {};
        let nsd = [];
        let vnfd = [];
        let pnfd = [];
        catalogs.forEach(function(catalog) {
            switch (catalog.type) {
                case "nsd":
                    nsd.push(catalog);
                    try {
                        self.descriptorSelected(catalog.descriptors[0])
                    } catch (e) {
                        console.log('unable to select catalog')
                    }
                    break;
                case "vnfd":
                    vnfd.push(catalog);
                    break;
                case "pnfd":
                    pnfd.push(catalog);
                    break;
            }
        });
        nsd[0].descriptors.map(function(n) {
            nsdDict[n.id] = n;
        })
        this.setState({
            nsd, vnfd, pnfd, nsdDict,

        });
    }
    getLaunchCloudAccountSuccess(cloudAccounts) {
        let newState = {};
        newState.cloudAccounts = cloudAccounts.filter(function(v) {
            console.log(v)
                return v['connection-status'].status == 'success';
            }) || [];
        if(cloudAccounts.length != newState.cloudAccounts.length) {
            Alt.actions.global.showNotification.defer({type: 'warning', msg: 'One or more VIM accounts have failed to connect'});
        }
        if(cloudAccounts && cloudAccounts.length > 0) {
            newState.selectedCloudAccount = cloudAccounts[0];
            if (cloudAccounts[0]['account-type'] == 'openstack') {
                newState.displayPlacementGroups = true;
            } else {
             newState.displayPlacementGroups = false;
            }
        } else {
            newState.selectedCloudAccount = {};
        }

        this.setState(newState);
    }
    getConfigAgentSuccess(configAgentAccounts) {
        this.setState({
            configAgentAccounts: configAgentAccounts
        })
    }
    getDataCentersSuccess(data) {
        let dataCenters = data;

        let newState = {
            dataCenters: dataCenters || []
        };
	if (this.ro && this.ro['account-type'] == 'openmano') {
            newState.dataCenterID = dataCenters[this.ro.name][0].uuid
        }
        this.setState(newState)
    }
    getVDUSuccess(VNFD) {
        this.setState({
            sla_parameters: VNFD
        })
    }
    launchNSRLoading() {
        Alt.actions.global.showScreenLoader.defer();
        this.setState({
            isLoading: true
        });
        console.log('is Loading', this)
    }
    launchNSRSuccess(data) {
        console.log('Launching Network Service')
        let tokenizedHash = window.location.hash.split('/');
        Alt.actions.global.hideScreenLoader.defer();
        this.setState({
            isLoading: false
        });
        return window.location.hash = 'launchpad/' + tokenizedHash[2];
    }
    launchNSRError(error) {
        var msg = 'Something went wrong while trying to instantiate. Check the error logs for more information';
        if(error) {
            msg = error;
        }
        Alt.actions.global.showNotification.defer(msg);
        Alt.actions.global.hideScreenLoader.defer();
        this.setState({
            isLoading: false
        });
    }
    getInstantiateSshKeySuccess = (data) => {
        this.setState({
            sshKeysList: data,
            sshKeysRef: []
        })
    }
    getResourceOrchestratorSuccess = (data) => {
        Alt.actions.global.hideScreenLoader.defer();
        this.setState({
            ro: data
        })
    }
    getResourceOrchestratorError = (data) => {
        console.log('getResourceOrchestrator Error: ', data)
    }
    //Form handlers
    nameUpdated = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    deselectDescriptor = () => {
        console.log('deselecting')
        this.setState({
            selectedNSDid: null,
            selectedNSD: {},
            isPreviewing: false
        })
    }
    descriptorSelected = (data) => {
        let NSD = data;
        let VNFIDs = [];
        this.resetView();
        let newState = {
            selectedNSDid: NSD.id,
            vld: NSD && NSD.vld && NSD.vld.map(function(v) {
                //Adding a type for UI state management
                //This is deleted before launch
                if(v['ip-profile-ref']) {
                    v.type = 'ip-profile-ref';
                } else {
                    if(v['vim-network-name']) {
                        v.type = 'vim-network-name';
                    } else {
                        v.type = 'none';
                    }
                }
                return v;
            }),
            ipProfiles: NSD['ip-profiles']
        };
        newState.selectedNSD = data;
        if (NSD['input-parameter-xpath']) {
            newState.hasConfigureNSD = true;
            newState['input-parameters'] = NSD['input-parameter-xpath'];
        } else {
            newState.hasConfigureNSD = false;
            newState['input-parameters'] = null;
        }
        if(NSD['ns-placement-groups'] && NSD['ns-placement-groups'].length > 0 ) {
            newState['ns-placement-groups'] = NSD['ns-placement-groups'];
        }
        if(NSD['vnf-placement-groups'] && NSD['vnf-placement-groups'].length > 0 ) {
            newState['vnf-placement-groups'] = NSD['vnf-placement-groups'];
        }
        NSD["constituent-vnfd"].map((v) => {
            VNFIDs.push(v["vnfd-id-ref"]);
        })
        this.getInstance().getVDU(VNFIDs);
        this.setState(newState);
    }
    previewDescriptor = (data) => {
        let self = this;
        return function(e) {
            self.setState({
                isPreviewing: true,
                selectedNSD: data
            })
        }
    }
    updateInputParam = (i, value) => {
        let ip = this['input-parameters'];
        ip[i].value = value;
        this.setState({
            'input-parameters': ip
        });
    }
    nsFn = () => {
        let self = this;
        return {
            updateSelectedCloudAccount: (cloudAccount) => {
                let nsd = self.nsd[0];
                var newState = {
                    selectedCloudAccount: JSON.parse(cloudAccount.target.value)
                };
                if (cloudAccount['account-type'] == 'openstack') {
                    newState.displayPlacementGroups = true;
                } else {
                     newState.displayPlacementGroups = false;
                }
                self.setState(newState);
            },
            updateSelectedDataCenter: (dataCenter) => {
                self.setState({
                    dataCenterID: JSON.parse(dataCenter.target.value)
                });
            },
            placementGroupUpdate: (i, k, value) => {
                let pg = self['ns-placement-groups'];
                pg[i][k] = value;
                self.setState({
                    'ns-placement-groups': pg
                })
            },
            hostAggregateUpdate: (pgi, hai, k, value) => {
                let pg = self['ns-placement-groups'];
                let ha = pg[pgi]['host-aggregate'][hai];
                ha[k] = value;
                self.setState({
                    'ns-placement-groups': pg
                })
            },
            addHostAggregate: (pgi) => {
                let pg = self['ns-placement-groups'];
                let ha = pg[pgi]['host-aggregate'];
                ha.push({});
                self.setState({
                    'ns-placement-groups': pg
                })
            },
            removeHostAggregate: (pgi, hai) => {
                let pg = self['ns-placement-groups'];
                let ha = pg[pgi]['host-aggregate'];
                ha.splice(hai, 1);
                self.setState({
                    'ns-placement-groups': pg
                })
            },
            getNSDByID: (id) => {

            }
        }
    }
    vnfFn = () => {
        let self = this;
        return {
            placementGroupUpdate: (i, k, value) => {
                let pg = self['vnf-placement-groups'];
                pg[i][k] = value;
                self.setState({
                    'vnf-placement-groups': pg
                })
            },
            hostAggregateUpdate: (pgi, hai, k, value) => {
                let pg = self['vnf-placement-groups'];
                let ha = pg[pgi]['host-aggregate'][hai];
                ha[k] = value;
                self.setState({
                    'vnf-placement-groups': pg
                })
            },
            addHostAggregate: (pgi) => {
                let pg = self['vnf-placement-groups'];
                let ha = pg[pgi]['host-aggregate'];
                ha.push({});
                self.setState({
                    'vnf-placement-groups': pg
                })
            },
            removeHostAggregate: (pgi, hai) => {
                let pg = self['vnf-placement-groups'];
                let ha = pg[pgi]['host-aggregate'];
                ha.splice(hai, 1);
                self.setState({
                    'vnf-placement-groups': pg
                })
            },
            updateSelectedCloudAccount: (id, cloudAccount) => {
                let vnfCA = self.vnfdCloudAccounts;
                if(cloudAccount) {
                    if(!vnfCA.hasOwnProperty(id)) {
                        vnfCA[id] = {};
                    }
                    vnfCA[id].account = JSON.parse(cloudAccount.target.value);

                    if (cloudAccount['account-type'] == 'openmano' && this.dataCenters && self.dataCenters[cloudAccount['name']]) {
                        let datacenter = self.dataCenters[cloudAccount['name']][0];
                        vnfCA[id].datacenter = datacenter.uuid;
                    } else {
                        if (vnfCA[id].datacenter) {
                            delete vnfCA[id].datacenter;
                        }
                    }
                } else {
                    if(vnfCA.hasOwnProperty(id)) {
                        if(vnfCA[id].hasOwnProperty('config-agent-account')) {
                            delete vnfCA[id].account;
                        } else {
                            delete vnfCA[id];
                        }
                    }
                }
                self.setState({
                    vnfdCloudAccounts: vnfCA
                });
            },
            updateSelectedConfigAgent:  (id) => {
                return function(e) {
                    let configAgentRef = JSON.parse(e.target.value);
                    let vnfCA = self.vnfdCloudAccounts;
                    if(configAgentRef) {
                        if(!vnfCA.hasOwnProperty(id)) {
                            vnfCA[id] = {};
                        }
                        vnfCA[id]['config-agent-account'] = configAgentRef;
                    } else {
                        if(vnfCA[id].hasOwnProperty('account')) {
                            delete vnfCA[id]['config-agent-account'];
                        } else {
                            delete vnfCA[id];
                        }
                    }
                    self.setState({
                        vnfdCloudAccounts: vnfCA
                    });
                }
            },
            updateSelectedDataCenter: (id, dataCenter) => {
                let vnfCA = self.vnfdCloudAccounts;
                if (!vnfCA[id]) {
                    vnfCA[id] = {};
                }
                vnfCA[id].datacenter = JSON.parse(dataCenter.target.value);
                self.setState({
                    vnfdCloudAccounts: vnfCA
                });
            }
        }
    }
    vldFn = () => {
        let self = this;
        return {
            updateType: (i) => {
                return function(e){
                    let type = e.target.value;
                    let vld = self.vld;
                    if (vld[i].hasOwnProperty('type')) {
                        delete vld[i][vld[i].type]
                    }
                    vld[i].type = type;
                    vld[i][type] = '';
                    if(type == 'ip-profile-ref') {
                        let IPProfile = self.ipProfiles;
                        vld[i][type] = IPProfile[0] && IPProfile[0].name;
                        delete vld[i]['vim-network-name'];
                    } else {
                        delete vld[i]['dns-server'];
                    }
                    if(type == 'none') {
                        delete vld[i]['ip-profile-ref'];
                        delete vld[i]['vim-network-name'];
                    }
                    self.setState({vld:vld});
                }
            },
            updateValue:  (i, type) => {
                return function(e) {
                    // Select Option returns JSON values.
                    let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
                    let vld = self.vld;
                    vld[i][type] = value;
                    self.setState({vld:vld});
                }
            }
        }
    }
    ipProfileFn = () => {
        let self = this;
        return {
            updateProfile: (i, key) => {
                return function(e) {
                    // Select Option returns JSON values.
                    let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
                    self.ipProfiles[i]['ip-profile-params'][key] = value;

                    self.setState({ipProfiles:self.ipProfiles});
                }
            },
            updateVersion: (i) => {
                return function(e) {
                    // Select Option returns JSON values.
                    let value = e.target.value;
                    self.ipProfiles[i]['ip-profile-params']['ip-version'] = value;
                    self.setState({ipProfiles:self.ipProfiles});
                }
            },
            updateDNS: (i, dnsIndex) => {
                return function(e) {
                    // Select Option returns JSON values.
                let value = e.target.nodeName == "SELECT" ? JSON.parse(e.target.value) : e.target.value;
                    self.ipProfiles[i]['ip-profile-params']['dns-server'][dnsIndex] = value;
                    self.setState({ipProfiles:self.ipProfiles});
                }
            },
            updateDHCP: (i, property) => {
                return function(e) {
                    let value = e.target.value;
                    //If value is meant to be boolean, convert it
                    if(value == "true" || value == "false") {
                        value = JSON.parse(value);
                    }
                    if(!self.ipProfiles[i]['ip-profile-params'].hasOwnProperty('dhcp-params')) {
                        self.ipProfiles[i]['ip-profile-params']['dhcp-params'] = {
                            enabled: true,
                            'start-address': '',
                            count: ''
                        }
                    }
                    //Removing DCHP property on disable to allow instantiation
                    if(!value) {
                        self.ipProfiles[i]['ip-profile-params']['dhcp-params'] = {
                            enabled: false
                        };
                    } else {
                        self.ipProfiles[i]['ip-profile-params']['dhcp-params'][property] = value;
                    }
                    self.setState({ipProfiles:self.ipProfiles});
                }
            }
        }
    }
    dnsFn = () => {
        let self = this;
        return {
            addDNS: (i) => {
                let self = this;
                return function(e) {
                    if(self.ipProfiles[i]['ip-profile-params']['dns-server']) {
                        self.ipProfiles[i]['ip-profile-params']['dns-server'].unshift({})
                    } else {
                        self.ipProfiles[i]['ip-profile-params']['dns-server'] = [{}];
                    }

                    self.setState({ipProfiles:self.ipProfiles});
                }
            },
            removeDNS: (i, k) => {
                let self = this;
                return function(e) {
                    self.ipProfiles[i]['ip-profile-params']['dns-server'].splice(k, 1);
                    if(self.ipProfiles[i]['ip-profile-params']['dns-server'].length == 0) {
                        delete self.ipProfiles[i]['ip-profile-params']['dns-server'];
                    }
                    self.setState({ipProfiles:self.ipProfiles});
                }
            },
            updateDNS: (i, k) => {
                let self = this;
                return function(e) {
                    let value = e.target.value;
                    self.ipProfiles[i]['ip-profile-params']['dns-server'][k].address = value;
                    self.setState({ipProfiles:self.ipProfiles});
                }
            }
        }
    }
    sshFn = () => {
        let self = this;
        return {
            updateNewKeyRefSelection: (e) => {
                self.setState({
                    newRefSelection: e.target.value
                })
            },
            updateKeyRef: (refIndex, remove) => {
                let self = this;
                return function(e) {
                    let sshKeysRef = self.sshKeysRef;
                    if(!remove) {
                        // if(!e.target.value) {
                        //     return Alt.actions.global.showError.defer('Please select a key pair');
                        // } else {
                            if(!isNaN(refIndex)){
                                sshKeysRef.splice(refIndex, 1);
                                sshKeysRef.push(e.target.value);
                            } else {
                                sshKeysRef.push(e.target.value);
                            }
                        // }
                    } else {
                        sshKeysRef.splice(refIndex, 1);
                    }
                    self.setState({
                        sshKeysRef: sshKeysRef,
                        newRefSelection: null
                    })
                }
            }
        }
    }
    usersFn = () => {
        let self = this;
        return {
            add: function(sshKeysList) {
                return function(e) {
                    let newUser = {
                        name: '',
                        'user-info': '',
                        'ssh-authorized-key': [sshKeysList[0].name]
                    }
                    let usersList = self.usersList;
                    usersList.push(newUser);
                    self.setState({
                        usersList:  usersList
                    })
                }
            },
            remove: function(i) {
                return function() {
                    self.usersList.splice(i, 1);
                    self.setState({
                        usersList: self.usersList
                    })
                }
            },
            update: function(i, key) {
                return function(e) {
                    let value = e.target.value;
                    self.usersList[i][key] = value;
                    self.setState({
                        usersList: self.usersList
                    })
                }
            },
            updateSSHkeyRef: function(i, j, remove){
                return function(e) {
                    let usersList = _.cloneDeep(self.usersList)
                    let keys = usersList[i]['ssh-authorized-key'];
                    if(!remove) {
                        let keyRef = JSON.parse(e.target.value).name;
                        if(!isNaN(j)) {
                            keys.splice(j, 1);
                        }
                        keys.push(keyRef);
                    } else {
                        keys.splice(j, 1);
                    }
                    usersList[i]['ssh-authorized-key'] = keys;
                    self.setState({
                        usersList: usersList
                    })
                }
            }
        }
    }
    saveNetworkServiceRecord(name, launch) {
        //input-parameter: [{uuid: < some_unique_name>, xpath: <same as you got from nsd>, value: <user_entered_value>}]
        /*
        'input-parameter-xpath':[{
                'xpath': 'someXpath'
            }],
         */
        let nsPg = null;
        let vnfPg = null;
        let guuid = GUID();

        // Create a filtered NSD payload from the decorated one as RW.REST cannot handle extra parameters now
        let nsdPayload = {};
        nsdPayload = _.cloneDeep(_.find(this.state.nsd[0].descriptors, {id: this.state.selectedNSDid}));

        if (nsdPayload != {}) {
            nsdPayload['meta'] && delete nsdPayload['meta'];
            nsdPayload['constituent-vnfd'] && nsdPayload['constituent-vnfd'].map((constituentVnfd) => {
                constituentVnfd['vnf-name'] && delete constituentVnfd['vnf-name'];
                constituentVnfd['name'] && delete constituentVnfd['name'];
            });
            nsdPayload['placement-groups'] && nsdPayload['placement-groups'].map((placementGroup) => {
                placementGroup['member-vnfd'] && placementGroup['member-vnfd'].map((memberVnfd) => {
                memberVnfd['name'] && delete memberVnfd['name'];
            });
            })
            nsdPayload['ns-placement-groups'] && delete nsdPayload['ns-placement-groups'];
            nsdPayload['vnf-placement-groups'] && delete nsdPayload['vnf-placement-groups'];
            nsdPayload.vld = this.state.vld;
            nsdPayload.vld && nsdPayload.vld.map(function(v){
                delete v['none'];
                delete v.type;
            })
        }
        let vnfdCloudAccounts = this.state.vnfdCloudAccounts;
        let payload = {
            id: guuid,
            "name": name,
            "short-name": name,
            "description": "a description for " + guuid,
            "admin-status": launch ? "ENABLED" : "DISABLED",
            "nsd": nsdPayload
        }

        if (this.state.ro && this.state.ro['account-type'] == 'openmano') {
            payload['om-datacenter'] = this.state.dataCenterID;
        } else {
            payload["cloud-account"] = this.state.selectedCloudAccount.name;
        }
        if (this.state.hasConfigureNSD) {
            let ips = this.state['input-parameters'];
            let ipsToSend = ips.filter(function(ip) {
                if (ip.value && ip.value != "") {
                    ip.uuid = GUID();
                    delete ip.name;
                    return true;
                }
                return false;
            });
            if (ipsToSend.length > 0) {
                payload['input-parameter'] = ipsToSend;
            }
        }
        // These placement groups need to be refactored. Too much boilerplate.
        if (this.state.displayPlacementGroups) {
            nsPg = this.state['ns-placement-groups'];
            vnfPg = this.state['vnf-placement-groups'];
            if(nsPg && (nsPg.length > 0)) {
                payload['nsd-placement-group-maps'] = nsPg.map(function(n, i) {
                    if(n['availability-zone'] || n['server-group'] || (n['host-aggregate'].length > 0)) {
                        var obj = {
                            'cloud-type': 'openstack'
                        };
                        if(n['host-aggregate'].length > 0) {
                            obj['host-aggregate'] = n['host-aggregate'].map(function(h, j) {
                                return {
                                    'metadata-key': h.key,
                                    'metadata-value': h.value
                                }
                            })
                        }
                        if(n['availability-zone'] && (n['availability-zone'] != '')) {
                            obj['availability-zone'] = {name: n['availability-zone']};
                        }
                        if(n['server-group'] && (n['server-group'] != '')) {
                            obj['server-group'] = {name: n['server-group']};
                        }
                        obj['placement-group-ref'] = n.name;
                        return obj;
                    }
                }).filter(function(o){
                    if(o) {
                        return true;
                    } else {
                        return false;
                    }
                });
            };
            if(vnfPg && (vnfPg.length > 0)) {
                payload['vnfd-placement-group-maps'] = vnfPg.map(function(n, i) {
                    if(n['availability-zone'] || n['server-group'] || (n['host-aggregate'].length > 0)) {
                        var obj = {
                            'cloud-type': 'openstack'
                        };
                        if(n['host-aggregate'].length > 0) {
                            obj['host-aggregate'] = n['host-aggregate'].map(function(h, j) {
                                return {
                                    'metadata-key': h.key,
                                    'metadata-value': h.value
                                }
                            })
                        }
                        if(n['server-group'] && (n['server-group'] != '')) {
                            obj['server-group'] = {name: n['server-group']};
                        }
                        if(n['availability-zone'] && (n['availability-zone'] != '')) {
                            obj['availability-zone'] = {name: n['availability-zone']};
                        }
                        obj['placement-group-ref'] = n.name;
                        obj['vnfd-id-ref'] = n['vnfd-id-ref'];
                        return obj;
                    }
                }).filter(function(o){
                    if(o) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
        //Construct VNF cloud accounts
        payload['vnf-cloud-account-map'] = [];
        for(let k in vnfdCloudAccounts) {
            let vnf = {};
            vnf['member-vnf-index-ref'] = k;
            if(vnfdCloudAccounts[k].hasOwnProperty('account') && (vnfdCloudAccounts[k]['account'] && vnfdCloudAccounts[k]['account'].name)) {
                vnf['cloud-account'] = vnfdCloudAccounts[k].account.name;
            }
            if(vnfdCloudAccounts[k].hasOwnProperty('config-agent-account') && vnfdCloudAccounts[k]['config-agent-account']) {
                vnf['config-agent-account'] = vnfdCloudAccounts[k]['config-agent-account'];
            }
            if(vnfdCloudAccounts[k].hasOwnProperty('datacenter')) {
                vnf['om-datacenter'] = vnfdCloudAccounts[k].datacenter;
            }
            if(vnf['om-datacenter'] || vnf['cloud-account'] || vnf['config-agent-account']) {
                payload['vnf-cloud-account-map'].push(vnf);
            }
        }
        //Add SSH-Keys
        payload['ssh-authorized-key'] = this.state.sshKeysRef.map(function(k) {
            return {'key-pair-ref': JSON.parse(k).name};
        });
        //Add Users
        payload['user'] = addKeyPairRefToUsers(this.state.usersList);
        console.log(payload)
        this.launchNSR({
            'nsr': [payload]
        });
    }
}


function addKeyPairRefToUsers(list) {
    return list.map(function(u) {
        return {
            name: u.name,
            'user-info': u['user-info'],
            'ssh-authorized-key': u['ssh-authorized-key'].map(function(k) {
                return {
                    'key-pair-ref' : k
                }
            })
        }
    })
}

function getMockSLA(id) {
    console.log('Getting mock SLA Data for id: ' + id);
    this.setState({
        sla_parameters: slaData
    });
}

function getMockData() {
    console.log('Getting mock Descriptor Data');
    this.setState({
        nsd: data.nsd,
        vnfd: data.vnfd,
        pnfd: data.pnfd
    });
}
// export default Alt.createStore(LaunchNetworkServiceStore);
export default LaunchNetworkServiceStore;
