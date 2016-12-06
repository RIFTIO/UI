/*
 * STANDARD_RIFT_IO_COPYRIGHT
 */

import React from 'react';
import AppHeader from 'widgets/header/header.jsx';
import ConfigStore from './configStore.js';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import 'style/layout.scss';
import './config.scss';
import {Panel, PanelWrapper} from 'widgets/panel/panel';
import TextInput from 'widgets/form_controls/textInput.jsx';
import Button from 'widgets/button/rw.button.js';

class ConfigDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.Store = this.props.flux.stores.hasOwnProperty('ConfigStore') ? this.props.flux.stores.ConfigStore : this.props.flux.createStore(ConfigStore);
        this.state = this.Store.getState();
    }
    componentWillMount() {
        this.Store.listen(this.updateState);
        this.Store.getResourceOrchestrator();
    }
    componentWillUnmount() {
        this.Store.unlisten(this.updateState);
    }
    updateState = (state) => {
        this.setState(state);
    }
    updateAccount = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.Store.update(this.state.account);
    }
    render() {
        let self = this;
        let html;
        let Account = this.state.account;
        let AccountMeta = this.state.AccountMeta;
        let AccountType = this.state.accountType;
        let isEdit = true;
        let ParamsHTML = null;
        let Store = this.Store;
        let Types = this.state.AccountMeta['account-types'];

        let selectAccountStack = [];
        let selectAccountHTML = null;


        if (Account['account-type']) {
            for (var i = 0; i < Types.length; i++) {
                var node = Types[i];
                var isSelected = (Account['account-type'] == node);
                selectAccountStack.push(
                  <label key={i} className={"accountSelection " + (isSelected ? "accountSelection--isSelected" : "")}>
                    <div className={"accountSelection-overlay" + (isSelected ? "accountSelection-overlay--isSelected" : "")}></div>
                    <div className="accountSelection-imageWrapper">
                        <img src={Store.getImage(node)}/>
                    </div>
                    <input type="radio" name="account"
                        onChange={Store.handleAccountTypeChange} defaultChecked={node == Types[0]} value={node} />{node}
                  </label>
                )
            }
            selectAccountHTML = (
                <Panel className="accountForm" title="Select Account Type" no-corners>
                    <div className="select-type accountForm-content row" >
                        {selectAccountStack}
                    </div>
                </Panel>
            );
        }

        if (AccountMeta[AccountType] && AccountMeta[AccountType].length > 0) {
            var paramsStack = [];
            var optionalField = '';
            for (var i = 0; i < AccountMeta[AccountType].length; i++) {
                var node = AccountMeta[AccountType][i];
                var value = ""
                if (Account[AccountType]) {
                    value = Account[AccountType][node.ref]
                }
                paramsStack.push(
                    <TextInput key={node.label} className="accountForm-input" label={node.label} required={!node.optional}  onChange={this.Store.handleParamChange(node)} value={value} />
                );
            }
            ParamsHTML = (
                <Panel className="create-fleet-pool accountForm" title={(isEdit ? 'Update' : 'Enter') +  ' Account Details'} no-corners>
                    <div className="accountForm-content">
                        {paramsStack}
                    </div>
                </Panel>
            )
        } else {
            ParamsHTML = (
                <Panel className="create-fleet-pool accountForm" title={(isEdit ? 'Update' : 'Enter') +  ' Account Details'} no-corners>
                    <label style={{'marginLeft':'17px', color:'#888'}}>No Details Required</label>
                </Panel>
            )
        }



        html = (
            <PanelWrapper className="column Config" style={{'alignContent': 'center', 'flexDirection': 'column'}}>
            <form className="app-body create Accounts"  onSubmit={this.preventDefault} onKeyDown={this.evaluateSubmit}>
                <div className="noticeSubText noticeSubText_right">
                    * required
                </div>
                <div>
                    <Panel className="create-fleet-pool accountForm" title="Resource Orchestrator" no-corners>
                        <div className="accountForm-content">
                             <TextInput className="accountForm-input" label={"Name"} onChange={this.Store.handleNameChange} value={Account.name} />
                        </div>
                    </Panel>

                            {
                                selectAccountHTML
                            }
                            {
                                ParamsHTML
                            }
                </div>
                <div className="form-actions">
                    <Button key="4" role="button" className="update dark" label="Update"  onClick={this.updateAccount} />
                </div>
            </form>
            </PanelWrapper>
        );
        return html;
    }
}
// onClick={this.Store.update.bind(null, Account)}
ConfigDashboard.contextTypes = {
    router: React.PropTypes.object
};

export default SkyquakeComponent(ConfigDashboard);
