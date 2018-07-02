/* viewer/viewer-controller.js */
'use strict'

class ViewerController {
	constructor(ViewerService) {

		this.ViewerService = ViewerService;
			// initial (page load) z-slice number [range 0-137]
		this.sliceIndex = 90;
			// initial display line
		this.currentLineName = 'Elavl3-H2BRFP';
			// initial display image, #viewer#primary-line-image[src]
		this.currentDisplayImage = 'images/0-Lines/Elavl3-H2BRFP/Elavl3-H2BRFP_6dpf_MeanImageOf10Fish-90.jpg';

			// array stores colors of active masks
		this.activeMasks = [];
			// object stores arrays of mask images
		this.maskArrays = {
			cyan: undefined,
			green: undefined,
			magenta: undefined,
			yellow: undefined,
		}
			// currently displayed mask images (each uses image src)
		this.currentDisplayMasks = {
			cyan: 'images/blank.png',
			green: 'images/blank.png',
			magenta: 'images/blank.png',
			yellow: 'images/blank.png'
		}

		this.activeChannels = [];
			// will be populated with arrays of color channel images
		this.colorChannelArrays = {
			red: undefined,
			green: undefined,
			blue: undefined,
		}
			// currently displayed mask image slices (each uses image src)
		this.currentDisplayColorChannels = {
			red: 'images/blank.png',
			green: 'images/blank.png',
			blue: 'images/blank.png',
		}
	}

	$onInit() {

		if ( this.resolvedMaskImages ) {
			let colors = Object.keys(this.resolvedMaskImages);
			for ( let i = 0; i < colors.length; i++ ) {
				this.maskArrays[colors[i]] = this.resolvedMaskImages[colors[i]];
			}
			this.activeMasks = colors.slice();
			this.maskImages = true;
			this.updateSlice();
		}
	}

	$onChanges(changes) {

		/* On new set of lines images load, update display
		 * lineImages << LinesComponent
		 */
		if ( this.lineImages.length ) {
			if ( Array.isArray(this.resolvedLineImages) && this.resolvedLineImages.length ) {
				this.lineName = this.resolvedLineName;
				this.lineImages = this.resolvedLineImages;
				this.resolvedLineName = this.resolvedLineImages = undefined;
			}
			this.currentDisplayImage = this.lineImages[this.sliceIndex].src;
			this.currentLineName = this.lineName || 'Elavl3-H2BRFP';
		}

		/* On new set of mask images load, update display
		 * maskImages << LinesComponent
		 */

		if ( Array.isArray(this.maskImages) ) {
			let color = this.maskColor;
			if ( !this.activeMasks.includes(color) )
				this.activeMasks.push(color)

			if ( !this.maskImages.length ) {
				this.activeMasks.splice(this.activeMasks.indexOf(color));
				this.maskArrays[color] = undefined;
				this.currentDisplayMasks[color] = 'images/blank.png';
			} else {
				this.maskArrays[color] = this.maskImages;
				this.currentDisplayMasks[color] = this.maskArrays[color][this.sliceIndex].src;
			}
		}

		/* On new set of color channel images load, update display
		 * colorChannelImages << LinesComponent
		 */
		if ( this.colorChannelImages ) {
			let color = this.colorChannelColor;
			if ( !this.activeChannels.includes(color) )
				this.activeChannels.push(color)

			if ( this.colorChannelImages === 'None') {
				this.activeChannels.splice(this.activeChannels.indexOf(color));
				this.colorChannelArrays[color] = undefined;
				this.currentDisplayColorChannels[color] = 'images/blank.png';
			} else {
				this.colorChannelArrays[color] = this.colorChannelImages;
				this.currentDisplayColorChannels[color] = this.colorChannelArrays[color][this.sliceIndex].src;
			}
		}

		/* On change slice index update display imagesel images load, update display
		 * sliceIndex << LinesComponent << SidebarComponent
		 */
		if ( this.sliceIndex ) {
			this.updateSlice();
		}
	}

	/* On slider change, update display with new slice number
	 */
	updateSlice()	{

		if ( !Array.isArray(this.lineImages) || !this.lineImages.length )
			return;

		// update displayed slice image
		this.onUpdateIndex({sliceIndex:this.sliceIndex});

		// update active displayed masks
		this.activeMasks.forEach((color) => {
			if ( Array.isArray(this.maskArrays[color]) ) {
				this.currentDisplayMasks[color] = this.maskArrays[color][this.sliceIndex].src;
			}
		});

		// update active displayed color channels
		this.activeChannels.forEach((color) => {
			if ( Array.isArray(this.colorChannelArrays[color]) ) {
				this.currentDisplayColorChannels[color] = this.colorChannelArrays[color][this.sliceIndex].src;
			}
		});

		/* When brightness/gamma adjustments,
		 * update display image if loaded, otherwise skip
		 */
		let imageLoaded = this.lineImages[this.sliceIndex].naturalHeight;

		if ( imageLoaded ) {
			this.currentDisplayImage = this.lineImages[this.sliceIndex].src;
		} else {
			this.ViewerService.forceImgReload(this.lineImages[this.sliceIndex],
													false, { height: 1406, width: 621 }, false);
		}
	}

}

ViewerController.$inject = ['ViewerService'];

export default ViewerController;
