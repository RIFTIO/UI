
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
'use strict';

import _isNumber from 'lodash/isNumber'
import _cloneDeep from 'lodash/cloneDeep'
import _isEmpty from 'lodash/isEmpty'
import _mergeWith from 'lodash/mergeWith'
import _uniqBy from 'lodash/uniqBy'
import _isEqual from 'lodash/isEqual'
import _findIndex from 'lodash/findIndex'
import _remove from 'lodash/remove'
import d3 from 'd3'
import alt from '../alt'
import UID from '../libraries/UniqueId'
import DescriptorModelFactory from '../libraries/model/DescriptorModelFactory'
import PanelResizeAction from '../actions/PanelResizeAction'
import CatalogItemsActions from '../actions/CatalogItemsActions'
import CanvasEditorActions from '../actions/CanvasEditorActions'
import ComposerAppActions from '../actions/ComposerAppActions'
import CatalogFilterActions from '../actions/CatalogFilterActions'
import CanvasPanelTrayActions from '../actions/CanvasPanelTrayActions'
import SelectionManager from '../libraries/SelectionManager'
import CatalogDataStore from '../stores/CatalogDataStore'
import isFullScreen from '../libraries/isFullScreen'

import FileManagerSource from '../components/filemanager/FileManagerSource';
import FileManagerActions from '../components/filemanager/FileManagerActions';

import React from 'react';

//Hack for crouton fix. Should eventually put composer in skyquake alt context
import SkyquakeComponent from 'widgets/skyquake_container/skyquakeComponent.jsx';
let NotificationError = null;

import utils from '../libraries/utils';

class ComponentBridge extends React.Component {
    constructor(props) {
        super(props);
        NotificationError = this.props.flux.actions.global.showNotification;
    }
    render(){
        return <i></i>
    }
}
const getDefault = (name, defaultValue) => {
	const val = window.localStorage.getItem('defaults-' + name);
	if (val) {
		if (_isNumber(val)) {
			if (val < 0) {
				return setDefault(name, 0);
			}
		}
		return Number(val);
	}
	setDefault(name, defaultValue);
	return defaultValue;
};

const setDefault = (name, defaultValue) => {
	window.localStorage.setItem('defaults-' + name, defaultValue);
	return defaultValue;
};

/* the top and bottom positions are managed by css; requires div to be display: absolute*/
const defaults = {
	left: getDefault('catalog-panel-start-width', 300),
	right: getDefault('details-panel-start-width', 365),
	bottom: 25 + getDefault('defaults-forwarding-graphs-panel-start-height', 0),
	showMore: false,
	zoom: getDefault('zoom', 100),
	filterCatalogBy: 'nsd',
	defaultPanelTrayOpenZoom: (() => {
		let zoom = parseFloat(getDefault('panel-tray-zoom', 75));
		if (isNaN(zoom)) {
			zoom = 75;
		}
		zoom = Math.min(100, zoom);
		zoom = Math.max(25, zoom);
		setDefault('panel-tray-zoom', zoom);
		return zoom;
	})()
};

const autoZoomCanvasScale = d3.scale.linear().domain([0, 300]).range([100, 50]).clamp(true);

const uiTransientState = {};

class ComposerAppStore {

