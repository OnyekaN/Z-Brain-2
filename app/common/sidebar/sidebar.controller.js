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
		/* handle route resolve of masks */
		let setMaskDropdowns = this.$interval(() => {
			let colors = Object.keys(this.resolvedMaskNames);
			if ( colors.length && this.masks.length ) {
				for ( let i = 0; i < colors.length; i++ ) {
					this.selectedMasks[colors[i]] = this.masks.filter(mask => {
						return mask.name == this.resolvedMaskNames[colors[i]];
					})[0];
				}
			}
			this.$interval.cancel(setMaskDropdowns);
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

		/* handle route resolve of masks */
		if ( false && !this.isEmpty(this.resolvedMaskNames) ) {
			if ( changes.resolvedMaskNames.isFirstChange() ) {
				console.log('firstChange');
				let colors = Object.keys(this.resolvedMaskNames);
				for ( let i = 0; i < colors.length; i++ ) {
					this.selectedMasks[colors[i]] = this.masks.filter(mask => {
						return mask.name == this.resolvedMaskNames[colors[i]];
					})[0];
				}
			} else {
				console.log(this.selectedMasks);
			}
		}
	}

	testValues() {
		console.log("selected");
		console.log(this.selectedMasks)
		console.log("resolved");
		console.log(this.resolvedMaskNames)
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
		this.resolvedMaskNames = undefined;
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
	/*utility function */
	isEmpty(obj) {
    for ( var key in obj ) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
	}

}

SidebarController.$inject = ['$interval'];

export default SidebarController;
