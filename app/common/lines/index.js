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
				template: viewerComponentTemplate,
				resolve: {
					resolvedLineImages: [ 'LinesService', (LinesService) => {
						return LinesService.cacheLine('Elavl3-H2BRFP')
					}],
					resolvedLineName: [() => { return 'Elavl3-H2BRFP' }],
				},
			})

			$stateProvider.state('home.line', {
				url: '/line/{id}?cy-mask&mg-mask&gr-mask&yl-mask&red-chl&bl-chl&gr-chl',
				template: viewerComponentTemplate,
				resolve: {
					resolvedLineName: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							//console.log(LinesService.getNameOfLine($stateParams.id));
							//return $stateParams.id;
							return LinesService.getNameOfLine($stateParams.id);
						}
					],
					resolvedLineImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheLine($stateParams.id);
						}
					],
					resolvedMaskImages: [
						'$stateParams', 'LinesService',
						($stateParams, LinesService) => {
							return LinesService.cacheLine($stateParams.id);
						}
					],

				},
			});
		}])
	.name;

let viewerComponentTemplate =`
					<viewer-component
						resolved-line-name="$resolve.resolvedLineName"
						resolved-line-images="$resolve.resolvedLineImages"
						line-name="$ctrl.lineName"
						line-images="$ctrl.lineImages"
						mask-images="$ctrl.maskImages"
						mask-color="$ctrl.maskColor"
						slice-index="$ctrl.sliceIndex"
						color-channel-images="$ctrl.colorChannelImages"
						color-channel-color="$ctrl.colorChannelColor"
						color-channel-opacities="$ctrl.colorChannelOpacities"
						on-update-index="$ctrl.updateIndex(sliceIndex)">
					</viewer-component>
`;

export default Lines;
