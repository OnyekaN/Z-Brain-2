/* common/index.js */
'use strict'
import Lines from './lines/index';
import Nav from './nav/index';
import Sidebar from './sidebar/index';
import Viewer from './viewer/index';
import Annotations from './annotations/index';

const common = angular
	.module('app.common', [
		Lines,
		Nav,
		Sidebar,
		Viewer,
		Annotations,
	])
	.name;

export default common
