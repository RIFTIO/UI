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
import './sshKeyCard.scss';
import React, {Component} from 'react';
import TextInput from 'widgets/form_controls/textInput.jsx';
import SshKeyActions from './sshKeyActions.js';
import Button from 'widgets/button/rw.button.js';

export default class SshKeyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.isExpanded = false;
    }
    cancelEdit(name) {
            SshKeyActions.cancelEditSshKeyPair(name)
    }
    render() {
        let {className, ...props} = this.props;
        let editMode = props.editMode.toString().toUpperCase();
        let editToolsHTML = null;
        let isInEditMode = null;
        let isInCreateMode = null;
        className = "sshKeyCard " + className;
        isInEditMode = editMode == "TRUE" ? true : false;
        isInCreateMode = editMode == "CREATE" ? true : false;
        if(isInEditMode) {
            editToolsHTML = (
                <div className="flex">
                    <span className="oi sshKeyCard-button" data-glyph="circle-check" onClick={props.updateEditSshKeyPair(props.name)}></span>
                    <span className="oi sshKeyCard-button" data-glyph="circle-x" onClick={props.cancelEditSshKeyPair(props.name)}></span>
                </div>
            )
        } else {
            if(isInCreateMode) {
                editToolsHTML = (
                    <div className="flex">
                    <Button className="dark" label="Add Key" onClick={props.saveEditSshKeyPair({name: props.name, key: props.value})}></Button>
                    </div>
                );
            } else {
                editToolsHTML = (
                    <div className="flex">
                        <span className="oi sshKeyCard-button" data-glyph="pencil" title="Edit SSH Key" onClick={props.editKey}></span>
                        <span className="oi sshKeyCard-button" data-glyph="trash" title="Delete SSH Key"  onClick={props.deleteKey}></span>
                    </div>
                );
            }
        }
        return (
            <div className={className}>
                <TextInput className="sshKeyCard-thumbnail " value={props.name} readonly={true && !isInCreateMode} label="name"
                 onChange={props.updateSshKeyPair(props.name, 'name')}
                />
                <div className="sshKeyCard-body">
                    <TextInput type="textarea"
                        className="sshKeyCard-key"
                        value={props.value}
                        readonly={!isInEditMode && !isInCreateMode} label="key"
                        onChange={props.updateSshKeyPair(props.name, 'key')}
                    />
                </div>
                <div className="sshKeyCard-controls">
                    {
                        editToolsHTML
                    }
                </div>
            </div>
        )
    }
}
SshKeyCard.defaultProps = {
    className: null,
    editMode: false,
    saveKey: function(e) {
        console.log('saving key');
    },
    cancelEdit: function(e) {
        console.log('canceling edit');
    },
    editKey: function(e) {
        console.log('Starting edit')
    },
    deleteKey: function(e) {
        console.log('deleting key')
    }


}
