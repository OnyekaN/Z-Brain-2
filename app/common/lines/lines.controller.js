/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService, Upload) {
		this.LinesService = LinesService;
		this.Upload = Upload;
		this.lines = [];
		this.masks = [];
		this.files = [];
		this.sliceIndex = 90;
		this.selected = undefined;
		this.lineImages = [];
		this.cyanMaskImages = [];
		this.lineName = "";
		this.uploadName = "";
		this.spinnerOpts = {
				// settings for spin.js spinner
			lines: 9, length: 40, width: 18, radius: 67, corners: 0.8,
			scale: 1.0, color: '#fff', opacity: 0.55, rotate: 0, direction: 1,
			speed: 1.9, trail: 90, fps: 20, zIndex: 2e9, className: 'spinner',
		 	top: '49%', left: '50%', shadow: false, hwaccel: false, position: 'absolute'
		}
		this.spinnerTarget = document.getElementById('spin');
		this.spinner = new Spinner(this.spinnerOpts).spin(this.spinnerTarget).stop();
	}

	$onInit() {
			// GET line and mask names for sidebar
		this.LinesService.getLineNames().then(response => {
												let names = response.map(obj => {
													let name = obj.line_name;
													if ( name.indexOf('MH_') !== -1 )
														name = "Z1" + name; // prefix it to end up near the bottom after sort
													return name;
												});
												names = names.sort();
												names = names.map(name => {
													if ( name.indexOf('Z1') !== -1 )
														name = name.substring(2); // strip prefix
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

			// cache default line for viewer component
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
			this.lineImages = response;
		});

		 // limit number of files on file input to 138
		var that = this;
		$(document).ready(function() {
			$('.input-upload').change(function() {
				if ( this.files.length > 138 )
					alert('Too many files (min 35, max 138, recommended 138)');
				if ( this.files.length < 30 )
					alert('Too few files (min 35, max 138, recommended 138)');
			});
		});
	}

		// sync slice index in lines component with viewer component
	updateIndex(sliceIndex) {
		this.sliceIndex = sliceIndex;
	}

		// cache selected line images for viewer component
	updateLine(line) {

		if ( line.startsWith('Upload') ){
			this.openUploadDialog();
		} else {
			this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
											});
		}
	}

		// cache mask images for viewer component
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

		// get color channel for viewer component
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

		// change the brightness or gamma settings on the displayed line image
	adjustLine(line, brightness, gamma) {
		this.spinner.spin(this.spinnerTarget);
		this.LinesService.adjustLine(line, brightness, gamma, this.sliceIndex)
			.then(response => {
												this.lineImages = response;
												this.spinner.stop();
												});
	}

	 // open and close upload dialog
	openUploadDialog() {
		let el = document.getElementsByClassName('upload')[0];
		el.className += " upload-active";
	}

	closeUploadDialog() {
		let el = document.getElementsByClassName('upload')[0];
		el.className = el.className.replace('upload-active', '');
	}

		// handle selected files
	uploadFiles() {
		if ( this.files && this.files.length && this.files.length <= 138) {
			this.Upload.upload({
				url: 'api/upload',
				method: 'post',
				arrayKey: '',
				data: { files: this.files }
			}).then(response => {
				let indices = this.linspace(0, response.data.length - 1, 138);
				let images = [];
				indices.forEach(i => {
					let img = new Image(); img.src = response.data[i];
					images.push(img);
				})
				this.lineImages = images;
				this.files = [];
			}, response => {
				alert('Error' + response.data);
			});
			this.closeUploadDialog();
		}
		else if ( this.files.length > 138 )
			alert('Too many files (min 35, max 138, recommended 138)');
		else if ( this.files.length < 35 )
			alert('Too few files (min 35, max 138, recommended 138)');

		if ( this.uploadName )
			this.lineName = this.uploadName;
		else
			this.lineName = "Uploaded Line";

		this.uploadName = "";
	}

		// helper function to create linear spaced array
		// https://gist.github.com/joates/6584908
		// with slight mod => Math.round()
	linspace(a, b, n) {
		if ( typeof n === "undefined" )
			n = Math.max(Math.round(b-a)+1,1);
    if ( n < 2) { return n===1?[a]:[]; }
		let i, ret = Array(n); n--;
    for ( i=n;i>=0;i-- ) { ret[i] = Math.round((i*b+(n-i)*a)/n); }
    return ret;
	}

}

LinesController.$inject = ['LinesService', 'Upload'];

export default LinesController;
