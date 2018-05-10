/* overview/overview-image.component.js */
'use strict'

const OverviewImageComponent = {
	bindings: {
		line: '<',
	},
	controller: OverviewImageController,
	template: `
		<div class="overview-tile">
			<h2 align="center">{{$ctrl.line.name}}</h2>
			<img alt="$ctrl.line.name" src="$ctrl.line.src"/>
		</div>
	`
}

class OverviewImageController {
	constructor() {

	}
}
