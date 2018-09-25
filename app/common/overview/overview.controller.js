/* overview/controller.js */
'use strict'

class OverviewController {
	constructor($window, $timeout, LinesService) {
		this.LinesService = LinesService;
		this.$window = $window;
		this.$timeout = $timeout;
		this.line = "test";
		this.selectedKeywords = [];
		this.allLines = [];
		this.activeLines = [];
}

	$onInit() {

		let names = this.lines;
		names = names.map(obj => {
			let name = obj.line_name;
			if ( name.indexOf('MH_') !== -1 )
					// prefix it to end up near the bottom after sort
				name = "Z1"+name;
			return name;
		});
		names = names.sort();
		names = names.map(name => {
			if ( name.indexOf('Z1') !== -1 )
				name = name.substring(2); //strip prefix
			return name;
		});
		this.allLines = this.activeLines = names.map(name => {
			let src = `images/5-MeanImages/${name}.jpg`,
					keywords = [];
			if ( this.annotations[name] )
				keywords = this.annotations[name].keywords;
			return { name: name, src: src, keywords: keywords };
		});

		this.keywords = [];
		Object.keys(this.annotations).forEach(key => {
			this.annotations[key].keywords.forEach(keyword => {
				if ( keyword != "" && this.keywords.indexOf(keyword) == -1 ) {
					this.keywords.push(keyword);
				}
			});
		});
		this.keywords.sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});

		this.container = document.getElementsByClassName('overview-tiles')[0];
		this.tiles = Array.from(document.getElementsByClassName('overview-tile'));

		let keywordsBank = document.getElementsByClassName('overview-keywords-bank')[0];
		this.$timeout(() => {
			//keywordsBank.style.opacity = '0.4';
		}, 2000);

		window.scrollTo(0, 0);

	}

	filterLines(selections) {
		window.scrollTo(0, 0);
		if ( !selections || !String(selections) ) {
			this.container.style.justifyContent = 'space-around';
			this.tiles.forEach((tile) => { tile.style.marginRight = '0'; });
			this.activeLines = this.allLines;
			return;
		} else {
			this.container.style.justifyContent = 'flex-start';
			this.tiles.forEach((tile) => { tile.style.marginRight = '50px'; });
			this.activeLines = this.allLines.filter(obj => {
				for ( let item in selections ) {
					if ( obj['keywords'].includes(selections[item]) ) {
							return true;
					}
				}
			});
		}
	}

	selectLine(line) {
		this.$window.location.href = `#/home/line/${line}`;
	}

}


OverviewController.$inject = ['$window', '$timeout', 'LinesService'];


export default OverviewController;

