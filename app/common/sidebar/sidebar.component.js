/* sidebar/sidebar.component.js */
import SidebarController from './sidebar.controller';
'use strict'

const SidebarComponent = {
	bindings: {
		lines: '<',
		masks: '<',
		onUpdateLine: '&',
		onUpdateMask: '&',
		onUpdateColorChannel: '&',
		onAdjustLine: '&',
	},
	controller: SidebarController,
	templateUrl: 'views/sidebar/sidebar.html'
}

export default SidebarComponent;
