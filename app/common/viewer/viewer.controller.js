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

			// array stores colors of active regions
		this.activeRegions = [];
			// object stores arrays of region images
		this.meceRegionArray = null;
		this.regionArrays = {
			cyan: null,
			green: null,
			magenta: null,
			yellow: null,
		}
			// currently displayed region images (each uses image src)
		this.meceDisplayRegion = 'images/blank.png';
		this.currentDisplayRegions = {
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
			// currently displayed region image slices (each uses image src)
		this.currentDisplayColorChannels = {
			red: 'images/blank.png',
			green: 'images/blank.png',
			blue: 'images/blank.png',
		}
	}

	$onInit() {

		const that = this;
		window.scrollTo(0, 0);
		document.getElementById('display-images').onmousemove = this.handleMouseMove;
		/* handle route resolve for regions */

		let setDisplayRegions = this.$interval(() => {
			if ( this.resolvedRegionImages && Object.keys(this.resolvedRegionImages).length ) {
				let keys = Object.keys(this.resolvedRegionImages);
				let colors = ['cyan', 'magenta', 'green', 'yellow'];
				colors.forEach(color => {
					if ( this.resolvedRegionImages[color] ) {
						this.regionArrays[color] = this.resolvedRegionImages[color];
					} else {
						this.regionArrays[color] = null;
					}
				});
				this.regionImages = null;
				this.activeRegions = keys;
				this.updateRegionsSlice();
				this.$interval.cancel(setDisplayRegions);
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

		/* On new set of region images load, update display
		 * regionImages << LinesComponent
		 */

		if ( Array.isArray(this.regionImages) ) {
			let color = this.regionColor;

			if ( this.regionImages.length ) {
				if ( !this.activeRegions.includes(color) ) {
					this.activeRegions.push(color)
				}
				this.regionArrays[color] = this.regionImages;
				this.currentDisplayRegions[color] = this.regionArrays[color][this.sliceIndex].src;
			} else {
				this.regionArrays[color] = null;
				this.currentDisplayRegions[color] = 'images/blank.png';
			}
		}

		if ( Array.isArray(this.meceRegionImages) ) {
			if ( this.meceRegionImages.length ) {
				this.meceRegionArray = this.meceRegionImages;
				this.meceDisplayRegion = this.meceRegionArray[this.sliceIndex].src;
			} else {
				this.meceRegionArray = null;
				this.meceDisplayRegion = 'images/blank.png';
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
		this.updateRegionsSlice();
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

	updateRegionsSlice() {
		// update active displayed regions
		this.activeRegions.forEach((color) => {
			if ( Array.isArray(this.regionArrays[color]) ) {
				this.currentDisplayRegions[color] = this.regionArrays[color][this.sliceIndex].src;
			} else {
				this.activeRegions.splice(this.activeRegions.indexOf(color), 1);
				this.currentDisplayRegions[color] = 'images/blank.png';
			}
		});
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

	handleMouseMove(event) {
		let eventDoc, doc, body;

		event = event || window.event;

		if ( event.pageX == null && event.clientX != null ) {
			eventDoc = ( event.target && event.target.ownerDocument ) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = event.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0);
		}
		if ( event.pageX < 600 && event.pageY < 1400 ) {
			return { 'x': event.pageX, 'y': event.pageY }
		}
		//console.log("X: "+event.pageX);
		//console.log("Y: "+event.pageY);

	}

}

ViewerController.$inject = ['$interval', '$timeout', 'ViewerService'];

export default ViewerController;
