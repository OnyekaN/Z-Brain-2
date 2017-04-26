/* lines/index.js */
'use strict'
import LinesComponent from './lines.component';
import LinesService from './lines.service';
import linesDirective from './lines.directive';

const Lines = angular
	.module('lines', [])
	.component('linesComponent', LinesComponent)
	.directive('linesDirective', linesDirective)
	.service('LinesService', LinesService)
	.name;

export default Lines;
