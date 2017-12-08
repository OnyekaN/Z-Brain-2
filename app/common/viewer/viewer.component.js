/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		//sliceIndex: '=',
		lineImages: '<',
		lineName: '<',
		maskImages: '<',
		maskColor: '<',
		colorChannelImages: '<',
		colorChannelColor: '<',
		onUpdateIndex: '&'
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}



export default ViewerComponent;
