/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		lineImages: '<',
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}

export default ViewerComponent;
