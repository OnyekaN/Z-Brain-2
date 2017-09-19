/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService) {
		this.LinesService = LinesService;
		this.lines = [];
		this.masks = [];
		this.selected = undefined;
		this.lineImages = [];
		this.cyanMaskImages = [];
		this.lineName = "";
		this.spinnerOpts = {
			// settings for spin.js spinner
			lines: 9, length: 40, width: 18, radius: 67, corners: 0.2,
			scale: 1.0, color: '#fff', opacity: 0.55, rotate: 0, direction: 1, 
			speed: 1.9, trail: 90, fps: 20, zIndex: 2e9, className: 'spinner',
		 	top: '49%', left: '50%', shadow: false, hwaccel: false, position: 'absolute'
		}
		this.spinnerTarget = document.getElementById('spin');
		this.spinner = new Spinner(this.spinnerOpts).spin(this.spinnerTarget).stop();
	}

	$onInit() {
		// GET line names from server (e.g. Elavl3-H2BRFP)
		this.LinesService.getLineNames().then(response => { 
												this.lines = response.map(obj => obj.line_name);			
												});

		this.LinesService.getMaskNames().then(response => { 
												this.masks = response.map(obj => obj.mask_name
																														.replace("'", "&quot"));			
												});

		// Load selected line images into browser cache
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
												this.lineImages = response;
												});
	}	

	// Make line images available to viewer component
	updateLine(line) {	
		this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
												this.spinner.stop();
												});
	}

	// Make mask images available to viewer component
	updateMask(mask, color) {
		this.LinesService.cacheMask(mask, color).then(response => {
												this.maskImages = response;
												this.maskColor = color;
												});
	}

	// Change the brightness or gamma settings on the displayed line image
	adjustLine(line, brightness, gamma) {
		console.log(`line:${line}, br:${brightness}, g:${gamma}`);	
		this.spinner.spin(this.spinnerTarget);
		this.LinesService.adjustLine(line, brightness, gamma).then(response => {
												this.lineImages = response;
												this.spinner.stop();
												});
	}

}

LinesController.$inject = ['LinesService'];

export default LinesController;
