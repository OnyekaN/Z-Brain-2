/* viewer/index.js */
'use strict'
import ViewerComponent from './viewer.component';

const Viewer = angular
	.module('viewer', [])
	.component('viewerComponent', ViewerComponent)
	.name;

export default Viewer;
