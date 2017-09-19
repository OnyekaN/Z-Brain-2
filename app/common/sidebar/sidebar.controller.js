/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor() {
		this.brightness = 1;
		this.gamma = 1;
		this.selected = 'Elavl3-H2BRFP';
		this.masks = {
			cyan: 'none',
			green: 'none',
			magenta: 'none',
			yellow: 'none'
		}
	}
	resetValues() {
		this.brightness = 1;
		this.gamma = 1;
		this.onUpdateLine({line: this.selected});
	}
}

export default SidebarController;
