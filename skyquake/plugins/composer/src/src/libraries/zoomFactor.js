
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
export default function zoomFactor(element = document.body) {
	let factor;
	const rect = element.getBoundingClientRect();
	const physicalW = rect.right - rect.left;
	const logicalW = element.offsetWidth;
	factor = Math.round((physicalW / logicalW) * 100) / 100;
	// if fullscreen mode offsetWidth is 0
	if (isNaN(factor)) {
		factor = 1;
	}
	return factor;
}
