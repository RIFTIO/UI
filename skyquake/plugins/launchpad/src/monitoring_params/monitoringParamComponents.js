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
import * as Components from 'widgets/components.js';
import Utils from 'utils/utils.js';

function Component(node, prop, count, length) {
    var valueProperty;
    var numericConstraintsMinPresent = false;
    var numericConstraintsMaxPresent = false;
    if ("value-type" in node) {
        switch(node["value-type"]) {
            case 'INT' :
                valueProperty = 'value-integer';
                if (node['numeric-constraints']) {
                    numericConstraintsMinPresent = node['numeric-constraints']['min-value'] ? true : false;
                    numericConstraintsMaxPresent = node['numeric-constraints']['max-value'] ? true : false;
                }
                break;
            case 'DECIMAL' :
                valueProperty = 'value-decimal';
                if (node['numeric-constraints']) {
                    numericConstraintsMinPresent = node['numeric-constraints']['min-value'] ? true : false;
                    numericConstraintsMaxPresent = node['numeric-constraints']['max-value'] ? true : false;
                }
                break;
            case 'STRING' : valueProperty = 'value-string'; break;
        }
    } else {
        valueProperty = 'value-integer';
    }
    //' + String((100/length) - 5) + '%'
    switch(node["widget-type"]) {
      case 'GAUGE':
        return (
            <div
            className="monitoring_params_component"
            key={prop + '-' + prop.name+ '-' + count}
            mp={node["mp-id"]}>
                <div>{node.name}</div>
                <Components.default.Gauge value={node[valueProperty] || 0} min={numericConstraintsMinPresent ? node['numeric-constraints']['min-value'] : 0} max={numericConstraintsMaxPresent ? node['numeric-constraints']['max-value'] : 100} units={node['units'] || ''} />
            </div>);
        break;
      case 'TEXTBOX':
      case 'COUNTER':
        var displayValue = 0;
        var backendValue = node[valueProperty] || 0;
        if (node['units'] == 'KB') {
            displayValue = Utils.getByteDataWithUnitPrefix(backendValue * 1024, 4);
        } else if (node['units'] == 'bytes') {
            displayValue = Utils.getByteDataWithUnitPrefix(backendValue, 4);
        } else if (node['units'] == 'packets') {
            displayValue = Utils.getPacketDataWithUnitPrefix(backendValue, 4);
        } else {
          displayValue = [backendValue, node['units']];
        }
        return (
            <div
            key={prop + '-' + prop.name + '-' + count}
            className="monitoring_params_component"
            mp={node["mp-id"]}>
                <div>{node.name}</div>
                <div style={{fontSize: '3rem'}}>{displayValue[0]}</div>
                <div style={{fontSize: '1.5rem'}}>{displayValue[1]}</div>
            </div>);
        break;
        default : return(<div>{node["widget-type"]} Widget Type Not Yet Supported</div>)
    }
}

export default function parseCardObj(obj_list, type) {
    var ret = [];
    var hash = {};
    if (typeof obj_list != 'undefined') {
      for (var i = 0; i < obj_list.length; i++) {
        var node = obj_list[i];
        var key = node[type] || node["group-tag"];
        if (key in hash) {
            hash[key].push(node);
        } else {
            hash[key] = [node];
        }
      }
    }
    for (var prop in hash) {
      var html = {};
      var vnfrID = hash[prop][0]['vnfr-id'];
      var vnfrSubstr = vnfrID ? hash[prop][0]['vnfr-id'].substr(hash[prop][0]['vnfr-id'].length - 4) : ''
      var GroupName = hash[prop][0]["group-tag"];
      html.title = GroupName ? GroupName : '';
      if (hash[prop].length == 1) {
          html.component = Component.call(this, hash[prop][0], prop, 1);
      } else {
          var list = []
          for (var i = 0; i < hash[prop].length; i++) {
              list.push(Component.call(this,hash[prop][i], prop, i, hash[prop].length));
          }
          html.component = list;
      }
      ret.push(html)
    }
    return ret.sort(function(a,b) {
            var titleA = a.title && a.title.toUpperCase();
            var titleB = b.title && b.title.toUpperCase();
            return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
          });
  }
