/* lines/index.js */
'use strict'
import LinesComponent from './lines.component';
import LinesService from './lines.service';

const Lines = angular
	.module('lines', [])
	.component('linesComponent', LinesComponent)
	.service('LinesService', LinesService)
	.config([
		'$stateProvider', '$urlRouterProvider',
		($stateProvider, $urlRouterProvider) => {

			$urlRouterProvider.when('/home', '/home/');
			$urlRouterProvider.when('/home/line/', '/home/');

			$stateProvider.state('home.default', {
				url: '/',
				views: {
					'sidebar': {
						template: sidebarComponentTemplate,
					},
					'viewer': {
						template: viewerComponentTemplate,
					},
				},
				resolve: {
					resolvedLineName: [() => { return 'Elavl3-H2BRFP' }],
					resolvedLineImages: [ 'LinesService', (LinesService) => {
						return LinesService.cacheLine('Elavl3-H2BRFP')
					}],
				},
			})

			$stateProvider.state('home.line', {
				url: '/line/{id}?cy_region&mg_region&gr_region&yl_region&red_ch&blu_ch&gre_ch&slice_i',
				views: {
					'sidebar': {
						template: sidebarComponentTemplate,
					},
					'viewer': {
						template: viewerComponentTemplate,
					},
				},
				resolve: {
					resolvedSliceIndex: [
						'$stateParams', ($stateParams) => {
							return $stateParams.slice_i
						}
					],
					resolvedLineName: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.getNameOfLine($stateParams.id);
						}
					],
					resolvedLineImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheLine($stateParams.id);
						}
					],
					resolvedRegionNames: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.getNamesOfRegions({
								cyan: $stateParams.cy_region,
								magenta: $stateParams.mg_region,
								yellow: $stateParams.yl_region,
								green: $stateParams.gr_region
							});
						}
					],
					resolvedRegionImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheMultipleRegions({
								cyan: $stateParams.cy_region,
								magenta: $stateParams.mg_region,
								yellow: $stateParams.yl_region,
								green: $stateParams.gr_region
							});
						}
					],
					resolvedColorChannelNames: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.getNamesOfLines({
								red: $stateParams.red_ch,
								blue: $stateParams.blu_ch,
								green: $stateParams.gre_ch,
							});
						}
					],
					resolvedColorChannelImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheMultipleColorChannels({
								red: $stateParams.red_ch,
								blue: $stateParams.blu_ch,
								green: $stateParams.gre_ch,
							});
						}
					],
				},
			});
		}])
	.name;

let sidebarComponentTemplate = `
					<sidebar-component
						lines="$ctrl.lines"
						regions="$ctrl.regions"
						slice-index="$ctrl.sliceIndex"
						on-update-line="$ctrl.updateLine(line)"
						on-update-region="$ctrl.updateRegion(region, color)"
						on-update-color-channel="$ctrl.updateColorChannel(line, color)"
						on-update-opacity="$ctrl.updateOpacity(val, color)"
						on-adjust-line="$ctrl.adjustLine(line, brightness, gamma)"
						on-open-share-dialog="$ctrl.openShareDialog(short, full)"
						resolved-line-name="$resolve.resolvedLineName"
						resolved-region-names="$resolve.resolvedRegionNames"
						resolved-color-channel-names="$resolve.resolvedColorChannelNames">
					</sidebar-component>
`;


let viewerComponentTemplate = `
					<viewer-component
						line-name="$ctrl.lineName"
						line-images="$ctrl.lineImages"
						region-images="$ctrl.regionImages"
						region-color="$ctrl.regionColor"
						slice-index="$ctrl.sliceIndex"
						color-channel-images="$ctrl.colorChannelImages"
						color-channel-color="$ctrl.colorChannelColor"
						color-channel-opacities="$ctrl.colorChannelOpacities"
						on-update-index="$ctrl.updateIndex(sliceIndex)"
						resolved-slice-index="$resolve.resolvedSliceIndex"
						resolved-line-name="$resolve.resolvedLineName"
						resolved-line-images="$resolve.resolvedLineImages"
						resolved-region-images="$resolve.resolvedRegionImages"
						resolved-color-channel-images="$resolve.resolvedColorChannelImages">
					</viewer-component>
`;

export default Lines;
