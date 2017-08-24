/* sidebar/sidebar.controller.js */
'use strict'

class SidebarController {
	constructor() {
		this.brightness = 0;
		this.gamma = 0;
		this.selected = 'Elavl3-H2BRFP';
	}
	resetValues() {
		this.brightness = 0;
		this.gamma = 0;
		this.onAdjustLine({line: this.selected, brightness: 0, gamma: 0});
	}
}

export default SidebarController;
