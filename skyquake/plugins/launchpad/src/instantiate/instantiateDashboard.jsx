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
import AppHeader from 'widgets/header/header.jsx';
import InstantiateStore from './instantiateStore.js';
import NetworkServiceActions from './launchNetworkServiceActions.js';
import InstantiateSelectDescriptorPanel from './instantiateSelectDescriptorPanel.jsx';
import CatalogDescriptorRaw from './catalogDescriptorRaw.jsx'
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import {Panel, PanelWrapper} from 'widgets/panel/panel';
import Button from 'widgets/button/rw.button.js'
import 'style/layout.scss';
import './instantiateDashboard.scss';

class InstantiateDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.Store = this.props.flux.stores.hasOwnProperty('InstantiateStore') ? this.props.flux.stores.InstantiateStore : this.props.flux.createStore(InstantiateStore                );
        this.state = this.Store.getState();
    }
    componentDidMount() {
        let self = this;
        let asyncOperations = []
        asyncOperations.push(this.Store.getCatalog());
        asyncOperations.push(this.Store.getCloudAccount(function() {
          asyncOperations.push(self.Store.getDataCenters());
          asyncOperations.push(self.Store.getResourceOrchestrator());
          asyncOperations.push(self.Store.getSshKey());
          asyncOperations.push(self.Store.getConfigAgent());
          asyncOperations.push(self.Store.getResourceOrchestrator());
        }));
        Promise.all(asyncOperations).then(function(resolve, reject) {
            if(self.props.params.nsd) {
                self.Store.descriptorSelected(self.state.nsdDict[self.props.params.nsd]);
            }
        })

    }
    componentWillMount() {
        this.Store.listen(this.updateState);
    }
    componentWillUnmount() {
        this.Store.unlisten(this.updateState);
    }
    handleCancel = (e) => {
        e.preventDefault();
        this.props.router.push({pathname:''});
    }
    handleBack = (e) => {
        e.preventDefault();
        this.props.router.goBack();
    }
    handleSave = (launch, e) => {
        let self = this;
        e.preventDefault();
        if (this.state.name == "") {
            self.props.actions.showNotification('Please name the network service');
          return;
        }
        if (!this.state.name.match(/^[a-zA-Z0-9_]*$/g)) {
          self.props.actions.showNotification('Spaces and special characters except underscores are not supported in the network service name at this time');
          return;
        }
        if (this.state.isOpenMano && (this.state.dataCenterID == "" || !this.state.dataCenterID)) {
             self.props.actions.showNotification("Please enter the Data Center ID");
          return;
        }
        // LaunchNetworkServiceStore.resetView();
        this.Store.saveNetworkServiceRecord(this.state.name, launch);
    }
    isSelectPage = () => {
        //If an NSD id is present in the route then this evalauates to false;
        return !this.props.location.pathname.split('/')[2];
    }
    isOpenMano = () => {
        return this.state.ro['account-type'] == 'openmano';
    }
    openDescriptor = (descriptor) => {
        let NSD = descriptor;
        if(descriptor.hasOwnProperty('target')) {
            NSD = this.state.selectedNSD;
        }
        this.Store.descriptorSelected(NSD);
        this.props.router.push({pathname:'/instantiate/' + NSD.id});
    }
    updateState = (state) => {
        this.setState(state);
    }
    render() {
        let self = this;
        let html;
        let selectedNSDid = self.state.selectedNSDid;
        let isPreviewing = self.state.isPreviewing;
        let descriptorPreview = (
            <Panel title={(self.state.selectedNSD['short-name'] || self.state.selectedNSD.name ) + ' Descriptor Preview'} className="CatalogDescriptorPreview">
            <span className="oi CatalogDescriptorPreview-button" data-glyph={"circle-x"} onClick={self.Store.deselectDescriptor}></span>
                <CatalogDescriptorRaw descriptor={self.state.selectedNSD} />
            </Panel>);
        html = this.props.children ?
                React.cloneElement(this.props.children, {store: self.Store, nsd: self.state.nsd[0], ...self.Store, ...self.state})
                : (
                    <PanelWrapper>
                        <InstantiateSelectDescriptorPanel
                            catalog={self.state.nsd[0]}
                            onSelectDescriptor={self.Store.descriptorSelected}
                            onPreviewDescriptor={self.Store.previewDescriptor}
                            selectedDescriptorID={selectedNSDid}
                            isPreviewing={isPreviewing}
                            closeCard={self.Store.deselectDescriptor}
                            openDescriptor={this.openDescriptor}
                        />
                        {isPreviewing ? descriptorPreview : null}
                    </PanelWrapper>
                )

        return (
            <div className="InstantiateDashboard">
                {html}
                <div className="ButtonGroup">

                    <Button label="Cancel" onClick={this.handleCancel}/>
                    {this.isSelectPage() ?
                        <Button label="Next" isLoading={this.state.isSaving} onClick={this.state.selectedNSD && self.openDescriptor} className="dark"  type="submit"/>
                        : <div>
                            <Button label="Back" onClick={this.handleBack}/>
                            <Button label="Launch" isLoading={this.state.isSaving} onClick={self.handleSave.bind(self, true)} className="dark"  type="submit"/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
InstantiateDashboard.contextTypes = {
    router: React.PropTypes.object
};
export default SkyquakeComponent(InstantiateDashboard);
