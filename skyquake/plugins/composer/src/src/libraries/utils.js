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

import _cloneDeep from 'lodash/cloneDeep';
import _isArray from 'lodash/isArray';
import _map from 'lodash/map';
import _flatten from 'lodash/flatten';
import _find from 'lodash/find';
import _toNumber from 'lodash/toNumber';
import _isNumber from 'lodash/isNumber';
import _clone from 'lodash/clone';

export default {
	addAuthorizationStub(xhr) {
		xhr.setRequestHeader('Authorization', 'Basic YWRtaW46YWRtaW4=');
	},
	getSearchParams(url) {
		var a = document.createElement('a');
		a.href = url;
		var params = {};
		var items = a.search.replace('?', '').split('&');
		for (var i = 0; i < items.length; i++) {
			if (items[i].length > 0) {
				var key_value = items[i].split('=');
				params[key_value[0]] = decodeURIComponent(key_value[1]);
			}
		}
		return params;
	},
	parseJSONIgnoreErrors(txt) {
		try {
			return JSON.parse(txt);
		} catch (ignore) {
			return {};
		}
	},
	resolvePath(obj, path) {
		// supports a.b, a[1] and foo[bar], etc.
		// where obj is ['nope', 'yes', {a: {b: 1}, foo: 2}]
		// then [1] returns 'yes'; [2].a.b returns 1; [2].a[foo] returns 2;
		path = path.split(/[\.\[\]]/).filter(d => d);
		return path.reduce((r, p) => {
			if (r) {
				return r[p];
			}
		}, obj);
	},
	assignPathValue(obj, path, value) {
		path = path.split(/[\.\[\]]/).filter(d => d);
		// enable look-ahead to determine if type is array or object
		const pathCopy = path.slice();
		// last item in path used to assign value on the resolved object
		const name = path.pop();
		const resolvedObj = path.reduce((r, p, i) => {
			if (typeof(r[p]) !== 'object') {
				// look-ahead to see if next path item is a number
				const isArray = !isNaN(parseInt(pathCopy[i + 1], 10));
				r[p] = isArray ? [] : {}
			}
			return r[p];
		}, obj);
		resolvedObj[name] = value;
	},
	updatePathValue(obj, path, value, isCase) {
		// todo: replace implementation of assignPathValue with this impl and
		// remove updatePathValue (only need one function, not both)
		// same as assignPathValue except removes property if value is undefined
		path = path.split(/[\.\[\]]/).filter(d => d);
		const isRemove = typeof value === 'undefined';
		// enable look-ahead to determine if type is array or object
		const pathCopy = path.slice();
		// last item in path used to assign value on the resolved object
		const name = path.pop();
		const resolvedObj = path.reduce((r, p, i) => {
			// look-ahead to see if next path item is a number
			const index = parseInt(pathCopy[i + 1], 10);
			const isArray = !isNaN(index);
			if (typeof(r[p]) !== 'object') {
				r[p] = isArray ? [] : {}
			}
			if (isRemove && ((i + 1) === path.length)) {
				if (isArray) {
					r[p] = r[p].filter((d, i) => i !== index);
				} else {
					if(isCase) {
						delete r[name];
					} else {
						delete r[p][name];
					}
				}
			}
			if(isCase) {
				return r;
			} else {
				return r[p];
			}

		}, obj);
		if (!isRemove) {
			resolvedObj[name] = value;
		}
	},
	removePathValue(obj, path, isCase) {
		// note updatePathValue removes value if third argument is undefined
		return this.updatePathValue(obj, path, undefined, isCase);
	},

	suffixAsInteger: (field) => {
		return (obj) =>{
			const str = String(obj[field]);
			const value = str.replace(str.replace(/[\d]+$/, ''), '');
			return 1 + parseInt(value, 10) || 0;
		};
	},

	toBiggestValue: (maxIndex, curIndex) => Math.max(maxIndex, curIndex),

	isRelativePath (path) {
		if (path.split('/')[0] == '..') {
			return true;
		}
		return false;
	},

	getResults (topLevelObject, pathArray) {
		let objectCopy = _cloneDeep(topLevelObject);
		let i = pathArray.length;
		let results = [];

		while(pathArray[pathArray.length - i]) {
			if (_isArray(objectCopy[pathArray[pathArray.length - i]])) {
				if (i == 2) {
					results = _map(objectCopy[pathArray[pathArray.length - i]], pathArray[pathArray.length - 1]);
				} else {
					objectCopy = objectCopy[pathArray[pathArray.length - i]];
				}
			} else if (_isArray(objectCopy)) {
				objectCopy.map((object) => {
					if (_isArray(object[pathArray[pathArray.length - i]])) {
						if (i == 2) {
							results = results.concat(_map(object[pathArray[pathArray.length - i]], pathArray[pathArray.length - 1]));
						}
					}
				})
			}
			i--;
		}

		return results;
	},

	getAbsoluteResults (topLevelObject, pathArray) {
		let i = pathArray.length;
		let objectCopy = _cloneDeep(topLevelObject);
		let results = [];

		let fragment = pathArray[pathArray.length - i]

		while (fragment) {
			if (i == 1) {
				// last fragment
				if (_isArray(objectCopy)) {
					// results will be obtained from a map
					results = _map(objectCopy, fragment);
				} else {
					// object
					if (fragment.match(/\[.*\]/g)) {
						// contains a predicate
						// shouldn't reach here
						console.log('Something went wrong while resolving a leafref. Reached a leaf with predicate.');
					} else {
						// contains no predicate
						results.push(objectCopy[fragment]);
					}
				}
			} else {
				if (_isArray(objectCopy)) {
					// is array
					objectCopy = _map(objectCopy, fragment);

					// If any of the deeper object is an array, flatten the entire list.
					// This would usually be a bad leafref going out of its scope.
					// Log it too
					for (let i = 0; i < objectCopy.length; i++) {
						if (_isArray(objectCopy[i])) {
							objectCopy = _flatten(objectCopy);
							console.log('This might be a bad leafref. Verify with backend team.')
							break;
						}
					}
				} else {
					// is object
					if (fragment.match(/\[.*\]/g)) {
						// contains a predicate
						let predicateStr = fragment.match(/\[.*\]/g)[0];
						// Clip leading [ and trailing ]
						predicateStr = predicateStr.substr(1, predicateStr.length - 2);
						const predicateKeyValue = predicateStr.split('=');
						const predicateKey = predicateKeyValue[0];
						const predicateValue = predicateKeyValue[1];
						// get key for object to search into
						let key = fragment.split('[')[0];
						let searchObject = {};
						searchObject[predicateKey] = predicateValue;
						let found = _find(objectCopy[key], searchObject);
						if (found) {
							objectCopy = found;
						} else {
							// check for numerical value
							if (predicateValue != "" &&
								predicateValue != null &&
								predicateValue != NaN &&
								predicateValue != Infinity &&
								predicateValue != -Infinity) {
								let numericalPredicateValue = _toNumber(predicateValue);
								if (_isNumber(numericalPredicateValue)) {
									searchObject[predicateKey] = numericalPredicateValue;
									found = _find(objectCopy[key], searchObject);
								}
							}
							if (found) {
								objectCopy = found;
							} else {
								return [];
							}
						}
					} else {
						// contains no predicate
						objectCopy = objectCopy[fragment];
						if (!objectCopy) {
							// contains no value
							break;
						}
					}
				}
			}
			i--;
			fragment = pathArray[pathArray.length - i];
		}

		return results;
	},

	resolveCurrentPredicate (leafRefPath, container, pathCopy) {
		if (leafRefPath.indexOf('current()') != -1) {
			// contains current

			// Get the relative path from current
			let relativePath = leafRefPath.match("current\\(\\)\/(.*)\]");
			let relativePathArray = relativePath[1].split('/');

			while (relativePathArray[0] == '..') {
				pathCopy.pop();
				relativePathArray.shift();
			}

			// Supports only one relative path up
			// To support deeper paths, will need to massage the string more
			// i.e. change '/'' to '.'
			const searchPath = pathCopy.join('.').concat('.', relativePathArray[0]);
			const searchValue = this.resolvePath(container.model, searchPath);

			const predicateStr = leafRefPath.match("(current.*)\]")[1];
			leafRefPath = leafRefPath.replace(predicateStr, searchValue);
		}
		return leafRefPath;
	},

	resolveLeafRefPath (catalogs, leafRefPath, fieldKey, path, container) {
		let pathCopy = _clone(path);
		// Strip any prefixes
		let leafRefPathCopy = leafRefPath.replace(/[\w\d]*:/g, '');
		// Strip any spaces
		leafRefPathCopy = leafRefPathCopy.replace(/\s/g, '');

		// resolve any current paths
		leafRefPathCopy = this.resolveCurrentPredicate(leafRefPathCopy, container, pathCopy);

		// Split on delimiter (/)
		const pathArray = leafRefPathCopy.split('/');
		let fieldKeyArray = fieldKey.split(':');
		let results = [];

		// Check if relative path or not
		// TODO: Below works but
		// better to convert the pathCopy to absolute/rooted path
		// and use the absolute module instead
		if (this.isRelativePath(leafRefPathCopy)) {
			let i = pathArray.length;
			while ((pathArray[pathArray.length - i] == '..') && fieldKeyArray.length > 1) {
				fieldKeyArray.splice(-1, 1);
				if (!isNaN(Number(fieldKeyArray[fieldKeyArray.length - 1]))) {
					// found a number, so an index. strip it
					fieldKeyArray.splice(-1, 1);
				}
				i--;
			}

			// traversed all .. - now traverse down
			if (fieldKeyArray.length == 1) {
				for (let key in catalogs) {
					for (let subKey in catalogs[key]) {
						let found = _find(catalogs[key][subKey], {id: fieldKeyArray[0]});
						if (found) {
							results = this.getAbsoluteResults(found, pathArray.splice(-i, i));
							return results;
						}
					}
				}
			} else if (fieldKeyArray.length == 2) {
				for (let key in catalogs) {
					for (let subKey in catalogs[key]) {
						console.log(key, subKey);
						var found = _find(catalogs[key][subKey], {id: fieldKeyArray[0]});
						if (found) {
							for (let foundKey in found) {
								if (_isArray(found[foundKey])) {
									let topLevel = _find(found[foundKey], {id: fieldKeyArray[1]});
									if (topLevel) {
										results = this.getAbsoluteResults(topLevel, pathArray.splice(-i, i));
										return results;
									}
								} else {
									if (foundKey == fieldKeyArray[1]) {
										results = this.getAbsoluteResults(found[foundKey], pathArray.splice(-i, i));
										return results;
									}
								}
							}
						}
					}
				}
			} else if (fieldKeyArray.length == 3) {
				for (let key in catalogs) {
					for (let subKey in catalogs[key]) {
						let found = _find(catalogs[key][subKey], {id: fieldKeyArray[0]});
						if (found) {
							for (let foundKey in found) {
								if (_isArray(found[foundKey])) {
									let topLevel = _find(found[foundKey], {id: fieldKeyArray[1]});
									if (topLevel) {
										results = this.getAbsoluteResults(topLevel, pathArray.splice(-i, i));
										return results;
									}
								} else {
									if (foundKey == fieldKeyArray[1]) {
										results = this.getAbsoluteResults(found[foundKey], pathArray.splice(-i, i));
										return results;
									}
								}
							}
						}
					}
				}
			} else {
				// not supported - too many levels deep ... maybe some day
				console.log('The relative path is from a node too many levels deep from root. This is not supported at the time');
			}
		} else {
			// absolute path
			if (pathArray[0] == "") {
				pathArray.splice(0, 1);
			}

			let catalogKey = pathArray[0];
			let topLevelObject = {};

			topLevelObject[catalogKey] = catalogs[catalogKey];

			results = this.getAbsoluteResults(topLevelObject, pathArray);

			return results;
		}
	}
}
