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
import SshKeyActions from './sshKeyActions.js';
import SshKeySource from './sshKeySource.js';
import GUID from 'utils/guid.js';
import AppHeaderActions from 'widgets/header/headerActions.js';
import Alt from '../alt';
import _ from 'lodash';


export default class SshKeyStore {
    constructor() {
        this.data = {
            keys: [],
            entities: {}
        };
        this.dataCache = _.cloneDeep(this.data);
        this.newKey = {
          name: '',
          key: ''
        };
        this.bindActions(SshKeyActions);
        this.registerAsync(SshKeySource);
        this.exportPublicMethods({
            updateNewKeyValue: this.updateNewKeyValue,
            updateSshKeyPair: this.updateSshKeyPair,
            editSshKeyPair: this.editSshKeyPair,
            cancelEditSshKeyPair: this.cancelEditSshKeyPair,
            saveEditSshKeyPair: this.saveEditSshKeyPair,
            deleteSshKeyPair: this.deleteSshKeyPair,
            updateEditSshKeyPair: this.updateEditSshKeyPair
        });
    }
    updateNewKeyValue = (k, field) => {
        let self = this;
        return function(e) {
            let value = e.target.value;
            let ref = self.newKey;
            ref[field] = value;
            self.setState({newKey: ref});
        }
    }
    editSshKeyPair = (k) => {
        let self = this;
        return function(e) {
            let data = self.data;
            let ref = data.entities[k];
            ref.isEditable = true;
            self.setState({data:data});
        }
    }
    cancelEditSshKeyPair = (k) => {
        let self = this;
        return function(e) {
            let data = _.cloneDeep(self.data);
            data.entities[k].key = self.dataCache.entities[k].key;
            data.entities[k].isEditable = false;
            self.setState({data:data});
        }
    }
    saveEditSshKeyPair = (data) => {
        let self = this;
            return function(e) {
                if(self.validate(data)) {
                    self.getInstance().saveSshKey(self.trimName(data)).then(function() {})
                } else {
                    self.alt.actions.global.showNotification('Make sure all fields are filled in and that you are using only alphanumeric characters for the name');
                }
            }
    }
    updateEditSshKeyPair = (k) => {
        let self = this;
        return function(e) {
            self.getInstance().updateSshKey(self.cleanUpKeyPayload(self.data.entities[k]))
        }
    }
    deleteSshKeyPair = (k) => {
        let self = this;
        return function(e) {
            if(window.confirm('Are you sure you want to delete this key?')) {
                self.getInstance().deleteSshKey(k);
            }
        }
    }
    saveSshKeySuccess = (data) => {
        let keys = this.data;
        keys.keys.push(data.name);
        keys.entities[data.name] = {
            name: data.name,
            key: data.key,
            isEditable: false
        };
        this.setState({
            dataCache: _.cloneDeep(keys),
            data: keys,
            newKey: {
              name: '',
              key: ''
            }
        })
    }
    updateSshKeySuccess = (data) => {
        let keys = this.data;
        keys.entities[data.name] = {
            name: data.name,
            key: data.key,
            isEditable: false
        };
        this.setState({
            dataCache: _.cloneDeep(keys),
            data: keys,
            newKey: {
              name: '',
              key: ''
            }
        })
    }
    deleteSshKeySuccess = (data) => {
        let keys = this.data;
        keys.keys.splice(keys.keys.indexOf(data.name), 1);
        delete keys.entities[data.name];
        this.setState({
            dataCache: _.cloneDeep(keys),
            data: keys
        })
    }
    saveEditSshKeyPairSuccess = () => {

    }
    getSshKeySuccess = (data) => {
        let flattened = this.flattenKeys(data);
        this.setState({
            data: flattened,
            dataCache: _.cloneDeep(flattened)
        })
    }
    updateSshKeyPair = (k, field) => {
        let self = this;
        return function(e) {
            let value = e.target.value;
            let data = self.data;
            let ref = data.entities[k];
            ref[field] = value;
            self.setState({data:data});
        }
    }
    flattenKeys(data) {
        var fd = {
            keys:[],
            entities: {}
        };
        data && data.map(function(d){
            fd.keys.push(d.name);
            fd.entities[d.name] = _.merge({isEditable: false}, d)
        });
        return fd;
    }
    cleanUpKeyPayload(payload) {
        return {key: payload.key, name: payload.name};
    }
    validate(data) {
        if((data['name'].trim() == '') || ((/[^\w _-]/).test(data['name']))) {
            return false;
        }
        return true;
    }
    trimName(data) {
        data.name = data.name.trim();
        return data;
    }

}
