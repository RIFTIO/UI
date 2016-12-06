/**
 * Created by onvelocity on 2/2/16.
 */

import React from 'react'
import OpenWindow from 'react-popout'
import JSONViewer from 'widgets/JSONViewer/JSONViewer';
import ComposerAppActions from '../actions/ComposerAppActions'

import 'widgets/JSONViewer/JSONViewer.scss'

window._open = window.open.bind(window);
window.open = function monkeyPatchOpen(url, name, options) {
	const popupWindow = this._open(url, name, options);
	popupWindow.document.getElementsByTagName('body')[0].focus();
	return popupWindow;
};
const h1style = {
	'paddingTop' : '1rem',
	'marginLeft': '1rem',
	'left': 0,
	'textTransform': 'uppercase',
	'fontSize': '1.625rem',
	'fontWeight': 'normal',
	'fontFamily': 'sans-serif'
}
export default function (props) {
	if (!props.show) {
		return <div></div>;
	}
	function onClose() {
		ComposerAppActions.closeJsonViewer();
	}
	return (
		<OpenWindow title={"RIFT.ware Popup"} onClosing={onClose}>
			<div style={{backgroundColor: '#f1f1f1', 'paddingBottom': '1rem'}}>
				<h1 style={h1style}>{props.title}</h1>
				{props.children}
			</div>
		</OpenWindow>
	);
}
