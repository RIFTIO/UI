/*
 * STANDARD_RIFT_IO_COPYRIGHT
 */

import React from 'react';
import Button from 'widgets/button/rw.button.js';
import _ from 'lodash';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import Crouton from 'react-crouton';
import TextInput from 'widgets/form_controls/textInput.jsx';
import 'style/common.scss';
import './config.scss';
class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.account = {};
    }
    storeListener = (state) => {
        if(!state.account) {
            this.setUp(this.props)
        }
        state.account && this.setState({account: state.account,accountType: state.accountType, types: state.types, sdnOptions: state.sdnOptions})
    }
    componentWillMount() {
        this.props.store.listen(this.storeListener);
        this.setUp(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(nextProps.params) != JSON.stringify(this.props.params)){
              this.setUp(nextProps);
        }
    }
    componentWillUnmount() {
        this.props.store.unlisten(this.storeListener);
    }
    setUp(props){
        if(props.params.name != 'create') {
            this.props.store.viewAccount({type: props.params.type, name: props.params.name});
        } else {
            this.props.store.setAccountTemplate(props.params.type);
        }
    }
    create(e) {
        e.preventDefault();
        var self = this;
        var Account = this.state.account;
        let AccountType = this.state.accountType;
        if (Account.name == "") {
            self.props.flux.actions.global.showNotification("Please give the account a name");
            return;
        } else {
            var type = Account['account-type'];
            var params = Account.params;

            if(params) {
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].ref;
                    if (typeof(Account[type]) == 'undefined' || typeof(Account[type][param]) == 'undefined' || Account[type][param] == "") {
                        if (!params[i].optional) {
                            self.props.flux.actions.global.showNotification("Please fill all account details");
                            return;
                        }
                    }
                }
            }

            let nestedParams = Account.nestedParams && Account.nestedParams;
            if (nestedParams && nestedParams.params) {
                for (let i = 0; i < nestedParams.params.length; i++) {
                    let nestedParam = nestedParams.params[i].ref;
                    if (typeof(Account[type]) == 'undefined' || typeof(Account[type][nestedParams['container-name']][nestedParam]) == 'undefined' || Account[type][nestedParams['container-name']][nestedParam] == "") {
                        if (!nestedParams.params[i].optional) {
                            self.props.flux.actions.global.showNotification("Please fill all account details");
                            return;
                        }
                    }
                }
            }
        }

        let newAccount = _.cloneDeep(removeTrailingWhitespace(Account));
        delete newAccount.params;
        newAccount.nestedParams &&
            newAccount.nestedParams['container-name'] &&
            delete newAccount[newAccount.nestedParams['container-name']];
        delete newAccount.nestedParams;

        this.props.flux.actions.global.showScreenLoader();
        this.props.store.create(newAccount, AccountType).then(function() {
            self.props.router.push({pathname:'accounts'});
            self.props.flux.actions.global.hideScreenLoader.defer();
        },
         function() {
            self.props.flux.actions.global.showNotification("There was an error creating your account. Please contact your system administrator.");
            self.props.flux.actions.global.hideScreenLoader.defer();
         });
    }
    update(e) {
        e.preventDefault();
        var self = this;
        var Account = this.state.account;
        let AccountType = this.state.accountType;
        this.props.flux.actions.global.showScreenLoader();
        this.props.store.update(Account, AccountType).then(function() {
            self.props.router.push({pathname:'accounts'});
             self.props.flux.actions.global.hideScreenLoader();
        },
        function() {

        });
    }
    cancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.router.push({pathname:'accounts'});
    }
    handleDelete = () => {
        let self = this;
        let msg = 'Preparing to delete "' + self.state.account.name + '"' +
        ' Are you sure you want to delete this ' + self.state.accountType + ' account?"';
        if (window.confirm(msg)) {
            this.props.store.delete(self.state.accountType, self.state.account.name).then(function() {
                self.props.flux.actions.global.hideScreenLoader();
                self.props.router.push({pathname:'accounts'});
            }, function(){
                // self.props.flux.actions.global.hideScreenLoader.defer();
                // console.log('Delete Account Fail');
            });
        } else {
           self.props.flux.actions.global.hideScreenLoader();
        }
    }
    handleNameChange(event) {
       this.props.store.handleNameChange(event);
    }
    handleAccountTypeChange(node, event) {
        this.props.store.handleAccountTypeChange(node, event);
    }
    handleSelectSdnAccount = (e) => {
        var tmp = this.state.account;
        if(e) {
            tmp['sdn-account'] = e;
        } else {
            if(tmp['sdn-account']) {
                delete tmp['sdn-account'];
            }
        }
        console.log(e, tmp)
    }
    preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    evaluateSubmit = (e) => {
        if (e.keyCode == 13) {
            if (this.props.edit) {
                this.update(e);
            } else {
                this.create(e);
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }

    render() {
        let self = this;
        let {store, ...props} = this.props;
        // This section builds elements that only show up on the create page.
        // var name = <label>Name <input type="text" onChange={this.handleNameChange.bind(this)} style={{'textAlign':'left'}} /></label>;
        var name = <TextInput label="Name"  onChange={this.handleNameChange.bind(this)} required={true} />;
        let params = null;
        let selectAccount = null;
        let resfreshStatus = null;
        let Account = this.state.account;
        // AccountType is for the view, not the data account-type value;
        let AccountType = this.state.accountType;
        let Types = this.state.types;
        let isEdit = this.props.params.name != 'create';
        var buttons;
        let cloudResources = Account['cloud-resources-state'] && Account['cloud-resources-state'][Account['account-type']];
        let cloudResourcesStateHTML = null;

        // Account Type Radio
        var selectAccountStack = [];
        if (!isEdit) {
            buttons = [
                <Button key="0" onClick={this.cancel} className="cancel light" label="Cancel"></Button>,
                <Button key="1" role="button" onClick={this.create.bind(this)} className="save dark" label="Save" />
            ]
            for (var i = 0; i < Types.length; i++) {
                var node = Types[i];
                var isSelected = (Account['account-type'] == node['account-type']);
                selectAccountStack.push(
                  <label key={i} className={"accountSelection " + (isSelected ? "accountSelection--isSelected" : "")}>
                    <div className={"accountSelection-overlay" + (isSelected ? "accountSelection-overlay--isSelected" : "")}></div>
                    <div className="accountSelection-imageWrapper">
                        <img src={store.getImage(node['account-type'])}/>
                    </div>
                    <input type="radio" name="account" onChange={this.handleAccountTypeChange.bind(this, node)} defaultChecked={node.name == Types[0].name} value={node['account-type']} />{node.name}
                  </label>
                )
            }
            selectAccount = (
                <div className="accountForm">
                    <h3 className="accountForm-title">Select Account Type</h3>
                    <div className="select-type accountForm-content" >
                        {selectAccountStack}
                    </div>
                </div>
            );
        } else {
            selectAccount = null
        }

         //
        // This sections builds the parameters for the account details.
        if (Account.params) {
            var paramsStack = [];
            var optionalField = '';
            for (var i = 0; i < Account.params.length; i++) {
                var node = Account.params[i];
                var value = ""
                if (Account[Account['account-type']]) {
                    value = Account[Account['account-type']][node.ref]
                }
                if (this.props.edit && Account.params) {
                    value = Account.params[node.ref];
                }
                paramsStack.push(
                    <TextInput key={node.label} className="accountForm-input" label={node.label} required={!node.optional}  onChange={this.props.store.handleParamChange(node)} value={value} />
                );
            }
            params = (
                <li className="create-fleet-pool accountForm">
                    <h3  className="accountForm-title"> {isEdit ? 'Update' : 'Enter'} Account Details</h3>
                    <div className="accountForm-content">
                        {paramsStack}
                    </div>
                </li>
            )
        } else {
            params = (
                <li className="create-fleet-pool accountForm">
                    <h3 className="accountForm-title"> {isEdit ? 'Update' : 'Enter'}</h3>
                    <label style={{'marginLeft':'17px', color:'#888'}}>No Details Required</label>
                </li>
            )
        }

        // This section builds elements that only show up in the edit page.
        if (isEdit) {
            name = <label>{Account.name}</label>;
            buttons = [
                <Button key="2" onClick={this.handleDelete} className="light" label="Remove Account" />,
                <Button key="3" onClick={this.cancel} className="light" label="Cancel" />,
                <Button key="4" role="button" onClick={this.update.bind(this)} className="update dark" label="Update" />
            ];
            resfreshStatus = Account['connection-status'] ? (
                <div className="accountForm">
                    <div className="accountForm-title accountForm-title--edit">
                        Connection Status
                    </div>
                    <div className="accountForm-content" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <AccountConnectivityStatus status={Account['connection-status'].status} />
                            {Account['connection-status'].status.toUpperCase()}
                        </div>
                            <Button className="refreshList light" onClick={this.props.store.refreshAccount.bind(this, Account.name, AccountType)} label="REFRESH STATUS"></Button>
                    </div>
                    {
                        Account['connection-status'].status.toUpperCase() === 'FAILURE' ?
                        displayFailureMessage(Account['connection-status'].details) : null
                    }
                </div>
            ) : null;
            // cloudResourcesStateHTML = (
            //     <div className="accountForm">
            //         <h3 className="accountForm-title">Resources Status</h3>
            //         <div className="accountForm-content" >
            //         <ul>
            //             {
            //                 cloudResources && props.AccountMeta.resources[Account['account-type']].map(function(r, i) {

            //                     return (
            //                         <li key={i}>
            //                             {r}: {cloudResources[r]}
            //                         </li>
            //                     )
            //                 }) || 'No Additional Resources'
            //             }
            //         </ul>
            //         </div>
            //     </div>
            // )
        }

        var html = (

              <form className="app-body create Accounts"  onSubmit={this.preventDefault} onKeyDown={this.evaluateSubmit}>
                <div className="noticeSubText noticeSubText_right">
                    * required
                </div>
                <div className="associateSdnAccount accountForm">
                    <h3 className="accountForm-title">Account</h3>
                    <div className="accountForm-content" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h4 style={{flex: '1'}}>{name}</h4>
                        { isEdit ?
                            (
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <img src={store.getImage(Account['account-type'])}/> {props.AccountMeta.labelByType[Account['account-type']]}
                                </div>)
                            : null
                        }
                    </div>
                </div>

                  {selectAccount}
                  {sdnAccounts}
                  {resfreshStatus}
                  {cloudResourcesStateHTML}
                  <ol className="flex-row">
                      {params}
                  </ol>
                  <div className="form-actions">
                      {buttons}
                  </div>
              </form>
        )
        return html;
    }
}

function displayFailureMessage(msg) {
    return (
        <div className="accountForm-content" style={{maxWidth: '600px'}}>
            <div style={{paddingBottom: '1rem'}}>Details:</div>
            <div>
                {msg}
            </div>

        </div>
    )
}

class SelectOption extends React.Component {
  constructor(props){
    super(props);
  }
  handleOnChange = (e) => {
    this.props.onChange(JSON.parse(e.target.value));
  }
  render() {
    let html;
    html = (
      <select className={this.props.className} onChange={this.handleOnChange}>
        {
          this.props.options.map(function(op, i) {
            return <option key={i} value={JSON.stringify(op.value)}>{op.label}</option>
          })
        }
      </select>
    );
    return html;
  }
}
SelectOption.defaultProps = {
  options: [],
  onChange: function(e) {
    console.dir(e)
  }
}

function removeTrailingWhitespace(Account) {
             var type = Account['account-type'];
            var params = Account.params;

            if(params) {
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].ref;
                    if(typeof(Account[type][param]) == 'string') {
                        Account[type][param] = Account[type][param].trim();
                    }
                }
            }

            let nestedParams = Account.nestedParams;
            if (nestedParams && nestedParams.params) {
                for (let i = 0; i < nestedParams.params.length; i++) {
                    let nestedParam = nestedParams.params[i].ref;
                    let nestedParamValue = Account[type][nestedParams['container-name']][nestedParam];
                    if (typeof(nestedParamValue) == 'string') {
                        Account[type][nestedParams['container-name']][nestedParam] = nestedParamValue.trim();
                    }
                }
            }
            return Account;
}

export default SkyquakeComponent(Account)
