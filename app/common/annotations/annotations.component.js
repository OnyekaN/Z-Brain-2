'use strict'
import AnnotationsController from './annotations.controller';

const AnnotationsComponent = {
	bindings: {
		lineName: '<',
		annotations: '<'
	},
	controller: AnnotationsController,
	templateUrl: 'views/annotations/annotations.html'
}

export default AnnotationsComponent;
