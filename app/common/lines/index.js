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
				url: '/line/{id}?cy_mask&mg_mask&gr_mask&yl_mask&red_chl&bl_chl&gr_chl',
				views: {
					'sidebar': {
						template: sidebarComponentTemplate,
					},
					'viewer': {
						template: viewerComponentTemplate,
					},
				},
				resolve: {
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
					resolvedMaskNames: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.getNamesOfMasks({
								cyan: $stateParams.cy_mask,
								magenta: $stateParams.mg_mask,
								yellow: $stateParams.yl_mask,
								green: $stateParams.gr_mask
							});
						}
					],
					resolvedMaskImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheMultipleMasks({
								cyan: $stateParams.cy_mask,
								magenta: $stateParams.mg_mask,
								yellow: $stateParams.yl_mask,
								green: $stateParams.gr_mask
							});
						}
					],
				},
			});
		}])
	.name;

let viewerComponentTemplate =`
					<viewer-component
						line-name="$ctrl.lineName"
						line-images="$ctrl.lineImages"
						mask-images="$ctrl.maskImages"
						mask-color="$ctrl.maskColor"
						slice-index="$ctrl.sliceIndex"
						color-channel-images="$ctrl.colorChannelImages"
						color-channel-color="$ctrl.colorChannelColor"
						color-channel-opacities="$ctrl.colorChannelOpacities"
						on-update-index="$ctrl.updateIndex(sliceIndex)"
						resolved-line-name="$resolve.resolvedLineName"
						resolved-line-images="$resolve.resolvedLineImages"
						resolved-mask-images="$resolve.resolvedMaskImages"
						resolved-color-channel-images="">
					</viewer-component>
`;

let sidebarComponentTemplate = `
					<sidebar-component
						lines="$ctrl.lines"
						masks="$ctrl.masks"
						on-update-line="$ctrl.updateLine(line)"
						on-update-mask="$ctrl.updateMask(mask, color)"
						on-update-color-channel="$ctrl.updateColorChannel(line, color)"
						on-update-opacity="$ctrl.updateOpacity(val, color)"
						on-adjust-line="$ctrl.adjustLine(line, brightness, gamma)"
						resolved-line-name="$resolve.resolvedLineName"
						resolved-mask-names=""
						resolved-color-channel-names="">
					</sidebar-component>
`;

export default Lines;