	constructor() {
        //Bridge for crouton fix
        this.ComponentBridgeElement = SkyquakeComponent(ComponentBridge);

		this.exportAsync(FileManagerSource)
		// the catalog item currently being edited in the composer
		this.item = null;
		// the left and right sides of the canvas area
		this.layout = {
			left: defaults.left,
			right: defaults.right,
			bottom: defaults.bottom
		};
		uiTransientState.restoreLayout = this.layout;
		this.zoom = defaults.zoom;
		this.showMore = defaults.showMore;
		this.filterCatalogByTypeValue = defaults.filterCatalogBy;
		// transient ui state
		this.drag = null;
		this.message = '';
		this.messageType = '';
		this.showJSONViewer = false;
		this.showClassifiers = {};
		this.editPathsMode = false;
		this.fullScreenMode = false;
		this.panelTabShown = 'descriptor';
		//File manager values
		this.files = false;
		this.filesState = {};
		this.downloadJobs = {};
		this.containers = [];
		this.newPathName = '';
		this.displayedPanel = 'forwarding' //or parameter
		//End File  manager values
		this.bindListeners({
			onResize: PanelResizeAction.RESIZE,
			editCatalogItem: CatalogItemsActions.EDIT_CATALOG_ITEM,
			catalogItemMetaDataChanged: CatalogItemsActions.CATALOG_ITEM_META_DATA_CHANGED,
			catalogItemDescriptorChanged: CatalogItemsActions.CATALOG_ITEM_DESCRIPTOR_CHANGED,
			toggleShowMoreInfo: CanvasEditorActions.TOGGLE_SHOW_MORE_INFO,
			showMoreInfo: CanvasEditorActions.SHOW_MORE_INFO,
			showLessInfo: CanvasEditorActions.SHOW_LESS_INFO,
			applyDefaultLayout: CanvasEditorActions.APPLY_DEFAULT_LAYOUT,
			addVirtualLinkDescriptor: CanvasEditorActions.ADD_VIRTUAL_LINK_DESCRIPTOR,
			addForwardingGraphDescriptor: CanvasEditorActions.ADD_FORWARDING_GRAPH_DESCRIPTOR,
			addVirtualDeploymentDescriptor: CanvasEditorActions.ADD_VIRTUAL_DEPLOYMENT_DESCRIPTOR,
			selectModel: ComposerAppActions.SELECT_MODEL,
			outlineModel: ComposerAppActions.OUTLINE_MODEL,
			showError: ComposerAppActions.SHOW_ERROR,
			clearError: ComposerAppActions.CLEAR_ERROR,
			setDragState: ComposerAppActions.SET_DRAG_STATE,
			filterCatalogByType: CatalogFilterActions.FILTER_BY_TYPE,
			setCanvasZoom: CanvasEditorActions.SET_CANVAS_ZOOM,
			showJsonViewer: ComposerAppActions.SHOW_JSON_VIEWER,
			closeJsonViewer: ComposerAppActions.CLOSE_JSON_VIEWER,
			toggleCanvasPanelTray: CanvasPanelTrayActions.TOGGLE_OPEN_CLOSE,
			openCanvasPanelTray: CanvasPanelTrayActions.OPEN,
			closeCanvasPanelTray: CanvasPanelTrayActions.CLOSE,
			enterFullScreenMode: ComposerAppActions.ENTER_FULL_SCREEN_MODE,
			exitFullScreenMode: ComposerAppActions.EXIT_FULL_SCREEN_MODE,
			showAssets: ComposerAppActions.showAssets,
			showDescriptor: ComposerAppActions.showDescriptor,
			getFilelistSuccess: FileManagerActions.getFilelistSuccess,
			updateFileLocationInput: FileManagerActions.updateFileLocationInput,
			sendDownloadFileRequest: FileManagerActions.sendDownloadFileRequest,
			addFileSuccess: FileManagerActions.addFileSuccess,
			deletePackageFile: FileManagerActions.deletePackageFile,
			deleteFileSuccess: FileManagerActions.deleteFileSuccess,
			deleteFileError: FileManagerActions.deleteFileError,
			closeFileManagerSockets: FileManagerActions.closeFileManagerSockets,
			openFileManagerSockets: FileManagerActions.openFileManagerSockets,
			openDownloadMonitoringSocketSuccess: FileManagerActions.openDownloadMonitoringSocketSuccess,
			getFilelistSocketSuccess: FileManagerActions.getFilelistSocketSuccess,
			newPathNameUpdated: FileManagerActions.newPathNameUpdated,
			createDirectory: FileManagerActions.createDirectory
		});
        this.exportPublicMethods({
            closeFileManagerSockets: this.closeFileManagerSockets.bind(this)
        })
	}

