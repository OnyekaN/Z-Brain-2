/* lines/index.js */
'use strict'
import LinesComponent from './lines.component';
import LinesService from './lines.service';
import sliderDirective from './slider.directive';

const Lines = angular
	.module('lines', [])
	.component('linesComponent', LinesComponent)
	.service('LinesService', LinesService)
	.directive('sliderDirective', sliderDirective)
	.name;

export default Lines;
