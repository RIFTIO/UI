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
import AppHeader from 'widgets/header/header.jsx';
import AccountStore from './accountStore.js';
import AccountSidebar from '../account_sidebar/accountSidebar.jsx';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import 'style/layout.scss';

class AccountsDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.Store = this.props.flux.stores.hasOwnProperty('AccountStore') ? this.props.flux.stores.AccountStore : this.props.flux.createStore(AccountStore);
        this.state = this.Store.getState();
    }
    componentWillMount() {
        this.Store.listen(this.updateState);
        this.Store.openAccountsSocket();
        this.Store.getResourceOrchestrator();
    }
    componentWillUnmount() {
        this.Store.closeSocket();
        this.Store.unlisten(this.updateState);
    }
    updateState = (state) => {
        this.setState(state);
    }
    render() {
        let self = this;
        let html;
        html = (<div className="launchpad-account-dashboard content-wrapper">
                    <div className="flex">
                      <AccountSidebar {...this.state} store={this.Store}/>
                      <div>
                        { this.props.children ? React.cloneElement(this.props.children, {store: self.Store, ...self.state}) : 'Edit or Create New Accounts'
                        }
                      </div>
                    </div>
              </div>);
        return html;
    }
}
AccountsDashboard.contextTypes = {
    router: React.PropTypes.object
};

export default SkyquakeComponent(AccountsDashboard);
