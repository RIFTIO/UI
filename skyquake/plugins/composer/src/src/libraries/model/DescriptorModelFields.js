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
/**
 * Created by onvelocity on 1/19/16.
 *
 * The fields used to populate the 'Basic' details editor panel.
 */
const common = ['logo', 'name', 'short-name', 'description', 'vendor', 'version'];
export default {
	simpleList: ['constituent-vnfd', 'vnffgd', 'vld', 'vdu', 'internal-vld'],
	common: common.concat(),
	nsd: common.concat(['constituent-vnfd', 'vnffgd', 'vld']),
	vld: common.concat([]),
	vnfd: common.concat(['vdu', 'internal-vld']),
	'vnfd.vdu': common.concat(['image', 'external-interface', 'vm-flavor', 'cloud-init', 'filename']),
	// white-list valid fields to send in the meta field
	meta: ['containerPositionMap']
};
