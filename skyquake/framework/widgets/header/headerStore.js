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

import HeaderActions from './headerActions.js';
import Alt from '../skyquake_container/skyquakeAltInstance';

class HeaderStoreConstructor {
    constructor() {
        var self = this;
        this.validateErrorEvent = 0;
        this.validateErrorMsg = '';
        this.bindActions(HeaderActions);
        this.exportPublicMethods({
            validateReset: self.validateReset
        })
    }
    showError = (msg) => {
        console.log('message received');
        this.setState({
            validateErrorEvent: true,
            validateErrorMsg: msg
        });
    }
    validateReset = () => {
        this.setState({
            validateErrorEvent: false
        });
    }
}

export default Alt.createStore(HeaderStoreConstructor)
