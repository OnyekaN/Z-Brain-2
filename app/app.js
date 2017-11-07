/* /app.js */
'use strict'
import uiRouter from 'angular-ui-router';
import Common from './common/index';

(() => {
	angular
		.module('zBrain', [
			uiRouter,
			Common,
		])
		.config([
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider',
			($stateProvider, $urlRouterProvider) => {
				$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html'	
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
				});
			$urlRouterProvider.when('/', '/home');
			$urlRouterProvider.otherwise('/home');	
			}])	
		.name;
})()


