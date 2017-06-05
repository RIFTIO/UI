/**
 * Created by onvelocity on 1/27/16.
 *
 * This class provides methods to get the metadata about descriptor models.
 */

import _cloneDeep from 'lodash/cloneDeep'
import _isEmpty from 'lodash/isEmpty'
import _pick from 'lodash/pick'
import _get from 'lodash/get'
import _set from 'lodash/set'
import DescriptorModelMetaProperty from './DescriptorModelMetaProperty'
import CommonUtils from 'utils/utils';
const assign = Object.assign;

const exportInnerTypesMap = {
	'constituent-vnfd': 'nsd.constituent-vnfd',
    'config-parameter-map': 'nsd.config-parameter-map',
	'vdu': 'vnfd.vdu'
};

function getPathForType(type) {
	if (exportInnerTypesMap[type]) {
		return exportInnerTypesMap[type];
	}
	return type;
}

const uiStateToSave = ['containerPositionMap'];

//////
// Data serialization will be done on a meta model basis. That is,
// given a schema and data, retrieve from the data only that which is 
// defined by the schema.
//

// serialize data for a list of properties
function serializeAll(properties, data) {
	if (data) {
		return properties.reduce((obj, p) => {
			return Object.assign(obj, p.serialize(data));
		}, {});
	}
	return null;
}

function serialize_container(data) {
	data = data[this.name];
	if (_isEmpty(data)) {
		return null;
	}
	let obj = {};
	obj[this.name] = serializeAll(this.properties, data);
	return obj;
}

function serialize_list(data) {
	data = data[this.name];
	if (data) {
		if (!Array.isArray(data)) {
			return serializeAll(this.properties, data);
		} else if (data.length) {
			let list = data.reduce((c, d) => {
				let obj = serializeAll(this.properties, d);
				if (!_isEmpty(obj)) {
					c.push(obj);
				}
				return c;
			}, []);
			if (!_isEmpty(list)){
				let obj = {};
				obj[this.name] = list;
				return obj;
			}
		}
	}
	return null;
}

function serialize_leaf(data) {
	let value = data[this.name];
	if (value === null || typeof value === 'undefined' || value === '') {
		return null;
	}
	let obj = {};
	if (this['data-type'] === 'empty') {
		value = ''; // empty string does get sent as value
	}
	obj[this.name] = value;
	return obj;
}

function serialize_leaf_empty(data) {
	let value = data[this.name];
	if (value) {
		let obj = {};
		obj[this.name] = "";
		return obj;
	}
	return null;
}

function serialize_leaf_list(data) {
	data = data[this.name];
	if (data) {
		data = data.reduce((result, value) => {
			if (value !== '' && value !== null && value !== undefined && typeof value !== 'object') {
				result.push(value);
			}
			return result;
		}, []);
		if (data.length){
			let obj = {};
			obj[this.name] = data;
			return obj;
		}
	}
	return null;
}

function serialize_choice(data) {
	let keys = Object.keys(data);
	if (keys) {
		const chosen = this.properties.find(
			c => c.type === 'case' && c.properties && c.properties.some(p => keys.indexOf(p.name) > -1));
		return chosen && serializeAll(chosen.properties, data);
	}
	return null;
}

function serialize_case(data) {
	return Serializer.container.call(this, data);
}

// special ui data handler for leaf of type string named 'meta' 
function serialize_meta(data) {
	let uiState = data['uiState'];
	let meta = uiState && _pick(uiState, uiStateToSave);
	// if there is no uiState to save perhaps this was not a ui state property
	return _isEmpty(meta) ? null : {meta: JSON.stringify(meta)};
}

function serialize_unsupported(data) {
	console.error('unsupported property', property);
	return null;
}

function getSerializer(property) {
	switch (property.name) {
		case 'rw-nsd:meta':
		case 'rw-vnfd:meta':
			return serialize_meta.bind(property);
	}
	switch (property.type) {
		case 'list':
		return serialize_list.bind(property);
		case 'container':
		return serialize_container.bind(property);
		case 'choice':
		return serialize_choice.bind(property);
		case 'case':
		return serialize_case.bind(property);
		case 'leaf_list':
		return serialize_leaf_list.bind(property);
		case 'leaf':
		switch (property['data-type']){
			case 'empty':
			return serialize_leaf_empty.bind(property);
		}
		return serialize_leaf.bind(property);
	}
	return serialize_unsupported.bind(property);
}

let modelMetaByPropertyNameMap = [];

let cachedDescriptorModelMetaRequest = null;

