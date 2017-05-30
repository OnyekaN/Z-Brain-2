/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		lineImages: '<',
		lineName: '<',
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}

export default ViewerComponent;
