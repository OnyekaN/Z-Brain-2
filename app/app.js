/* /app.js */
'use strict'
import uiRouter from 'angular-ui-router';
import ngFileUpload from 'ng-file-upload';
import Common from './common/index';

(() => {
	angular
		.module('zBrain', [
			uiRouter,
			ngFileUpload,
			Common,
		])
		.config([
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider',
			($stateProvider, $urlRouterProvider, $locationProvider) => {
				$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html'
				})
				.state('lines-overview', {
					url: '/lines-overview',
					template: `<overview-component
											lines="$resolve.lines"
											annotations="$resolve.annotations">
											</overview-component>`,
					resolve: {
						lines: ['LinesService', (LinesService) => {
							return LinesService.getAllLineNames();
						}],
						annotations: ['LinesService', (LinesService) => {
							return LinesService.getAnnotations();
						}]
					},
				})
				.state('about', {
					url: '/about',
					templateUrl: 'views/about.html'
				})
				.state('contributing', {
					url: '/contributing',
					templateUrl: 'views/contributing.html'
				})
				.state('faq', {
					url: '/faq',
					templateUrl: 'views/faq.html'
				})
				.state('downloads', {
					url: '/downloads',
					templateUrl: 'views/downloads.html'
				})
				.state('upload', {
					url: '/upload',
					templateUrl: 'views/upload.html'
				});

				$urlRouterProvider.when('/', '/home/');
				$urlRouterProvider.otherwise('/home/');
				$locationProvider.html5Mode(true).hashPrefix('!');

			}])
		.name;
})();



