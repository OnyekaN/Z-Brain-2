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

		this.selectedRegions = {
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

		/* handle route resolve for regions */

		let setRegionDropdowns = this.$interval(() => {
			if ( this.resolvedRegionNames && Object.keys(this.resolvedRegionNames)
						&& this.regions.length ) {
				let colors = Object.keys(this.resolvedRegionNames);
				colors.forEach(color => {
					this.selectedRegions[color] = this.regions.filter(region => {
						return region.name == this.resolvedRegionNames[color];
					})[0];
				});
			this.$interval.cancel(setRegionDropdowns);
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

	onUpdateRegionWrapper(region, color) {
		this.onUpdateRegion(region, color);
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

	regionsGroupFn(region) {
		if ( region.name.indexOf('Forebrain') == 0 ) {
			return 'Forebrain';
		} else if ( region.name.indexOf('Midbrain') == 0 ) {
			return 'Midbrain';
		} else if ( region.name.indexOf('Hindbrain') == 0 ) {
			return 'Hindbrain';
		} else if ( region.name.indexOf('Ganglia') == 0 ) {
			return 'Ganglia';
		} else if ( region.name.indexOf('Spinal Cord') == 0 ) {
			return 'Spinal Cord';
		} else {
			return 'Other';
		}
	}

	createShareLinks() {
		let base = `https://engertlab.fas.harvard.edu/Z-Brain/#/home/line/${this.selected||'Elavl3-H2BRFP'}`,
				byId = [],
				byName = [],
				sliceIndex = `&slice_i=${this.sliceIndex}`;

		if ( this.selectedRegions.cyan ) {
			byId.push(`cy_region=${this.selectedRegions.cyan.id}`);
			byName.push(`cy_region=${this.selectedRegions.cyan.name}`);
		}
		if ( this.selectedRegions.magenta ) {
			byId.push(`mg_region=${this.selectedRegions.magenta.id}`);
			byName.push(`mg_region=${this.selectedRegions.magenta.name}`);
		}
		if ( this.selectedRegions.green ) {
			byId.push(`gr_region=${this.selectedRegions.green.id}`);
			byName.push(`gr_region=${this.selectedRegions.green.name}`);
		}
		if ( this.selectedRegions.yellow ) {
			byId.push(`yl_region=${this.selectedRegions.yellow.id}`);
			byName.push(`yl_region=${this.selectedRegions.yellow.name}`);
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
