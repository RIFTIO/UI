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
import React from 'react';
import _isArrayLike from 'lodash/isArrayLike';
import _isObjectLike from 'lodash/isObjectLike';
import _isEmpty from 'lodash/isEmpty';

/**
 *
 *
 */
export default class Listy extends React.Component {
	constructor(props) {
 		super(props);
 	}

 	/**

 	 */
 	createList(data, iter=0) {
 		var groupTag = this.props.groupTag.tag;
 		var groupClass = this.props.groupTag.className;
 		var itemTag = this.props.itemTag.tag;
 		var itemClass = this.props.itemTag.className;
 		var listHeaderTag = this.props.listHeaderTag.tag;
 		var listHeaderClass = this.props.listHeaderTag.className;

 		var listNode = null;
 		var self = this;
 		if (_isArrayLike(data) && _isObjectLike(data)) {
 			var children = [];
			data.forEach(function(element, index, array) {
				if ( _isArrayLike(element) || _isObjectLike(element)) {
					children.push(self.createList(element, iter+1));
				} else {
					children.push(React.createElement(itemTag, {
						key: index,
						className: itemClass
					}, element));
				}
			});

			listNode = React.createElement(groupTag, {
				key: iter,
				className: groupClass }, children);
 		}
 		else if (_isObjectLike(data)) {
 			var children = [];
 			for (var key in data) {
 				if ( _isArrayLike(data[key]) || _isObjectLike(data[key])) {
 					children.push(
 						React.createElement(listHeaderTag, {
 							key: key + '_header',
 							className: listHeaderClass }, key + ":")
 					);
 					children.push(
 						React.createElement(groupTag, {
 							key: key + '_list',
 							className: groupClass },
 							[this.createList(data[key], iter + 1)])
 					);

 				} else {
 					// TODO: Add span to line-wrap the data part (hanging)
 					children.push(React.createElement(itemTag, {
 						key: key,
 						className: itemClass},
 						key + ": " + data[key]));
 				}
 			}
 			listNode = React.createElement(groupTag, {
 				key: iter,
 				className: groupClass }, children);
 		} else {
 			listNode = React.createElement(itemTag, {
 				className: itemClass}, data);
 		}

 		return listNode;
 	}

 	noDataMessage() {
 		return React.createElement("div", {
 			className: this.props.noDataMessageClass},
 			this.props.noDataMessage);
 	}

 	render () {
 		var data = this.props.data;

 		return React.createElement("div", {
 			className: "listy" },
 			_isEmpty(data) ? 
 			this.noDataMessage() : 
 			this.createList(data)
 		)
 	}
}

Listy.validateTagDefinition = function(props, propName, componentName) {
	let obj = props[propName];
	let fullAttr = componentName + "." + propName;

	if (!obj)
		return new Error('Validation failed. "%" is undefined', fullAttr);
	if (!obj.hasOwnProperty("tag") || _isEmpty(obj.tag))
		return new Error('Validation failed. "%s" missing attribute "tag"', fullAttr);
	if (!obj.hasOwnProperty("className") || obj.className == undefined)
		return new Error('Validation failed. "%s" missing attribute "className"', fullAttr);
}

Listy.propTypes = {
	data: React.PropTypes.object,
	groupTag: Listy.validateTagDefinition,
	itemTag: Listy.validateTagDefinition,
	listHeaderTag: Listy.validateTagDefinition,	
	debugMode: React.PropTypes.bool
}

Listy.defaultProps = {
	data: {},

	// Visual Rules
	groupTag: {
		tag: "ul",
		className: "listyGroup"
	},
	itemTag: {
		tag: "li",
		className: "listyItem"
	},
	listHeaderTag: {
		tag: "h2",
		className: "listyGroupHeader"
	},
	noDataMessage: "No data",
	noDataMessageClass: "listyNoDataMessage",
	debugMode: false
}
