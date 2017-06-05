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
 * Created by onvelocity on 1/18/16.
 *
 * This class generates the form fields used to edit the CONFD JSON model.
 */

import _includes from 'lodash/includes'
import _isArray from 'lodash/isArray'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce';
import _uniqueId from 'lodash/uniqueId';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _has from 'lodash/has';
import utils from '../libraries/utils'
import React from 'react'
import ClassNames from 'classnames'
import changeCase from 'change-case'
import toggle from '../libraries/ToggleElementHandler'
import Button from './Button'
import Property from '../libraries/model/DescriptorModelMetaProperty'
import ComposerAppActions from '../actions/ComposerAppActions'
import CatalogItemsActions from '../actions/CatalogItemsActions'
import DESCRIPTOR_MODEL_FIELDS from '../libraries/model/DescriptorModelFields'
import DescriptorModelFactory from '../libraries/model/DescriptorModelFactory'
import DescriptorModelMetaFactory from '../libraries/model/DescriptorModelMetaFactory'
import SelectionManager from '../libraries/SelectionManager'
import DeletionManager from '../libraries/DeletionManager'
import DescriptorModelIconFactory from '../libraries/model/IconFactory'
import getEventPath from '../libraries/getEventPath'
import CatalogDataStore from '../stores/CatalogDataStore'

import imgAdd from '../../../node_modules/open-iconic/svg/plus.svg'
import imgRemove from '../../../node_modules/open-iconic/svg/trash.svg'

import '../styles/EditDescriptorModelProperties.scss'

const EMPTY_LEAF_PRESENT = '--empty-leaf-set--';

function resolveReactKey(value) {
	const keyPath =  ['uiState', 'fieldKey'];
	if (!_has(value, keyPath)) {
		_set(value, keyPath, _uniqueId());
	}
	return _get(value, keyPath);
}

function getDescriptorMetaBasicForType(type) {
	const basicPropertiesFilter = d => _includes(DESCRIPTOR_MODEL_FIELDS[type], d.name);
	return DescriptorModelMetaFactory.getModelMetaForType(type, basicPropertiesFilter) || {properties: []};
}

function getDescriptorMetaAdvancedForType(type) {
	const advPropertiesFilter = d => !_includes(DESCRIPTOR_MODEL_FIELDS[type], d.name);
	return DescriptorModelMetaFactory.getModelMetaForType(type, advPropertiesFilter) || {properties: []};
}

function getTitle(model = {}) {
	if (typeof model['short-name'] === 'string' && model['short-name']) {
		return model['short-name'];
	}
	if (typeof model.name === 'string' && model.name) {
		return model.name;
	}
	if (model.uiState && typeof model.uiState.displayName === 'string' && model.uiState.displayName) {
		return model.uiState.displayName
	}
	if (typeof model.id === 'string') {
		return model.id;
	}
}

