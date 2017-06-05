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

import DescriptorModelMetaFactory from './DescriptorModelMetaFactory'

const DescriptorModelSerializer = {
	/**
	 * Create a json object that can be sent to the backend. I.e. CONFD JSON compliant to the schema definition.
	 * 
	 * @param {any} model - the data blob from the editor. This is not modified.
	 * @returns cleansed data model
	 */
	serialize(model) {
		if (!model.uiState) {
			console.error('model uiState null', model);
			return {};
		}
		const path = model.uiState['qualified-type'] || model.uiState['type'];
		const metaModel = DescriptorModelMetaFactory.getModelMetaForType(path);
		const data = {};
		const name = model.uiState['type'];
		data[name] = model; // lets get the meta hierachy from the top
		const result = metaModel.serialize(data);
		console.debug(result);
		return result;
	}
}
export default DescriptorModelSerializer;
