'use strict'

class AnnotationsController {

	constructor() {
		this.currentAnnotations = this.annotations;
	}

	$onChanges(changes) {
		if ( this.lineName ) {
			console.log(this.annotations)
		}
	}

}

export default AnnotationsController;


