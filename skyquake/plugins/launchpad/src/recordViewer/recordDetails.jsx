
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
import LoadingIndicator from 'widgets/loading-indicator/loadingIndicator.jsx';
import DashboardCard from 'widgets/dashboard_card/dashboard_card.jsx';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
export default class RecordDetails extends React.Component{
  constructor(props) {
    super(props)
  }
  render(){
    let html;
    // Prism can't handle escaped \n and other characters
    let text = JSON.stringify(this.props.data, undefined, 2)
                .replace(/\r\n/g, '\n')
                .replace(/\\\\n/g, "\n")
                .replace(/\\\\'/g, "\'")
                .replace(/\\\\"/g, '\"')
                .replace(/\\\\&/g, "\&")
                .replace(/\\\\r/g, "\r")
                .replace(/\\\\t/g, "\t")
                .replace(/\\\\b/g, "\b")
                .replace(/\\\\f/g, "\f");
    // html = this.props.isLoading ? <LoadingIndicator size={10} show={true} /> : <pre className="json">{JSON.stringify(this.props.data, undefined, 2)}</pre>;
    html = this.props.isLoading ? <LoadingIndicator size={10} show={true} /> : Prism.highlight(text, Prism.languages.javascript, 'javascript');
    return (
            <DashboardCard showHeader={true} title="Record Details" className={this.props.isLoading ? 'loading' : 'recordDetails'}>
              <pre className="language-js">
              <code dangerouslySetInnerHTML={{__html: html}} />
              </pre>
            </DashboardCard>
            );
  }
}
RecordDetails.defaultProps = {
  data: {}
}
