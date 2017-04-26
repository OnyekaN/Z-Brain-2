/* nav/index.js */
'use strict'
import NavComponent from './nav.component'
import NavService from './nav.service'

const Nav = angular
	.module('nav', [])
	.component('navComponent', NavComponent)
	.service('NavService', NavService)
	.name;

export default Nav
