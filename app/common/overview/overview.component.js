/* overview/component.js */
'use strict'
import OverviewController from './overview.controller';

const OverviewComponent = {
	bindings: {
		lines: '<',
		annotations: '<',
	},
	controller: OverviewController,
	controllerAs: 'Overview',
	templateUrl: 'views/overview/overview.html',
}

export default OverviewComponent;
