'use strict'

class AnnotationsController {

	constructor($timeout) {
		this.$timeout = $timeout;
		this.first = true;
		this.searchResultsActive = false;
		this.linesVals = {};
		this.searchTerm = undefined;
		this.searchOpen = false;
    this.searchResEl = document.getElementsByClassName('annotations-search-results')[0];
	}


	$onInit() {

	}

	$onChanges(changes) {
		if ( this.first && this.annotations ) {
			Object.keys(this.annotations).forEach((line) => {
				this.linesVals[line] = "";
				Object.keys(this.annotations[line]).forEach((key) => {
					if ( !!this.annotations[line][key] ) {
						this.linesVals[line] += `${this.annotations[line][key]} | `;
					}
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

	onUpdateLineWrapper(line) {
		if ( line ) {
			if ( line.line == 'No Matches' )
				return;
			this.onUpdateLine(line);
		}
		this.searchTerm = '';
		this.closeSearchResults();
	}

	handleSearch() {
		this.results = [];
		if ( this.searchTerm ) {
			this.openSearchResults();
			this.searchTerm = this.searchTerm.toLowerCase();
			Object.keys(this.linesVals).forEach((line) => {
				if ( this.linesVals[line].toLowerCase().indexOf(this.searchTerm) != -1 ) {
					let lineName = this.linesVals[line].split(' | ')[1];
					if ( this.annotations[lineName] ) {
						this.results.push(this.annotations[lineName]);
					}
				}
			})
			if ( !this.results.length ) {
				this.results = []
			}
		} else {
			this.closeSearchResults();
		}

	}

	openSearchResults() {
		if ( !!this.searchTerm && this.searchResEl.classList.contains('search-results-hidden') ) {
			this.searchResEl.classList.remove('search-results-hidden');
			this.searchResEl.classList.add('search-results-active');
		}
	}

	closeSearchResults() {
		if ( this.searchResEl.classList.contains('search-results-active') ) {
			this.searchResEl.classList.remove('search-results-active');
			this.searchResEl.classList.add('search-results-hidden');
		}
	}

	delayCloseSearchResults(delay) {
		this.searchOpen = false;
		this.$timeout(() => {
			if ( !this.searchOpen ) {
				this.closeSearchResults();
			}
		}, delay);
	}

}
AnnotationsController.$inject = ['$timeout'];

export default AnnotationsController;


