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
import './catalogCard.scss';
import 'style/common.scss';
import React, {Component} from 'react';
export default class CatalogCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.isExpanded = false;
    }
    hideIt = (e) => {
        document.querySelector('body').removeEventListener('click', this.hideIt);
        if(e.target.parentElement.classList.contains('CatalogCard-info--expanded') || e.target.classList.contains('CatalogCard-info--expanded')) {
            e.stopPropagation();
        }
        this.setState({
            isExpanded: false
        });
    }
    handleImageError = (e) => {
        console.log('Bad logo path, using default');
        e.target.src = require('style/img/catalog-default.svg');
    }
    toggleDetailsDisplay = (e) => {
        let self = this;
        let isExpanded = this.state.isExpanded;
        e.stopPropagation();
        if(!isExpanded) {
            document.querySelector('body').addEventListener('click', this.hideIt);
             self.setState({
                isExpanded: true
            });
        }
    }
    detailsHTML = (descriptor) => {
        let self = this;
        return (
            <dd className="details">
                <div className="details-section">
                    <div className="details-section-title">
                        VNFDs
                    </div>
                    {
                        (
                         descriptor['constituent-vnfd'] &&
                         (descriptor['constituent-vnfd'].length > 0)
                         ) ?
                            descriptor['constituent-vnfd'] && descriptor['constituent-vnfd'].map(function(v,i) {
                                return (
                                    <div key={i} className="details-section-item">
                                        <img
                                            onError={self.handleImageError}
                                            src={cleanDataURI(descriptor.logo, 'vnfd', descriptor.id)}
                                        />
                                        {v['name']}
                                    </div>
                                    )
                            })
                            : 'None'
                    }
                </div>
                <div className="details-section">
                    <div className="details-section-title">
                        VLDs
                    </div>
                    {
                        (
                         descriptor['vld'] &&
                         (descriptor['vld'].length > 0)
                         ) ?
                            descriptor['vld'] && descriptor['vld'].map(function(v,i) {
                                return (
                                    <div key={i} className="details-section-item">
                                        {v['short-name']}
                                    </div>
                                    )
                            })
                            : 'None'
                    }
                </div>
                <div className="details-section">
                    <div className="details-section-title">
                        VNFFGDs
                    </div>
                    {
                        (
                         descriptor['vnffgd'] &&
                         (descriptor['vnffgd'].length > 0)
                         ) ?
                            descriptor['vnffgd'] && descriptor['vnffgd'].map(function(v,i) {
                                return (
                                    <div key={i} className="details-section-item">
                                        {v['short-name']}
                                    </div>
                                    )
                            })
                            : 'None'
                    }
                </div>
            </dd>
        );
    }
    componentWillUnmount() {
        document.querySelector('body').removeEventListener('click', this.hideIt);
    }
    render() {
        let {className, descriptor, isActive, isOpen, onCloseCard,...props} = this.props;
        let openTool = isOpen ? null : <span className="oi CatalogCard-button" data-glyph={isActive ? "circle-x" : "arrow-circle-right"} onClick={isActive ?  onCloseCard : props.onPreviewDescriptor(descriptor)}></span>
        className = "CatalogCard " + buildClass(this.props);
        return (
            <div className={className} onClick={props.onClick} onDoubleClick={props.onDoubleClick}>
                <img className="CatalogCard-thumbnail"  onError={this.handleImageError} src={cleanDataURI(descriptor.logo, 'nsd', descriptor.id)} />
                <div className="CatalogCard-body">
                    <div className="CatalogCard-header">
                        <div className="CatalogCard-name">
                            {descriptor.name}
                        </div>
                        <div className="CatalogCard-subtitle">
                            {descriptor['short-name']}
                        </div>
                        <div className="CatalogCard-subtitle">
                            {descriptor['vendor']} / {descriptor['version']}
                        </div>
                    </div>
                    <div className="CatalogCard-description">
                        {descriptor['description']}
                    </div>
                    <dl className={"CatalogCard-info " + (this.state.isExpanded ? "CatalogCard-info--expanded" : "")} onClick={this.toggleDetailsDisplay}>
                        <dt>VNFDs:</dt>
                        <dd>{descriptor['constituent-vnfd'] && descriptor['constituent-vnfd'].length || 0}</dd>
                        <dt>VLDs:</dt>
                        <dd>{descriptor['vld'] && descriptor['vld'].length || 0}</dd>
                        <dt>VNFFGDs:</dt>
                        <dd>{descriptor['vnffgd'] && descriptor['vnffgd'].length || 0}</dd>
                        <dd className="arrow-black--down"></dd>
                        {this.detailsHTML(descriptor)}
                    </dl>
                </div>
                {openTool}
            </div>
        )
    }
}
CatalogCard.defaultProps = {
    className: null,
    descriptor: {}
}

function buildClass(props) {
    let className = '';
    if(props.isSelected) {
        className += ' CatalogCard-is-selected';
    }
    if(props.isActive) {
        className += ' CatalogCard-is-active';
    }
    return className;
}

function cardHandler(element) {
    this.handleEvent = function(e) {
        ''
    }
}

function cleanDataURI(imageString, type, id) {
        if (/\bbase64\b/g.test(imageString)) {
            return imageString;
        } else if (/<\?xml\b/g.test(imageString)) {
            const imgStr = imageString.substring(imageString.indexOf('<?xml'));
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(imgStr);
        } else if (/\.(svg|png|gif|jpeg|jpg)$/.test(imageString)) {
            return '/composer/assets/logos/' + type + '/' + id + '/' + imageString;
            // return require('../images/logos/' + imageString);
        }
        if(type == 'nsd' || type == 'vnfd') {
            return require('style/img/catalog-'+type+'-default.svg');
        }
        return require('style/img/catalog-default.svg');
    }
