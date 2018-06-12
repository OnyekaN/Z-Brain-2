/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor() {
		this.brightness = 1;
		this.gamma = 1;
		this.slice = 90;
		this.selected = 'Elavl3-H2BRFP';
		this.current = 'Elavl3-H2BRFP';
		this.masks = {
			cyan: 'None',
			green: 'None',
			magenta: 'None',
			yellow: 'None'
		}

		this.colorChannels = {
			red: 'None',
			green: 'None',
			blue: 'None'
		}

		this.colorChannelOpacities = {
			red: 50,
			green: 50,
			blue: 50
		}
	}

	onUpdateLineWrapper(line) {
		if ( !line.line.startsWith('Upload') ) {
			this.current = line.line;
		}
		this.onUpdateLine({line: this.selected});
		this.selected = this.current;
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


export default SidebarController;
