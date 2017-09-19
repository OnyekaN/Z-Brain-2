/* sidebar/sidebar.component.js */
import SidebarController from './sidebar.controller';
'use strict'

const SidebarComponent = {
	bindings: {
		lines: '<',
		masks: '<',
		onUpdateLine: '&',
		onUpdateMask: '&',
		onAdjustLine: '&',
		onUpdateBrightness: '&',
	},
	controller: SidebarController,
	templateUrl: '/views/sidebar/sidebar.html'
}

export default SidebarComponent;
