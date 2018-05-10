/* overview/index.js */
'use strict'
import OverviewComponent from './overview.component';
import OverviewImageComponent from './overview.component';

const Overview = angular
	.module('overview', [])
	.component('overviewComponent', OverviewComponent)
	.component('overviewImageComponent', OverviewImageComponent)
	.name;

export default Overview;