	onResize(e) {
		if (e.type === 'resize-manager.resize.catalog-panel') {
			const layout = Object.assign({}, this.layout);
			layout.left = Math.max(0, layout.left - e.moved.x);
			if (layout.left !== this.layout.left) {
				this.setState({layout: layout});
			}
		} else if (e.type === 'resize-manager.resize.details-panel') {
			const layout = Object.assign({}, this.layout);
			layout.right = Math.max(0, layout.right + e.moved.x);
			if (layout.right !== this.layout.right) {
				this.setState({layout: layout});
			}
		} else if (/^resize-manager\.resize\.canvas-panel-tray/.test(e.type)) {
			const layout = Object.assign({}, this.layout);
			layout.bottom = Math.max(25, layout.bottom + e.moved.y);
			if (layout.bottom !== this.layout.bottom) {
				const zoom = autoZoomCanvasScale(layout.bottom) ;
				if (this.zoom !== zoom) {
					this.setState({layout: layout, zoom: zoom});
				} else {
					this.setState({layout: layout});
				}
			}
		} else if (e.type !== 'resize') {
			console.log('no resize handler for ', e.type, '. Do you need to add a handler in ComposerAppStore::onResize()?')
		}
		SelectionManager.refreshOutline();
	}

	updateItem(item) {
		const self = this;
		let containers = [];
		let cpNumber = 0;
		if(!document.body.classList.contains('resizing')) {
			containers = [item].reduce(DescriptorModelFactory.buildCatalogItemFactory(CatalogDataStore.getState().catalogs), []);

			containers.filter(d => DescriptorModelFactory.isConnectionPoint(d)).forEach(d => {
				d.cpNumber = ++cpNumber;
				containers.filter(d => DescriptorModelFactory.isVnfdConnectionPointRef(d)).filter(ref => ref.key === d.key).forEach(ref => ref.cpNumber = d.cpNumber);
			});
			this.setState({containers: containers, item: _cloneDeep(item)});
		}
		SelectionManager.refreshOutline();
	}

	editCatalogItem(item) {
		let self = this;
		self.closeFileManagerSockets();
		if (item && item.uiState) {
			item.uiState.isOpenForEdit = true;
			if (item.uiState.type !== 'nsd') {
				this.closeCanvasPanelTray();
			}
		}
		SelectionManager.select(item);
		this.updateItem(item);
		if (item) {
			this.openFileManagerSockets(item);
		}
	}
	catalogItemMetaDataChanged(item) {
		this.updateItem(item);
	}

	catalogItemDescriptorChanged(itemDescriptor) {
		this.catalogItemMetaDataChanged(itemDescriptor.model);
	}

	showMoreInfo() {
		this.setState({showMore: true});
	}

	showLessInfo() {
		this.setState({showMore: false});
	}

	showError(data) {
        NotificationError.defer({msg: data.errorMessage, type: 'error'})
        // this.setState({message: data.errorMessage, messageType: 'error'});
	}

	clearError() {
		this.setState({message: '', messageType: ''});
	}

	toggleShowMoreInfo() {
		this.setState({showMore: !this.showMore});
	}

	applyDefaultLayout() {
		if (this.item && this.item.uiState && this.item.uiState.containerPositionMap) {
			if (!_isEmpty(this.item.uiState.containerPositionMap)) {
				this.item.uiState.containerPositionMap = {};
				CatalogItemsActions.catalogItemMetaDataChanged.defer(this.item);
			}
		}
	}

	addVirtualLinkDescriptor(dropCoordinates = null) {
		let vld;
		if (this.item) {
			if (this.item.uiState.type === 'nsd') {
				const nsdc = DescriptorModelFactory.newNetworkService(this.item);
				vld = nsdc.createVld();
			} else if (this.item.uiState.type === 'vnfd') {
				const vnfd = DescriptorModelFactory.newVirtualNetworkFunction(this.item);
				vld = vnfd.createVld();
			}
			if (vld) {
				vld.uiState.dropCoordinates = dropCoordinates;
				SelectionManager.clearSelectionAndRemoveOutline();
				SelectionManager.addSelection(vld);
				this.updateItem(vld.getRoot().model);
				CatalogItemsActions.catalogItemDescriptorChanged.defer(vld.getRoot());
			}
		}
	}

