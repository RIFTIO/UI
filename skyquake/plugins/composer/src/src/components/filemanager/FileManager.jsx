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


//https://raw.githubusercontent.com/RIFTIO/RIFT.ware/master/rift-shell
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _uniqueId from 'lodash/uniqueId'
import React from 'react';
import ReactDOM from 'react-dom';
import TreeView from 'react-treeview';
import TextInput from 'widgets/form_controls/textInput.jsx';
import Button from '../Button';
import './FileMananger.scss';
import FileManagerActions from './FileManagerActions.js';
import imgSave from '../../../../node_modules/open-iconic/svg/data-transfer-upload.svg'
import { Panel, PanelWrapper } from 'widgets/panel/panel';
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
import LoadingIndicator from 'widgets/loading-indicator/loadingIndicator.jsx';

import DropZone from 'dropzone'
import Utils from '../../libraries/utils'
import FileManagerUploadDropZone from '../../libraries/FileManagerUploadDropZone';
let API_SERVER = require('utils/rw.js').getSearchParams(window.location).api_server;

const ASSET_TYPE = {
    'nsd': [
        { id: 'ICONS', folder: 'icons', title: "Icons", allowFolders: false },
        { id: 'SCRIPTS', folder: 'scripts', title: "scripts", allowFolders: true },
        { id: 'NS_CONFIG', folder: 'ns_config', title: "NS Config", allowFolders: false },
        { id: 'VNF_CONFIG', folder: 'vnf_config', title: "VNF Config", allowFolders: false }
    ],
    'vnfd': [
        { id: 'ICONS', folder: 'icons', title: "Icons", allowFolders: false },
        { id: 'CHARMS', folder: 'charms', title: "charms", allowFolders: true },
        { id: 'SCRIPTS', folder: 'scripts', title: "scripts", allowFolders: true },
        { id: 'IMAGES', folder: 'images', title: "images", allowFolders: false },
        { id: 'CLOUD_INIT', folder: 'cloud_init', title: "cloud_init", allowFolders: false },
        { id: 'README', folder: '.', title: "readme", allowFolders: false }
    ]
}

const createDropZone = function (action, clickable, getUploadPropsCallback, dropTarget) {
    const dropZone = new FileManagerUploadDropZone(ReactDOM.findDOMNode(dropTarget), [clickable], action, getUploadPropsCallback);
    // dropZone.on('dragover', this.onDragOver);
    // dropZone.on('dragend', this.onDragEnd);
    // dropZone.on('addedfile', this.onFileAdded);
    return dropZone;
};

function normalizeAssets(packageType, assetInfo, filesStatus) {
    let assets = {};
    let assetTypes = ASSET_TYPE[packageType];
    assetTypes.forEach(assetGroup => {
        const typeFolder = assetGroup.folder;
        let folders = assetInfo.id.filter(name => name.startsWith(typeFolder));
        if (folders.length) {
            folders.reverse();
            assets[assetGroup.id] = folders.map(fullName => {
                let path = fullName.slice(typeFolder.length + 1);
                let files = assetInfo.data[fullName].map(info => ({
                    name: info.name.startsWith(fullName) ? info.name.slice(fullName.length + 1) : info.name,
                    status: filesStatus[info.name]
                }));
                return { path, files };
            });
        }
    });
    return assets;
}

function sendDeleteFileRequest(assetType, path, name) {
    path = path ? path + '/' + name : name;
    FileManagerActions.deletePackageFile({ assetType, path });
}

