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

/*
 Simple helper to avoid 'undefined' in class name rendered in the html

 * First incarnation expects additionalClassNames to be a string
 * Later, we'll improve to take a string or array

 * And move this into a different file/module, uiHelers.js maybe for now
*/
function buildClassName(baseClassName, additionalClassNames) {
  if (additionalClassNames) {
    return baseClassName + " " + additionalClassNames;
  } else {
   return baseClassName;
  }
}

class GridCell extends React.Component {
  render() {
    const {baseClassName, className, children, ...props} = this.props;
    return (
      <div className={buildClassName(baseClassName, className)}>
      {children}
      </div>
    );
  }
}
GridCell.defaultProps = {
  baseClassName: "gridCell"
}

class GridRow extends React.Component {

  columnClass(columnClasses, index) {
    // starting point for sanity check
    if (columnClasses && index >= 0 && index < columnClasses.length) {
      return columnClasses[index];
    } else {
      return null;
    }
  }
  render() {
    let self = this;
    const {className, cells, columnClasses, ...props} = this.props;
    return (
      <div className={className} >
        {
          cells.map( (cell, index) =>
            <GridCell key={index}
              className={self.columnClass(columnClasses, index)}>{cell}</GridCell>)
        }
      </div>
    );
  }
}

/**
* Maybe we can do without GridHead as it is a specialized version of GridRow
*/
class GridHead extends React.Component {
  render() {
    const {className, cellLabels, columnClasses, ...props} = this.props;
    return (
      <GridRow className={className} cells={cellLabels} 
      columnClasses={columnClasses} />
    );
  }
}


class GridBody extends React.Component {
  render() {
    let self = this;
    const {className, rows, columnClasses, ...props} = this.props;
    return (
      <div className={className}>
          {
            rows.map( (row, index) =>
              <GridRow key={index} className="gridRow"
                cells={row} columnClasses={columnClasses} />
            )
          }
        </div>
    );
  }
}

/**
 *
 * TODO: Consider merging cellLabels and columnClasses into array of single structure
 */
class Grid extends React.Component {

  renderHasNoRows() {
    return (<div className="noRows">No Data</div>);
  }
  render() {
    const {baseClassName, className, cellLabels, rows, columnClasses,
      ...props} = this.props;

    return (
      <div className={buildClassName(baseClassName, className)}>
        <GridHead className="gridHead"
          cellLabels={cellLabels} columnClasses={columnClasses} />
        {
          (rows) ? <GridBody className="gridBody" rows={rows}
            columnClasses={columnClasses} />
            : this.renderHasNoRows()
        }
      </div>
    );
  }
}
Grid.defaultProps = {
  baseClassName: "grid"
}

module.exports = {
  Grid: Grid,
  GridBody: GridBody,
  GridCell: GridCell,
  GridHead: GridHead,
  GridRow: GridRow
}
