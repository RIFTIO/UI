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

import {DropList, RadioButtonGroup, CardSection } from './loggingWidgets.jsx';
import { Grid } from './gridWidgets.jsx';
import LoggingStore from './loggingStore.js';


export default class CategorySeverityGrid extends React.Component {

  generateRows(defaultSeverities, severityOptions) {
    let self = this;
    return defaultSeverities.map(function(catsev) {
      // let dropList = (<DropList options={severityOptions}
      //   selectedOption={catsev.severity}
      //   onChange={self.onChangeSeverity(catsev.category)} />);
      let dropList = (<DropList options={severityOptions}
        selectedOption={catsev.severity}
        onChange={self.onChangeSyslogSeverity(catsev.name)} />);
      return [catsev.name, dropList];
    });
  }

  // onChangeSeverity (category) {
  //   return function(e) {
  //     LoggingStore.updateCategoryDefaultSeverity({
  //       category: category,
  //       severity: e
  //     });
  //   }
  // }

  onChangeSyslogSeverity (name) {
    return function(e) {
      LoggingStore.updateCategoryDefaultSyslogSeverity({
        name: name,
        severity: e
      });
    }
  }

  render() {
    const {cellLabels, severityOptions, defaultSeverities, columnClasses,
       ...props} = this.props;
    let rows = null;
    if (defaultSeverities) {
      rows = this.generateRows(defaultSeverities, severityOptions);
    }
    return (<Grid className="categorySeverityGrid"
      cellLabels={cellLabels}
      rows={rows}
      columnClasses={columnClasses}
      />);
  }
}

CategorySeverityGrid.defaultProps = {
  cellLabels: [
    'Name', 'Severity'
  ],
  columnClasses: [
    'category', 'severity'
  ]
}