class FileManager extends React.Component {
    constructor(props) {
        super(props)
        let assests = props.files;
    }
    componentWillMount() {
        // FileManagerActions.openFileManagerSockets()
    }
    componentWillUnmount() {
        // FileManagerActions.closeFileManagerSockets();
    }
    generateFolder(data, nesting) {
        let nestingLevel = nesting || 1;
    }
    render() {
        let { files, filesState, type, item, actions } = this.props;
        let assets = normalizeAssets(type, files, filesState);
        let children = [];
        let assetTypes = ASSET_TYPE[type];
        assetTypes.forEach(assetGroup => {
            const typeFolder = assetGroup.folder;
            let folders = assets[assetGroup.id];
            let rootAssets = { path: '', files: [] };
            let subFolders = null;
            if (folders && folders.length) {
                rootAssets = folders[0];
                subFolders = folders.slice(1);
            }
            children.push(
                <AssetGroup
                    key={typeFolder}
                    packageId={item.id}
                    packageType={type}
                    title={assetGroup.title}
                    assetGroup={assetGroup}
                    path={rootAssets.path}
                    files={rootAssets.files}
                    allowsFolders={assetGroup.allowFolders}
                    folders={subFolders}
                    showNotification={actions.showNotification}
                />
            )
        }, this);

        let html = (
            <div className="FileManager">
                <PanelWrapper style={{ flexDirection: 'column' }}>
                    {children}
                </PanelWrapper>
            </div>
        )
        return html;
    }

}

function NewHierachy(props) {
    return (
        <Panel className="addFileSection" style={{ backgroundColor: 'transparent' }} no-corners>
            <div className="inputSection">
                <TextInput placeholder="some/path" label="create a folder hierarchy" onChange={FileManagerActions.newPathNameUpdated} />
                <Button label="Create" onClick={e => FileManagerActions.createDirectory(props.assetGroup.id)} />
            </div>
        </Panel>
    );
}

class AssetGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { downloadPath: "" };
    }

    render() {
        let { title, packageType, packageId, assetGroup, files, allowsFolders, folders, path, inputState, showNotification } = this.props;
        let children = [];
        if (folders && folders.length) {
            folders.map(function (folder, i) {
                children.push(
                    <AssetGroup
                        key={folder.path}
                        packageId={packageId}
                        title={folder.path}
                        packageType={packageType}
                        files={folder.files}
                        assetGroup={assetGroup}
                        path={folder.path}
                        showNotification={showNotification}
                    />
                )
            });
        }
        let folderCreateComponent = allowsFolders ? <NewHierachy assetGroup={assetGroup} /> : null;
        let entries = null

        function uploadFileFromUrl(url) {
            if (!url || url == "") {
                return;
            }
            let splitUrl = url.split('/');
            let fileName = splitUrl[splitUrl.length - 1];
            if (files.findIndex(f => f.name === fileName) > -1) {
                showNotification('It seems you\'re attempting to upload a file with a duplicate file name');
            } else {
                FileManagerActions.sendDownloadFileRequest({ url, assetType: assetGroup.id, path: path });
            }
        }

        return (
            <Panel title={title} itemClassName="nested" no-corners>
                {folderCreateComponent}
                <div className="folder">
                    <FileAssetList files={files} path={path} packageId={packageId} packageType={packageType} assetGroup={assetGroup} />
                    <Panel className="addFileSection" no-corners>
                        <ItemUpload packageType={packageType} packageId={packageId} path={path} assetGroup={assetGroup} />
                        <div style={{ marginLeft: '0.5rem' }}>
                            OR
                    </div>
                        <div className="inputSection">
                            <TextInput placeholder="URL" className="" label="External URL" value={this.state.downloadPath} onChange={e => this.setState({ downloadPath: e.target.value })} />
                            <Button className='ComposerAppSave' label="DOWNLOAD" onClick={e => uploadFileFromUrl(this.state.downloadPath)} />
                        </div>
                    </Panel>
                    <div>
                        {children}
                    </div>
                </div>
            </Panel>
        );
    }
}

function FileAssetList(props) {
    let { packageType, packageId, assetGroup, files, path } = props;
    let children = null;
    if (files) {
        children = files.map(function (file, i) {
            if (!file.hasOwnProperty('contents')) {
                return <FileAsset key={file.name} file={file} path={path} id={packageId} type={packageType} assetGroup={assetGroup} />
            }
        })
    }
    return (
        <div className='file-list'>
            {children}
        </div>
    );

}

