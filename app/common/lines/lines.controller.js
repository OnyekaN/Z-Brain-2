/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService) {
		this.LinesService = LinesService;
		this.lines = [];
		this.selected = undefined;
		this.lineImages = [];
	}

	$onInit() {
		this.LinesService.getLineNames().then(response => { 
												this.lines = response.map(obj => obj.line_name);			
												console.log(this.lines) 
												});

		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
												this.lineImages = response;
												console.log(response) 
												});
	}	

	updateLine(line) {	
		this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												console.log(this.lineImages);
												});
	}
		

}

LinesController.$inject = ['LinesService'];

export default LinesController;
