
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

import React from 'react'
import moment from 'moment'
import ClassNames from 'classnames'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CatalogPackageManagerStore from '../stores/CatalogPackageManagerStore'
import CatalogPackageManagerActions from '../actions/CatalogPackageManagerActions'
import Button from './Button'

import '../styles/CatalogPackageManager.scss'
// import imgVideoFileType from '../images/video167.svg'
// import imgZipFileType from '../images/zipped2.svg'
// import imgUnknownFileType from '../images/file87.svg'
import imgCancel from '../../../node_modules/open-iconic/svg/circle-x.svg'

const CatalogPackageManager = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return CatalogPackageManagerStore.getState();
	},
	getDefaultProps() {
		return {};
	},
	componentWillMount() {
		CatalogPackageManagerStore.listen(this.onChange);
	},
	componentDidMount() {
	},
	onChange(state) {
		this.setState(state);
	},
	componentDidUpdate() {
	},
	componentWillUnmount() {
		CatalogPackageManagerStore.unlisten(this.onChange);
	},
	render() {
		function getIndicator(download) {
			if (download.pending) {
				return (
					<div className="file-progress-indicator">
						<div className="file-progress-indicator-value" style={{width: (download.progress || 0) + '%'}}></div>
					</div>
				);
			}
		}
		function getDownloadLink(download) {
			if (download.success) {
				const now = moment();
				const duration = moment.duration(moment(download.urlValidUntil).diff(now));
				return (
					<div className="file-download">
						<a className="file-download-link" href={download.url}>Download Package</a>
						{/*<span>expires&nbsp;</span> {duration.humanize(true)}*/}

					</div>
				);
			}
		}

		function getMessage(catalogPackage) {
			if (catalogPackage.success && catalogPackage.url) {
				return getDownloadLink(catalogPackage);
			}
			return (
				<div className="message">{catalogPackage.message}</div>
			);
		}

		var createItem = function (catalogPackage) {
			const onClickRemove = function () {
				CatalogPackageManagerActions.removeCatalogOperation(catalogPackage);
			};
			const classNames = ClassNames('item', {'-error': catalogPackage.error, '-success': catalogPackage.success});
			return (
				<div ref="catalogPackage" className={classNames} key={catalogPackage.id}>
					<div className="item-body">
						<h2 title={catalogPackage.name}>{catalogPackage.name}</h2>
						<img src={catalogPackage.icon} />
						{getIndicator(catalogPackage)}
						{getMessage(catalogPackage)}
					</div>
					<div className="item-actions">
						<Button className="action-remove-catalog-package" onClick={onClickRemove} src={imgCancel} />
					</div>
				</div>
			);
		};

		const operations = this.state.operations || [];
		return (
			<div className="CatalogPackageManager">
				<div className="items">
					{operations.map(createItem)}
				</div>
			</div>
		);

	}

});

export default CatalogPackageManager;
