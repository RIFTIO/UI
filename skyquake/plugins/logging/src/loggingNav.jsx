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

import AppHeader from 'widgets/header/header.jsx';
//import AppHeaderActions from 'widgets/header/headerActions.js';


export default class LoggingNav extends React.Component {

  navItems(currentPage) {
    let navItems = [{
        name: 'General',
        onClick: this.context.router.push.bind(this, { pathname: '/'})
      },{
        name: 'Console',
        onClick: this.context.router.push.bind(this, {
          pathname: '/logging-console'})
      },{
        name: 'Sinks',
        onClick: this.context.router.push.bind(this, {
          pathname: '/logging-sinks'})
      }
    ];

    if (currentPage) {
      return navItems.map(function(navItem) {
        if (navItem.name == currentPage) {
          return { name: currentPage };
        } else {
          return navItem;
        }
      });
    } else {
      // return all
      return navItems;
    }
  }

  render() {
    const {currentPage, ...props} = this.props;
    return (<AppHeader nav={this.navItems(currentPage)} />);
  }
}
LoggingNav.contextTypes = {
  router: React.PropTypes.object
}