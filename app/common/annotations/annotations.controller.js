'use strict'

class AnnotationsController {

	constructor() {
	}

	$onChanges(changes) {
		if ( !this.lineName && this.annotations ) {
			let current = Object.assign({}, this.annotations['Elavl3-H2BRFP']);
			console.log(current);
			this.current = current;

		}

		if ( this.lineName ) {
			this.current = this.annotations[this.lineName];
		}
	}

}

export default AnnotationsController;


