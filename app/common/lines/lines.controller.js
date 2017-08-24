/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService) {
		this.LinesService = LinesService;
		this.lines = [];
		this.selected = undefined;
		this.lineImages = [];
		this.lineName = "";
	}

	$onInit() {
		// GET line names from server (e.g. Elavl3-H2BRFP)
		this.LinesService.getLineNames().then(response => { 
												this.lines = response.map(obj => obj.line_name);			
												});

		// Load selected line images into browser cache
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
												this.lineImages = response;
												});
	}	

	// Load new set of line images into browser cache
	updateLine(line) {	
		this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
												});
	}

	// Change the brightness or gamma settings on the displayed line image
	updateBrightness(brightness) {
		this.brightness = brightness;
		console.log(this.brightness);
	}

	adjustLine(line, brightness, gamma) {
		console.log(`line:${line}, br:${brightness}, g:${gamma}`);
		this.LinesService.adjustLine(line, brightness, gamma).then(response => {
												console.log(response.data)
												});
	}

}

LinesController.$inject = ['LinesService'];

export default LinesController;
