/* lines/lines.controller.js */
'use strict'

class LinesController {
	constructor(LinesService, Upload, $timeout) {
		this.LinesService = LinesService;
		this.Upload = Upload;
		this.$timeout = $timeout;
		this.selected = undefined;
		this.lines = [];
		this.regions = [];
		this.files = [];
		this.shortLink = '';
		this.fullLink = '';
		this.sliceIndex = 90;
		this.lineImages = [];
		this.lineName = "";
		this.uploadName = "";
		this.spinnerOpts = {
				// Settings for spin.js spinner
			lines: 9, length: 40, width: 18, radius: 67, corners: 0.8,
			scale: 1.0, color: '#fff', opacity: 0.55, rotate: 0, direction: 1,
			speed: 1.9, trail: 90, fps: 20, zIndex: 2e9, className: 'spinner',
		 	top: '49%', left: '50%', shadow: false, hwaccel: false, position: 'absolute'
		}
		this.spinnerTarget = document.getElementById('spin');
		this.spinner = new Spinner(this.spinnerOpts).spin(this.spinnerTarget).stop();
		this.colorChannelOpacities = { 'red': .5, 'green': .5, 'blue': .5};
	}

	$onInit() {
			// GET line and region names for sidebar
		this.LinesService.getAllLineNames().then(response => {
												let names = response.map(obj => {
													let [name, id] = [obj.line_name, obj.line_id];
													if ( name.indexOf('MH_') !== -1 )
														name = "Z1" + name; // Prefix it to end up near the bottom after sort
													return { 'name': name, 'id': id };
												});
												names = names.sort((a,b) => {
													if ( a.name < b.name ) return -1;
													if ( a.name > b.name ) return 1;
													return 0;
												});
												names = names.map(line => {
													if ( line.name.indexOf('Z1') !== -1 )
														line.name = line.name.substring(2); // strip prefix
													return line;
												});
												this.lines = names;
											});

		this.LinesService.getAllRegionNames().then(response => {
													this.regions = response.map(obj => {
																				let name = obj.region_name.replace("'", "&quot"),
																					 short = name.substr(name.indexOf('-') + 2),
																							id = obj.region_id,
																				 is_mece = obj.bool_or ? 'mece': '';
																				return { 'id': parseInt(id + 1000),
																								 'name': name,
																								 'short': short,
																								 'is_mece': is_mece	}
																				});
													let regions = response.map(obj => {

													});


												});


		this.LinesService.getAnnotations().then(response => {
													this.annotations = response;
												});

			// Cache default line for viewer component
		this.LinesService.cacheLine("Elavl3-H2BRFP").then(response => {
			this.lineImages = response;
		});

		 // Limit number of files on file input to 138
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

		// Sync slice index in lines component with viewer component
	updateIndex(sliceIndex) {
		this.sliceIndex = sliceIndex;
	}

		// Cache selected line images for viewer component
	updateLine(line) {
		if ( !line )
			return;
		if ( line.startsWith('Upload') ){
			this.openUploadDialog();
		} else {
			this.LinesService.cacheLine(line).then(response => {
												this.lineImages = response;
												this.lineName = line;
											});
		}
	}

		// Cache region images for viewer component
	updateRegion(region, color) {
		if ( region ) {
			this.LinesService.cacheRegion(region, color).then(response => {
												let [max, maxIndex] = [response[this.sliceIndex].size, this.sliceIndex];
												this.regionImages = response.map((obj, i) => {
													if ( obj.size > max )
														[max, maxIndex]= [obj.size, i];
													return obj.img
												});
												this.regionColor = color;
												this.$timeout(() => {this.updateIndex(maxIndex)}, 100);
											});
		} else {
			this.regionImages = [];
			this.regionColor = color;
			return;
		}
	}

		// Get color channel for viewer component
	updateColorChannel(line, color) {
		if ( line ) {
			this.LinesService.cacheColorChannel(line, color).then(response => {
													this.colorChannelImages = response;
													this.colorChannelColor = color;
												});
		} else {
			this.colorChannelImages = [];
			this.colorChannelColor = color;
			return;
		}
	}

	updateOpacity(val, color) {
		this.colorChannelOpacities[color] = parseInt(val) / 100;
	}

		// Change the brightness or gamma settings on the displayed line image
	adjustLine(line, brightness, gamma) {
		this.spinner.spin(this.spinnerTarget);
		this.LinesService.adjustLine(line||'Elavl3-H2BRFP', brightness, gamma, this.sliceIndex)
			.then(response => {
												this.lineImages = response;
												this.spinner.stop();
												});
	}

	openShareDialog(short, full) {
		this.shortShareLink = short;
		this.fullShareLink = full;
		let el = document.getElementsByClassName('share')[0];
		el.className += " share-active";
	}

	closeShareDialog() {
		let el = document.getElementsByClassName('share')[0];
		el.className = el.className.replace('share-active', '');
	}

	 // Open and close upload dialog
	openUploadDialog() {
		let el = document.getElementsByClassName('upload')[0];
		el.className += " upload-active";
	}

	closeUploadDialog() {
		let el = document.getElementsByClassName('upload')[0];
		el.className = el.className.replace('upload-active', '');
	}

		// Handle selected files
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
			this.lineName = "Upload";

		this.uploadName = "";
	}

		// Helper function to create linear spaced array
		// https://gist.github.com/joates/6584908
		// with modification: Math.round()
	linspace(a, b, n) {
		if ( typeof n === "undefined" )
			n = Math.max(Math.round(b-a)+1,1);
    if ( n < 2) { return n===1?[a]:[]; }
		let i, ret = Array(n); n--;
    for ( i=n;i>=0;i-- ) { ret[i] = Math.round((i*b+(n-i)*a)/n); }
    return ret;
	}

}

LinesController.$inject = ['LinesService', 'Upload', '$timeout'];





export default LinesController;
