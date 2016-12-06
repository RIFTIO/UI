
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
 * Created by onvelocity on 12/2/15.
 */
'use strict';

import React from 'react'
import ClassNames from 'classnames'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CatalogFilterActions from '../actions/CatalogFilterActions'
import NSDicon from '../../../node_modules/open-iconic/svg/map.svg'
import VNFDicon from '../../../node_modules/open-iconic/svg/map-marker.svg'
import Isvg from 'react-inlinesvg';
import '../styles/CatalogFilter.scss'

const CatalogFilter = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState: function () {
		return {};
	},
	getDefaultProps: function () {
		return {filterByType: 'nsd'};
	},
	componentWillMount: function () {
	},
	componentDidMount: function () {
	},
	componentDidUpdate: function () {
	},
	componentWillUnmount: function () {
	},
	render() {
		const clickFilterByType = function (event) {
			CatalogFilterActions.filterByType(event.currentTarget.value);
		};

		return (
			<div className="CatalogFilter">
				<button className={ClassNames('CatalogFilterNSD', {'-selected': this.props.filterByType === 'nsd'})}
						value="nsd" onClick={clickFilterByType}><svg width="8" height="8" viewBox="0 0 8 8"><path  transform="scale(0.018) translate(-50,5)" d='M325.55,87.34c0,34.54-27.71,62.55-61.89,62.55s-61.89-28-61.89-62.55S229.48,24.8,263.66,24.8,325.55,52.8,325.55,87.34Zm-220.1,96.09c-34.18,0-61.89,28-61.89,62.55s27.71,62.55,61.89,62.55,61.89-28,61.89-62.55S139.63,183.43,105.45,183.43ZM259,235.18c-34.18,0-61.89,28-61.89,62.55s27.71,62.55,61.89,62.55,61.89-28,61.89-62.55S293.23,235.18,259,235.18Zm153.6-51.74c-34.18,0-61.89,28-61.89,62.55s27.71,62.55,61.89,62.55,61.89-28,61.89-62.55S446.83,183.43,412.64,183.43ZM213,127.14l-66,80.5m116.59-57.75v85.29m42.76-104.42,64,64.68'></path></svg>NSD
				</button>
				<button className={ClassNames('CatalogFilterVNFD', {'-selected': this.props.filterByType === 'vnfd'})}
						value="vnfd" onClick={clickFilterByType}><svg><circle cx="50%" cy="50%" r="6" /></svg>VNFD
				</button>
			</div>
		);
	}
});

export default CatalogFilter;