function FileAsset(props) {
    let { file, path, type, assetGroup, id } = props;
    const name = file.name;
    const downloadHost = API_SERVER.match('localhost') || API_SERVER.match('127.0.0.1') ? `${window.location.protocol}//${window.location.hostname}` : API_SERVER;
    //{`${window.location.protocol}//${API_SERVER}:4567/api/package${type}/${id}/${path}/${name}`}
    return (
        <div className="file">
            <div className="file-section">
                <div className="file-info">
                    <div className="file-status"
                        style={{ display: (file.status && file.status.toLowerCase() != 'completed') ? 'inherit' : 'none', color: (file.status == 'FAILED' ? 'red' : 'inherit') }}>
                        {file.status && (file.status == 'IN_PROGRESS' || file.status == 'DOWNLOADING') ? <LoadingIndicator size={2} /> : file.status}
                    </div>
                    <div className="file-name">
                        <a target="_blank" href={`${downloadHost}:4567/api/package/${type}/${id}/${assetGroup.folder}${path}/${name}`}>{name}</a>
                    </div>
                </div>
                <div className="file-action"
                    style={{ display: (!file.status || (file && file.status.toLowerCase() != 'loading...')) ? 'inherit' : 'none', cursor: 'pointer' }}
                    onClick={e => sendDeleteFileRequest(assetGroup.id, path, name)}>
                    X
                </div>
            </div>
        </div>
    )
}

class ItemUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dropzoneIdClass: 'DZ-' + _uniqueId() };
    }
    componentDidMount() {
        createDropZone(
            FileManagerUploadDropZone.ACTIONS.onboard,
            '.ComposerAppAddFile.' + this.state.dropzoneIdClass,
            () => {
            let theCode = 'crap';
            return ({
                packageType: this.props.packageType,
                packageId: this.props.packageId,
                assetGroup: this.props.assetGroup,
                path: this.props.path
            })},
            this);
    }

    render() {
        let { dropzoneIdClass } = this.props;
        return (
            <div className="inputSection">
                <label className="sqTextInput" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <span>Upload File</span>
                    <Button className={'ComposerAppAddFile ' + this.state.dropzoneIdClass} label="BROWSE" />
                </label>
            </div>
        )
    }
}

function stripPath(name, path, returnPath) {
    let stripSlash = (name.indexOf('/') > -1) ? '/' : '';
    // return name.split(path + stripSlash)[1].replace('/', '');
    let split = name.split(path + stripSlash)[returnPath ? 0 : 1];
    return split ? split.replace('/', '') : name;
}



export default SkyquakeComponent(FileManager)
/**
 * Sample Data
 */
// let files = {
//   "name": ".",
//   "contents": [
//     {
//       "name": "pong_vnfd",
//       "contents": [
//         {
//           "name": "pong_vnfd/checksums.txt",
//           "last_modified_time": 1474458399.6218443,
//           "byte_size": 168
//         },
//         {
//           "name": "pong_vnfd/pong_vnfd.yaml",
//           "last_modified_time": 1474458399.6258445,
//           "byte_size": 3514
//         },
//         {
//           "name": "pong_vnfd/icons",
//           "contents": [
//             {
//               "name": "pong_vnfd/icons/rift_logo.png",
//               "last_modified_time": 1474458399.6218443,
//               "byte_size": 1658
//             }
//           ],
//           "last_modified_time": 1474458399.6218443,
//           "byte_size": 3
//         },
//         {
//           "name": "pong_vnfd/cloud_init",
//           "contents": [
//             {
//               "name": "pong_vnfd/cloud_init/pong_cloud_init.cfg",
//               "last_modified_time": 1474458399.6258445,
//               "byte_size": 227
//             }
//           ],
//           "last_modified_time": 1474458399.6258445,
//           "byte_size": 3
//         }
//       ],
//       "last_modified_time": 1474458399.6258445,
//       "byte_size": 6
//     }
//   ],
//   "last_modified_time": 1474458399.6218443,
//   "byte_size": 3
// };
