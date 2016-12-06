
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
var React = require('react');
var Slider = require('react-slick');
// require('../../components/gauge/gauge.js');
// require('../../components/text-area/rw.text-area.js');
// require('../../components/test/multicomponent.js');
import button from '../../components/components.js'

require('./carousel.css');
var SimpleSlider = React.createClass({
  propTypes: {
    component_list:           React.PropTypes.array.isRequired,
    slideno:                  React.PropTypes.number
  },
  handleClick: function() {
    this.setState({});
  },
  getInitialState: function() {
    return {
      }
    
  },
  shouldComponentUpdate: function(nextProps) {

    if (nextProps.slideno != this.props.slideno) {
      return true;
    }
    return false;
  },
  render: function () {
    // var settings = {
    //   dots: true,
    //   infinite: false,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   centerMode: true,
    //   initialSlide: this.props.slideno || 2
    // };
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        initialSlide: this.props.slideno || 0
    }
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 1000)
    var list = [];
    if (this.props.component_list !== undefined) {
      for (var i = 0; i < this.props.component_list.length; i++) {
        list.push(<div key={i}  className={"component"}>{this.props.component_list[i]}</div>);
      }
    }
    return (
      <div>
      <Slider {...settings}>
        {list}
      </Slider>
      </div>o
    );
  }
});
module.exports = SimpleSlider;
