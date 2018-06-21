/* sidebar/index.js */
'use strict'
import SidebarComponent from './sidebar.component';
import selectDirective from './select.directive';

const Sidebar = angular
	.module('sidebar', ['ui.select'])
	.component('sidebarComponent', SidebarComponent)
	.directive('selectDirective', selectDirective)
	.config((uiSelectConfig) => { uiSelectConfig.theme = 'bootstrap'; })
	.name;

export default Sidebar;
