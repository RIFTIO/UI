
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
'use strict';

import alt from '../alt'
import CatalogPanelTrayActions from '../actions/CatalogPanelTrayActions'

class CatalogPanelStore {

	constructor() {
		this.isTrayOpen = 0;
		this.bindAction(CatalogPanelTrayActions.OPEN, this.openTray);
		this.bindAction(CatalogPanelTrayActions.CLOSE, this.closeTray);
		this.bindAction(CatalogPanelTrayActions.TOGGLE_OPEN_CLOSE, this.toggleTrayOpenClose);
	}

	openTray() {
		// note incrementing integer will force a state change needed to redraw tray drop zones
		this.setState({isTrayOpen: this.isTrayOpen + 1});
	}

	closeTray() {
		this.setState({isTrayOpen: 0});
	}

	toggleTrayOpenClose() {
		this.setState({isTrayOpen: this.isTrayOpen === 0 ? 1 : 0});
	}

}

export default alt.createStore(CatalogPanelStore, 'CatalogPanelStore');
