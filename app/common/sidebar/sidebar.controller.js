/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor() {
		this.brightness = 1;
		this.gamma = 1;
		this.slice = 90;
		this.selected = 'Elavl3-H2BRFP';
		this.current = 'Elavl3-H2BRFP';
		this.opacity = '50';
		this.masks = {
			cyan: 'none',
			green: 'none',
			magenta: 'none',
			yellow: 'none'
		}

		this.colorChannels = {
			red: 'none',
			green: 'none',
			blue: 'none'
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
