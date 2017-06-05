
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

import _ from 'lodash'
import d3 from 'd3'
import React from 'react'
import Range from '../Range'
import Button from '../Button'
import ClassNames from 'classnames'
import changeCase from 'change-case'
import LayoutRow from '../LayoutRow'
import SelectionManager from '../../libraries/SelectionManager'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import CatalogItemsActions from '../../actions/CatalogItemsActions'
import CanvasEditorActions from '../../actions/CanvasEditorActions'
import DescriptorModelFactory from '../../libraries/model/DescriptorModelFactory'
import ComposerAppActions from '../../actions/ComposerAppActions'
import DescriptorModelMetaFactory from '../../libraries/model/DescriptorModelMetaFactory'
import ComposerAppStore from '../../stores/ComposerAppStore'
import DeletionManager from '../../libraries/DeletionManager'
import ContentEditableDiv from '../ContentEditableDiv'
import TooltipManager from '../../libraries/TooltipManager'
import HighlightRecordServicePaths from '../../libraries/graph/HighlightRecordServicePaths'

import '../../styles/EditForwardingGraphPaths.scss'

import imgNSD from '../../images/default-catalog-icon.svg'
import imgFG from '../../../../node_modules/open-iconic/svg/infinity.svg'
import imgRemove from '../../../../node_modules/open-iconic/svg/trash.svg'
import imgAdd from '../../../../node_modules/open-iconic/svg/plus.svg'
import imgConnection from '../../../../node_modules/open-iconic/svg/random.svg'
import imgClassifier from '../../../../node_modules/open-iconic/svg/spreadsheet.svg'
import imgReorder from '../../../../node_modules/open-iconic/svg/menu.svg'
import CatalogDataStore from '../../stores/CatalogDataStore'
import utils from '../../libraries/utils'
import getEventPath from '../../libraries/getEventPath'
import guid from '../../libraries/guid'

import '../../styles/EditDescriptorModelProperties.scss'
import '../../styles/EditConfigParameterMap.scss';

function configParameterMapMap(ap, i) {

    const context = this;
    context.vnfapMap = ap;
    return (
        <div key={i}>
        <div>{ap.id}</div>
        <div>{ap.capability['member-vnf-index']}</div>
        <div>{ap.capability['capability-ref']}</div>

        </div>
    )

}

function mapNSD(nsd, i) {

    const context = this;
    context.nsd = nsd;

    function onClickAddConfigParameterMap(nsd, event) {
        event.preventDefault();
        nsd.createConfigParameterMap();
        CatalogItemsActions.catalogItemDescriptorChanged(nsd.getRoot());
    }

    const forwardingGraphs = nsd.configParameterMap.map(configParameterMap.bind(context));
    if (forwardingGraphs.length === 0) {
        forwardingGraphs.push(
            <div key="1" className="welcome-message">
                No Forwarding Graphs to model.
            </div>
        );
    }

    return (
        <div key={i} className={nsd.className}>
            {forwardingGraphs}
            <div className="footer-actions">
                <div className="row-action-column">
                    <Button className="create-new-forwarding-graph" src={imgAdd} width="20px" onClick={onClickAddConfigParameterMap.bind(null, nsd)} label="Add new Access Point" />
                </div>
            </div>
        </div>
    );

}


function startEditing() {
        event.stopPropagation();
        DeletionManager.removeEventListeners();
    }

function endEditing() {
    DeletionManager.addEventListeners();
}


