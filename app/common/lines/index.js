/* lines/index.js */
'use strict'
import LinesComponent from './lines.component';
import LinesService from './lines.service';

const Lines = angular
	.module('lines', [])
	.component('linesComponent', LinesComponent)
	.service('LinesService', LinesService)
	.name;

export default Lines;
