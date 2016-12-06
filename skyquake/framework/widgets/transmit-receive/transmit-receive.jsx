
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
import './transmit-receive.scss'
class TransmitReceive extends React.Component {
  constructor(props) {
    super(props)
  }
  // getDigits(number) {
  //   return Math.log(number) * Math.LOG10E + 1 | 0;
  // }
  getUnits(number) {
    if (number < Math.pow(10,3)) {
      return [number, ''];
    } else if (number < Math.pow(10,6)) {
      return [(number / Math.pow(10,3)), 'K'];
    } else if (number < Math.pow(10,9)) {
      return [(number / Math.pow(10,6)), 'M'];
    } else if (number < Math.pow(10,12)) {
      return [(number / Math.pow(10,9)), 'G'];
    } else if (number < Math.pow(10,15)) {
      return [(number / Math.pow(10,12)), 'T'];
    } else if (number < Math.pow(10,18)) {
      return [(number / Math.pow(10,15)), 'P'];
    } else if (number < Math.pow(10,21)) {
      return [(number / Math.pow(10,18)), 'E'];
    } else if (number < Math.pow(10,24)) {
      return [(number / Math.pow(10,21)), 'Z'];
    } else if (number < Math.pow(10,27)) {
      return [(number / Math.pow(10,24)), 'Z'];
    } else {
      return [(number / Math.pow(10,27)), 'Y'];
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.props.data) === JSON.stringify(nextProps.data)) {
      return false;
    }
    return true;
  }

  render() {
    let html;

    html = (
            <div className="transmit-receive-container">
              <div className="transmit-container">
                <div className="label">{this.props.data.outgoing.label}</div>
                <div className="measure">{this.getUnits(this.props.data.outgoing.bytes)[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.outgoing.bytes)[1]}B</div>
                <div className="measure">{this.getUnits(this.props.data.outgoing.packets)[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.outgoing.packets)[1]}P</div>
                <div className="measure">{this.getUnits(this.props.data.outgoing['byte-rate'])[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.outgoing['byte-rate'])[1]}BPS</div>
                <div className="measure">{this.getUnits(this.props.data.outgoing['packet-rate'])[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.outgoing['packet-rate'])[1]}PPS</div>
              </div>
              <div className="receive-container">
                <div className="label">{this.props.data.incoming.label}</div>
                <div className="measure">{this.getUnits(this.props.data.incoming.bytes)[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.incoming.bytes)[1]}B</div>
                <div className="measure">{this.getUnits(this.props.data.incoming.packets)[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.incoming.packets)[1]}P</div>
                <div className="measure">{this.getUnits(this.props.data.incoming['byte-rate'])[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.incoming['byte-rate'])[1]}BPS</div>
                <div className="measure">{this.getUnits(this.props.data.incoming['packet-rate'])[0].toFixed(1)}</div><div className="units">{this.getUnits(this.props.data.incoming['packet-rate'])[1]}PPS</div>
              </div>
            </div>
            );
    return html;
  }
}


export default TransmitReceive;
