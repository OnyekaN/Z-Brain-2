/* viewer/index.js */
'use strict'
import ViewerComponent from './viewer.component';
import sliderDirective from './slider.directive';

const Viewer = angular
	.module('viewer', [])
	.component('viewerComponent', ViewerComponent)
	.directive('sliderDirective', sliderDirective)
	.name;

export default Viewer;