	addForwardingGraphDescriptor(dropCoordinates = null) {
		if (this.item && this.item.uiState.type === 'nsd') {
			const nsdc = DescriptorModelFactory.newNetworkService(this.item);
			const fg = nsdc.createVnffgd();
			fg.uiState.dropCoordinates = dropCoordinates;
			SelectionManager.clearSelectionAndRemoveOutline();
			SelectionManager.addSelection(fg);
			this.updateItem(nsdc.model);
			CatalogItemsActions.catalogItemDescriptorChanged.defer(nsdc);
		}
	}

	addVirtualDeploymentDescriptor(dropCoordinates = null) {
		if (this.item.uiState.type === 'vnfd') {
			const vnfd = DescriptorModelFactory.newVirtualNetworkFunction(this.item);
			const vdu = vnfd.createVdu();
			vdu.uiState.dropCoordinates = dropCoordinates;
			SelectionManager.clearSelectionAndRemoveOutline();
			SelectionManager.addSelection(vdu);
			this.updateItem(vdu.getRoot().model);
			CatalogItemsActions.catalogItemDescriptorChanged.defer(vdu.getRoot());
		}
	}

	selectModel(container) {
		if (SelectionManager.select(container)) {
			const model = DescriptorModelFactory.isContainer(container) ? container.getRoot().model : container;
			this.catalogItemMetaDataChanged(model);
		}
	}

	outlineModel(obj) {
		const uid = UID.from(obj);
		requestAnimationFrame(() => {
			SelectionManager.outline(Array.from(document.querySelectorAll(`[data-uid="${uid}"]`)));
		});
	}

	clearSelection() {
		SelectionManager.clearSelectionAndRemoveOutline();
		this.catalogItemMetaDataChanged(this.item);
	}

	setDragState(dragState) {
		this.setState({drag: dragState});
	}

	filterCatalogByType(typeValue) {
		this.setState({filterCatalogByTypeValue: typeValue})
	}

	setCanvasZoom(zoom) {
		this.setState({zoom: zoom});
	}

	showJsonViewer() {
		this.setState({showJSONViewer: true});
	}

	closeJsonViewer() {
		this.setState({showJSONViewer: false});
	}

	toggleCanvasPanelTray(event) {
		const layout = this.layout;
		const attrMap = event.target.attributes;
		let panelEvent = null;
		for(let k in attrMap) {
			if(attrMap[k].name == 'data-event') {
				panelEvent = attrMap[k].nodeValue;
			}
		}
		if ((layout.bottom > 25) && ((panelEvent == this.displayedPanel) || panelEvent == 'arrow')) {
 			this.closeCanvasPanelTray();
 		} else {
 			this.openCanvasPanelTray();
 		}
		if(panelEvent != 'arrow'){
			this.setState({displayedPanel: panelEvent})
		}
 	}

	openCanvasPanelTray() {
		const layout = {
			left: this.layout.left,
			right: this.layout.right,
			bottom: 300
		};
		const zoom = defaults.defaultPanelTrayOpenZoom;
		if (this.zoom !== zoom) {
			this.setState({layout: layout, zoom: zoom, restoreZoom: this.zoom});
		} else {
			this.setState({layout: layout});
		}
	}

	closeCanvasPanelTray() {
		const layout = {
			left: this.layout.left,
			right: this.layout.right,
			bottom: 25
		};
		const zoom = this.restoreZoom || autoZoomCanvasScale(layout.bottom);
		if (this.zoom !== zoom) {
			this.setState({layout: layout, zoom: zoom, restoreZoom: null});
		} else {
			this.setState({layout: layout, restoreZoom: null});
		}
	}

	enterFullScreenMode() {

		/**
		 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
		 * This is an experimental api but works our target browsers and ignored by others
		 */
		const eventNames = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'];

		const appRoot = document.body;//.getElementById('RIFT_wareLaunchpadComposerAppRoot');

		const comp = this;

		function onFullScreenChange() {

			if (isFullScreen()) {
				const layout = comp.layout;
				const restoreLayout = _cloneDeep(layout);
				uiTransientState.restoreLayout = restoreLayout;
				layout.left = 0;
				layout.right = 0;
				comp.setState({fullScreenMode: true, layout: layout, restoreLayout: restoreLayout});
			} else {
				comp.setState({fullScreenMode: false, layout: uiTransientState.restoreLayout});
			}

		}

		if (this.fullScreenMode === false) {

			if (appRoot.requestFullscreen) {
				appRoot.requestFullscreen();
			} else if (appRoot.msRequestFullscreen) {
				appRoot.msRequestFullscreen();
			} else if (appRoot.mozRequestFullScreen) {
				appRoot.mozRequestFullScreen();
			} else if (appRoot.webkitRequestFullscreen) {
				appRoot.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}

			eventNames.map(name => {
				document.removeEventListener(name, onFullScreenChange);
				document.addEventListener(name, onFullScreenChange);
			});

		}

	}

