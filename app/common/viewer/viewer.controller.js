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
			cyan: "images/2Masks/blank.png",
			green: "images/2Masks/blank.png",
			magenta: "images/2Masks/blank.png",
			yellow: "images/2Masks/blank.png"
		}
		this.tempOverlay = `imagesbk/3test/6.7FRhcrtR-Gal4-uasKaede_6dpf_MeanImageOf12Fish-${this.sliceIndex}.png`;
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

		// whenver new set of mask images loaded, display them
		if ( this.maskImages ) {	
			this.maskArrays[this.maskColor] = this.maskImages;
			this.currentDisplayMasks[this.maskColor] = this.maskArrays[this.maskColor][this.sliceIndex].src;
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

		this.tempOverlay = `imagesbk/3test/6.7FRhcrtR-Gal4-uasKaede_6dpf_MeanImageOf12Fish-${this.sliceIndex}.png`;
	}


}

export default ViewerController;
