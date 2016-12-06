
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
 * Created by onvelocity on 12/3/15.
 */

import d3 from 'd3'

const defaults = {
	size: 15,
	padding: 5
};

export default class DescriptorGraphGrid {

	constructor(graph, props) {
		this.graph = graph;
		Object.assign(props, defaults);
		this.size = props.size;
		this.padding = props.padding;
	}

	render() {

		const grid = this.graph.grid;
		const width = 2 * this.graph.svg.attr('width');
		const height = 2 * this.graph.svg.attr('height');
		const yAxis = d3.range(0, height, this.size);
		const xAxis = d3.range(0, width, this.size);

		grid.selectAll('line.vertical')
			.data(xAxis)
			.enter().append('svg:line')
			.classed('vertical', true)
			.attr('x1', (d) => d)
			.attr('y1', 0)
			.attr('x2', (d) => d)
			.attr('y2', height);

		grid.selectAll('line.horizontal')
			.data(yAxis)
			.enter().append('svg:line')
			.classed('horizontal', true)
			.attr('x1', 0)
			.attr('y1', (d) => d)
			.attr('x2', width)
			.attr('y2', (d) => d);

	}

}