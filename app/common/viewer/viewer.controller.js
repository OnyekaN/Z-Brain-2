/* viewer/viewer-controller.js */
'use strict'

class ViewerController {
	constructor() {
		this.imageIndex = 80;
		this.imagesrc = "images/Elavl3-H2BRFP/Elavl3-H2BRFP_6dpf_MeanImageOf10Fish-80.jpg";
		this.currentLine = this.imagesrc;
	}
	update() {
		console.log('now viewing new line number')
	}
	$onInit() {
	}
	$onChanges() {
		if ( this.lineImages.length ) {
			this.currentLine = this.lineImages[this.imageIndex].src;
		}			
	}
	updateSlice() {
		console.log(this.ImageIndex);
		this.currentLine = this.lineImages[this.imageIndex].src;
	}


}

export default ViewerController;