	exitFullScreenMode() {

		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}

		this.setState({fullScreenMode: false});

	}
	showAssets() {
		this.setState({
			panelTabShown: 'assets'
		});
	}
	showDescriptor() {
		this.setState({
			panelTabShown: 'descriptor'
		});
	}

	//File Manager methods
	getFilelistSuccess(data) {
		let self = this;
		let filesState = null;
        if (self.fileMonitoringSocketID) {
        	let newState = {};
        	if(data.hasOwnProperty('contents')) {
        		filesState = updateFileState( _cloneDeep(this.filesState),data);
				let normalizedData = normalizeTree(data);
				newState = {
					files: {
						data: _mergeWith(normalizedData.data, self.files.data, function(obj, src) {
							return _uniqBy(obj? obj.concat(src) : src, 'name');
						}),
						id: normalizedData.id
					},
					filesState: filesState
				}
        	} else {
        		newState = {
        			files: false
        		}
        	}
        	if(!_isEqual(newState.files, this.files) || ! _isEqual(newState.fileState, this.fileState)) {
        		this.setState(newState);
        	}

        }
		function normalizeTree(data) {
			let f = {
				id:[],
				data:{}
			};
			function getContents(d) {
				if(d.hasOwnProperty('contents')) {
					let contents = [];
					d.contents.map(function(c,i) {
						if (!c.hasOwnProperty('contents')) {
							contents.push(c);
						} else {
							getContents(c);
						}
					})
					f.id.push(d.name);
					f.data[d.name] = contents;
				}
			}
			getContents(data);
 			return f;
		}
		function updateFileState(obj, d) {
			d.newFile = '';
			if(d.hasOwnProperty('contents')) {
				d.contents.map(updateFileState.bind(null, obj))
			}
			// override any "pending" state we may have initialized
			obj[d.name] = '';
			return obj;
		}
	}
	sendDownloadFileRequest(data) {
		let id = data.id || this.item.id;
		let type = data.type || this.item.uiState.type;
		let assetType = data.assetType;
		let path = data.path;
		let url = data.url;
		this.getInstance().addFile(id, type, assetType, path, url, data.refresh);
	}
	updateFileLocationInput = (data) => {
		let name = data.name;
		let value = data.value;
		var filesState = _cloneDeep(this.filesState);
		filesState[name] = value;
		this.setState({
			filesState: filesState
		});
	}
	addFileSuccess = (data) => {
		if(!data.refresh) {
			let path = data.path;
			if (path.startsWith('readme')) {
				// this asset type stuff should be in a more common location
				// this is a wee bit of a hack till it is
				path = '.' + path.slice(6);
			}
			let fileName = data.fileName;
			let files = _cloneDeep(this.files);
			let assetGroup = files.data[path] || [];
			if (fileName) {
				let name = path + '/' + fileName;
				if (assetGroup.findIndex(f => f.name === name) == -1){
					assetGroup.push({name});
				}
			}
			files.data[path] = assetGroup;
			if (files.id.indexOf(path) == -1){
				files.id.push(path);
			}
			let filesState = _cloneDeep(this.filesState);
			filesState[name] = "DOWNLOADING";
			this.setState({files, filesState});
		}

	}
	startWatchingJob = () => {
		let ws = window.multiplexer.channel(this.jobSocketId);
		this.setState({
			jobSocket:null
		})
	}
	openDownloadMonitoringSocketSuccess = (id) => {
		let self = this;
		let ws = window.multiplexer.channel(id);
		let downloadJobs = _cloneDeep(self.downloadJobs);
		let newFiles = false;
		ws.onmessage = (socket) => {
            if (self.files && self.files.length > 0) {
                let jobs = [];
                try {
                    jobs = JSON.parse(socket.data);
                } catch(e) {}
                newFiles = _cloneDeep(self.files);
                jobs.map(function(j) {
                    //check if not in completed state
                    let fullPath = j['package-path'];
                    let path = fullPath.split('/');
                    let fileName = path.pop();
                    path = path.join('/');
                    let index = _findIndex(self.files.data[path], function(o){
                        return fullPath == o.name
                    });
                    if((index > -1) && newFiles.data[path][index]) {
                        newFiles.data[path][index].status = j.status
					} else {
                        if(j.status.toUpperCase() == 'LOADING...' || j.status.toUpperCase() == 'IN_PROGRESS') {
                            newFiles.data[path].push({
                                status: j.status,
                                name: fullPath
                            })
                        } else {
                            // if ()
                        }
					}
                })
                self.setState({
                    files: newFiles
                })
			// console.log(JSON.parse(socket.data));
            }
		}
		this.setState({
			jobSocketId: id,
			jobSocket: ws
		})

	}
	getFilelistSocketSuccess = (id) => {
		let self = this;
		let ws = window.multiplexer.channel(id);
		ws.onmessage = (socket) => {
            if (self.fileMonitoringSocketID) {
                let data = [];
                try {
                    data = JSON.parse(socket.data);
                } catch(e) {}
                self.getFilelistSuccess(data)
            }
		}

		this.setState({
			filesState: [],
			files: {
				id:[],
				data:{}
			},
			fileMonitoringSocketID: id,
			fileMonitoringSocket: ws
		})

	}
	closeFileManagerSockets() {
        this.fileMonitoringSocketID = null;
        this.setState({
                jobSocketId : null,
                fileMonitoringSocketID : null
                // jobSocket : null,
                // fileMonitoringSocket : null,
        });
		this.jobSocket && this.jobSocket.close();
		this.fileMonitoringSocket && this.fileMonitoringSocket.close();
        console.log('closing');
	}
	openFileManagerSockets(i) {
		let self = this;
		let item = i || self.item;
        // this.closeFileManagerSockets();
		this.getInstance().openFileMonitoringSocket(item.id, item.uiState.type).then(function() {
        // 	// self.getInstance().openDownloadMonitoringSocket(item.id);
		});
        this.getInstance().openDownloadMonitoringSocket(item.id);
	}
	endWatchingJob(id) {

	}
	deletePackageFile(asset) {
		let {assetType, path} = asset;
		let id = this.item.id;
		let type = this.item.uiState.type;
		this.getInstance().deleteFile(id, type, assetType, path);
	}
	deleteFileSuccess = (data) => {
		let name = null;
		let path = null;
		if (data.assetFolder === 'readme'){
			// freak'n root folder is special
			name = data.path;
			path = ['.'];
		} else {
			name = data.assetFolder + '/' + data.path;
			path = name.split('/');
			path.pop();
		}
		let files = _cloneDeep(this.files);
		let filesForPath = files.data[path.join('/')]
		_remove(filesForPath, function(c) {
			return c.name == name;
		});

		this.setState({
			files: files
		})
	}
	deleteFileError = (error) => {
		const filepath = error.path;
		const message = error.data && error.data.output ? ' (' + error.data.output['error-trace'] + ')' : ' (server error)';
		console.log('Unable to delete', filepath, 'Error:', message);
		ComposerAppActions.showError.defer({
			errorMessage: 'Unable to delete ' + filepath + message + '. '
		});
	}

	newPathNameUpdated = (event) => {
		const value = event.target.value;
		this.setState({
			newPathName: value
		})
	}
	createDirectory = (assetType) => {
		console.log(this.newPathName);
		this.sendDownloadFileRequest({
			id: this.item.id,
			type: this.item.uiState.type,
			assetType: assetType,
			path: this.newPathName,
			url: utils.getSearchParams(window.location).dev_download_server || window.location.protocol + '//' + window.location.host,
			refresh: true
		});
		this.setState({
			newPathName: ''
		})
	}
}

export default alt.createStore(ComposerAppStore, 'ComposerAppStore');
