//  Copyright 2020 Alperen Çetin
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

for (event_name of ["visibilitychange", "webkitvisibilitychange", "blur", "keyup", "focus", "keydown", "keypress"]) {
	window.addEventListener(event_name, function(event) {
		event.stopImmediatePropagation();
	}, true);
}

const uMode = {
	toggle: false,
	18: false,
	16: false,
	65: false
};
const defaultEventHandlersContainer = [];
const defaultHandlers = ['onselectstart', 'oncopy','oncontextmenu','onclick','onkeypress','onkeyup','onkeydown','onmousedown','onmousemove','onmouseup'];
const styles = [];
const maxLoadingTime = 5000;
let extentionLoadingTimeout = setTimeout(loadExtension, maxLoadingTime);
window.addEventListener('load', loadExtension);
function loadExtension() {
	clearTimeout(extentionLoadingTimeout);
	selectAllow();
}
function selectAllow() {
	if (styles.length === 0) {
		styleAdd('user-select: text !important;', 'body', 'div', 'a', 'p', 'span');
		styleAdd('cursor: auto; user-select: text !important;', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
		styleAdd('background-color: #338FFF !important; color: #fff !important;', '::selection');
	}
	newStyleTag(styles);

	window.addEventListener('keydown', uMod, true);
	window.addEventListener('keyup', uMod, true);

	autoAllowSelectAndCopy(defaultEventHandlersContainer, window, document, document.documentElement, document.body);
}
function styleAdd(style, ...selectors) {
	const css_result = `${selectors.join(', ')}{ ${style} }`;
	styles.push(css_result);
}
function newStyleTag(stylesArray) {
	const style_tag = document.createElement('style');
	style_tag.type = 'text/css';
	for (let i = 0; i < stylesArray.length; i++) {
		style_tag.appendChild(document.createTextNode(stylesArray[i]));
	}
	style_tag.setAttribute('data-asas-style', '');
	document.head.appendChild(style_tag);
}
const uMod = function(event) {
	uKeyPressed(event);
	uCombinedPressed();
};
function uKeyPressed(event) {
	if (event.type == 'keydown') {
		if (uMode.hasOwnProperty(event.keyCode)) {
			uMode[event.keyCode] = true;
		}
	} else if (event.type == 'keyup') {
		if (uMode.hasOwnProperty(event.keyCode)) {
			uMode[event.keyCode] = false;
		}
	}
}
function uCombinedPressed() {
	if (uMode[18] && uMode[16] && uMode[65]) {
		uMode.toggle = !uMode.toggle;
		console.log('ultra', uMode.toggle);
		toggleUltraHandlers('selectstart mousedown contextmenu copy keydown', ultraPropagation, uMode.toggle);
	}
}
function toggleUltraHandlers(events, callback, activate) {
	events = events.split(' ');
	if (activate) {
		events.forEach(function(item) {
			window.addEventListener(item, callback, true);
		});
	} else {
		events.forEach(function(item) {
			window.removeEventListener(item, callback, true);
		});
	}
}

function autoAllowSelectAndCopy(arr, ...elems) {
	elems.forEach((elem, index) => {
		const elemContainer = {};
		elemContainer.refElem = elem;
		defaultHandlers.forEach(function(item) {
			elemContainer[item] = elem[item];
			elem[item] = null;
		});
		arr.push(elemContainer);
	});
}