const ConfigPrimitiveParameters = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState: function () {
        return ComposerAppStore.getState();
    },
    getDefaultProps: function () {
        return {
            containers: []
        };
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
        const self = this;
        const containers = this.props.containers;
        let NSContainer = containers.filter(function(c) {
           return c.className == "NetworkService"
        })[0]
        const context = {
            component: this,
            containers: containers
        };

        const networkService = containers.filter(d => d.type === 'nsd');
        if (networkService.length === 0) {
            return <p className="welcome-message">No <img src={imgNSD} width="20px" /> NSD open in the canvas. Try opening an NSD.</p>;
        }
        let MapData = constructRequestSourceData(containers);
        let mapCounter = 1;



        return (
                <div className="ConfigParameterMap">

                        <div className="config-parameter-map">
                            <div className="config-parameter-titles">
                                <div className="config-parameter">
                                    Primitive Parameter Request
                                </div>
                                <div className="config-parameter">
                                    Data Source
                                </div>
                            </div>
                            {
                                MapData.Requests.map(function(r, i) {
                                    let currentValue = {};
                                    let SourceOptions = [<option value={JSON.stringify({
                                            requestValue: r.name,
                                            requestIndex: r.vnfdIndex
                                        })} key="reset">No Source Selected</option>]
                                    MapData.Sources.map(function(s, j) {
                                        let value = {
                                            value: s.name,
                                            index: s.vnfdIndex,
                                            requestValue: r.name,
                                            requestIndex: r.vnfdIndex
                                        }
                                        if (r.vnfdIndex !== s.vnfdIndex) {
                                            SourceOptions.push(<option value={JSON.stringify(value)} key={`${j}-${i}`} >{`${s.vnfdName} (${s.vnfdIndex}): ${s.name}`}</option>)
                                        }
                                    })
                                    //Finds current value
                                    NSContainer.model['config-parameter-map'] && NSContainer.model['config-parameter-map'].map((c)=>{
                                        if(
                                            c['config-parameter-request'] &&
                                            (c['config-parameter-request']['config-parameter-request-ref'] == r.name)
                                            && (c['config-parameter-request']['member-vnf-index-ref'] == r.vnfdIndex)
                                           ) {
                                            currentValue = {
                                                value: c['config-parameter-source']['config-parameter-source-ref'],
                                                index: c['config-parameter-source']['member-vnf-index-ref'],
                                                requestValue: r.name,
                                                requestIndex: r.vnfdIndex
                                            };
                                        }
                                    })
                                    currentValue.hasOwnProperty('value') ? mapCounter++ : mapCounter--;
                                    let currentMapIndex = (mapCounter > 0) ? (mapCounter) - 1: 0;
                                    return (
                                            <div key={i} className="EditDescriptorModelProperties -is-tree-view config-parameter config-parameter-group">
                                                <div  className="config-parameter-request" >{`${r.vnfdName} (${r.vnfdIndex}): ${r.name}`}</div>
                                                <div className="config-parameter-source">
                                                    <select
                                                        onChange={onFormFieldValueChanged.bind(NSContainer, i)}
                                                        onBlur={endEditing}
                                                        onMouseDown={startEditing}
                                                        onMouseOver={startEditing}
                                                        value={JSON.stringify(currentValue)}
                                                         >
                                                        }
                                                        {SourceOptions}
                                                    </select>
                                                </div>
                                            </div>
                                    )
                                })
                            }
                        </div>
                </div>
        )
    }
});

    function onFormFieldValueChanged(index, event) {
        if (DescriptorModelFactory.isContainer(this)) {
            event.preventDefault();
            const name = event.target.name;
            const value = JSON.parse(event.target.value);

            let ConfigMap = utils.resolvePath(this.model, 'config-parameter-map');
            let ConfigMapIndex = false;
            let id = guid().substring(0, 8);
            //Check current map, if request is present, assign map index.
            ConfigMap.map(function(c, i) {
                let req = c['config-parameter-request'];
                if((req['config-parameter-request-ref'] == value.requestValue) &&
                   (req['member-vnf-index-ref'] == value.requestIndex)) {
                    ConfigMapIndex = i;
                    id = c.id;
                }
            });
            if(!ConfigMapIndex && _.isBoolean(ConfigMapIndex)) {
                ConfigMapIndex = ConfigMap.length;
            }
            if(value.value) {
                utils.assignPathValue(this.model, 'config-parameter-map.' + ConfigMapIndex + '.config-parameter-source.config-parameter-source-ref', value.value);
                utils.assignPathValue(this.model, 'config-parameter-map.' + ConfigMapIndex + '.config-parameter-source.member-vnf-index-ref', value.index);
                utils.assignPathValue(this.model, 'config-parameter-map.' + ConfigMapIndex + '.config-parameter-request.config-parameter-request-ref', value.requestValue);
                utils.assignPathValue(this.model, 'config-parameter-map.' + ConfigMapIndex + '.config-parameter-request.member-vnf-index-ref', value.requestIndex);
                utils.assignPathValue(this.model, 'config-parameter-map.' + ConfigMapIndex + '.id', id);
                CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());
            } else {
                utils.removePathValue(this.model, 'config-parameter-map.' + ConfigMapIndex)
                CatalogItemsActions.catalogItemDescriptorChanged(this.getRoot());

            }
        }
    }


//Values from
//

//To update
//Container:NSD
//path
//["config-parameter", "config-parameter-source"]
//{config-parameter-source-ref: "service_port", member-vnf-index-ref: 2}

function constructRequestSourceData(containers) {
    let cds = CatalogDataStore;
    let catalogs = cds.getTransientCatalogs();
    let Requests = [];
    let Sources = [];
    let vnfdData = {
        index:[],
        vnfdIDs:[],
        indexRefs: {},
        vnfdRefs:{}
    };

    //Init VNFD map
    //{
    //
    //  index:[1], //member-vnfd-index-ref
    //  vnfdIDs:[],
    //  indexRefs: {
    //      1: vnfdID
    //  },
    //  vnfdRefs: {
    //      {1.id} : {...}
    //  }
    //}

    containers.map(function(c, i) {
        if(c.className == 'ConstituentVnfd') {
            vnfdData.index.push(c.vnfdIndex);
            vnfdData.vnfdIDs.push(c.vnfdId);
            vnfdData.indexRefs[c.vnfdIndex] = c.vnfdId;
            vnfdData.vnfdRefs[c.vnfdId] = {
                id: c.vnfdId,
                name: c.name,
                'short-name': c['short-name']
            };
        }
    });

    //Decorate VNFDMap with descriptor data;
    catalogs[1].descriptors
        .filter((v) => vnfdData.vnfdIDs.indexOf(v.id) > -1)
        .map(constructVnfdMap.bind(this, vnfdData));


    vnfdData.index.map(function(vnfdIndex) {
        let vnfdId = vnfdData.indexRefs[vnfdIndex];
        let vnfd = vnfdData.vnfdRefs[vnfdId];
        let vnfdShortName = vnfd['short-name'];
        vnfd.requests && vnfd.requests.map(function(request) {
            Requests.push(_.merge({
                            id: vnfdId,
                            vnfdIndex: vnfdIndex,
                            vnfdName: vnfdShortName,
                        }, request))
        });
        vnfd.sources && vnfd.sources.map(function(source) {
            Sources.push(_.merge({
                            id: vnfdId,
                            vnfdIndex: vnfdIndex,
                            vnfdName: vnfdShortName,
                        }, source));
        });
    })

    return {Requests, Sources};

    function constructVnfdMap(vnfdData, vnfd) {
        let data = {
            requests: vnfd['config-parameter'] && vnfd['config-parameter']['config-parameter-request'],
            sources: vnfd['config-parameter'] && vnfd['config-parameter']['config-parameter-source']
        };
        vnfdData.vnfdRefs[vnfd.id] =  _.merge(vnfdData.vnfdRefs[vnfd.id], data);
    }

}



export default ConfigPrimitiveParameters;
