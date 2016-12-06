
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
import Carousel from '../carousel/carousel-react.jsx';
import SkyquakeCarousel from '../carousel/skyquakeCarousel.jsx';
import './monitoring_params.scss';
import ParseMP from './monitoringParamComponents.js';
//TODO
// This Carousel needs to be refactored so that we can sanely add a unique key to each element.
// The entire component needs some serious refactoring.

export default class launchpadCarousel extends React.Component {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        // window.addEventListener('resize', resizeComponents.bind(this))
    }
    componentWillUnmount(){
        // window.removeEventListener('resize', resizeComponents.bind(this))
    }
  render() {
    var slideno = this.props.slideno;
    if(this.props.component_list) {
        var components = ParseMP.call(this, this.props.component_list);
       return <Carousel slideno={this.props.slideno} component_list={components} />
       // return <SkyquakeCarousel slideno={this.props.slideno} slides={components} />
    } else {
        return <div className="empty"> MONITORING PARAMETERS NOT LOADED</div>
    }
  }
}


