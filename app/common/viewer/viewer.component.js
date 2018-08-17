/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		lineImages: '<',
		lineName: '<',
		maskImages: '<',
		maskColor: '<',
		sliceIndex: '<',
		colorChannelImages: '<',
		colorChannelColor: '<',
		colorChannelOpacities: '<',
		onUpdateIndex: '&',
		resolvedLineName: '<',
		resolvedLineImages: '<',
		resolvedMaskImages: '<',
		resolvedSliceIndex: '<',
		resolvedColorChannelImages: '<',
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}



export default ViewerComponent;
