/**
 * Created by onvelocity on 1/27/16.
 *
 * This class provides methods to get the metadata about descriptor models.
 */

'use strict';

import _ from 'lodash'
import utils from './../utils'
import DescriptorModelMetaProperty from './DescriptorModelMetaProperty'
import CommonUtils from 'utils/utils';
const assign = Object.assign;

const exportInnerTypesMap = {
	'constituent-vnfd': 'nsd.constituent-vnfd',
	'vdu': 'vnfd.vdu'
};

function getPathForType(type) {
	if (exportInnerTypesMap[type]) {
		return exportInnerTypesMap[type];
	}
	return type;
}

let modelMetaByPropertyNameMap = [];

let cachedDescriptorModelMetaRequest = null;

export default {
	init() {
		if (!cachedDescriptorModelMetaRequest) {
			cachedDescriptorModelMetaRequest = new Promise(function(resolve, reject) {
				CommonUtils.getDescriptorModelMeta().then(function(data) {
					let DescriptorModelMetaJSON = data;
					modelMetaByPropertyNameMap = Object.keys(DescriptorModelMetaJSON).reduce((map, key) => {
						function mapProperties(parentMap, parentObj) {
							parentMap[':meta'] = parentObj;
							const properties = parentObj && parentObj.properties ? parentObj.properties : [];
							properties.forEach(p => {
								parentMap[p.name] = mapProperties({}, assign(p, {':qualified-type': parentObj[':qualified-type'] + '.' + p.name}));
								return map;
							}, parentMap);
							return parentMap;
						}
						map[key] = mapProperties({}, assign(DescriptorModelMetaJSON[key], {':qualified-type': key}));
						return map;
					}, {});

					(() => {
						// initialize the UI centric properties that CONFD could care less about
						utils.assignPathValue(modelMetaByPropertyNameMap, 'nsd.meta.:meta.preserve-line-breaks', true);
						utils.assignPathValue(modelMetaByPropertyNameMap, 'vnfd.meta.:meta.preserve-line-breaks', true);
						utils.assignPathValue(modelMetaByPropertyNameMap, 'vnfd.vdu.cloud-init.:meta.preserve-line-breaks', true);
						utils.assignPathValue(modelMetaByPropertyNameMap, 'nsd.constituent-vnfd.vnf-configuration.config-template.:meta.preserve-line-breaks', true);
					})();
					resolve();
				}, function(error) {
					cachedDescriptorModelMetaRequest = null;
				})
			})
		}

		return cachedDescriptorModelMetaRequest;
	},
	createModelInstanceForType(typeOrPath) {
		const modelMeta = this.getModelMetaForType(typeOrPath);
		return DescriptorModelMetaProperty.createModelInstance(modelMeta);
	},
	getModelMetaForType(typeOrPath, filterProperties = () => true) {
		// resolve paths like 'nsd' or 'vnfd.vdu' or 'nsd.constituent-vnfd'
		const found = utils.resolvePath(modelMetaByPropertyNameMap, getPathForType(typeOrPath));
		if (found) {
			const uiState = _.cloneDeep(found[':meta']);
			uiState.properties = uiState.properties.filter(filterProperties);
			return uiState;
		}
		console.warn('no model uiState found for type', typeOrPath);
	},
	getModelFieldNamesForType(typeOrPath) {
		// resolve paths like 'nsd' or 'vnfd.vdu' or 'nsd.constituent-vnfd'
		const found = utils.resolvePath(modelMetaByPropertyNameMap, getPathForType(typeOrPath));
		if (found) {
			let result = [];
			found[':meta'].properties.map((p) => {
				// if(false) {
				if(p.type == 'choice') {
					result.push(p.name)
					return p.properties.map(function(q){
						result.push(q.properties[0].name);
					})

				} else  {
					return result.push(p.name);
				}
			})
			return result;
		}
		console.warn('no model uiState found for type', typeOrPath);
	}
}
