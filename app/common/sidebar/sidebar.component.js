/* sidebar/sidebar.component.js */
import SidebarController from './sidebar.controller';
'use strict'

const SidebarComponent = {
	bindings: {
		lines: '<',
		regions: '<',
		sliceIndex: '<',
		onUpdateLine: '&',
		onUpdateRegion: '&',
		onUpdateColorChannel: '&',
		onUpdateOpacity: '&',
		onAdjustLine: '&',
		onOpenShareDialog: '&',
		resolvedLineName: '<',
		resolvedRegionNames: '<',
		resolvedColorChannelNames: '<',
	},
	controller: SidebarController,
	templateUrl: 'views/sidebar/sidebar.html'
}

export default SidebarComponent;
