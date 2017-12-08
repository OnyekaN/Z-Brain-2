/* viewer/index.js */
'use strict'
import ViewerComponent from './viewer.component';
import ViewerService from './viewer.service';
import sliderDirective from './slider.directive';

const Viewer = angular
	.module('viewer', [])
	.component('viewerComponent', ViewerComponent)
	.service('ViewerService', ViewerService)
	.directive('sliderDirective', sliderDirective)
	.name;

export default Viewer;
