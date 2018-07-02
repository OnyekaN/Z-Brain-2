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
		onUpdateOpacity: '&',
		onAdjustLine: '&',
		resolvedLineName: '<',
		resolvedMaskNames: '<',
	},
	controller: SidebarController,
	templateUrl: 'views/sidebar/sidebar.html'
}

export default SidebarComponent;
