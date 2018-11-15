'use strict'
import AnnotationsController from './annotations.controller';

const AnnotationsComponent = {
	bindings: {
		lineName: '<',
		annotations: '<',
		onUpdateLine: '&',
	},
	controller: AnnotationsController,
	templateUrl: 'views/annotations/annotations.html'
}

export default AnnotationsComponent;
