'use strict'

class AnnotationsController {

	constructor() {
		this.first = true;
		this.searchResultsActive = false;
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
			this.openSearchDialog();
			this.searchTerm = this.searchTerm.toLowerCase();
			Object.keys(this.linesVals).forEach((line) => {
				if ( this.linesVals[line].toLowerCase().indexOf(this.searchTerm) != -1 ) {
					this.results.push(line);
				}
			})
			if ( !this.results.length ) {
				this.results = ["None"]
			}
		}
	}

	onUpdateLineWrapper(line) {
		if ( line ) {
			this.onUpdateLine(line);
		}
		this.closeSearchDialog();
	}

	openSearchDialog() {
    let el = document.getElementsByClassName('annotations-search-results')[0];
		if ( el.classList.contains("search-results-hidden") ) {
			el.classList.remove("search-results-hidden");
			el.classList.add("search-results-active");
		}
	}

	closeSearchDialog() {
    let el = document.getElementsByClassName('annotations-search-results')[0];
		if ( el.classList.contains("search-results-active") ) {
			el.classList.remove("search-results-active");
			el.classList.add("search-results-hidden");
		}
	}

}

export default AnnotationsController;


