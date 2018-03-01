/*annotations/annotations.js */
'use strict'
import AnnotationsComponent from './annotations.component';

const Annotations = angular
	.module('annotations', [])
	.component('annotationsComponent', AnnotationsComponent)
	.name;

export default Annotations;
