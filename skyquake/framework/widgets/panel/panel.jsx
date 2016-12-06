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
import React, {Component} from 'react';
import 'style/core.css';
import './panel.scss';
export class Panel extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let self = this;
        let {children, className, title, ...props} = self.props;
        let classRoot = className ? ' ' + className : ' ';
        let hasCorners = this.props['no-corners'];
        let titleTag = title ? <header className="skyquakePanel-title">{title}</header> : '';
        return (
            <section className={'skyquakePanel' + classRoot} style={props.style}>
                { !hasCorners ? <i className="corner-accent top left"></i> : null }
                { !hasCorners ? <i className="corner-accent top right"></i> : null }
                {titleTag}
                <div className="skyquakePanel-wrapper">
                    <div className={(classRoot ? 'skyquakePanel-body ' + decorateClassNames(classRoot, '-body') : 'skyquakePanel-body')}>
                            {children}
                    </div>
                </div>
                { !hasCorners ? <i className="corner-accent bottom left"></i> : null }
                { !hasCorners ? <i className="corner-accent bottom right"></i> : null }
            </section>
        )
    }
}

Panel.defaultProps = {

}

export class PanelWrapper extends Component {
    render() {
        return (
        <div className={'skyquakePanelWrapper ' + this.props.className} style={this.props.style}>
            {this.props.children}
        </div>)
    }
}

export default Panel;


function decorateClassNames(className, addendum) {
    return className.trim().split(' ').map(function(c) {
        return c + addendum
    }).join(' ');
}
