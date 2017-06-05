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
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx'
import SshKeyCard from './sshKeyCard.jsx';
import SshKeyStore from './sshKeyStore.js';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import '../../node_modules/open-iconic/font/css/open-iconic.css';
// import 'style/base.scss';


class SshKeys extends Component {
    constructor(props) {
        super(props);
        this.Store = this.props.flux.stores.hasOwnProperty('SshKeyStore') ? this.props.flux.stores.SshKeyStore : this.props.flux.createStore(SshKeyStore, 'SshKeyStore');
        this.state = this.Store.getState();
        this.Store.listen(this.handleUpdate);
    }
    componentWillMount() {
        this.Store.getSshKey();
    }
    componentWillUnmount() {
      this.Store.unlisten(this.handleUpdate);
    }
    handleUpdate = (state) => {
        this.setState(state)
    }
    render() {
        let self = this;
        let Store = self.Store;
        // return <div>test</div>
        return (
          <div className="sshKeyCards">
            {
              self.state.data && self.state.data.keys.map(function(k, i) {
                let sshKey = self.state.data.entities[k];
                return (
                  <SshKeyCard key={i}  name={sshKey.name} value={sshKey.key}
                  editMode={sshKey.isEditable}
                  editKey= {Store.editSshKeyPair(sshKey.name)}
                  updateSshKeyPair={Store.updateSshKeyPair}
                  cancelEditSshKeyPair={Store.cancelEditSshKeyPair}
                  saveEditSshKeyPair={Store.saveEditSshKeyPair}
                  updateEditSshKeyPair={Store.updateEditSshKeyPair}
                  deleteKey={Store.deleteSshKeyPair(sshKey.name)}
                  />
                )
              })
            }
            <SshKeyCard  name={this.state.newKey.name} value={ this.state.newKey.key}
                  editMode={"create"}
                  updateSshKeyPair={Store.updateNewKeyValue}
                  saveEditSshKeyPair={Store.saveEditSshKeyPair}
                  />
          </div>
        )
  }
}

export default SkyquakeComponent(SshKeys);
