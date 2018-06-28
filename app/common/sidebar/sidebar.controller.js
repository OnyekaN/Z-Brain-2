/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor($timeout) {
		this.$timeout = $timeout;
		this.brightness = 1;
		this.gamma = 1;
		this.slice = 90;
		this.selected = undefined;
		this.current = 'Elavl3-H2BRFP';
		this.placeholder = '';
		this.sel = false;
		this.selectedMasks = {
			cyan: undefined,
			green: undefined,
			magenta: undefined,
			yellow: undefined
		}

		this.selectedColorChannels = {
			red: undefined,
			green: undefined,
			blue: undefined
		}

		this.colorChannelOpacities = {
			red: 50,
			green: 50,
			blue: 50
		}
	}

	$onChanges() {
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

	onUpdateMaskWrapper({mask, color}) {
		/* try reset to default instead of 'None' */
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

SidebarController.$inject = ['$timeout'];

export default SidebarController;
