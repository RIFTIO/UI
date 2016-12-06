
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
import VnfrActions from './vnfrActions.js';
import VnfrSource from './vnfrSource.js';
import VnfrStore from './vnfrStore.js';
import VnfrCard from './vnfrCard.jsx';
import Loader from 'widgets/loading-indicator/loadingIndicator.jsx';
import ScreenLoader from 'widgets/screen-loader/screenLoader.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
class VnfrView extends React.Component {
  constructor(props) {
    super(props);
    this.state = VnfrStore.getState();
    this.state.vnfrs = [];
  }
  componentDidMount() {
    VnfrStore.listen(this.handleUpdate);
    console.log(VnfrStore)
    setTimeout(function() {
      VnfrStore.openVnfrSocket();
      // VnfrStore.vnfrMock();
    },100);
  }
  handleUpdate = (data) => {
    this.setState(data);
  }
  render() {
    let self = this;
    let html;
    let vnfrCards = [];
    self.state.vnfrs.map(function(vnfr) {
                 vnfrCards.push(<VnfrCard data={vnfr}></VnfrCard>)
    })
    html = (
            <ReactCSSTransitionGroup
            transitionName="loader-animation"
            component="div"
            className="dashboardCard_wrapper"

            >
              {vnfrCards}
            </ReactCSSTransitionGroup>
    );
    return html;
  }
}
export default VnfrView;
