
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
import Bullet from 'widgets/bullet/bullet.js';
class VnfrCardNfviMetrics extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let height = 100;
    let html = (
       <div className="nfviMetrics">
          <div>
            <h3>{this.props.metrics[0].label}</h3>
            <h3>{this.props.metrics[0].total}</h3>
          </div>
          <div>
            <h3>{this.props.metrics[1].label}</h3>
            <Bullet textMarginY={height - (height/2) + 15} fontSize={height / 2} height={height} value={Math.round(this.props.metrics[1].utilization * 100)} />
          </div>
          <div>
            <h3>{this.props.metrics[2].label}</h3>
            <Bullet textMarginY={height - (height/2) + 15} fontSize={height / 2}  height={height} value={Math.round(this.props.metrics[2].utilization * 100)} />
          </div>
        </div>
    );
    return html;
  }
}

export default VnfrCardNfviMetrics;
