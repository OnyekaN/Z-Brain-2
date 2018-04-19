/* overview/controller.js */
'use strict'

class OverviewController {
	constructor($window, LinesService) {
		this.LinesService = LinesService;
		this.$window = $window;
		this.line = "test";
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
		this.lines = names.map(name => {
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
		this.keywords.sort();
	}

	selectLine(line) {
		this.$window.location.href = '#/home/line/' + line;
	}

}

OverviewController.$inject = ['$window', 'LinesService'];


export default OverviewController;

