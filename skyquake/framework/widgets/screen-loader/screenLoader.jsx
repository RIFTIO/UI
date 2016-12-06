
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
import Loader from '../loading-indicator/loadingIndicator.jsx';
import React from 'react';

export default class ScreenLoader extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let overlayStyle = {
      position: 'fixed',
      zIndex: 999,
      width: '100%',
      height: '100%',
      top: 0,
      // right: 0,
      // bottom: 0,
      left: 0,
      display: this.props.show ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      scroll: 'none',
      backgroundColor: 'rgba(0,0,0,0.5)'
    };
    return (
      <div style={overlayStyle}><Loader size="10"/></div>
    );
  }
}
