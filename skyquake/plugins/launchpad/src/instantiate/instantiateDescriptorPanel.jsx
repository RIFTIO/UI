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
import React, {Component} from 'react';
import Panel from 'widgets/panel/panel';
import CatalogCard from './catalogCard.jsx'
import CatalogDescriptorRaw from './catalogDescriptorRaw.jsx'

export default class InstantiateDescriptorPanel extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Panel title="Descriptor">
                <CatalogCard descriptor={this.props.descriptor} isOpen={true} />
                <CatalogDescriptorRaw descriptor={this.props.descriptor} />
            </Panel>
        )
    }
}