export default function EditDescriptorModelProperties(props) {

	const container = props.container;

	if (!(DescriptorModelFactory.isContainer(container))) {
		return
	}

	function startEditing() {
		DeletionManager.removeEventListeners();
	}

	function endEditing() {
		DeletionManager.addEventListeners();
	}

	function onClickSelectItem(property, path, value, event) {
		event.preventDefault();
		const root = this.getRoot();
		if (SelectionManager.select(value)) {
			CatalogItemsActions.catalogItemMetaDataChanged(root.model);
		}
	}

	function onFocusPropertyFormInputElement(property, path, value, event) {

		event.preventDefault();
		startEditing();

		function removeIsFocusedClass(event) {
			event.target.removeEventListener('blur', removeIsFocusedClass);
			Array.from(document.querySelectorAll('.-is-focused')).forEach(d => d.classList.remove('-is-focused'));
		}

		removeIsFocusedClass(event);

		const propertyWrapper = getEventPath(event).reduce((parent, element) => {
			if (parent) {
				return parent;
			}
			if (!element.classList) {
				return false;
			}
			if (element.classList.contains('property')) {
				return element;
			}
		}, false);

		if (propertyWrapper) {
			propertyWrapper.classList.add('-is-focused');
			event.target.addEventListener('blur', removeIsFocusedClass);
		}

	}

	function buildAddPropertyAction(container, property, path) {
		function onClickAddProperty(property, path, event) {
			event.preventDefault();
			//SelectionManager.resume();
			const create = Property.getContainerCreateMethod(property, this);
			if (create) {
				const model = null;
				create(model, path, property);
			} else {
				const name = path.join('.');
				// get a unique name for the new list item based on the current list content
				// some lists, based on the key, may not get a uniqueName generated here
				const uniqueName = DescriptorModelMetaFactory.generateItemUniqueName(container.model[property.name], property);
				const value = Property.createModelInstance(property, uniqueName);
				utils.assignPathValue(this.model, name, value);
			}
			CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());
		}
		return (
				<Button className="inline-hint" onClick={onClickAddProperty.bind(container, property, path)} label="Add" src={imgAdd} />
		);
	}

	function buildRemovePropertyAction(container, property, path) {
		function onClickRemoveProperty(property, path, event) {
			event.preventDefault();
			const name = path.join('.');
			const removeMethod = Property.getContainerMethod(property, this, 'remove');
			if (removeMethod) {
				removeMethod(utils.resolvePath(this.model, name));
			} else {
				utils.removePathValue(this.model, name);
			}
			CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());
		}
		return (
			<Button className="remove-property-action inline-hint" title="Remove" onClick={onClickRemoveProperty.bind(container, property, path)} label="Remove" src={imgRemove}/>
		);
	}

	function buildField(container, property, path, value, fieldKey) {
		let cds = CatalogDataStore;
		let catalogs = cds.getTransientCatalogs();

		const pathToProperty = path.join('.');
		const isEditable = true;
		const isGuid = Property.isGuid(property);
		const isBoolean = Property.isBoolean(property);
		const isEnumeration = Property.isEnumeration(property);
		const isLeafRef = Property.isLeafRef(property);
		const onFocus = onFocusPropertyFormInputElement.bind(container, property, path, value);
		const placeholder = changeCase.title(property.name);
		const className = ClassNames(property.name + '-input', {'-is-guid': isGuid});
		const fieldValue = value ? (value.constructor.name != "Object") ? value : '' : (isNaN(value) ? undefined : value);

		// process the named field value change
		function processFieldValueChange(name, value) {
			console.debug('processed change for -- ' + name + ' -- with value -- ' + value);
			// this = the container being edited
			if (DescriptorModelFactory.isContainer(this)) {
				utils.assignPathValue(this.model, name, value);
				CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());
			}
		}

		// change handler used for onChange event
		const changeHandler = (handleValueChange, event) => {
			event.preventDefault();
			console.debug(event.target.value);
			handleValueChange(event.target.value);
		};
		// create an onChange event handler for a text field for the specified field path (debounced to accumulate chars)
		const onTextChange = changeHandler.bind(null, _debounce(
			processFieldValueChange.bind(container, pathToProperty), 2000, {maxWait: 5000})); // max wait for short-name
		// create an onChange event handler for a select field for the specified field path
		const onSelectChange = changeHandler.bind(null, processFieldValueChange.bind(container, pathToProperty));
		
		if (isEnumeration) {
			const enumeration = Property.getEnumeration(property, value);
			const options = enumeration.map((d, i) => {
				// note yangforge generates values for enums but the system does not use them
				// so we categorically ignore them
				// https://trello.com/c/uzEwVx6W/230-bug-enum-should-not-use-index-only-name
				//return <option key={fieldKey + ':' + i} value={d.value}>{d.name}</option>;
				return <option key={':' + i} value={d.name}>{d.name}</option>;
			});
			const isValueSet = enumeration.filter(d => d.isSelected).length > 0;
			if (!isValueSet || property.cardinality === '0..1') {
				const noValueDisplayText = changeCase.title(property.name);
				options.unshift(<option key={'(value-not-in-enum)'} value="" placeholder={placeholder}>{noValueDisplayText}</option>);
			}
			return (
				<select 
					key={fieldKey} 
					id={fieldKey}
					className={ClassNames({'-value-not-set': !isValueSet})} 
					defaultValue={value} 
					title={pathToProperty} 
					onChange={onSelectChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					readOnly={!isEditable}>
						{options}
				</select>
			);
		}

		if (isLeafRef) {
			let fullPathString = container.key + ':' + path.join(':');
			let containerRef = container;
			while (containerRef.parent) {
				fullPathString = containerRef.parent.key + ':' + fullPathString;
				containerRef = containerRef.parent;
			}
			const leafRefPathValues = Property.getLeafRef(property, path, value, fullPathString, catalogs, container);

			const options = leafRefPathValues && leafRefPathValues.map((d, i) => {
				return <option key={':' + i} value={d.value}>{d.value}</option>;
			});
			const isValueSet = leafRefPathValues.filter(d => d.isSelected).length > 0;
			if (!isValueSet || property.cardinality === '0..1') {
				const noValueDisplayText = changeCase.title(property.name);
				options.unshift(<option key={'(value-not-in-leafref)'} value="" placeholder={placeholder}>{noValueDisplayText}</option>);
			}
			return (
				<select 
					key={fieldKey} 
					id={fieldKey} 
					className={ClassNames({'-value-not-set': !isValueSet})} 
					defaultValue={value} 
					title={pathToProperty} 
					onChange={onSelectChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					readOnly={!isEditable}>
						{options}
				</select>
			);
		}

		if (isBoolean) {
			const options = [
				<option key={'true'} value="TRUE">TRUE</option>,
				<option key={'false'} value="FALSE">FALSE</option>
			]

			// if (!isValueSet) {
				const noValueDisplayText = changeCase.title(property.name);
				options.unshift(<option key={'(value-not-in-leafref)'} value="" placeholder={placeholder}></option>);
			// }
			let val = value;
			if(typeof(val) == 'number') {
				val = value ? "TRUE" : "FALSE"
			}
			const isValueSet = (val != '' && val)
			return (
				<select 
					key={fieldKey} 
					id={fieldKey} 
					className={ClassNames({'-value-not-set': !isValueSet})} 
					defaultValue={val && val.toUpperCase()} 
					title={pathToProperty} 
					onChange={onSelectChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					readOnly={!isEditable}>
						{options}
				</select>
			);
		}
		
		if (Property.isLeafEmpty(property)) {
			// A null value indicates the leaf exists (as opposed to undefined).
			// We stick in a string when the user actually sets it to simplify things
			// but the correct thing happens when we serialize to user data
			let isEmptyLeafPresent = (value === EMPTY_LEAF_PRESENT || value === null); 
			let present = isEmptyLeafPresent ? EMPTY_LEAF_PRESENT : "";
			const options = [
				<option key={'true'} value={EMPTY_LEAF_PRESENT}>Enabled</option>,
				<option key={'false'} value="">Not Enabled</option>
			]

			return (
				<select 
					key={fieldKey} 
					id={fieldKey} 
					className={ClassNames({'-value-not-set': !isEmptyLeafPresent})} 
					defaultValue={present} 
					title={pathToProperty} 
					onChange={onSelectChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					readOnly={!isEditable}>
						{options}
				</select>
			);
		}

		if (property['preserve-line-breaks']) {
			return (
				<textarea 
					key={fieldKey} 
					cols="5" 
					id={fieldKey} 
					defaultValue={value} 
					placeholder={placeholder} 
					onChange={onTextChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					onMouseOut={endEditing} 
					onMouseLeave={endEditing} 
					readOnly={!isEditable} />
			);
		}

		return (
			<input 
				key={fieldKey}
				id={fieldKey}
				type="text"
				defaultValue={fieldValue}
				className={className}
				placeholder={placeholder}
				onChange={onTextChange}
				onFocus={onFocus}
				onBlur={endEditing}
				onMouseDown={startEditing}
				onMouseOver={startEditing}
				onMouseOut={endEditing}
				onMouseLeave={endEditing}
				readOnly={!isEditable}
			/>
		);

	}

	/**
	 * buiid and return an array of components representing an editor for each property.
	 * 
	 * @param {any} container the master document being edited
	 * @param {[property]} properties 
	 * @param {string} pathToProperties path within the container to the properties
	 * @param {Object} data source for each property
	 * @param {any} props object containing main data panel information, e.g. panel width {width: 375}
	 * which may be useful/necessary to a components rendering.
	 * @returns an array of react components
	 */
	function buildComponentsForProperties(container, properties, pathToProperties, data, props) {
		return properties.map((property) => {
			let value;
			let propertyPath = pathToProperties.slice();
			if (data && typeof data === 'object') {
				value = data[property.name];
			}
			if(property.type != 'choice'){
				propertyPath.push(property.name);
			}
			return build(container, property, propertyPath, value, props);
		});
	}

	function buildElement(container, property, valuePath, value) {
		return buildComponentsForProperties(container, property.properties, valuePath, value);
	}

	function buildChoice(container, property, path, value, key) {

		function processChoiceChange(name, value) {
			if (DescriptorModelFactory.isContainer(this)) {

				/*
					Transient State is stored for convenience in the uiState field.
					The choice yang type uses case elements to describe the "options".
					A choice can only ever have one option selected which allows
					the system to determine which type is selected by the name of
					the element contained within the field.
				 */
				/*
					const stateExample = {
						uiState: {
							choice: {
								'conf-config': {
									selected: 'rest',
									'case': {
										rest: {},
										netconf: {},
										script: {}
									}
								}
							}
						}
					};
				*/
				const statePath = ['uiState.choice'].concat(name);
				const stateObject = utils.resolvePath(this.model, statePath.join('.')) || {};
				const selected = stateObject.selected ? stateObject.selected.split('.')[1] : undefined;
				// write state back to the model so the new state objects are captured
				utils.assignPathValue(this.model, statePath.join('.'), stateObject);

				// write the current choice value into the state
				let choiceObject = utils.resolvePath(this.model, [name, selected].join('.'));
				let isTopCase = false;
				if (!choiceObject) {
					isTopCase = true;
					choiceObject = utils.resolvePath(this.model, [selected].join('.'));
				}
				utils.assignPathValue(stateObject, [selected].join('.'), _cloneDeep(choiceObject));

				if(selected) {
					if(this.model.uiState.choice.hasOwnProperty(name)) {
						delete this.model[selected];
						utils.removePathValue(this.model, [name, selected].join('.'), isTopCase);
					} else {
						// remove the current choice value from the model
						utils.removePathValue(this.model, [name, selected].join('.'), isTopCase);
					}
				}

				// get any state for the new selected choice
				const newChoiceObject = utils.resolvePath(stateObject, [value].join('.')) || {};

				// assign new choice value to the model
				if (isTopCase) {
					utils.assignPathValue(this.model, [name, value].join('.'), newChoiceObject);
				} else {
					utils.assignPathValue(this.model, [value].join('.'), newChoiceObject)
				}

				// update the selected name
				utils.assignPathValue(this.model, statePath.concat('selected').join('.'), value);

				CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());
			}
		}

		const pathToChoice = path.join('.');
		const caseByNameMap = {};

		const choiceChangeHandler = processChoiceChange.bind(container, pathToChoice);
		const onChange = ((handleChoiceChange, event) => {
			event.preventDefault();
			handleChoiceChange(event.target.value);
		}).bind(null, choiceChangeHandler);


		const cases = property.properties.map(d => {
			if (d.type === 'case') {
				//Previous it was assumed that a case choice would have only one property. Now we pass on either the only item or the
				caseByNameMap[d.name] = d.properties && (d.properties.length == 1 ? d.properties[0] : d.properties);
				return {
					optionName: d.name,
					optionTitle: d.description,
					//represents case name and case element name
					optionValue: [d.name, d.properties[0].name].join('.')
				};
			}
			caseByNameMap[d.name] = d;
			return {optionName: d.name};
		});

		const options = [{optionName: '', optionValue: false}].concat(cases).map((d, i) => {
			return (
				<option key={i} value={d.optionValue} title={d.optionTitle}>
					{d.optionName}
					{i ? null : changeCase.title(property.name)}
				</option>
			);
		});

		let selectedOptionPath = ['uiState.choice', pathToChoice, 'selected'].join('.');
		//Currently selected choice/case statement on UI model
		let selectedOptionValue = utils.resolvePath(container.model, selectedOptionPath);
		//If first time loaded, and none is selected, check if there is a value corresponding to a case statement in the container model
		if(!selectedOptionValue) {
			//get field properties for choice on container model
			let fieldProperties = utils.resolvePath(container.model, pathToChoice);
			if(fieldProperties) {
				//Check each case statement in model and see if it is present in container model.
				cases.map(function(c){
					if(c.optionValue && fieldProperties.hasOwnProperty(c.optionValue.split('.')[1])) {
						utils.assignPathValue(container.model, ['uiState.choice', pathToChoice, 'selected'].join('.'), c.optionValue);
					}
				});
				selectedOptionValue = utils.resolvePath(container.model, ['uiState.choice', pathToChoice, 'selected'].join('.'));
			} else {
				property.properties.map(function(p) {
					let pname = p.properties[0] && p.properties[0].name;
					if(container.model.hasOwnProperty(pname)) {
						utils.assignPathValue(container.model, ['uiState.choice', pathToChoice, 'selected'].join('.'), [p.name, pname].join('.'));
					}
				})
				selectedOptionValue = utils.resolvePath(container.model, ['uiState.choice', pathToChoice, 'selected'].join('.'));
			}
		}
		//If selectedOptionValue is present, take first item in string which represents the case name.
		const valueProperty = caseByNameMap[selectedOptionValue ? selectedOptionValue.split('.')[0] : undefined] || {properties: []};
		const isLeaf = Property.isLeaf(valueProperty);
		const hasProperties = _isArray(valueProperty.properties) && valueProperty.properties.length;
		const isMissingDescriptorMeta = !hasProperties && !Property.isLeaf(valueProperty);
		//Some magic that prevents errors for arising
		let valueResponse = null;
		if (valueProperty.properties && valueProperty.properties.length) { 
			valueResponse = valueProperty.properties.map(valuePropertyFn);
		} else if (!isMissingDescriptorMeta) {
			let value = utils.resolvePath(container.model, path.concat(valueProperty.name).join('.')) || container.model[valueProperty.name];
			valueResponse = build(container, valueProperty, path.concat(valueProperty.name), value)
		} else {
			valueResponse = valueProperty.map && valueProperty.map(valuePropertyFn);
		}
		function valuePropertyFn(d, i) {
			const childPath = path.concat(valueProperty.name, d.name);
			const childValue = utils.resolvePath(container.model, childPath.join('.'));
			return (
				<div key={childPath.concat('info', i).join(':')}>
					{build(container, d, childPath, childValue, props)}
				</div>
			);
		}
		// end magic
		const onFocus = onFocusPropertyFormInputElement.bind(container, property, path, value);

		return (
			<div key={key} className="choice">
				<select 
					key={Date.now()} 
					className={ClassNames({'-value-not-set': !selectedOptionValue})} 
					defaultValue={selectedOptionValue} 
					onChange={onChange} 
					onFocus={onFocus} 
					onBlur={endEditing} 
					onMouseDown={startEditing} 
					onMouseOver={startEditing} 
					onMouseOut={endEditing} 
					onMouseLeave={endEditing}
				>
					{options}
				</select>
				{valueResponse}
			</div>
		);

	}

	function buildSimpleListItem(container, property, path, value, uniqueId, index) {
		// todo need to abstract this better
		const title = getTitle(value);
		var req = require.context("../", true, /\.svg/);
		return (
			<div key={uniqueId} >
				<a href="#select-list-item" className={property.name + '-list-item simple-list-item '} onClick={onClickSelectItem.bind(container, property, path, value)}>
					<img src={req('./' + DescriptorModelIconFactory.getUrlForType(property.name))} width="20px" />
					<span>{title}</span>
				</a>
				{buildRemovePropertyAction(container, property, path)}
			</div>
		);
	}

	function buildRemoveListItem(container, property, valuePath, index) {
		const className = ClassNames(property.name + '-remove actions');
		return (
			<div className={className}>
				<h3>
					<span className={property.type + '-name name'}>{changeCase.title(property.name)}</span>
					<span className="info">{index + 1}</span>
					{buildRemovePropertyAction(container, property, valuePath)}
				</h3>
			</div>
		);
	}

	function buildLeafListItem(container, property, valuePath, value, uniqueId, index) {
		// look at the type to determine how to parse the value
		return (
			<div key={uniqueId}>
				{buildRemoveListItem(container, property, valuePath, index)}
				{buildField(container, property, valuePath, value, uniqueId)}
			</div>

		);
	}

	function build(container, property, path, value, props = {}) {

		const fields = [];
		const isLeaf = Property.isLeaf(property);
		const isArray = Property.isArray(property);
		const isObject = Property.isObject(property);
		const isLeafList = Property.isLeafList(property);
		const isRequired = Property.isRequired(property);
		const title = changeCase.titleCase(property.name);
		const columnCount = property.properties.length || 1;
		const isColumnar = isArray && (Math.round(props.width / columnCount) > 155);
		const classNames = {'-is-required': isRequired, '-is-columnar': isColumnar};

		// create a unique Id for use as react component keys and html element ids
		// use uid (from ui info) instead of id property (which is not stable)
		let uniqueId = container.uid;
		let containerRef = container;
		while (containerRef.parent) {
			uniqueId = containerRef.parent.uid + ':' + uniqueId;
			containerRef = containerRef.parent;
		}
		uniqueId += ':' + path.join(':')

		if (!property.properties && isObject) {
			const uiState = DescriptorModelMetaFactory.getModelMetaForType(property.name) || {};
			property.properties = uiState.properties;
		}

		const hasProperties = _isArray(property.properties) && property.properties.length;
		const isMissingDescriptorMeta = !hasProperties && !Property.isLeaf(property);

		// ensure value is not undefined for non-leaf property types
		if (isObject) {
			if (typeof value !== 'object') {
				value = isArray ? [] : {};
			}
		}
		const valueAsArray = _isArray(value) ? value : isLeafList && typeof value === 'undefined' ? [] : [value];

		const isMetaField = property.name === 'meta';
		const isCVNFD = property.name === 'constituent-vnfd';
		const isSimpleListView = Property.isSimpleList(property);

		valueAsArray.forEach((value, index) => {

			let field;
			const valuePath = path.slice();
			// create a unique field Id for use as react component keys and html element ids
			// notes: 
			//   keys only need to be unique on components in the same array
			//   html element ids should be unique with the document (or form)
			let fieldId = uniqueId;

			if (isArray) {
				valuePath.push(index);
				fieldId = isLeafList ? fieldId + index + value : resolveReactKey(value);
			}

			if (isMetaField) {
				if (typeof value === 'object') {
					value = JSON.stringify(value, undefined, 12);
				} else if (typeof value !== 'string') {
					value = '{}';
				}
			}

			if (isMissingDescriptorMeta) {
				field = <span key={fieldId} className="warning">No Descriptor Meta for {property.name}</span>;
			} else if (property.type === 'choice') {
				field = buildChoice(container, property, valuePath, value, fieldId);
			} else if (isSimpleListView) {
				field = buildSimpleListItem(container, property, valuePath, value, fieldId, index);
			} else if (isLeafList) {
				field = buildLeafListItem(container, property, valuePath, value, fieldId, index);
			} else if (hasProperties) {
				field = buildElement(container, property, valuePath, value, fieldId)
			} else {
				field = buildField(container, property, valuePath, value, fieldId);
			}

			function onClickLeaf(property, path, value, event) {
				if (event.isDefaultPrevented()) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				this.getRoot().uiState.focusedPropertyPath = path.join('.');
				console.debug('property selected', path.join('.'));
				ComposerAppActions.propertySelected([path.join('.')]);
			}

			const clickHandler = isLeaf ? onClickLeaf : () => {};
			const isContainerList = isArray && !(isSimpleListView || isLeafList);

			fields.push(
				<div key={fieldId}
					 className={ClassNames('property-content', {'simple-list': isSimpleListView})}
					 onClick={clickHandler.bind(container, property, valuePath, value)}>
					{isContainerList ? buildRemoveListItem(container, property, valuePath, index) : null}
					{field}
				</div>
			);

		});

		classNames['-is-leaf'] = isLeaf;
		classNames['-is-array'] = isArray;
		classNames['cols-' + columnCount] = isColumnar;

		if (property.type === 'choice') {
			value = utils.resolvePath(container.model, ['uiState.choice'].concat(path, 'selected').join('.'));
			if(!value) {
				property.properties.map(function(p) {
					let pname = p.properties[0] && p.properties[0].name;
					if(container.model.hasOwnProperty(pname)) {
						value = container.model[pname];
					}
				})
			}
		}

		let displayValue = typeof value === 'object' ? '' : value;
		const displayValueInfo = isArray ? valueAsArray.filter(d => typeof d !== 'undefined').length + ' items' : '';

		const onFocus = isLeaf ? event => event.target.classList.add('-is-focused') : false;

		return (
			<div key={uniqueId} className={ClassNames(property.type + '-property property', classNames)} onFocus={onFocus}>
				<h3 className="property-label">
					<label htmlFor={uniqueId}>
						<span className={property.type + '-name name'}>{title}</span>
						<small>
							<span className={property.type + '-info info'}>{displayValueInfo}</span>
							<span className={property.type + '-value value'}>{displayValue}</span>
						</small>
						{isArray ? buildAddPropertyAction(container, property, path.concat(valueAsArray.length)) : null}
					</label>
				</h3>
				<span className={property.type + '-description description'}>{property.description}</span>
				<val className="property-value">
					{isCVNFD ? <span className={property.type + '-tip tip'}>Drag a VNFD from the Catalog to add more.</span> : null}
					{fields}
				</val>
			</div>
		);

	}

	const containerType = container.uiState['qualified-type'] || container.uiState.type;
	const basicProperties = getDescriptorMetaBasicForType(containerType).properties;

	function buildBasicGroup() {
		if (basicProperties.length === 0) {
			return null;
		}
		return (
			<div className="basic-properties-group">
				<h2>Basic</h2>
				<div>
					{buildComponentsForProperties(container, basicProperties, [], container.model)}
				</div>
			</div>
		);
	}

	function buildAdvancedGroup() {
		const properties = getDescriptorMetaAdvancedForType(containerType).properties;
		if (properties.length === 0) {
			return null;
		}
		const hasBasicFields = basicProperties.length > 0;
		const closeGroup = basicProperties.length > 0;
		return (
			<div className="advanced-properties-group">
				<h1 data-toggle={closeGroup ? 'true' : 'false'} className={ClassNames({'-is-toggled': closeGroup})} onClick={toggle} style={{display: hasBasicFields ? 'block' : 'none'}}>
					<a className="toggle-show-more" href="#show-more-properties">more&hellip;</a>
					<a className="toggle-show-less" href="#show-more-properties">less&hellip;</a>
				</h1>
				<div className="toggleable">
					{buildComponentsForProperties(container, properties, [], container.model, {toggle: true, width: props.width})}
				</div>
				<div className="toggle-bottom-spacer" style={{visibility: 'hidden', 'height': '50%', position: 'absolute'}}>We need this so when the user closes the panel it won't shift away and scare the bj out of them!</div>
			</div>
		);
	}

	function buildMoreLess(d, i) {
		return (
			<span key={'bread-crumb-part-' + i}>
				<a href="#select-item" onClick={onClickSelectItem.bind(d, null, null, d)}>{d.title}</a>
				<i> / </i>
			</span>
		);
	}

	const path = [];
	if (container.parent) {
		path.push(container.parent);
	}
	path.push(container);

	return (
		<div className="EditDescriptorModelProperties -is-tree-view">
			<h1>{path.map(buildMoreLess)}</h1>
			{buildBasicGroup()}
			{buildAdvancedGroup()}
		</div>
	);
};


