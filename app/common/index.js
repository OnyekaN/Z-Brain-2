/* common/index.js */
'use strict'
import Lines from './lines/index';
import Nav from './nav/index';
import Sidebar from './sidebar/index';
import Viewer from './viewer/index';

const common = angular
	.module('app.common', [
		Lines,
		Nav,
		Sidebar,
		Viewer,
	])
	.name;

export default common
