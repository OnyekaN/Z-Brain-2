/* sidebar/index.js */
'use strict'
import SidebarComponent from './sidebar.component';
import selectDirective from './select.directive';

const Sidebar = angular
	.module('sidebar', [])
	.component('sidebarComponent', SidebarComponent)
	.directive('selectDirective', selectDirective)
	.name;
	
export default Sidebar;
