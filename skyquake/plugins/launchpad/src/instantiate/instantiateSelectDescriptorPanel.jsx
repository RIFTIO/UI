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
import CatalogCard from './catalogCard.jsx'
import Panel from 'widgets/panel/panel.jsx'
import React, {Component} from 'react';
import './instantiateSelectDescriptorPanel.scss';
export default class InstantiateSelectDescriptorPanel extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let self = this;
        let {catalog, onPreviewDescriptor, onSelectDescriptor, selectedDescriptorID, previewing, isPreviewing, closeCard, openDescriptor, ...props} = self.props;
        return (
            <Panel title="Select Descriptor"  className={"InstantiateSelectDescriptorPanel" + (isPreviewing ? " InstantiateSelectDescriptorPanel--previewmode" : '')}>
            {
                catalog.descriptors && catalog.descriptors.map(function(descriptor, i) {
                    let isSelected = (descriptor.id === selectedDescriptorID);
                    return (
                        <CatalogCard
                            key={i}
                            isActive={isPreviewing && isSelected}
                            isSelected={isSelected}
                            descriptor={descriptor}
                            onClick={onSelectDescriptor.bind(null, descriptor)}
                            onDoubleClick={openDescriptor.bind(null, descriptor)}
                            onPreviewDescriptor={onPreviewDescriptor}
                            onCloseCard={closeCard}
                        />
                    )
                })
            }
            </Panel>
        )
    }
}

InstantiateSelectDescriptorPanel.defaultProps = {
    catalog: {},
    onSelectDescriptor: function(descriptor) {
        return (e) => {
            console.log('Selecting NSD: ' + descriptor.id)
        }
    },
    onPreviewDescriptor: function(descriptor) {
        return (e) => {
            console.log('Previewing NSD: ' + descriptor.id)
        }
    }
}
