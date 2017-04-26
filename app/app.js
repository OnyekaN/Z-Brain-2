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
					templateUrl: '/views/about.html'
				});
			$urlRouterProvider.when('/', '/home');
			$urlRouterProvider.otherwise('/home');	
			}])	
		.name;
})()