export default {
	init() {
		if (!cachedDescriptorModelMetaRequest) {
			cachedDescriptorModelMetaRequest = new Promise(function (resolve, reject) {
				CommonUtils.getDescriptorModelMeta().then(function (data) {
					let DescriptorModelMetaJSON = data;
					modelMetaByPropertyNameMap = Object.keys(DescriptorModelMetaJSON).reduce((map, key) => {
						function mapProperties(parentMap, parentObj) {
							// let's beef up the meta info with a helper (more to come?)
							parentObj.serialize = getSerializer(parentObj);
							parentMap[':meta'] = parentObj;
							const properties = parentObj && parentObj.properties ? parentObj.properties : [];
							properties.forEach(p => {
								parentMap[p.name] = mapProperties({}, assign(p, {
									':qualified-type': parentObj[':qualified-type'] + '.' + p.name
								}));
								return map;
							}, parentMap);
							return parentMap;
						}
						map[key] = mapProperties({}, assign(DescriptorModelMetaJSON[key], {
							':qualified-type': key
						}));
						return map;
					}, {});

					(() => {
						// initialize the UI centric properties that CONFD could care less about
						_set(modelMetaByPropertyNameMap, 'nsd.meta.:meta.preserve-line-breaks', true);
						_set(modelMetaByPropertyNameMap, 'vnfd.meta.:meta.preserve-line-breaks', true);
						_set(modelMetaByPropertyNameMap, 'vnfd.vdu.cloud-init.:meta.preserve-line-breaks', true);
						_set(modelMetaByPropertyNameMap, 'nsd.constituent-vnfd.vnf-configuration.config-template.:meta.preserve-line-breaks', true);
					})();
					resolve();
				}, function (error) {
					cachedDescriptorModelMetaRequest = null;
				})
			})
		}

		return cachedDescriptorModelMetaRequest;
	},
	/**
	 * Create a new instance of the indicated property and, if relevent, use the given
	 * unique name for the instance's key (see generateItemUniqueName)
	 * 
	 * @param {Object | string} typeOrPath a property definition object or a path to a property 
	 * @param [{string}] uniqueName optional 
	 * @returns 
	 */
	createModelInstanceForType(typeOrPath, uniqueName) {
		const modelMeta = this.getModelMetaForType(typeOrPath);
		return DescriptorModelMetaProperty.createModelInstance(modelMeta, uniqueName);
	},
	getModelMetaForType(typeOrPath, filterProperties = () => true) {
		// resolve paths like 'nsd' or 'vnfd.vdu' or 'nsd.constituent-vnfd'
		const found = _get(modelMetaByPropertyNameMap, getPathForType(typeOrPath));
		if (found) {
			const uiState = _cloneDeep(found[':meta']);
			uiState.properties = uiState.properties.filter(filterProperties);
			return uiState;
		}
		console.warn('no model uiState found for type', typeOrPath);
	},
	getModelFieldNamesForType(typeOrPath) {
		// resolve paths like 'nsd' or 'vnfd.vdu' or 'nsd.constituent-vnfd'
		const found = _get(modelMetaByPropertyNameMap, getPathForType(typeOrPath));
		if (found) {
			let result = [];
			found[':meta'].properties.map((p) => {
				// if(false) {
				if (p.type == 'choice') {
					result.push(p.name)
					return p.properties.map(function (q) {
						result.push(q.properties[0].name);
					})

				} else {
					return result.push(p.name);
				}
			})
			return result;
		}
		console.warn('no model uiState found for type', typeOrPath);
	},
	/**
	 * For a list with a single valued key that is of type string, generate a unique name
	 * for a new entry to be added to the indicated list. This name will use the provided
	 * prefix (or the list's name) followed by a number. The number will be based on the
	 * current length of the array but will insure there is no collision with an existing
	 * name.
	 * 
	 * @param {Array} list the list model data
	 * @param {prooerty} property the schema definition of the list 
	 * @param [{any} prefix] the perferred prefix for the name. If not provide property.name
	 *  will be used. 
	 * @returns {string}
	 */
	generateItemUniqueName(list, property, prefix) {
		if (property.type !== 'list' ||
			property.key.length !== 1 ||
			property.properties.find(prop => prop.name === property.key[0])['data-type'] !== 'string') {
			// only support list with a single key of type string
			return null;
		}
		if (!prefix) {
			prefix = property.name;
		}
		let key = property.key[0];
		let suffix = list ? list.length + 1 : 1
		let keyValue = prefix + '-' + suffix;

		function makeUniqueName() {
			if (list) {
				for (let i = 0; i < list.length; i = ++i) {
					if (list[i][key] === keyValue) {
						keyValue = keyValue + '-' + (i + 1);
						makeUniqueName(); // not worried about recursing too deep (chances ??)
						break;
					}
				}
			}
		}
		makeUniqueName();
		return keyValue;
	}

}