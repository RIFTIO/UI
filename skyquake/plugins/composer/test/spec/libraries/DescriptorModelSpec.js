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
 * Created by onvelocity on 2/8/16.
 */
/*global describe, beforeEach, it, expect, xit */

'use strict';
import DescriptorModel from 'libraries/model/DescriptorModel'

class TestDescriptorModel extends DescriptorModel {
	constructor(model, parent) {
		super(model, parent);
	}
}
describe('DescriptorModel', () => {
	let parent, child1, child2;
	beforeEach(() => {
		parent = new TestDescriptorModel({name: 'parent 1'});
		child1 = new TestDescriptorModel({name: 'child 1'}, parent);
		child2 = new TestDescriptorModel({name: 'child 2'}, parent);
	});
	it('creates a uid and stores it in the uiState field ":uid"', () => {
		expect(child1.uid).toEqual(child1.model.uiState[':uid']);
	});
	describe('.constructor(model, parent)', () => {
		it('creates child when parent is given on constructor', () => {
			const child = new TestDescriptorModel({name: 'test1'}, parent);
			expect(parent.children).toContain(child);
		});
	});
	describe('.findChildByUid', () => {
		it('finds an existing child', () => {
			const result = parent.findChildByUid(child2.uid);
			expect(result).toBe(child2);
		});
	});
});