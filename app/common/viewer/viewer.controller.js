/* viewer/viewer-controller.js */
'use strict'

class ViewerController {
	constructor() {
	// initial #viewer#main-img index, src, images array, and name
		this.sliceIndex = 90;
		this.currentDisplayImage = "images/Elavl3-H2BRFP/Elavl3-H2BRFP_6dpf_MeanImageOf10Fish-90.jpg"
		this.currentLineName = "Elavl3-H2BRFP"; 
		this.maskArrays = {
			cyan: undefined,
			green: undefined,
			magenta: undefined,
			yellow: undefined,
		}	
		this.currentDisplayMasks = {
			cyan: "images/blank.png",
			green: "images/blank.png",
			magenta: "images/blank.png",
			yellow: "images/blank.png"
		}
		this.colorChannelArrays = {
			red: undefined,
			green: undefined,
			blue: undefined,
		}	
		this.currentDisplayColorChannels = {
			red: "images/blank.png",
			green: "images/blank.png",
			blue: "images/blank.png",
		}
	}
	$onInit() {
	}
	$onChanges(changes) {
		// whenever new set of line images loaded, change currently shown
		// line and display name
		if ( this.lineImages.length ) {
			this.currentDisplayImage = this.lineImages[this.sliceIndex].src;
			this.currentLineName = this.lineName || "Elavl3-H2BRFP";
		}			

		// whenever new set of mask images loaded, update display
		if ( this.maskImages ) {	
			this.maskArrays[this.maskColor] = this.maskImages;
			this.currentDisplayMasks[this.maskColor] = this.maskArrays[this.maskColor][this.sliceIndex].src;
		}

		// whenever new set of color channel images loaded, update display
		if ( this.colorChannelImages ) {
			this.colorChannelArrays[this.colorChannelColor] = this.colorChannelImages;
			this.currentDisplayColorChannels[this.colorChannelColor] = this.colorChannelArrays[this.colorChannelColor][this.sliceIndex].src;
			console.log('ye');
		}

		// on changes in brightness update line-img brightness attr
		if ( changes.brightness	) {
			if ( changes.brightness.currentValue == 10 
			&& typeof changes.brightness.previousValue == 'object' ) {
				return;
			}
		}
			
		// on changes in gamma update line-img gamma attr
		if ( changes.gamma ) {
			if ( changes.gamma.currentValue == 0 
			&& typeof changes.gamma.previousValue == 'object' ) {
				return
			}	
			this.gamma = changes.gamma.currentValue;

		}

	}
	// on slider update change slice number
	updateSlice() {
		this.currentDisplayImage = this.lineImages[this.sliceIndex].src;

		if ( Array.isArray(this.maskArrays['cyan']) ) 
			this.currentDisplayMasks['cyan'] = this.maskArrays['cyan'][this.sliceIndex].src;
		if ( Array.isArray(this.maskArrays['green']) ) 
			this.currentDisplayMasks['green'] = this.maskArrays['green'][this.sliceIndex].src;
		if ( Array.isArray(this.maskArrays['magenta']) ) 
			this.currentDisplayMasks['magenta'] = this.maskArrays['magenta'][this.sliceIndex].src;
		if ( Array.isArray(this.maskArrays['yellow']) ) 
			this.currentDisplayMasks['yellow'] = this.maskArrays['yellow'][this.sliceIndex].src;

		if ( Array.isArray(this.colorChannelArrays['red']) ) 
			this.currentDisplayColorChannels['red'] = this.colorChannelArrays['red'][this.sliceIndex].src;
		if ( Array.isArray(this.colorChannelArrays['green']) ) 
			this.currentDisplayColorChannels['green'] = this.colorChannelArrays['green'][this.sliceIndex].src;
		if ( Array.isArray(this.colorChannelArrays['blue']) ) 
			this.currentDisplayColorChannels['blue'] = this.colorChannelArrays['blue'][this.sliceIndex].src;


	}

}

export default ViewerController;
