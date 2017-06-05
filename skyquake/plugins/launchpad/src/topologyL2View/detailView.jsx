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
import LoadingIndicator from 'widgets/loading-indicator/loadingIndicator.jsx';
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import Listy from 'widgets/listy/listy.js';

import _isEmpty from 'lodash/isEmpty';

export default class TopologyDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    detailData(data) {
        if (_isEmpty(data)) {
            return {};
        } else {
            return {
                name: data['name'],
                full_name: data['full_name'],
                network: data['network'],
                attr: data['attr']
            }
        }
    }

    rawDetails(data) {
        let text = JSON.stringify(data, undefined, 2);
        if (text == "{}") {
            return false;
        } else {
            return (
                <div className="topologyDebugRawJSON">
                    <h2>Raw JSON</h2>
                    <pre className="language.js">{text}</pre>
                </div>
            );
        }
    }

    render() {
        return (
            <DashboardCard showHeader={true} title="Record Details" className={'recordDetails'}>
              <div className="nodeAttr">
                <Listy data={this.detailData(this.props.data)}
                       noDataMessage={"Select a node"}
                       debugMode={this.props.debugMode}
                />
              </div>
              {
                (this.props.debugMode)
                    ? this.rawDetails(this.props.data)
                    : false
              }
            </DashboardCard>
        );
    }
}

TopologyDetail.propTypes = {
    debugMode: React.PropTypes.bool
}

TopologyDetail.defaultProps = {
    data: {},
    debugMode: false
}
