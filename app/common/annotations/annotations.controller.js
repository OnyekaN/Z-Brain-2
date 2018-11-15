'use strict'

class AnnotationsController {

	constructor() {
		this.first = true;
		this.linesVals = {};
		this.searchTerm = undefined;
	}


	$onInit() {

	}

	$onChanges(changes) {
		if ( this.first && this.annotations ) {
			Object.keys(this.annotations).forEach((line) => {
				this.linesVals[line] = "";
				Object.keys(this.annotations[line]).forEach((key) => {
					this.linesVals[line] += `${this.annotations[line][key]};`;
				});
			});
			this.first = false;
		console.log(this.linesVals);
		}


		if ( !this.lineName && this.annotations ) {
			let current = Object.assign({}, this.annotations['Elavl3-H2BRFP']);
			this.current = current;
		}

		if ( this.lineName ) {
			this.current = this.annotations[this.lineName];
		}
	}

	handleSearch() {
		this.results = [];
		if ( this.searchTerm ) {
			this.searchTerm = this.searchTerm.toLowerCase();
			Object.keys(this.linesVals).forEach((line) => {
				if ( this.linesVals[line].toLowerCase().indexOf(this.searchTerm) != -1 ) {
					this.results.push(line);
				}
			})
		}
		console.log(this.results);
	}

	onUpdateLineWrapper(line) {
		if ( line ) {
			this.onUpdateLine(line);
		}
	}

	openSearchDialog() {
	}
	closeSearchDialog() {
	}


}

export default AnnotationsController;


