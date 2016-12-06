/*
 * STANDARD_RIFT_IO_COPYRIGHT
 */
import AccountActions from './configActions.js';
import AccountSource from './configSource.js';

let tempData = {
    "rw-launchpad:resource-orchestrator": {
        "name": "test",
        "account-type": "openmano",
        "openmano": {
            "port": 9090,
            "tenant-id": "d2581f60-4f28-11e6-9732-fa163e4bfd3e",
            "host": "10.0.55.39"
        }
    }
}

var rw = require('utils/rw.js');
var altImage = rw.getSearchParams(window.location).alt_image;

let Params = {
    //Config Agent
    ConfigAgent: {

    }
}



let AccountMeta = {
    'account-types': ['openmano', 'rift-ro'],
    'rift-ro' : [],
    'openmano' : [{
        label: "Host",
        ref: 'host'
    }, {
        label: "Port",
        ref: 'port'
    }, {
        label: "Tenant ID",
        ref: 'tenant-id'
    }],
    imageByType: {
        "openmano": altImage || require("../../images/openmano.png"),
        "rift-ro": require("../../images/riftio.png")

    },
    labelByType: {
        "openmano": "OpenStack",
        "rift-ro": "Cloudsim"
    }
}

export default class ConfigStore {
    constructor() {
        this.account = {};
        this.accountType = 'openmano';
        this.refreshingAll = false;
        this.sdnOptions = [];
        this.AccountMeta = AccountMeta;
        this.bindActions(AccountActions(this.alt));
        this.registerAsync(AccountSource);
        this.exportPublicMethods({
            getROAccount: this.getROAccount,
            handleParamChange: this.handleParamChange,
            handleNameChange: this.handleNameChange,
            handleAccountTypeChange: this.handleAccountTypeChange,
            updateAccount: this.updateAccount,
            getImage: this.getImage
        })
    }
    setAccountTemplate = (AccountType) => {
        let state = {};
        let account = {
            name: '',
            'account-type': AccountType || 'rift-ro',
        };
        account[AccountType || 'rift-ro'] = {};
        state.account = account;
        state.accountType = AccountType;
        if (AccountType == this.initialAccountType) {
            state.account = this.initialAccount;
        }
        this.setState(state)
    }
    updateAccount = (account) => {
        this.setState({account:account})
    }
    getROAccount = () => {
        let data = tempData["rw-launchpad:resource-orchestrator"]
        this.setState({
            account: data
        })
    }
    handleNameChange = (event) => {
        var account = this.account;
        account.name = event.target.value;
        this.setState(
             {
                account:account
             }
        );
    }
    handleAccountTypeChange = (event) => {
        var accountType = event.target.value;
        this.setAccountTemplate(accountType);
    }
    handleParamChange(node, event) {
        return function(event) {
            var account = this.state.account;
            account[account['account-type']][node.ref] = event.target.value;
            this.updateAccount(account);
        }.bind(this);
    }
    getImage = (type) => {
        return AccountMeta.imageByType[type];
    }
    getResourceOrchestratorSuccess = (data) => {
        this.alt.actions.global.hideScreenLoader.defer();
        if(!data) {
            this.setAccountTemplate(false)
        } else {
            this.setState({
                initialAccount: data,
                initialAccountType: data['account-type'],
                account: data,
                accountType: data['account-type'] || 'rift-ro'
            });
        }
    }
    updateResourceOrchestratorSuccess = (data) => {
        this.alt.actions.global.showNotification.defer({type:'success', msg: 'Resource Orchestrator has been succesfully updated'});
    }
}
