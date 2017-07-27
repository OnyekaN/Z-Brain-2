/* viewer/viewer-controller.js */
'use strict'

class ViewerController {
	constructor() {
	// initial #viewer#main-img index, src, images array, and name
		this.imageIndex = 90;
		this.imagesrc = "images/Elavl3-H2BRFP/Elavl3-H2BRFP_6dpf_MeanImageOf10Fish-90.jpg";
		this.currentDisplayImage = this.imagesrc;
		this.currentLineName = "Elavl3-H2BRFP"; 
	}
	$onInit() {
	}
	$onChanges(changes) {
		// whenever new set of line images loaded, change currently shown
		// line and display name
		if ( this.lineImages.length ) {
			//$("#line-image").replaceWith("<img id='line-image' ng-src='{{$ctrl.currentDisplayImage}}' alt='line-image' brightness='{{$ctrl.brightness}}'/>")
			this.currentDisplayImage = this.lineImages[this.imageIndex].src;
			this.currentLineName = this.lineName || "Elavl3-H2BRFP";
		}			

		// on changes in brightness update line-img brightness attr
		if ( changes.brightness	) {
			if ( changes.brightness.currentValue == 10 
			&& typeof changes.brightness.previousValue == 'object' ) {
				return;
			}
			let brightness = changes.brightness.currentValue - changes.brightness.previousValue;	
			Caman('#line-image', function () {
				this.brightness(brightness);
				this.render();
			});
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
		this.currentDisplayImage = this.lineImages[this.imageIndex].src;
	}


}

export default ViewerController;
