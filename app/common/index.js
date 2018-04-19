/* common/index.js */
'use strict'
import Lines from './lines/index';
import Nav from './nav/index';
import Sidebar from './sidebar/index';
import Viewer from './viewer/index';
import Annotations from './annotations/index';
import Overview from './overview/index';

const common = angular
	.module('app.common', [
		Lines,
		Nav,
		Sidebar,
		Viewer,
		Annotations,
		Overview,
	])
	.name;

export default common
