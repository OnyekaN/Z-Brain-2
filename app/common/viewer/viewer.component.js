/* viewer/viewer.component.js */
'use strict'
import ViewerController from './viewer.controller.js';

const ViewerComponent = {
	bindings: {
		lineImages: '<',
		lineName: '<',
		regionImages: '<',
		regionColor: '<',
		sliceIndex: '<',
		hitRegions: '<',
		colorChannelImages: '<',
		colorChannelColor: '<',
		colorChannelOpacities: '<',
		onUpdateIndex: '&',
		resolvedLineName: '<',
		resolvedLineImages: '<',
		resolvedRegionImages: '<',
		resolvedSliceIndex: '<',
		resolvedColorChannelImages: '<',
	},
	controller: ViewerController,
	templateUrl: 'views/viewer/viewer.html'
}



export default ViewerComponent;
