
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
 * Created by onvelocity on 8/20/15.
 */
'use strict';

import React from 'react'

import imgOnboard from '../../../node_modules/open-iconic/svg/cloud-upload.svg'

const message = {
	detailsWelcome() {
		return <p className="welcome-message">Select an object to view details.</p>;
	},
	canvasWelcome() {
		return (
			<span>
				<p className="welcome-message">Double-click a Descriptor to open.</p>
				<p className="welcome-message">Or drag a Descriptor to add to Canvas.</p>
			</span>
		);
	},
	get showMoreTitle() {
		return 'Show More';
	},
	get showLessTitle() {
		return 'Show Less';
	},
	get catalogWelcome() {
		return <p className="welcome-message">To onboard a descriptor, drag the package to the catalog or click the Onboard button (<img style={{width: '20px'}} src={imgOnboard} />) to select the package.</p>;
	},
	getSaveActionLabel(isNew) {
		return isNew ? 'Onboard' : 'Update';
	}
};

export default message;
