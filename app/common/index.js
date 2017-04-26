/* common/index.js */
'use strict'
import Lines from './lines/index';
import Nav from './nav/index';

const common = angular
	.module('app.common', [
		Lines,
		Nav,
	])
	.name;

export default common
