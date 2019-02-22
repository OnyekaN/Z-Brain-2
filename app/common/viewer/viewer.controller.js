/* viewer/viewer-controller.js */
'use strict'

class ViewerController {
	constructor($interval, $timeout, ViewerService) {
		this.$interval = $interval;
		this.$timeout = $timeout;
		this.ViewerService = ViewerService;
			// initial (page load) z-slice number [range 0-137]
		this.sliceIndex = 90;
			// actively updating slice ? true : false;
		this.updating = true;
			// initial display line
		this.currentLineName = 'Elavl3-H2BRFP';
			// initial display image, #viewer#primary-line-image[src]
		this.currentDisplayImage = 'images/0-Lines/Elavl3-H2BRFP/Elavl3-H2BRFP_6dpf_MeanImageOf10Fish-90.jpg';

			// array stores colors of active masks
		this.activeMasks = [];
			// object stores arrays of mask images
		this.meceMaskArray = null;
		this.maskArrays = {
			cyan: null,
			green: null,
			magenta: null,
			yellow: null,
		}
			// currently displayed mask images (each uses image src)
		this.meceDisplayMask = 'images/blank.png';
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

		window.scrollTo(0, 0);
		/* handle route resolve for masks */

		let setDisplayMasks = this.$interval(() => {
			if ( this.resolvedMaskImages && Object.keys(this.resolvedMaskImages).length ) {
				let keys = Object.keys(this.resolvedMaskImages);
				let colors = ['cyan', 'magenta', 'green', 'yellow'];
				colors.forEach(color => {
					if ( this.resolvedMaskImages[color] ) {
						this.maskArrays[color] = this.resolvedMaskImages[color];
					} else {
						this.maskArrays[color] = null;
					}
				});
				this.maskImages = null;
				this.activeMasks = keys;
				this.updateMasksSlice();
				this.$interval.cancel(setDisplayMasks);
			}
		}, 200, 5);

		/* handle route resolve for color channels */

		let setDisplayColorChannels = this.$interval(() => {
			if ( this.resolvedColorChannelImages
			&& Object.keys(this.resolvedColorChannelImages).length ) {
				let keys = Object.keys(this.resolvedColorChannelImages).slice();
				let colors = ['red', 'blue', 'green'];
				colors.forEach(color => {
					if ( this.resolvedColorChannelImages[color] ) {
						this.colorChannelArrays[color] = this.resolvedColorChannelImages[color];
					} else {
						this.colorChannelArrays[color] = null;
					}
				})
				this.activeChannels = keys;
				this.colorChannelImages = null;
				this.updateColorChannelsSlice();
				this.$interval.cancel(setDisplayColorChannels);
			}
		}, 200, 5);

		if ( this.resolvedSliceIndex ) {
			this.sliceIndex = this.resolvedSliceIndex;
			this.updateSlice()
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

			if ( this.maskImages.length ) {
				if ( !this.activeMasks.includes(color) ) {
					this.activeMasks.push(color)
				}
				this.maskArrays[color] = this.maskImages;
				this.currentDisplayMasks[color] = this.maskArrays[color][this.sliceIndex].src;
			} else {
				this.maskArrays[color] = null;
				this.currentDisplayMasks[color] = 'images/blank.png';
			}
		}

		if ( Array.isArray(this.meceMaskImages) ) {
			if ( this.meceMaskImages.length ) {
				this.meceMaskArray = this.meceMaskImages;
				this.meceDisplayMask = this.meceMaskArray[this.sliceIndex].src;
			} else {
				this.meceMaskArray = null;
				this.meceDisplayMask = 'images/blank.png';
			}
		}

		/* On new set of color channel images load, update display
		 * colorChannelImages << LinesComponent
		 */
		if ( Array.isArray(this.colorChannelImages) ) {
			let color = this.colorChannelColor;

			if ( this.colorChannelImages.length ) {
				if ( !this.activeChannels.includes(color) ) {
					this.activeChannels.push(color)
				}
				this.colorChannelArrays[color] = this.colorChannelImages;
				this.currentDisplayColorChannels[color] =
					this.colorChannelArrays[color][this.sliceIndex].src;
			} else {
				this.colorChannelArrays[color] = null;
				this.currentDisplayColorChannels[color] = 'images/blank.png';
			}
		}

		/* On change slice index update display images
		 * sliceIndex << LinesComponent << SidebarComponent
		 */
		if ( this.sliceIndex ) {
			this.updateSlice();
		}
	}

	/* On slider change, update display with new slice number
	 */
	updateSlice(indexChange=true)	{

		let lineNumber = document.getElementsByClassName('line-number')[0];
		if ( this.updating && indexChange ) {
			this.updating = false;
			lineNumber.className = 'line-number updating';
			this.$timeout(() => {
				lineNumber.className = 'line-number';
				this.updating = true;
			}, 2000);
		}

		if ( !Array.isArray(this.lineImages) || !this.lineImages.length )
			return;

		// update displayed slice image
		this.onUpdateIndex({sliceIndex:this.sliceIndex});
		this.updateMasksSlice();
		this.updateColorChannelsSlice();


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

	updateMasksSlice() {
		// update active displayed masks
		this.activeMasks.forEach((color) => {
			if ( Array.isArray(this.maskArrays[color]) ) {
				this.currentDisplayMasks[color] = this.maskArrays[color][this.sliceIndex].src;
			} else {
				this.activeMasks.splice(this.activeMasks.indexOf(color), 1);
				this.currentDisplayMasks[color] = 'images/blank.png';
			}
		});

		if ( Array.isArray(this.meceMaskArray) ) {
			this.meceDisplayMask = this.meceMaskArray[this.sliceIndex].src;
		} else {
			this.meceDisplayMask = 'images/blank.png';
		}
	}

		// update active displayed color channels
	updateColorChannelsSlice() {

		this.activeChannels.forEach((color) => {
			if ( Array.isArray(this.colorChannelArrays[color]) ) {
				this.currentDisplayColorChannels[color] = this.colorChannelArrays[color][this.sliceIndex].src;
			} else {
				this.currentDisplayColorChannels[color] = 'images/blank.png';
			}
		});
	}

}

ViewerController.$inject = ['$interval', '$timeout', 'ViewerService'];

export default ViewerController;
