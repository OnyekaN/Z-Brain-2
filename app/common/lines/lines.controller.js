/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService) {
		this.LinesService = LinesService;
		this.lines = [];
		this.masks = [];
		this.sliceIndex = 90;
		this.selected = undefined;
		this.lineImages = [];
		this.cyanMaskImages = [];
		this.lineName = "";
		this.spinnerOpts = {
			//settings for spin.js spinner
			lines: 9, length: 40, width: 18, radius: 67, corners: 0.8,
			scale: 1.0, color: '#fff', opacity: 0.55, rotate: 0, direction: 1,
			speed: 1.9, trail: 90, fps: 20, zIndex: 2e9, className: 'spinner',
		 	top: '49%', left: '50%', shadow: false, hwaccel: false, position: 'absolute'
		}
		this.spinnerTarget = document.getElementById('spin');
		this.spinner = new Spinner(this.spinnerOpts).spin(this.spinnerTarget).stop();
	}

	$onInit() {
		//GET line and mask names for sidebar
		this.LinesService.getLineNames().then(response => {
												let names = response.map(obj => {
													let name = obj.line_name;
													if ( name.indexOf('MH_') !== -1 )
														name = "Z1"+name; //Prefix it to end up near the bottom after sort
													return name;
												});
												names = names.sort();
												names = names.map(name => {
													if ( name.indexOf('Z1') !== -1 )
														name = name.substring(2); //Strip prefix
													return name;
												});
												this.lines = names;
											});

		this.LinesService.getMaskNames().then(response => {
													this.masks = response.map(obj => obj.mask_name
																				.replace("'", "&quot"));
												});

		this.LinesService.getAnnotations().then(response => {
													this.annotations = response;
												});

		//Load default (Elavl3-H2BRFP) line images into cache for viewer
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
													this.lineImages = response;
												});
	}

	//Sync slice index in lines component with viewer component
	updateIndex(sliceIndex) {
		this.sliceIndex = sliceIndex;
	}

	//Send line images to viewer component
	updateLine(line) {
		this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
											});
	}

	//Send mask images to viewer component
	updateMask(mask, color) {
		if ( mask === 'None' ) {
			this.maskImages = 'None';
			this.maskColor = color;
			return;
		} else {
		this.LinesService.cacheMask(mask, color).then(response => {
												this.maskImages = response;
												this.maskColor = color;
											});
		}
	}


	//Send color channel to viewer component
	updateColorChannel(line, color) {
		if ( line === 'None' ) {
			this.colorChannelImages = 'None';
			this.colorChannelColor = color;
			return;
		} else {
			this.LinesService.cacheColorChannel(line, color).then(response => {
													this.colorChannelImages = response;
													this.colorChannelColor = color;
												});
		}
	}

	//Change the brightness or gamma settings on the displayed line image
	adjustLine(line, brightness, gamma) {
		this.spinner.spin(this.spinnerTarget);
		this.LinesService.adjustLine(line, brightness, gamma, this.sliceIndex).then(response => {
												this.lineImages = response;
												this.spinner.stop();
												});
	}

}

LinesController.$inject = ['LinesService'];

export default LinesController;
