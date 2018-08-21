/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor($interval) {
		this.$interval = $interval;
		this.brightness = 1.0;
		this.gamma = 1.;
		this.slice = 90;
		this.selected = undefined;
		this.current = 'Elavl3-H2BRFP';
		this.shortShareLink = 'https://engertlab.fas.harvard.edu/Z-Brain/#/home/';
		this.fullShareLink = 'https://engertlab.fas.harvard.edu/Z-Brain/#/home/';
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
				colors.forEach(color => {
					this.selectedMasks[color] = this.masks.filter(mask => {
						return mask.name == this.resolvedMaskNames[color];
					})[0];
				});
			this.$interval.cancel(setMaskDropdowns);
			}
		}, 200, 5);

		/* handle route resolve for color channels */

		let setColorChannelDropdowns = this.$interval(() => {
			if ( this.resolvedColorChannelNames && Object.keys(this.resolvedColorChannelNames) ) {
				let colors = Object.keys(this.resolvedColorChannelNames);
				colors.forEach(color => {
					this.selectedColorChannels[color] = this.lines.filter(line => {
						return line.name == this.resolvedColorChannelNames[color];
					})[0];
				});
			this.$interval.cancel(setColorChannelDropdowns);
			}
		}, 200, 5);

		this.createShareLinks();

	}

	$onChanges(changes) {

		/* add 'Upload' option to search Lines dropdown */
		this.searchLines = this.lines.slice()
		this.searchLines.unshift({name:'Upload (Image Slices)', id: 0});

		/* handle route resolve of line */
		if ( this.resolvedLineName != 'Elavl3-H2BRFP' ) {
			this.selected = this.resolvedLineName;
		}
	}

	onUpdateLineWrapper(line) {
		if ( !line.line.name.startsWith('Upload') ) {
			this.current = line.line.name;
		}
		this.onUpdateLine({line: this.selected.name});
		this.selected = this.current;
	}

	onUpdateMaskWrapper(mask, color) {
		this.onUpdateMask(mask, color);
	}

	onOpenShareDialogWrapper() {
		this.createShareLinks();
		this.onOpenShareDialog({short: this.shortShareLink, full: this.fullShareLink});
	}
	resetValues() {
		this.brightness = 1.0;
		this.gamma = 1.0;
		this.onUpdateLine({line: this.selected});
	}

	createShareLinks() {
		let base = `https://engertlab.fas.harvard.edu/Z-Brain/#/home/line/${this.selected||'Elavl3-H2BRFP'}`,
				byId = [],
				byName = [],
				sliceIndex = `&slice_i=${this.sliceIndex}`;

		if ( this.selectedMasks.cyan ) {
			byId.push(`cy_mask=${this.selectedMasks.cyan.id}`);
			byName.push(`cy_mask=${this.selectedMasks.cyan.name}`);
		}
		if ( this.selectedMasks.magenta ) {
			byId.push(`mg_mask=${this.selectedMasks.magenta.id}`);
			byName.push(`mg_mask=${this.selectedMasks.magenta.name}`);
		}
		if ( this.selectedMasks.green ) {
			byId.push(`gr_mask=${this.selectedMasks.green.id}`);
			byName.push(`gr_mask=${this.selectedMasks.green.name}`);
		}
		if ( this.selectedMasks.yellow ) {
			byId.push(`yl_mask=${this.selectedMasks.yellow.id}`);
			byName.push(`yl_mask=${this.selectedMasks.yellow.name}`);
		}


		if ( this.selectedColorChannels.red ) {
			byId.push(`red_ch=${this.selectedColorChannels.red.id}`);
			byName.push(`red_ch=${this.selectedColorChannels.red.name}`);
		}
		if ( this.selectedColorChannels.blue ) {
			byId.push(`blu_ch=${this.selectedColorChannels.blue.id}`);
			byName.push(`blu_ch=${this.selectedColorChannels.blue.name}`);
		}
		if ( this.selectedColorChannels.green ) {
			byId.push(`gre_ch=${this.selectedColorChannels.green.id}`);
			byName.push(`gre_ch=${this.selectedColorChannels.green.name}`);
		}

		if ( byId.length || byName.length ) {
			byId = byId.join('&');
			byName = byName.join('&');
			let [shortShareLink, fullShareLink] = [base+'?'+byId+sliceIndex,
					base+'?'+byName+sliceIndex];
			this.shortShareLink = shortShareLink;
			this.fullShareLink = fullShareLink;
		} else {
			this.shortShareLink = this.fullShareLink = base;
		}

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
