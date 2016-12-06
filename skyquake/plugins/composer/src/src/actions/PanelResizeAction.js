
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
 * Created by onvelocity on 8/11/15.
 */
import alt from '../alt';
import changeCase from 'change-case'

/*
 This class manages Composer Layout State
 */

const cleanNameRegExp = /(-is-tray-open|panel-)/i;

class PanelResizeAction {

	resize(e) {

		/* we expect two types of resize events:
		 * window resize - invoked by window
		 * resize-manager resize - invoked by ResizeManager
		 *
		 * normalize the data needed by the Composer Layout or ignore invalid ones
		 *
		 * */

		if (!e) {
			return false;
		}

		if (e.detail && e.detail.side) {
			// a ResizeManager event
			this.dispatch(PanelResizeAction.buildResizeManagerInfo(e))
		} else {
			// a window event
			this.dispatch(PanelResizeAction.buildWindowResizeInfo(e));
		}

	}

	static buildWindowResizeInfo(e) {
		return e;
	}

	static buildResizeManagerInfo(e) {
		const info = Object.assign({originalEvent: e}, e.detail);
		const name = changeCase.paramCase(info.target.className.replace(cleanNameRegExp, ''));
		info.type = 'resize-manager.resize.' + name;
		return info;
	}

}

export default alt.createActions(PanelResizeAction);
