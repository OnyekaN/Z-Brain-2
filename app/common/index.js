/* common/index.js */
'use strict'
import Lines from './lines/index';
import Nav from './nav/index';
import Sidebar from './sidebar/index';

const common = angular
	.module('app.common', [
		Lines,
		Nav,
		Sidebar,
	])
	.name;

export default common
