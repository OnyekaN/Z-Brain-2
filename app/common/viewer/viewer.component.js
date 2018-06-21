/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		resolvedLineName: '<',
		resolvedLineImages: '<',
		lineImages: '<',
		lineName: '<',
		maskImages: '<',
		maskColor: '<',
		sliceIndex: '<',
		colorChannelImages: '<',
		colorChannelColor: '<',
		colorChannelOpacities: '<',
		onUpdateIndex: '&',
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}



export default ViewerComponent;
