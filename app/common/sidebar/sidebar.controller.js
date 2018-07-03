/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor($interval) {
		this.$interval = $interval;
		this.brightness = 1;
		this.gamma = 1;
		this.slice = 90;
		this.selected = undefined;
		this.current = 'Elavl3-H2BRFP';
		this.placeholder = '';
		this.selectedMasks = {
			cyan: null,
			green: null,
			magenta: null,
			yellow: null
		}

		this.selectedColorChannels = {
			red: null,
			green: null,
			blue: null
		}

		this.colorChannelOpacities = {
			red: 50,
			green: 50,
			blue: 50
		}

	}

	$onInit() {

		/* handle route resolve for masks */

		let setMaskDropdowns = this.$interval(() => {
			if ( this.resolvedMaskNames && Object.keys(this.resolvedMaskNames)
						&& this.masks.length ) {
				let colors = Object.keys(this.resolvedMaskNames);
				for ( let i = 0; i < colors.length; i++ ) {
					this.selectedMasks[colors[i]] = this.masks.filter(mask => {
						return mask.name == this.resolvedMaskNames[colors[i]];
					})[0];
				}
			this.$interval.cancel(setMaskDropdowns);
			}
		}, 200, 5);

		/* handle route resolve for color channels */

		let setColorChannelDropdowns = this.$interval(() => {
			if ( this.resolvedColorChannelNames && Object.keys(this.resolvedColorChannelNames) ) {
				let colors = Object.keys(this.resolvedColorChannelNames);
				for ( let i = 0; i < colors.length; i++ ) {
					this.selectedColorChannels[colors[i]] = this.resolvedColorChannelNames[colors[i]];
				}
			this.$interval.cancel(setColorChannelDropdowns);
			}
		}, 200, 5);


	}

	$onChanges(changes) {

		/* add 'Upload' option to search Lines dropdown */
		this.searchLines = this.lines.slice()
		this.searchLines.unshift('Upload (Image Slices)');

		/* handle route resolve of line */
		if ( this.resolvedLineName != 'Elavl3-H2BRFP' ) {
			this.selected = this.resolvedLineName;
		}
	}

	onUpdateLineWrapper(line) {
		if ( !line.line.startsWith('Upload') ) {
			this.current = line.line;
		}
		this.onUpdateLine({line: this.selected});
		this.selected = this.current;
	}

	onUpdateMaskWrapper(mask, color) {
		this.onUpdateMask(mask, color);
	}

	resetValues() {
		this.brightness = 1;
		this.gamma = 1;
		this.onUpdateLine({line: this.selected});
	}

	gaEvent() {
		ga('send', {
			hitType: 'event',
			eventCategory: 'Lines',
			eventAction: 'select',
			eventLabel: 'Search Line'
		});
	}

}

SidebarController.$inject = ['$interval'];

export default SidebarController;
