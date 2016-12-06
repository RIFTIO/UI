
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
/**
 * Created by onvelocity on 10/14/15.
 */
'use strict';

import alt from '../alt'
import React from 'react'
import ModalOverlayActions from '../actions/ModalOverlayActions'
import LoadingIndicator from '../components/LoadingIndicator'

class ModalOverlayStore {

	constructor() {
		this.ui = <LoadingIndicator/>;
		this.visible = false;
		this.bindActions(ModalOverlayActions);
	}

	showModalOverlay(ui = <LoadingIndicator/>) {
		this.setState({visible: true, ui: ui});
	}

	hideModalOverlay() {
		this.setState({visible: false, ui: null});
	}

}

ModalOverlayStore.config = {
	onSerialize: function() {
		return {};
	}
};

export default alt.createStore(ModalOverlayStore, 'ModalOverlayStore');
