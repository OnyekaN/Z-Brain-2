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
		// GET line names from server (e.g. Elavl3-H2BRFP)
		this.LinesService.getLineNames().then(response => { 
												this.lines = response.map(obj => obj.line_name);			
												});

		// Load selected line images into browser cache
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
												this.lineImages = response;
												console.log(response) 
												});
	}	

	updateLine(line) {	
		this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
												console.log(this.lineImages);
												});
	}
		

}

LinesController.$inject = ['LinesService'];

export default LinesController;
